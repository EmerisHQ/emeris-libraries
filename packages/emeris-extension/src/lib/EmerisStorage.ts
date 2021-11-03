import * as CryptoJS from 'crypto-js';

import { SaveWalletError, UnlockWalletError, WalletNotFoundError } from '@@/errors';
import { EmerisEncryptedWallet, EmerisWallet } from '@@/types';
export enum EmerisStorageMode {
  SYNC = 'sync',
  LOCAL = 'local'
}
export default class EmerisStorage {
  
  private wallets: EmerisEncryptedWallet[] = [];
  private storageMode: EmerisStorageMode;
  private lastWallet: string | null;

  constructor(storageMode: EmerisStorageMode) {
    this.storageMode = storageMode;
  }
  async loadWallets(): Promise<void> {
    const result = await browser.storage[this.storageMode].get('wallets');
    if (result.wallets) {
      this.wallets = result.wallets;
    }
    const res = await browser.storage.local.get('lastWallet');
    if (res.lastWallet) {
      this.lastWallet = res.lastWallet;
    } else {
      this.lastWallet = null;
    }
  }
  async getWallets() {
    await this.loadWallets();
    return this.wallets;
  }
  getLastWallet(): EmerisEncryptedWallet | null {
    if (this.lastWallet) {
      return this.wallets.find((wallet) => wallet.walletName == this.lastWallet) ?? null;
    } else {
      return this.wallets.length > 0 ? this.wallets[0] : null;
    }
  }
  async setLastWallet(walletName: string):Promise<void> {
    await browser.storage[this.storageMode].set({ lastWallet: walletName });
    this.lastWallet = walletName;
  }
  async saveWallet(wallet: EmerisWallet, password: string): Promise<boolean> {
    try {
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();
      if (!this.wallets) {
        this.wallets = [];
      }
      this.wallets.push({ walletName: wallet.walletName, walletData: encryptedWallet });
      await browser.storage[this.storageMode].set({ wallets: this.wallets });
      await browser.storage[this.storageMode].set({ lastWallet: wallet.walletName });
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async unlockWallet(encryptedWallet: EmerisEncryptedWallet, password: string): Promise<EmerisWallet> {
    try {
      const wallet = JSON.parse(CryptoJS.AES.decrypt(encryptedWallet.walletData, password).toString(CryptoJS.enc.Utf8));
      await browser.storage[this.storageMode].set({ lastWallet: wallet.walletName });
      return wallet;
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
}
