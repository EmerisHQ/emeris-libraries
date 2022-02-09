import { EmerisAccount } from '.';
import { TransactionSignRequest } from '../../../types/src/EmerisTransactions';

export interface Request {
  id?: string;
  action?: string;
  origin?: string; // set by Emeris
  data?: Record<string, unknown>;
}
export type ApproveOriginRequest = Request & {
  action: 'enable';
};
export type SignTransactionRequest = Request & {
  action: 'signTransaction';
  data: TransactionSignRequest;
};
export type SignAndBroadcastTransactionRequest = Request & {
  action: 'signAndBroadcastTransaction';
  data: {
    tx: TransactionSignRequest;
  };
};
export type GetAddressRequest = Request & {
  action: 'getAddress';
  data: {
    chainId: string;
  };
};
export type GetPublicKeyRequest = Request & {
  action: 'getPublicKey';
  data: {
    chainId: string;
  };
};
export type IsHWWalletRequest = Request & {
  action: 'isHWWallet';
};
export type SupportedChainsRequest = Request & {
  action: 'supportedChains';
};
export type GetAccountNameRequest = Request & {
  action: 'getAccountName';
};
export type HasWalletRequest = Request & {
  action: 'hasWallet';
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
    oldAccountName: string;
    account: EmerisAccount;
  };
};
export type RemoveAccountRequest = Request & {
  action: 'removeAccount';
  data: {
    accountName: string;
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
export type ChangePasswordRequest = Request & {
  action: 'changePassword';
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
export type GetWhitelistedWebsiteRequest = Request & {
  action: 'getWhitelistedWebsite';
};
export type RemoveWhitelistedWebsiteRequest = Request & {
  action: 'removeWhitelistedWebsite';
  data: {
    website: string;
  };
};
export type AddWhitelistedWebsiteRequest = Request & {
  action: 'addWhitelistedWebsite';
  data: {
    website: string;
  };
};
export type AcceptTransactionSignRequest = Request & {
  action: 'acceptTransaction';
  data: {
    id: string;
  };
};
export type CancelTransactionSignRequest = Request & {
  action: 'cancelTransaction';
  data: {
    id: string;
  };
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
  | RemoveAccountRequest
  | SetLastAccountRequest
  | GetMnemonicRequest
  | CreateWalletRequest
  | UnlockWalletRequest
  | ChangePasswordRequest
  | GetWalletRequest
  | GetLastAccountRequest
  | SetResponseRequest
  | GetAddressRequest
  | ExtensionResetRequest
  | GetWhitelistedWebsiteRequest
  | RemoveWhitelistedWebsiteRequest
  | AddWhitelistedWebsiteRequest
  | AcceptTransactionSignRequest
  | CancelTransactionSignRequest
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
