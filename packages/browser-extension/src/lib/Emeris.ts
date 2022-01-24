import { IEmeris } from '@@/types/emeris';
import { EmerisWallet } from '@@/types';
import { v4 as uuidv4 } from 'uuid';
import EmerisStorage from './EmerisStorage';
import config from '../chain-config';
import libs from './libraries';
import { UnlockWalletError } from '@@/errors';
import {
  GetAddressRequest,
  GetPublicKeyRequest,
  GetAccountNameRequest,
  IsHWWalletRequest,
  SignTransactionRequest,
  SupportedChainsRequest,
  ApproveOriginRequest,
  SignAndBroadcastTransactionRequest,
  ExtensionRequest,
  ExtensionResponse,
  RoutedInternalRequest,
} from '@@/types/api';
import { AbstractTxResult } from '@@/types/transactions';

import { keyHashfromAddress } from '@/utils/basic';
import { Secp256k1HdWallet } from '@cosmjs/amino';
export class Emeris implements IEmeris {
  public loaded: boolean;
  private storage: EmerisStorage;
  private wallet: EmerisWallet;
  private selectedAccount: string;
  private popup: number;
  private password: string;
  private queuedRequests: Map<
    string,
    Record<'resolver', (value: ExtensionRequest | PromiseLike<ExtensionRequest>) => void>
  >;
  private pending: ExtensionRequest[] = [];
  private timeoutLock: ReturnType<typeof setTimeout>;

  constructor(storage: EmerisStorage) {
    this.loaded = true;
    this.storage = storage;
    this.popup = null;
    this.queuedRequests = new Map();
  }
  reset(): void {
    if (this.timeoutLock) {
      clearTimeout(this.timeoutLock);
      this.timeoutLock = setTimeout(() => {
        this.lock();
      }, 120000);
    }
  }
  lock(): void {
    clearTimeout(this.timeoutLock);
    this.timeoutLock = null;
    this.wallet = null;
    this.password = null;
    this.selectedAccount = null;
  }
  async unlockWallet(password: string): Promise<EmerisWallet> {
    try {
      this.wallet = await this.storage.unlockWallet(password);
      this.password = password;
      this.selectedAccount = await this.storage.getLastAccount();
      if (this.wallet.length > 0 && !this.selectedAccount) {
        this.setLastAccount(this.wallet[0].accountName);
      }
      this.timeoutLock = setTimeout(() => {
        this.lock();
      }, 120000);
      return this.wallet;
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async changePassword(password: string): Promise<void> {
    try {
      this.storage.changePassword(this.password, password);
      this.unlockWallet(password);
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async launchPopup(): Promise<number> {
    return (
      await browser.windows.create({
        width: 375,
        height: 600,
        type: 'popup',
        url: browser.runtime.getURL('/popup.html'),
      })
    ).id;
  }
  async forwardToPopup(request: ExtensionRequest): Promise<ExtensionResponse> {
    let resolver;
    const response: Promise<ExtensionResponse> = new Promise((resolve) => {
      resolver = resolve;
    });
    this.queuedRequests.set(request.id, { resolver });
    this.pending.push(request);
    this.ensurePopup();
    const resp = await response;
    return resp;
  }
  getAccount() {
    return this.wallet.find((x) => x.accountName == this.selectedAccount);
  }
  async setLastAccount(accountName) {
    if (accountName) {
      try {
        await this.storage.setLastAccount(accountName);
        this.selectedAccount = accountName;
      } catch (e) {
        console.log(e);
      }
    }
  }
  async popupHandler(message: RoutedInternalRequest): Promise<unknown> {
    let request;
    this.reset();
    switch (message?.data.action) {
      case 'getPending':
        return this.pending;
      case 'setLastAccount':
        this.setLastAccount(message.data.data.accountName);
        break;
      case 'getLastAccount':
        try {
          const accountName = await this.storage.getLastAccount();
          return accountName;
        } catch (e) {
          console.log(e);
        }
        break;
      case 'createAccount':
        // guard
        if (!message.data.data.account.accountMnemonic) {
          throw new Error("Account has no mnemonic")
        }
        await this.storage.saveAccount(message.data.data.account, this.password);
        if (message.data.data.account.isLedger) {
          try {
            await navigator['usb'].requestDevice({ filters: [] });
          } catch (e) {
            console.log(e);
            break;
          }
        }
        try {
          this.wallet = await this.unlockWallet(this.password);
          this.setLastAccount(message.data.data.account.accountName);
        } catch (e) {
          console.log(e);
        }
        return this.wallet;
      case 'updateAccount':
        try {
          await this.storage.updateAccount(
            message.data.data.account,
            message.data.data.account.accountName,
            this.password,
          );
          this.wallet = await this.unlockWallet(this.password);
          this.setLastAccount(message.data.data.newAccountName);
          return this.wallet;
        } catch (e) {
          console.log(e);
        }
        return;
      case 'removeAccount':
        try {
          await this.storage.removeAccount(message.data.data.accountName, this.password);
          if (this.selectedAccount === message.data.data.accountName) {
            this.selectedAccount === undefined;
          }
          return await this.unlockWallet(this.password);
        } catch (e) {
          console.log(e);
        }
        return this.wallet;
      case 'getWallet':
        return this.getDisplayAccounts();
      case 'getAddress':
        return this.getAddress(message.data);
      case 'getMnemonic':
        try {
          const wallet = await this.unlockWallet(message.data.data.password);
          if (wallet) {
            return wallet.find((x) => x.accountName == message.data.data.accountName);
          }
        } catch (e) {
          console.log(e);
        }
        return;
      case 'createWallet':
      case 'unlockWallet':
        try {
          this.wallet = await this.unlockWallet(message.data.data.password);
          return this.wallet;
        } catch (e) {
          console.log(e);
        }
        return;
      case 'changePassword':
        try {
          this.changePassword(message.data.data.password);
        } catch (e) {
          console.log(e);
        }
        return;
      case 'hasWallet':
        return await this.hasWallet();
      case 'setResponse':
        return this.setResponse(message.data.data.id, message.data.data)
      case 'extensionReset':
        this.storage.extensionReset();
        return;
      case 'removeWhitelistedWebsite':
        this.storage.deletePermission(message.data.data.website);
        return;
      case 'getWhitelistedWebsite':
        return this.storage.getPermissions()
    }
  }
  async ensurePopup(): Promise<void> {
    if (!this.popup) {
      this.popup = await this.launchPopup();
      browser.windows.update(this.popup as number, {
        focused: true,
      });
    } else {
      try {
        await browser.windows.get(this.popup as number);
        browser.runtime.sendMessage({ type: 'toPopup', data: { action: 'update' } });
      } catch (e) {
        this.popup = await this.launchPopup();
      }

      await browser.windows.update(this.popup as number, {
        focused: true,
      });
    }
  }
  async getAddress(req: GetAddressRequest): Promise<string> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[req.data.chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + req.data.chainId);
    }
    const account = this.getAccount();
    if (!account) {
      throw new Error('No account selected');
    }
    const mnemonic = account.accountMnemonic;

    return await libs[chain.library].getAddress(account, chain);
  }
  // function limits the data that we return to the view layers to not expose accidentially data
  async getDisplayAccounts() {
    if (!this.wallet) return undefined;
    // TODO add hd paths to account and use here
    return await Promise.all(
      this.wallet.map(async ({ accountName, accountMnemonic, setupState }) => {
        const hdWallet = await Secp256k1HdWallet.fromMnemonic(
          accountMnemonic /* config for hdPath and prefix go here */,
        );
        const [{ address }] = await hdWallet.getAccounts();
        const keyHash = keyHashfromAddress(address);

        return {
          accountName,
          keyHash,
          setupState,
        };
      }),
    );
  }

  async getPublicKey(req: GetPublicKeyRequest): Promise<Uint8Array> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[req.data.chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + req.data.chainId);
    }
    const account = this.getAccount();
    if (!account) {
      throw new Error('No account selected');
    }

    return await libs[chain.library].getPublicKey(account, chain);
  }
  async isPermitted(origin: string): Promise<boolean> {
    return await this.storage.isPermitted(origin);
  }
  async isHWWallet(_req: IsHWWalletRequest): Promise<boolean> {
    return false;
  }
  async supportedChains(_req: SupportedChainsRequest): Promise<string[]> {
    return Object.keys(config);
  }
  async getAccountName(_req: GetAccountNameRequest): Promise<string> {
    return this.selectedAccount;
  }
  async hasWallet(): Promise<boolean> {
    return await this.storage.hasWallet();
  }

  async signTransaction(request: SignTransactionRequest): Promise<any> {
    request.id = uuidv4();
    const { accept, fees, memo } = await this.forwardToPopup(request);
    if (accept) {
      if (!this.wallet) {
        throw new Error('No wallet configured');
      }
      const chain = config[request.data.chainId];
      if (!chain) {
        throw new Error('Chain not supported: ' + request.data.chainId);
      }

      const selectedAccount = this.wallet.find(({ accountName }) => accountName === this.selectedAccount)
      const address = await libs[chain.library].getAddress(selectedAccount, chain)

      if (address !== request.data.signingAddress) {
        throw new Error('The requested signing address is not active in the extension');
      }

      const mapper = new chain.mapper(chain.chainId)
      const chainMessages = [].concat(...request.data.messages.map(message => mapper.map(message, address)))
      const broadcastable = await libs[chain.library].sign(selectedAccount, chain, chainMessages, fees, memo)

      return broadcastable
    }
    return undefined
  }
  // async signAndBroadcastTransaction(request: SignAndBroadcastTransactionRequest): Promise<AbstractTxResult> {
  //   request.id = uuidv4();
  //   return (await this.forwardToPopup(request)).data as AbstractTxResult;
  // }
  async enable(request: ApproveOriginRequest): Promise<boolean> {
    // TODO purge this queue and replace with a sensible data struct to we can check if a request is a dupe
    request.id = uuidv4();
    const accept = (await this.forwardToPopup(request)).accept as boolean;
    if (accept) {
      await this.storage.addPermission(request.origin);
    }
    return accept;
  }
  setResponse(id: string, response: any) {
    const request = this.queuedRequests.get(id);
    if (!request) {
      return;
    }
    request.resolver(response);
    this.queuedRequests.delete(id);
    this.pending.splice(
      this.pending.findIndex((req) => req.id == id),
      1,
    );
    browser.runtime.sendMessage({ type: 'toPopup', data: { action: 'update' } });
    return true;
  }
}
