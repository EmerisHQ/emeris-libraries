import { EmerisAccount } from '.';
import { TransactionSignRequest } from '../../../types/src/EmerisTransactions';


export interface Request {
  id?: string;
  action?: string;
  data?: Record<string, unknown>;
}
export type ApproveOriginRequest = Request & {
  action: 'enable';
  data: {
    origin?: string;
  };
};
export type SignTransactionRequest = Request & {
  action: 'signTransaction';
  data: {
    tx: TransactionSignRequest;
    origin?: string;
  };
};
export type SignAndBroadcastTransactionRequest = Request & {
  action: 'signAndBroadcastTransaction';
  data: {
    tx: TransactionSignRequest;
    origin?: string;
  };
};
export type GetAddressRequest = Request & {
  action: 'getAddress';
  data: {
    chainId: string;
    origin?: string;
  };
};
export type GetPublicKeyRequest = Request & {
  action: 'getPublicKey';
  data: {
    chainId: string;
    origin?: string;
  };
};
export type IsHWWalletRequest = Request & {
  action: 'isHWWallet';
  data: {
    origin?: string;
  };
};
export type SupportedChainsRequest = Request & {
  action: 'supportedChains';
  data: {
    origin?: string;
  };
};
export type GetAccountNameRequest = Request & {
  action: 'getAccountName';
  data: {
    origin?: string;
  };
};
export type HasWalletRequest = Request & {
  action: 'hasWallet';
  data: {
    origin?: string;
  };
};
export type GetPendingRequest = Request & {
  action: 'getPending';
};
export type GetWalletRequest = Request & {
  action: 'getWallet';
};
export type SetLastAccountRequest = Request & {
  action: 'setLastAccount';
  data: {
    accountName: string;
  };
};
export type GetMnemonicRequest = Request & {
  action: 'getMnemonic';
  data: {
    accountName: string;
    password: string;
  };
};
export type GetLastAccountRequest = Request & {
  action: 'getLastAccount';
};
export type CreateAccountRequest = Request & {
  action: 'createAccount';
  data: {
    account: EmerisAccount;
  };
};
export type UpdateAccountRequest = Request & {
  action: 'updateAccount';
  data: {
    account: EmerisAccount;
  };
};
export type UnlockWalletRequest = Request & {
  action: 'unlockWallet';
  data: {
    password: string;
  };
};
export type CreateWalletRequest = Request & {
  action: 'createWallet';
  data: {
    password: string;
  };
};
export type SetPasswordRequest = Request & {
  action: 'setPassword';
  data: {
    password: string;
  };
};
export type CheckPasswordRequest = Request & {
  action: 'checkPassword';
  data: {
    password: string;
  };
};
export type HasPasswordRequest = Request & {
  action: 'hasPassword';
};
export type ExtensionResetRequest = Request & {
  action: 'extensionReset';
};
export type SetResponseRequest = Request & {
  action: 'setResponse';
  data: {
    id: string;
  };
};
export type ExtensionRequest =
  | ApproveOriginRequest
  | SignTransactionRequest
  | SignAndBroadcastTransactionRequest
  | GetAddressRequest
  | GetPublicKeyRequest
  | IsHWWalletRequest
  | SupportedChainsRequest
  | GetAccountNameRequest
  | HasWalletRequest;
export type PopupRequest =
  | GetPendingRequest
  | CreateAccountRequest
  | UpdateAccountRequest
  | SetLastAccountRequest
  | GetMnemonicRequest
  | CreateWalletRequest
  | UnlockWalletRequest
  | GetWalletRequest
  | GetLastAccountRequest
  | SetResponseRequest
  | GetAddressRequest
  | HasWalletRequest;
export type RoutedExternalRequest = {
  type: 'toEmerisExtension' | 'toPopup';
  data: ExtensionRequest;
};
export type RoutedInternalRequest = {
  type: 'fromPopup';
  data: PopupRequest;
};
export type RoutedExtensionRequest = RoutedExternalRequest | RoutedInternalRequest;
export type ExtensionResponse = {
  id: string;
  [key: string]: unknown;
};
