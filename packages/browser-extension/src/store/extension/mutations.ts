import { EmerisAccount, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { State } from './state';
import { MutationTree } from 'vuex';

export type Mutations<S = State> = {
  [MutationTypes.ADD_PENDING](state: S, payload: ExtensionRequest[]): void;
  [MutationTypes.REMOVE_REQUEST](state: S, requestId: string): void;
  [MutationTypes.SET_WALLET](state: S, wallet: EmerisWallet): void;
  [MutationTypes.SET_LAST_ACCOUNT](state: S, accountName: string): void;
  [MutationTypes.SET_MNEMONIC](state: S, payload: { account: EmerisAccount }): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_PENDING](state: State, payload: ExtensionRequest[]) {
    state.pending = [...payload];
  },
  [MutationTypes.REMOVE_REQUEST](state: State, requestId: string) {
    state.pending = [...state.pending.filter((request) => request.id != requestId)];
  },
  [MutationTypes.SET_WALLET](state: State, wallet: EmerisWallet) {
    state.wallet = wallet;
  },
  [MutationTypes.SET_LAST_ACCOUNT](state: State, accountName: string) {
    state.lastAccount = accountName;
  },
  [MutationTypes.SET_NEW_ACCOUNT](state: State, account: EmerisAccount) {
    state.newAccount = account;
  },
  [MutationTypes.SET_MNEMONIC](state: State, payload: { account: EmerisAccount }) {
    state.wallet = state.wallet.map((account) => {
      if (account.accountName === payload.account.accountName) {
        account.accountMnemonic = payload.account.accountMnemonic;
      }
      return account;
    });
  },
};
