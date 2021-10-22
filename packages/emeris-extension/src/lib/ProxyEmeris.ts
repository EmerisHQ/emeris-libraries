import { IEmeris } from '@/shims-vue';
import { ExtensionRequest, ExtensionResponse, RoutedExtensionRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';
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
	async init(): Promise<boolean> {
		const request = {
      action: 'init',
    };
    const response = await this.sendRequest(request);
    return response.data as boolean;
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
    const response = await this.sendRequest(request);
    return response.data as string;
  }
  async getPublicKey(chainId: string): Promise<Uint8Array> {
    const request = {
      action: 'getPublicKey',
      data: { chainId },
    };
    const response = await this.sendRequest(request);
    return response.data as Uint8Array;
  }
  async isHWWallet(): Promise<boolean> {
    const request = {
      action: 'isHWWallet',
    };
    const response = await this.sendRequest(request);
    return response.data as boolean;
  }
  async supportedChains(): Promise<string[]> {
    const request = {
      action: 'supportedChains',
    };
    const response = await this.sendRequest(request);
    return response.data as string[];
  }
  async getWalletName(): Promise<string> {
    const request = {
      action: 'getWalletName',
    };
    const response = await this.sendRequest(request);
    return response.data as string;
  }
  async hasWallet(): Promise<boolean> {
    const request = {
      action: 'hasWallet',
    };
    const response = await this.sendRequest(request);
    return response.data as boolean;
	}
	/*
  async signTransaction(tx: any, chainId: string): Promise<Uint8Array> {
    const request = {
      action: 'signTransaction',
      data: { tx, chainId },
    };
    const response = await this.sendRequest(request);
    return response.data as Uint8Array;
  }
  async signAndBroadcastTransaction(tx: any, chainId: string): Promise<boolean> {
    const request = {
      action: 'signAndBroadcastTransaction',
      data: { tx, chainId },
    };
    const response = await this.sendRequest(request);
    return response.data as boolean;
  }
	*/
}
