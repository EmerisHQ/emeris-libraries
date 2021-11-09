import { IEmeris } from '@@/types/emeris';
import { EmerisWallet } from '@@/types';
import { v4 as uuidv4 } from 'uuid';
import EmerisStorage from './EmerisStorage';
import config from '../chain-config';
import libs from './libraries';
import { UnlockWalletError } from '@@/errors';
import * as CryptoJS from 'crypto-js';
import {
  GetAddressRequest,
  GetPublicKeyRequest,
  GetWalletNameRequest,
  HasWalletRequest,
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
  private popup: number;
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
      console.log('reset?');
      clearTimeout(this.timeoutLock);
      this.timeoutLock = setTimeout(() => {
        this.lock();
      }, 120000);
    }
  }
  lock(): void {
    console.log('here');
    console.log(this.wallet);
    clearTimeout(this.timeoutLock);
    this.timeoutLock = null;
    this.wallet = null;
    console.log(this.wallet);
  }
  async unlockWallet(walletName: string, password: string): Promise<EmerisWallet> {
    try {
      const wallets = await this.storage.getWallets();
      const encryptedWallet = wallets.find((x) => x.walletName == walletName);
      if (encryptedWallet) {
        this.wallet = JSON.parse(
          CryptoJS.AES.decrypt(encryptedWallet.walletData, password).toString(CryptoJS.enc.Utf8),
        );
        await this.storage.setLastWallet(this.wallet.walletName);
        this.timeoutLock = setTimeout(() => {
          this.lock();
        }, 120000);
        console.log(this.wallet);
        return this.wallet;
      } else {
        console.log('?');
        throw new UnlockWalletError('Wallet not found');
      }
    } catch (e) {
      console.log(e);
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
  async popupHandler(message: RoutedInternalRequest): Promise<unknown> {
    let request;
    console.log(message);
    this.reset();
    switch (message?.data.action) {
      case 'getPending':
        return this.pending;
      case 'createWallet':
        if (message.data.data.wallet.walletMnemonic == 'ledger') {
          try {
            await navigator['usb'].requestDevice({ filters: [] });
          } catch (e) {
            console.log(e);
          }
        }
        await this.storage.saveWallet(message.data.data.wallet, message.data.data.password);
        this.wallet = message.data.data.wallet;
        return this.wallet;
      case 'getWallet':
        return this.wallet;
      case 'unlockWallet':
        this.wallet = await this.unlockWallet(message.data.data.walletName, message.data.data.password);
        return this.wallet;
      case 'getWallets':
        return await this.storage.getWallets();
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
    const mnemonic = '';
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
    const mnemonic = '';
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
  async getWalletName(_req: GetWalletNameRequest): Promise<string> {
    if (!this.wallet) {
      return null;
    } else {
      return this.wallet.walletName;
    }
  }
  async hasWallet(_req: HasWalletRequest): Promise<boolean> {
    return !!this.wallet;
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
