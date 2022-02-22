import { EmerisMessageMapper } from '../../../mapper/src/base';
import { ClientLibrary } from './libraries';

export type EmerisEncryptedWallet = {
  walletData: string;
};
export enum AccountCreateStates {
  CREATED = 0, // Mnemonic saved
  CONFIRMED = 1, // Mnemonic re-entered
  COMPLETE = 2, // All steps complete
}
export type EmerisAccount = {
  accountName: string;
  accountMnemonic: string;
  isLedger: boolean;
  setupState: AccountCreateStates;
  hdPath?: [account: string, change: string, addressIndex: string] // TODO force setting or default later in code?
};
export type EmerisWallet = EmerisAccount[];

export type EmerisPermission = {
  origin: string;
};
export type ExtensionRequest = {
  id?: string;
  origin: string;
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
  mapper: typeof EmerisMessageMapper;
  chainName: string;
  chainId: string;
  rpcEndpoint: string;
};
