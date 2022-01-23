import { IEmeris } from '@@/types/emeris';
import * as Base from '@@/../../types/lib/EmerisBase';
import {
  ExtensionRequest,
  ExtensionResponse,
  GetAddressRequest,
  GetPublicKeyRequest,
  HasWalletRequest,
  IsHWWalletRequest,
  RoutedExtensionRequest,
  SignTransactionRequest,
  SupportedChainsRequest,
  ApproveOriginRequest,
  SignAndBroadcastTransactionRequest,
  GetAccountNameRequest,
} from '@@/types/api';
import { v4 as uuidv4 } from 'uuid';
import { AbstractTx, AbstractTxResult } from '@@/types/transactions';
import { Transaction, TransactionData } from 'EmerisTransactions';
export class ProxyEmeris implements IEmeris {
  loaded: boolean;
  private queuedRequests: Map<
    string,
    Record<'resolver', (value: ExtensionRequest | PromiseLike<ExtensionRequest>) => void>
  >;
  constructor() {
    this.loaded = true;
    this.queuedRequests = new Map();

    window.addEventListener('message', this.responseHandler.bind(this));
  }
  private async responseHandler(event) {
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }
    // We only deal with messages to the extension
    if (event.data.type != 'fromEmerisExtension') {
      return;
    }
    const request = this.queuedRequests.get(event.data.data.id);
    if (!request) {
      return;
    }
    request.resolver(event.data.data);
    this.queuedRequests.delete(event.data.data.id);
  }
  private async sendRequest(request: ExtensionRequest): Promise<ExtensionResponse> {
    const requestId = uuidv4();

    const fullRequest: RoutedExtensionRequest = {
      type: 'toEmerisExtension',
      data: { id: requestId, ...request },
    };

    let resolver;

    const response: Promise<ExtensionResponse> = new Promise((resolve) => {
      resolver = resolve;
    });

    this.queuedRequests.set(requestId, { resolver });
    window.postMessage(fullRequest, window.location.origin);

    return await response;
  }
  async getAddress(chainId: string): Promise<string> {
    const request = {
      action: 'getAddress',
      data: { chainId },
    };
    const response = await this.sendRequest(request as GetAddressRequest);
    return response.data as string;
  }
  async getPublicKey(chainId: string): Promise<Uint8Array> {
    const request = {
      action: 'getPublicKey',
      data: { chainId },
    };
    const response = await this.sendRequest(request as GetPublicKeyRequest);
    return response.data as Uint8Array;
  }
  async isHWWallet(): Promise<boolean> {
    const request = {
      action: 'isHWWallet',
      data: {},
    };
    const response = await this.sendRequest(request as IsHWWalletRequest);
    return response.data as boolean;
  }
  async supportedChains(): Promise<string[]> {
    const request = {
      action: 'supportedChains',
      data: {},
    };
    const response = await this.sendRequest(request as SupportedChainsRequest);
    return response.data as string[];
  }
  async getAccountName(): Promise<string> {
    const request = {
      action: 'getAccountName',
      data: {},
    };
    const response = await this.sendRequest(request as GetAccountNameRequest);
    return response.data as string;
  }
  async hasWallet(): Promise<boolean> {
    const request = {
      action: 'hasWallet',
      data: {},
    };
    const response = await this.sendRequest(request as HasWalletRequest);
    return response.data as boolean;
  }

  // TODO resolve type errors
  async signTransaction({
    messages,
    chainId,
    signingAddress,
    fee,
    memo
  }: {
    signingAddress: string,
    chainId: string,
    messages: Transaction<TransactionData>[],
    fee: {
      gas: string,
      amount: Base.Amount[]
    }
    memo?: string
  }): Promise<Uint8Array> {
    const request = {
      action: 'signTransaction',
      data: { messages, chainId, signingAddress, fee, memo },
    };
    const response = await this.sendRequest(request as SignTransactionRequest);
    if (!response.data) {
      throw new Error('Signing was not successful')
    }
    return response.data as Uint8Array;
  }
  async enable(): Promise<boolean> {
    const request = {
      action: 'enable',
      data: {},
    };
    const response = await this.sendRequest(request as ApproveOriginRequest);
    return response.data as boolean;
  }

  // TODO resolve type issues
  // async signAndBroadcastTransaction({ tx, chainId }: { tx: AbstractTx; chainId: string }): Promise<AbstractTxResult> {
  //   const request = {
  //     action: 'signAndBroadcastTransaction',
  //     data: { tx, chainId },
  //   };
  //   const response = await this.sendRequest(request as SignAndBroadcastTransactionRequest);
  //   return response.data as AbstractTxResult;
  // }
}
