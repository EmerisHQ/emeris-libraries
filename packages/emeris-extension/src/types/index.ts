import { ClientLibrary } from './libraries';

export type EmerisEncryptedWallet = {
  walletName: string;
  walletData: string;
};
export type EmerisWallet = {
  walletName: string;
  walletMnemonic: string;
  lastUsedChain?: string;
};
export type ExtensionRequest = {
  id?: string;
  [key: string]: unknown;
};
export type ExtensionResponse = {
  id: string;
  [key: string]: unknown;
};
export type ExtensionAction = {
  action: string;
  [key: string]: unknown;
};
export type RoutedExtensionRequest = {
  type: 'fromEmerisExtension' | 'toEmerisExtension';
  data: ExtensionRequest;
};
export type RoutedExtensionAction = {
  type: 'fromPopup' | 'toPopup';
  data: ExtensionAction;
};

export type ChainDetails = {
  library: ClientLibrary;
  HDPath?: string;
  prefix?: string;
};
