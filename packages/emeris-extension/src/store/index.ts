import { createStore, Store } from 'vuex';

import { InjectionKey } from 'vue';
import { ExtensionStore, State, store as extension } from '@@/store/extension';

export type RootState = {
  extension: State;
  [key: string]: unknown;
};
export type TypedExtensionStore = ExtensionStore<Pick<RootState, 'extension'>>;

export const key: InjectionKey<Store<RootState>> = Symbol();
export const rootstore = createStore<RootState>({
  modules: {
    extension,
  },
});

export function useExtensionStore(): TypedExtensionStore {
  return rootstore as TypedExtensionStore;
}
