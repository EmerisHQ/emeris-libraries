/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
export interface IEmeris {
  loaded: boolean;
  getAddress?: (chainId: string) => Promise<string>;
  getPublicKey?: (chainId: string) => Promise<Uint8Array>;
  isHWWallet?: () => Promise<boolean>;
  supportedChains?: () => Promise<string[]>;
  getWalletName?: () => Promise<string>;
  hasWallet?: () => Promise<boolean>;
  enable?: () => Promise<boolean>;
  signTransaction?: (tx: AbstractTx, chainId: string) => Promise<Uint8Array>;
  signAndBroadcastTransaction?: (tx: AbstractTx, chainId: string) => Promise<AbstractTxResult>;
}
export type EmerisWindow = {
  emeris: IEmeris;
};
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends EmerisWindow {}
}
