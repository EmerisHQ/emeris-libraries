import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { GlobalGetterTypes as GlobalApiGetterTypes } from '@/store/demeris-api/getter-types';
import { State } from './state';
import { RootState } from '..';
import { Balance } from '@/types/api';
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
  [GetterTypes.getAccount]: (state) => {
    return (state.wallet || []).find(account => account.accountName === state.lastAccount);
  },
  [GetterTypes.getKeyHash]: (state, getters) => {
    const account = getters[GetterTypes.getAccount]
    if (!account) return

    const keyHashRecord = state.keyHashes.find(({ accountName }) => accountName === account.accountName)
    return keyHashRecord ? keyHashRecord.keyHash : undefined
  },
  // accessing rootState doesn't allow for isolating each module, but this way we don't need to change the demeris module
  [GetterTypes.getAllBalances]: (state, getters, rootState, rootGetters) => {
    const keyHash = getters[GetterTypes.getKeyHash]

    return rootGetters[GlobalApiGetterTypes.getBalances]({ address: keyHash })
  },
};
