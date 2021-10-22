import { IEmeris } from '@/shims-vue';
import { EmerisEncryptedWallet } from '@/types';

import EmerisStorage from './EmerisStorage';
import config from '../chain-config';
import libs from './libraries';

export class Emeris implements IEmeris {
  public loaded: boolean;
  private storage: EmerisStorage;
	private wallet: EmerisEncryptedWallet;

  constructor(storage: EmerisStorage) {
    this.loaded = true;
    this.storage = storage;
	}
	async init() {
		 try {
       await this.storage.loadLocal();
     } catch (e) {
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

  async getAddress(chainId: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('No wallet configured');
    }
    const chain = config[chainId];
    if (!chain) {
      throw new Error('Chain not supported: ' + chainId);
    }
    let mnemonic = '';
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
    let mnemonic = '';
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
			return null
		} else {
			return this.wallet.walletName;
		}
	}
	async hasWallet(): Promise<boolean> {
		return !!this.wallet;
  }
  /*
  signTransaction: (tx: any, chainId: string) => Promise<Uint8Array>;
  signAndBroadcastTransaction: (tx: any, chainId: string) => Promise<any>;
  */
}
