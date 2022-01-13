import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { State } from './state';
import { RootState } from '..';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';
import { Secp256k1HdWallet } from '@cosmjs/amino';
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
  // accessing rootState doesn't allow for isolating each module, but this way we don't need to change the demeris module
  [GetterTypes.getAllBalances]: async (state, getters, rootState) => {
    const account = getters[GetterTypes.getAccount]
    if (!account) return

    const hdWallet = await Secp256k1HdWallet.fromMnemonic(account.accountMnemonic, /* config for hdPath and prefix go here */)
    const [{ address }] = await hdWallet.getAccounts()
    const keyHash = keyHashfromAddress(address)

    const balances = Object.values(rootState.demerisAPI.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => keyHash === balance.address)
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
};
