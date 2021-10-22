import { ActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { ExtensionRequest } from '@/types/index';
import { MutationTypes } from './mutation-types';
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_PENDING]({ commit, getters }: ActionContext<State, RootState>): Promise<ExtensionRequest[]>;
  [ActionTypes.COMPLETE_REQUEST]({ commit }: ActionContext<State, RootState>, { requestId: number }): Promise<boolean>;
}
export type GlobalActions = Namespaced<Actions, 'extension'>;

export const actions: ActionTree<State, RootState> & Actions = {
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
  async [ActionTypes.COMPLETE_REQUEST]({ commit }, { requestId }) {
    try {
      commit(MutationTypes.REMOVE_REQUEST, requestId);
      return true;
    } catch (e) {
      return false;
    }
  },
};
