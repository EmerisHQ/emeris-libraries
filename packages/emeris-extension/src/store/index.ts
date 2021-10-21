import { createStore } from 'vuex';

import { ExtensionStore, ExtensionState, store as extension } from '@/store/extension';

export type RootState = {
  extension: ExtensionState;
};
export type Store = ExtensionStore<Pick<RootState, 'extension'>>;
export const store = createStore({
  modules: {
    extension,
  },
});


export function useStore() {
  return store;
}