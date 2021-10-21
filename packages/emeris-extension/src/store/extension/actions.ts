import { ActionTypes, GlobalActionTypes } from "./action-types";
import { ActionContext, ActionTree } from 'vuex';
import { ExtensionState } from "./state";
import { RootState } from "..";
import { ExtensionRequest } from "@/types/index";
import { MutationTypes } from "./mutation-types";


export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_PENDING](
    { commit, getters }: ActionContext<ExtensionState, RootState>
  ): Promise<ExtensionRequest[]>;
}
export interface GlobalActions {
  // Cross-chain endpoint actions
  [GlobalActionTypes.GET_PENDING](
    ...args: Parameters<Actions[ActionTypes.GET_PENDING]>
  ): ReturnType<Actions[ActionTypes.GET_PENDING]>;
}

export const actions: ActionTree<ExtensionState, RootState> & Actions = {
  async [ActionTypes.GET_PENDING]({ commit, getters }) {
    try {
			const latestPending = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getPending' } });
			console.log(latestPending);
			if (latestPending.length > 0) {
				commit(MutationTypes.ADD_PENDING, latestPending);
			}
    } catch (e) {
      throw new Error('Extension:GetPendingRequests failed');
    }
    return getters['getPending'];
  },
};