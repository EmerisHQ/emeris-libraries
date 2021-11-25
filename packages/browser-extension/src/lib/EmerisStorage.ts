import * as CryptoJS from 'crypto-js';

import { SaveWalletError, UnlockWalletError } from '@@/errors';
import { EmerisEncryptedWallet, EmerisWallet } from '@@/types';
export enum EmerisStorageMode {
  SYNC = 'sync',
  LOCAL = 'local',
}
export default class EmerisStorage {
  private storageMode: EmerisStorageMode;

  constructor(storageMode: EmerisStorageMode) {
    this.storageMode = storageMode;
  }
  async isPermitted(origin: string): Promise<boolean> {
    const result = await browser.storage[this.storageMode].get('permissions');
    if (!result.permissions) {
      return false;
    } else {
      const hasPermission = result.permissions.find((permission) => permission.origin == origin);
      return !!hasPermission;
    }
  }
  async addPermission(origin: string): Promise<boolean> {
    try {
      const result = await browser.storage[this.storageMode].get('permissions');
      if (!result.permissions) {
        result.permissions = [];
      }
      result.permissions.push({ origin });
      await browser.storage[this.storageMode].set({ permissions: result.permissions });
      return true;
    } catch (e) {
      return false;
    }
  }
  async getWallets(): Promise<EmerisEncryptedWallet[]> {
    const result = await browser.storage[this.storageMode].get('wallets');
    if (result.wallets) {
      return result.wallets;
    } else {
      return [];
    }
  }
  async getLastWallet(): Promise<EmerisEncryptedWallet | null> {
    const result = await browser.storage[this.storageMode].get('wallets');
    if (result.wallets) {
      const res = await browser.storage[this.storageMode].get('lastWallet');
      return result.wallets.find((wallet) => wallet.walletName == res.lastWallet) ?? result.wallets[0];
    } else {
      return null;
    }
  }
  async setLastWallet(walletName: string): Promise<void> {
    await browser.storage[this.storageMode].set({ lastWallet: walletName });
  }
  async saveWallet(wallet: EmerisWallet, password: string): Promise<boolean> {
    try {
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();

      const result = await browser.storage[this.storageMode].get('wallets');
      if (!result.wallets) {
        result.wallets = [];
      }
      result.wallets.push({ walletName: wallet.walletName, walletData: encryptedWallet });
      await browser.storage[this.storageMode].set({ wallets: result.wallets });
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
      console.log(e);
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async setPassword(password: String) {
    await browser.storage[this.storageMode].set({ 'password': password });
  }
  async checkPassword(password: String): Promise<Boolean> {
    const { password: storedPassword } = await browser.storage[this.storageMode].get('password');
    return storedPassword === password
  }
  async hasPassword(): Promise<Boolean> {
    const { password } = await browser.storage[this.storageMode].get('password');
    return !!password
  }
  async extensionReset() {
    await browser.storage[this.storageMode].set({ password: null, wallets: null, lastWallet: null, permissions: null });
  }
}
