import { EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { State } from './state';
import { MutationTree } from 'vuex';

export type Mutations<S = State> = {
  [MutationTypes.ADD_PENDING](state: S, payload: ExtensionRequest[]): void;
  [MutationTypes.REMOVE_REQUEST](state: S, requestId: string): void;
  [MutationTypes.SET_WALLET](state: S, wallet: EmerisWallet): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_PENDING](state: State, payload: ExtensionRequest[]) {
    state.pending = [...state.pending, ...payload];
  },
  [MutationTypes.REMOVE_REQUEST](state: State, requestId: string) {
    state.pending = [...state.pending.filter((request) => request.id != requestId)];
  },
  [MutationTypes.SET_WALLET](state: State, wallet: EmerisWallet) {
    state.wallet = wallet;
  },
};
