import {
  SignTransactionRequest,
  SignAndBroadcastTransactionRequest,
  GetPublicKeyRequest,
  GetAccountNameRequest,
  IsHWWalletRequest,
  SupportedChainsRequest,
  GetAddressRequest,
  HasWalletRequest,
  ApproveOriginRequest,
} from './api';
import { AbstractTx, AbstractTxResult } from './transactions';

export interface IEmeris {
  loaded: boolean;
  getAddress?: (arg: string | GetAddressRequest) => Promise<string>;
  getPublicKey?: (arg: string | GetPublicKeyRequest) => Promise<Uint8Array>;
  isHWWallet?: (arg?: IsHWWalletRequest) => Promise<boolean>;
  supportedChains?: (arg?: SupportedChainsRequest) => Promise<string[]>;
  getAccountName?: (arg?: GetAccountNameRequest) => Promise<string>;
  hasWallet?: (arg?: HasWalletRequest) => Promise<boolean>;
  enable?: (arg?: ApproveOriginRequest) => Promise<boolean>;
  signTransaction?: (arg: { tx: AbstractTx; chainId: string } | SignTransactionRequest) => Promise<Uint8Array>;
  signAndBroadcastTransaction?: (
    arg: { tx: AbstractTx; chainId: string } | SignAndBroadcastTransactionRequest,
  ) => Promise<AbstractTxResult>;
}
