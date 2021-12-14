import * as CryptoJS from 'crypto-js';

import { SaveWalletError, UnlockWalletError } from '@@/errors';
import { EmerisEncryptedWallet, EmerisAccount,EmerisWallet } from '@@/types';
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
  async getWallet(): Promise<EmerisEncryptedWallet> {
    const result = await browser.storage[this.storageMode].get('wallet');
    if (result.wallet) {
      return result.wallet;
    } else {
      return null;
    }
  }
  async getLastAccount(): Promise<EmerisEncryptedWallet | null> {
    const result = await browser.storage[this.storageMode].get('wallets');
    if (result.wallets) {
      const res = await browser.storage[this.storageMode].get('lastAccount');
      return result.wallets.find((wallet) => wallet.walletName == res.lastWallet) ?? result.wallets[0];
    } else {
      return null;
    }
  }
  async setLastAccount(accountName: string): Promise<void> {
    await browser.storage[this.storageMode].set({ lastAccount: accountName });
  }
  async updateAccount(account: EmerisAccount, password: string): Promise<boolean> {
    try {
      
      const wallet = await this.unlockWallet(await this.getWallet(),password);
      
      const accounts = wallet.filter(x => x.accountName != account.accountName);

      accounts.push(account);
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(accounts), password).toString();

      await browser.storage[this.storageMode].set({ wallet: {walletData: encryptedWallet} });
      await browser.storage[this.storageMode].set({ lastAccount: account.accountName });
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async saveAccount(account: EmerisAccount, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(await this.getWallet(),password);
      wallet.push(account);
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();

      
      await browser.storage[this.storageMode].set({ wallet: {walletData: encryptedWallet}});
      await browser.storage[this.storageMode].set({ lastAccount: account.accountName });
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async saveWallet(wallet: EmerisWallet, password: string): Promise<boolean> {
    try {
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();

      await browser.storage[this.storageMode].set({ wallet: {walletData: encryptedWallet} });      
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async unlockWallet(encryptedWallet: EmerisEncryptedWallet, password: string): Promise<EmerisWallet> {
    try {
      const wallet = JSON.parse(CryptoJS.AES.decrypt(encryptedWallet.walletData, password).toString(CryptoJS.enc.Utf8));      
      return wallet;
    } catch (e) {
      console.log(e);
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
}
