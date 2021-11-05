import { IEmeris } from '@@/shims-vue';
import { EmerisEncryptedWallet, ExtensionRequest, EmerisWallet } from '@@/types';
import { v4 as uuidv4 } from 'uuid';
import EmerisStorage from './EmerisStorage';
import config from '../chain-config';
import libs from './libraries';
import { UnlockWalletError } from '@@/errors';
import * as CryptoJS from 'crypto-js';
export class Emeris implements IEmeris {
  public loaded: boolean;
  private storage: EmerisStorage;
  private wallet: EmerisWallet;
  private lastWallet: EmerisEncryptedWallet;
  private wallets: EmerisEncryptedWallet[];
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
      const encryptedWallet = this.wallets.find((x) => x.walletName == walletName);
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
  async forwardToPopup(request) {
    let resolver;
    const response = new Promise((resolve) => {
      resolver = resolve;
    });
    this.queuedRequests.set(request.id, { resolver });
    this.pending.push(request);
    this.ensurePopup();
    const resp = await response;
    return resp;
  }
  async popupHandler(message) {
    let request;
    console.log(request);
    this.reset();
    switch (message?.data.action) {
      case 'getPending':
        return this.pending.splice(0);
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
  async getAddress(chainId: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + chainId);
    }
    const mnemonic = '';
    return await libs[chain.library].getAddress(mnemonic, chain);
  }

  async getPublicKey(chainId: string): Promise<Uint8Array> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + chainId);
    }
    const mnemonic = '';
    return await libs[chain.library].getPublicKey(mnemonic, chain);
  }

  async isHWWallet(): Promise<boolean> {
    return false;
  }
  async supportedChains(): Promise<string[]> {
    return Object.keys(config);
  }
  async getWalletName(): Promise<string> {
    if (!this.wallet) {
      return null;
    } else {
      return this.wallet.walletName;
    }
  }
  async hasWallet(): Promise<boolean> {
    return !!this.wallet;
  }

  async signTransaction(request: ExtensionRequest): Promise<Uint8Array> {
    request.id = uuidv4();
    return (await this.forwardToPopup(request)) as Uint8Array;
  }
  async enable(request: ExtensionRequest): Promise<boolean> {
    request.id = uuidv4();
    //request.type =
    return (await this.forwardToPopup(request)) as boolean;
  }
  /*
  signAndBroadcastTransaction: (tx: any, chainId: string) => Promise<any>;
  */
}
