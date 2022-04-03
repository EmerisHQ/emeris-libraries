import * as CryptoJS from 'crypto-js';
import browser from 'webextension-polyfill';
import { SaveWalletError, UnlockWalletError } from '@@/errors';
import { EmerisEncryptedWallet, EmerisAccount, EmerisWallet } from '@@/types';
export enum EmerisStorageMode {
  SYNC = 'sync',
  LOCAL = 'local',
}
export default class EmerisStorage {
  private storageMode: EmerisStorageMode;

  constructor(storageMode: EmerisStorageMode) {
    this.storageMode = storageMode;
  }
  async getWhitelistedWebsites(): Promise<{ origin: string }[]> {
    const result = await browser.storage[this.storageMode].get('whitelistedWebsites');
    return result.whitelistedWebsites;
  }
  async isWhitelistedWebsite(origin: string): Promise<boolean> {
    const result = await browser.storage[this.storageMode].get('whitelistedWebsites');
    if (!result.whitelistedWebsites) {
      return false;
    } else {
      const hasPermission = result.whitelistedWebsites.find((permission) => permission.origin == origin);
      return !!hasPermission;
    }
  }
  async addWhitelistedWebsite(origin: string): Promise<boolean> {
    try {
      const result = await browser.storage[this.storageMode].get('whitelistedWebsites');
      if (!result.whitelistedWebsites) {
        result.whitelistedWebsites = [];
      }
      result.whitelistedWebsites.push({ origin });
      await browser.storage[this.storageMode].set({ whitelistedWebsites: result.whitelistedWebsites });
      return true;
    } catch (e) {
      return false;
    }
  }
  async deleteWhitelistedWebsite(origin: string): Promise<boolean> {
    try {
      const result = await browser.storage[this.storageMode].get('whitelistedWebsites');
      const newWhitelistedWebsites = result.whitelistedWebsites.filter((permission) => permission.origin != origin);
      await browser.storage[this.storageMode].set({ whitelistedWebsites: newWhitelistedWebsites });
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
  async hasWallet(): Promise<boolean> {
    return !!(await this.getWallet());
  }
  async getLastAccount(): Promise<string | null> {
    const res = await browser.storage[this.storageMode].get('lastAccount');
    return res.lastAccount ?? null;
  }
  async setLastAccount(accountName: string): Promise<void> {
    await browser.storage[this.storageMode].set({ lastAccount: accountName });
  }
  async updateAccount(account: Partial<EmerisAccount>, targetAccountName: string, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(password);
      const oldAccount = wallet.find((x) => x.accountName === targetAccountName);
      const accounts = wallet.filter((x) => x.accountName != targetAccountName);
      accounts.push({ ...oldAccount, ...account });
      await this.saveWallet(accounts, password);
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async removeAccount(accountName: string, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(password);
      const accounts = wallet.filter((x) => x.accountName != accountName);
      await this.saveWallet(accounts, password);
      return true;
    } catch (e) {
      console.log(e);
      throw new SaveWalletError('Could not save wallet: ' + e);
    }
  }
  async saveAccount(account: EmerisAccount, password: string): Promise<boolean> {
    try {
      const wallet = await this.unlockWallet(password);
      if (account.isLedger) {
        delete account.accountMnemonic // just to avoid confusion
      }
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
        await this.saveWallet([], password); // create wallet object if not there
        return [];
      }
      const wallet = JSON.parse(CryptoJS.AES.decrypt(encWallet.walletData, password).toString(CryptoJS.enc.Utf8));
      return wallet;
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const wallet = await this.unlockWallet(oldPassword);
      this.saveWallet(wallet, newPassword);
    } catch (e) {
      throw new UnlockWalletError('Could not unlock wallet: ' + e);
    }
  }
  async extensionReset() {
    await browser.storage[this.storageMode].set({ password: null, wallet: null, lastAccount: null, whitelistedWebsites: null, partialAccountCreationStep: null });
  }
  async setPartialAccountCreationStep(partialAccountCreationStep, password) {
    const encryptedPartialAccountCreationStep = partialAccountCreationStep ? CryptoJS.AES.encrypt(JSON.stringify(partialAccountCreationStep), password).toString() : null;
    await browser.storage[this.storageMode].set({ partialAccountCreationStep: encryptedPartialAccountCreationStep });
  }
  async getPartialAccountCreationStep(password) {
    try {
      const { partialAccountCreationStep: encryptedPartialAccountCreationStep } = await browser.storage[this.storageMode].get('partialAccountCreationStep');
      if (!encryptedPartialAccountCreationStep) return undefined
      const partialAccountCreationStep = JSON.parse(CryptoJS.AES.decrypt(encryptedPartialAccountCreationStep, password).toString(CryptoJS.enc.Utf8));
      return partialAccountCreationStep;
    } catch (e) {
      await browser.storage[this.storageMode].set({ partialAccountCreationStep: null }); // prevent a broken state and the information is not critical
      throw new UnlockWalletError('Could not unlock partialAccountCreationStep: ' + e);
    }
  }
}
