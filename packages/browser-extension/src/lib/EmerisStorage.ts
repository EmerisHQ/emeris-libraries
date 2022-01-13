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
  async deletePermission(origin: string): Promise<boolean> {
    try {
      const result = await browser.storage[this.storageMode].get('permissions');
      const newPermissions = result.permissions.filter((permission => permission.origin != origin));
      await browser.storage[this.storageMode].set({ permissions: newPermissions });
      return true;
    } catch (e) {
      return false;
    }
  }
  private async getWallet(): Promise<EmerisEncryptedWallet> {
    const result = await browser.storage[this.storageMode].get('wallet');
    if (result.wallet) {
      return result.wallet;
    } else {
      return null;
    }
  }
  async getLastAccount(): Promise<string | null> {   
    
    const res = await browser.storage[this.storageMode].get('lastAccount');
    return res.lastAccount ?? null;
    
  }
  async setLastAccount(accountName: string): Promise<void> {

    await browser.storage[this.storageMode].set({ lastAccount: accountName });

  }
  async updateAccount(account: EmerisAccount, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(password);
      const accounts = wallet.filter((x) => x.accountName != account.accountName);
      accounts.push(account);
      await this.saveWallet(accounts, password);
      await this.setLastAccount(account.accountName);
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async saveAccount(account: EmerisAccount, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(password);
      wallet.push(account);
      await this.saveWallet(wallet, password);
      await this.setLastAccount(account.accountName);
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  private async saveWallet(wallet: EmerisWallet, password: string): Promise<boolean> {
    try {
      const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(wallet), password).toString();
      await browser.storage[this.storageMode].set({ wallet: { walletData: encryptedWallet } });
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async unlockWallet(password: string): Promise<EmerisWallet> {
    try {
      const encWallet = await this.getWallet();
      if (!encWallet) {
        return [];
      }
      const wallet = JSON.parse(CryptoJS.AES.decrypt(encWallet.walletData, password).toString(CryptoJS.enc.Utf8));
      return wallet;
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async setPartialAccountCreation(wallet: EmerisWallet, route: string) {
    if (!wallet) {
      await browser.storage[this.storageMode].set({ 'partialAccount': null });
    } else {
      await browser.storage[this.storageMode].set({ 'partialAccount': { wallet, route } });
    }
  }
  async getPartialAccountCreation() {
    const { partialAccount } = await browser.storage[this.storageMode].get('partialAccount');
    return partialAccount
  }
  async setPassword(password: String) {
    await browser.storage[this.storageMode].set({ 'password': password });
  }
  async checkPassword(password: String): Promise<Boolean> {
    // TODO this is not how it should be stored
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
