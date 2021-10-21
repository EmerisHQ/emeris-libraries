import { createStore } from 'vuex';

import { ExtensionStore, State, store as extension } from '@/store/extension';

export type RootState = {
  extension: State;
  [key: string]:unknown;
};
export type TypedExtensionStore = ExtensionStore<Pick<RootState, 'extension'>>;
export const rootstore = createStore<RootState>({
  modules: {
    extension,
  },
});


export function useExtensionStore():TypedExtensionStore {
  return rootstore as TypedExtensionStore;
}