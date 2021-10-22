import { IEmeris } from '@/shims-vue';
import { EmerisEncryptedWallet, ExtensionRequest, ExtensionResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import EmerisStorage from './EmerisStorage';
import config from '../chain-config';
import libs from './libraries';

export class Emeris implements IEmeris {
  public loaded: boolean;
  private storage: EmerisStorage;
  private wallet: EmerisEncryptedWallet;
  private popup: number;
  private queuedRequests: Map<
    string,
    Record<'resolver', (value: ExtensionRequest | PromiseLike<ExtensionRequest>) => void>
  >;
  private pending: ExtensionRequest[] = [];

  constructor(storage: EmerisStorage) {
    this.loaded = true;
    this.storage = storage;
    this.popup = null;
    this.queuedRequests = new Map();
  }
  async init(): Promise<void> {
    try {
      await this.storage.loadLocal();
    } catch (e) {
      console.log(e);
      console.log('No local wallets');
      try {
        await this.storage.loadSync();
      } catch (e) {
        console.log('No sync wallets');
      }
    } finally {
      this.wallet = this.storage.getLastWallet();
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
    switch (message?.data.action) {
      case 'getPending':
        return this.pending.splice(0);
      case 'getWallet':
        return this.wallet;
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
  /*
  signAndBroadcastTransaction: (tx: any, chainId: string) => Promise<any>;
  */
}
