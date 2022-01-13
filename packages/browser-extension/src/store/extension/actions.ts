import { ActionTypes, GlobalActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { EmerisAccount, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { keyHashfromAddress } from '@/utils/basic';
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { GlobalDemerisActionTypes } from '@/store/demeris-api/action-types';
import { DemerisMutationTypes } from '@/store/demeris-api/mutation-types';
import { GetterTypes } from './getter-types';

type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_PENDING]({ commit, getters }: ActionContext<State, RootState>): Promise<ExtensionRequest[]>;
  [ActionTypes.COMPLETE_REQUEST](
    { commit }: ActionContext<State, RootState>,
    { requestId }: { requestId: number },
  ): Promise<boolean>;
  [ActionTypes.GET_WALLET]({ commit, getters }: ActionContext<State, RootState>): Promise<EmerisWallet>;
  [ActionTypes.HAS_WALLET]({ commit, getters }: ActionContext<State, RootState>): Promise<boolean>;
  [ActionTypes.CREATE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { account }: { account: EmerisAccount },
  ): Promise<EmerisWallet>;
  [ActionTypes.UPDATE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { account }: { account: EmerisAccount },
  ): Promise<EmerisWallet>;
  [ActionTypes.CREATE_WALLET](
    { commit }: ActionContext<State, RootState>,
    { password }: { password: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.UNLOCK_WALLET](
    { commit }: ActionContext<State, RootState>,
    { password }: { password: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.GET_LAST_ACCOUNT_USED]({ commit, getters }: ActionContext<State, RootState>): Promise<string>;
  [ActionTypes.SET_LAST_ACCOUNT_USED](
    { commit, getters }: ActionContext<State, RootState>,
    { accountName }: { accountName: string },
  ): Promise<void>;
  [ActionTypes.GET_MNEMONIC](
    { commit }: ActionContext<State, RootState>,
    { accountName, password }: { accountName: string; password: string },
  ): Promise<string>;
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
  async [ActionTypes.COMPLETE_REQUEST]({ commit }, { requestId }) {
    try {
      commit(MutationTypes.REMOVE_REQUEST, requestId);
      return true;
    } catch (e) {
      return false;
    }
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
  async [ActionTypes.HAS_WALLET]({ commit }) {
    try {
      const hasWallet = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'hasWallet' } });
      if (!hasWallet) {
        commit(MutationTypes.SET_WALLET, [] as EmerisWallet);
      }
      return hasWallet;
    } catch (e) {
      throw new Error('Extension:HasWallet failed');
    }
  },
  async [ActionTypes.CREATE_WALLET](
    { commit, getters },
    { password }: { password: string },
  ) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createWallet', data: { password } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.CREATE_ACCOUNT](
    { commit, getters },
    { account }: { account: EmerisAccount },
  ) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createAccount', data: { account } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.UPDATE_ACCOUNT](
    { commit, getters },
    { account }: { account: EmerisAccount },
  ) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'updateAccount', data: { account } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.UNLOCK_WALLET]({ commit, dispatch, getters }, { password }: { password: string }) {
    try {
      const wallet = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'unlockWallet', data: { password } },
      });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);
        dispatch(ActionTypes.GET_LAST_ACCOUNT_USED)

        // // TODO whole block is a clone of getallbalances in getters => refactor
        // const account = getters[GetterTypes.getAccount]
        // if (!account) return

        // const hdWallet = await Secp256k1HdWallet.fromMnemonic(account.accountMnemonic, /* config for hdPath and prefix go here */)
        // const [{ address }] = await hdWallet.getAccounts()
        // const keyHash = keyHashfromAddress(address)

        // await dispatch(GlobalDemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }, { root: true })
      }
    } catch (e) {
      console.log(e);
      throw new Error('Extension:UnlockWallet failed');
    }
    return getters['getWallet'];
  },
  async [ActionTypes.GET_LAST_ACCOUNT_USED]({ commit, getters }) {
    try {
      const accountName = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'getLastAccountUsed' },
      });
      if (accountName) {
        commit(MutationTypes.SET_LAST_ACCOUNT, accountName);
      }
    } catch (e) {
      throw new Error('Extension:GetLastAccountUsed failed');
    }
    return getters['getLastAccount'];
  },
  async [ActionTypes.SET_LAST_ACCOUNT_USED]({ commit, getters }, { accountName }) {
    try {
      await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'setLastAccountUsed' },
      });
      commit(MutationTypes.SET_LAST_ACCOUNT, accountName);
    } catch (e) {
      throw new Error('Extension:SetLastAccountUsed failed');
    }
    return getters['getLastAccount'];
  },
  async [ActionTypes.GET_MNEMONIC](
    { commit, getters },
    { accountName, password }: { accountName: string; password: string },
  ) {
    try {
      const mnemonic = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'getMnemonic', data: { accountName, password } },
      });
      return mnemonic;
    } catch (e) {
      console.log(e);
      throw new Error('Extension:getMnemonic failed');
    }
  },
  // async [ActionTypes.EXTENSION_RESET]() {
  //   return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'extensionReset' } });
  // },
};

