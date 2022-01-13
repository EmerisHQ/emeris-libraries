import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { State } from './state';
import { RootState } from '..';
export interface Getters {
  [GetterTypes.getPending](state: State): ExtensionRequest[];
  [GetterTypes.getWallet](state: State): EmerisWallet;
  [GetterTypes.getLastAccount](state: State): string;
}

export interface GlobalGetters {
  [GlobalGetterTypes.getPending](
    ...args: Parameters<Getters[GetterTypes.getPending]>
  ): ReturnType<Getters[GetterTypes.getPending]>;
  [GlobalGetterTypes.getWallet](
    ...args: Parameters<Getters[GetterTypes.getWallet]>
  ): ReturnType<Getters[GetterTypes.getWallet]>;
  [GlobalGetterTypes.getLastAccount](
    ...args: Parameters<Getters[GetterTypes.getLastAccount]>
  ): ReturnType<Getters[GetterTypes.getLastAccount]>;
}

export const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.getPending]: (state) => {
    return state.pending;
  },
  [GetterTypes.getWallet]: (state) => {
    return state.wallet;
  },
  [GetterTypes.getLastAccount]: (state) => {
    return state.lastAccount;
  },
};
