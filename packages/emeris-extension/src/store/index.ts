import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

import init from '@/store/config';
import {
  DemerisStore as DemerisStoreAPI,
  module as moduleAPI,
  namespace as namespaceAPI,
  State as StateAPI,
} from '@/store/demeris-api';
import {
  DemerisStore as DemerisStoreTX,
  module as moduleTX,
  namespace as namespaceTX,
  State as StateTX,
} from '@/store/demeris-tx';
import {
  DemerisStore as DemerisStoreUSER,
  module as moduleUSER,
  namespace as namespaceUSER,
  State as StateUSER,
} from '@/store/demeris-user';
import { ExtensionStore, State as ExtensionState, store as extension } from '@@/store/extension';

export type RootState = {
  extension: ExtensionState;
  [namespaceAPI]: StateAPI;
  [namespaceTX]: StateTX;
  [namespaceUSER]: StateUSER;
  [key: string]: unknown;
};
export type RootStore<S> = DemerisStoreAPI<S> & DemerisStoreTX<S> & DemerisStoreUSER<S> & ExtensionStore<S>;

export type RootStoreType = RootStore<
  Pick<RootState, typeof namespaceAPI | typeof namespaceTX | typeof namespaceUSER | 'extension'>
>;

export type TypedAPIStore = DemerisStoreAPI<Pick<RootState, typeof namespaceAPI>>;
export type TypedUSERStore = DemerisStoreUSER<Pick<RootState, typeof namespaceUSER>>;
export type TypedTXStore = DemerisStoreTX<Pick<RootState, typeof namespaceTX>>;
export type TypedExtensionStore = ExtensionStore<Pick<RootState, 'extension'>>;

export const key: InjectionKey<Store<RootState>> = Symbol();
export const rootstore = createStore<RootState>({
  modules: {
    extension,
    [namespaceAPI]: moduleAPI,
    [namespaceTX]: moduleTX,
    [namespaceUSER]: moduleUSER,
  },
});
init(rootstore); // add tendermint-liquidity module

export function useExtensionStore(): TypedExtensionStore {
  return rootstore as TypedExtensionStore;
}
