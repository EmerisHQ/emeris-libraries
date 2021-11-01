import CryptoJS from 'crypto-js';

import { SaveWalletError, UnlockWalletError, WalletNotFoundError } from '@@/errors';
import { EmerisEncryptedWallet, EmerisWallet } from '@@/types';

export default class EmerisStorage {
  private wallets: EmerisEncryptedWallet[] = [];
  private storageMode: 'sync' | 'local';
  private lastWallet: string | null;

  constructor() {
    this.storageMode = 'sync';
  }
  async loadLocal(): Promise<void> {
    const result = await browser.storage.local.get('wallets');
    if (result.wallets) {
      this.wallets = result.wallets;
      this.storageMode = 'local';
      const res = await browser.storage.local.get('lastWallet');
      if (res.lastWallet) {
        this.lastWallet = res.lastWallet;
      } else {
        this.lastWallet = null;
      }
    } else {
      await browser.storage.local.set({ wallets: [{ walletName: 'clockwork', walletData: 'somedata' }] });
      await browser.storage.local.set({ lastWallet: 'clockwork' });
      this.loadLocal();
      //throw new WalletNotFoundError('No local wallets found');
    }
  }
  getLastWallet(): EmerisEncryptedWallet | null {
    if (this.lastWallet) {
      return this.wallets.find((wallet) => wallet.walletName == this.lastWallet) ?? null;
    } else {
      return this.wallets.length > 0 ? this.wallets[0] : null;
    }
  }
  async loadSync(): Promise<void> {
    const result = await browser.storage.sync.get('wallets');
    if (result.wallets) {
      this.wallets = result.wallets;
      this.storageMode = 'sync';
      const res = await browser.storage.sync.get('lastWallet');
      if (res.lastWallet) {
        this.lastWallet = res.lastWallet;
      } else {
        this.lastWallet = null;
      }
    } else {
      throw new WalletNotFoundError('No sync wallets found');
    }
  }
  async saveWallet(wallet: EmerisWallet, password: string): Promise<boolean> {
    try {
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();
      if (!this.wallets) {
        this.wallets = [];
      }
      if (!this.storageMode) {
        this.storageMode = 'local';
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
