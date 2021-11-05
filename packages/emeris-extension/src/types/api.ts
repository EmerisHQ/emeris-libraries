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
    tx: unknown;
    chainId: string;
    origin?: string;
  };
};
export type SignAndBroadcastTransactionRequest = Request & {
  action: 'signAndBroadcastTransaction';
  data: {
    tx: unknown;
    chainId: string;
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
export type RoutedExtensionRequest = {
  type: 'toEmerisExtension' | 'toPopup';
  data: ExtensionRequest;
};
export type ExtensionResponse = {
  id: string;
  [key: string]: unknown;
};
