import { EmerisWallet } from '.';
import { TransactionSignRequest } from '../../../types/EmerisTransactions';


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
export type GetWalletNameRequest = Request & {
  action: 'getWalletName';
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
export type GetWalletsRequest = Request & {
  action: 'getWallets';
};
export type SetPartialAccountCreationRequest = Request & {
  action: 'setPartialAccountCreation';
  data: {
    wallet: EmerisWallet;
    route: string;
  };
};
export type GetPartialAccountCreationRequest = Request & {
  action: 'getPartialAccountCreation';
};
export type CreateWalletRequest = Request & {
  action: 'createWallet';
  data: {
    wallet: EmerisWallet;
    password: string;
  };
};
export type UnlockWalletRequest = Request & {
  action: 'unlockWallet';
  data: {
    walletName: string;
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
  | GetWalletNameRequest
  | HasWalletRequest;
export type PopupRequest =
  | GetPendingRequest
  | SetPartialAccountCreationRequest
  | GetPartialAccountCreationRequest
  | CreateWalletRequest
  | UnlockWalletRequest
  | GetWalletRequest
  | GetWalletsRequest
  | SetPasswordRequest
  | CheckPasswordRequest
  | HasPasswordRequest
  | ExtensionResetRequest
  | SetResponseRequest;
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
