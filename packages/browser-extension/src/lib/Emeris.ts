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
        this.setLastAccount(this.wallet[0].accountName)
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
      this.storage.changePassword(this.password, password)
      this.unlockWallet(password)
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async launchPopup(): Promise<number> {
    return (
      await browser.windows.create({
        width: 400,
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
    return this.wallet.find(x => x.accountName == this.selectedAccount);
  }
  async setLastAccount(accountName) {
    if (accountName) {
      try {
        await this.storage.setLastAccount(accountName);
        this.selectedAccount = accountName
      } catch (e) {
        console.log(e);
      }
    }
  }
  async popupHandler(message: RoutedInternalRequest): Promise<unknown> {
    let request;
    console.log(message);
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
          await this.storage.updateAccount(message.data.data.newAccountName, message.data.data.oldAccountName, this.password);
          this.wallet = await this.unlockWallet(this.password);
          this.setLastAccount(message.data.data.newAccountName);
          return this.wallet;
        } catch (e) {
          console.log(e);
        }
        return
      case 'removeAccount':
        try {
          await this.storage.removeAccount(message.data.data.accountName, this.password);
          if (this.selectedAccount === message.data.data.accountName) {
            this.selectedAccount === undefined
          }
          return await this.unlockWallet(this.password);
        } catch (e) {
          console.log(e);
        }
        return this.wallet;
      case 'getWallet':
        return this.wallet;
      case 'getAddress':
        return this.getAddress(message.data);
      case 'getMnemonic':
        try {
          this.wallet = await this.unlockWallet(message.data.data.password);
        } catch (e) {
          console.log(e);
        }
        return this.wallet.find((x) => x.accountName == message.data.data.accountName);
      case 'createWallet':
      case 'unlockWallet':
        try {
          this.wallet = await this.unlockWallet(message.data.data.password);
          return this.wallet;
        } catch (e) {
          console.log(e);
        }
        return
      case 'changePassword':
        try {
          this.changePassword(message.data.data.password)
        } catch (e) {
          console.log(e);
        }
        return
      case 'hasWallet':
        return await this.hasWallet()
      case 'setResponse':
        request = this.queuedRequests.get(message.data.data.id);
        if (!request) {
          return;
        }
        request.resolver(message.data.data);
        this.queuedRequests.delete(message.data.data.id);
        this.pending.splice(
          this.pending.findIndex((req) => req.id == message.data.data.id),
          1,
        );
        browser.runtime.sendMessage({ type: 'toPopup', data: { action: 'update' } });
        return true;
      case 'extensionReset':
        this.storage.extensionReset()
        return
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
    const account = this.getAccount()
    if (!account) {
      throw new Error('No account selected');
    }
    const mnemonic = account.accountMnemonic
    return await libs[chain.library].getAddress(mnemonic, chain);
  }

  async getPublicKey(req: GetPublicKeyRequest): Promise<Uint8Array> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[req.data.chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + req.data.chainId);
    }
    const mnemonic = this.getAccount().accountMnemonic;
    return await libs[chain.library].getPublicKey(mnemonic, chain);
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

  async signTransaction(request: SignTransactionRequest): Promise<Uint8Array> {
    request.id = uuidv4();
    return (await this.forwardToPopup(request)).data as Uint8Array;
  }
  async signAndBroadcastTransaction(request: SignAndBroadcastTransactionRequest): Promise<AbstractTxResult> {
    request.id = uuidv4();
    return (await this.forwardToPopup(request)).data as AbstractTxResult;
  }
  async enable(request: ApproveOriginRequest): Promise<boolean> {
    request.id = uuidv4();
    const enabled = (await this.forwardToPopup(request)).data as boolean;
    if (enabled) {
      await this.storage.addPermission(request.data.origin);
    }
    return enabled;
  }
}
