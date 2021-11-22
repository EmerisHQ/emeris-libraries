import { ActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_PENDING]({ commit, getters }: ActionContext<State, RootState>): Promise<ExtensionRequest[]>;
  [ActionTypes.GET_WALLET]({ commit, getters }: ActionContext<State, RootState>): Promise<EmerisWallet>;
  [ActionTypes.GET_WALLETS]({ commit, getters }: ActionContext<State, RootState>): Promise<EmerisEncryptedWallet[]>;
  [ActionTypes.COMPLETE_REQUEST](
    { commit }: ActionContext<State, RootState>,
    { requestId }: { requestId: number },
  ): Promise<boolean>;
  [ActionTypes.CREATE_WALLET](
    { commit }: ActionContext<State, RootState>,
    { wallet, password }: { wallet: EmerisWallet; password: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.UNLOCK_WALLET](
    { commit }: ActionContext<State, RootState>,
    { walletName, password }: { walletName: string; password: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.HAS_PASSWORD](
    { getters }: ActionContext<State, RootState>,
    { },
  ): Promise<boolean>;
}
export type GlobalActions = Namespaced<Actions, 'extension'>;

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GET_PENDING]({ commit, getters }) {
    try {
      const latestPending = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getPending' } });
      console.log(latestPending);

      commit(MutationTypes.ADD_PENDING, latestPending);
    } catch (e) {
      throw new Error('Extension:GetPendingRequests failed');
    }
    return getters['getPending'];
  },
  async [ActionTypes.CREATE_WALLET](
    { commit, getters },
    { wallet, password }: { wallet: EmerisWallet; password: string },
  ) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createWallet', data: { wallet, password } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.GET_WALLET]({ commit, getters }) {
    try {
      const wallet = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getWallet' } });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);
      }
    } catch (e) {
      throw new Error('Extension:GetWallet failed');
    }
    return getters['getWallet'];
  },
  async [ActionTypes.UNLOCK_WALLET](
    { commit, getters },
    { walletName, password }: { walletName: string; password: string },
  ) {
    try {
      const wallet = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'unlockWallet', data: { walletName, password } },
      });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);
      }
    } catch (e) {
      console.log(e);
      throw new Error('Extension:UnlockWallet failed');
    }
    return getters['getWallet'];
  },
  async [ActionTypes.GET_WALLETS]({ commit, getters }) {
    try {
      const wallets = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getWallets' } });
      if (wallets) {
        commit(MutationTypes.SET_WALLETS, wallets as EmerisEncryptedWallet[]);
      }
    } catch (e) {
      throw new Error('Extension:GetWallets failed');
    }
    return getters['getWallets'];
  },
  async [ActionTypes.COMPLETE_REQUEST]({ commit }, { requestId }) {
    try {
      commit(MutationTypes.REMOVE_REQUEST, requestId);
      return true;
    } catch (e) {
      return false;
    }
  },
  async [ActionTypes.HAS_PASSWORD]() {
    return true; // TODO
  },
};
