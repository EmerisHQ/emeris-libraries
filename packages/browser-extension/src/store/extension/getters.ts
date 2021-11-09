import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { State } from './state';
import { RootState } from '..';
export interface Getters {
  [GetterTypes.getPending](state: State): ExtensionRequest[];
  [GetterTypes.getWallet](state: State): EmerisWallet;
  [GetterTypes.getWallets](state: State): EmerisEncryptedWallet[];
}

export interface GlobalGetters {
  [GlobalGetterTypes.getPending](
    ...args: Parameters<Getters[GetterTypes.getPending]>
  ): ReturnType<Getters[GetterTypes.getPending]>;
  [GlobalGetterTypes.getWallet](
    ...args: Parameters<Getters[GetterTypes.getWallet]>
  ): ReturnType<Getters[GetterTypes.getWallet]>;
  [GlobalGetterTypes.getWallets](
    ...args: Parameters<Getters[GetterTypes.getWallets]>
  ): ReturnType<Getters[GetterTypes.getWallets]>;
}

export const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.getPending]: (state) => {
    return state.pending;
  },
  [GetterTypes.getWallet]: (state) => {
    return state.wallet;
  },
  [GetterTypes.getWallets]: (state) => {
    return state.wallets;
  },
};
