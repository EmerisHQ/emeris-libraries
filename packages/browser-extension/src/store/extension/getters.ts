import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { State } from './state';
import { RootState } from '..';
import { parseCoins } from '@/utils/basic';
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
  // accessing rootState doesn't allow for isolating each module, but this way we don't need to change the demeris module
  [GetterTypes.getAllBalances]: (state, getters, rootState) => {
    const balances = Object.values(rootState.demerisAPI.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => state.wallet.keyHash === balance.address)
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
};
