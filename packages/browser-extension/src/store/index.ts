import { createStore, Store } from 'vuex';

import { InjectionKey } from 'vue';
import { ExtensionStore, State as ExtensionState, store as extension } from '@@/store/extension';
import { DemerisStore, State as DemerisState, store as demeris } from '@/store/demeris';
import init from '@/store/config';

export type RootState = {
  extension: ExtensionState;
  demeris: DemerisState;
  [key: string]: unknown;
};
export type TypedExtensionStore = ExtensionStore<Pick<RootState, 'extension'>>;
export type TypedDemerisStore = DemerisStore<Pick<RootState, 'demeris'>>;

export const key: InjectionKey<Store<RootState>> = Symbol();
export const rootstore = createStore<RootState>({
  modules: {
    extension,
    demeris
  },
});
init(rootstore); // add tendermint-liquidity module

export function useExtensionStore(): TypedExtensionStore & TypedDemerisStore {
  return rootstore as (TypedExtensionStore & TypedDemerisStore);
}
