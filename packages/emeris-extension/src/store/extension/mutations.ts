import { ExtensionRequest } from "@/types/index";
import { MutationTypes } from "./mutation-types";
import { ExtensionState } from './state';
import { MutationTree } from 'vuex';

export type Mutations<S = ExtensionState> = {
	[MutationTypes.ADD_PENDING](state: S, payload: ExtensionRequest[]): void;
}

export const mutations: MutationTree<ExtensionState> & Mutations = {
	[MutationTypes.ADD_PENDING](state: ExtensionState, payload: ExtensionRequest[]) {
		state.pending = [...state.pending, ...payload];
  },
};