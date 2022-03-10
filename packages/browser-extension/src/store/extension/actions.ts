import { ActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { AccountCreateStates, EmerisAccount, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { GlobalDemerisActionTypes } from '@/store';

type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_PENDING]({ commit, getters }: ActionContext<State, RootState>): Promise<ExtensionRequest[]>;
  [ActionTypes.GET_WALLET]({ commit, getters }: ActionContext<State, RootState>): Promise<EmerisWallet>;
  [ActionTypes.HAS_WALLET]({ commit, getters }: ActionContext<State, RootState>): Promise<boolean>;
  [ActionTypes.CREATE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { account }: { account: EmerisAccount },
  ): Promise<void>;
  [ActionTypes.UPDATE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { oldAccountName, newAccountName }: { oldAccountName: string; newAccountName: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.REMOVE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { accountName }: { accountName: string },
  ): Promise<void>;
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
  ): Promise<void>;
  [ActionTypes.GET_ADDRESS]({ }: ActionContext<State, RootState>, { chainId }: { chainId: string }): Promise<string>;
  [ActionTypes.REMOVE_WHITELISTED_WEBSITE](
    { }: ActionContext<State, RootState>,
    { website }: { website: string },
  ): Promise<void>;
  [ActionTypes.SET_NEW_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    account: EmerisAccount & { route: string }
  ): void;
  [ActionTypes.GET_NEW_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
  ): Promise<EmerisAccount & { route: string }>;
}
export type GlobalActions = Namespaced<Actions, 'extension'>;

const respond = async (id, data) => {
  await browser.runtime.sendMessage({
    type: 'fromPopup',
    data: { action: 'setResponse', data: { id, ...data } },
  });
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.GET_PENDING]({ commit, getters }) {
    try {
      const latestPending = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getPending' } });

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
  async [ActionTypes.LOAD_SESSION_DATA]({ dispatch, getters }) {
    const lastAccountused = await dispatch(ActionTypes.GET_LAST_ACCOUNT_USED); // also loads the last account to the state
    const account = getters['getWallet'].find(account => account.accountName === lastAccountused)
    await Promise.all(account.keyHashes.map(keyHash =>
      dispatch(
        GlobalDemerisActionTypes.API.GET_BALANCES,
        { subscribe: true, params: { address: keyHash } },
        { root: true },
      )
    ))
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
  async[ActionTypes.HAS_WALLET]({ commit }) {
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
  async[ActionTypes.CREATE_WALLET]({ commit, getters }, { password }: { password: string }) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createWallet', data: { password } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async[ActionTypes.CREATE_ACCOUNT]({ dispatch }, { account }: { account: EmerisAccount }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createAccount', data: { account } },
    });
    dispatch(ActionTypes.GET_WALLET)
    dispatch(ActionTypes.SET_LAST_ACCOUNT_USED, account)
  },
  async[ActionTypes.UPDATE_ACCOUNT](
    { commit, getters },
    { oldAccountName, newAccountName }: { oldAccountName: string; newAccountName: string },
  ) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'updateAccount', data: { oldAccountName, newAccountName } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async[ActionTypes.REMOVE_ACCOUNT]({ dispatch, getters }, { accountName }: { accountName: string }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'removeAccount', data: { accountName } },
    });
    await dispatch(ActionTypes.GET_WALLET)
  },
  async[ActionTypes.UNLOCK_WALLET]({ commit, dispatch, getters }, { password }: { password: string }) {
    try {
      const wallet = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'unlockWallet', data: { password } },
      });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);
        dispatch(ActionTypes.GET_WALLET);
        return getters['getWallet'];
      }
    } catch (e) {
      console.log(e);
      throw new Error('Extension:UnlockWallet failed');
    }
  },
  async [ActionTypes.CHANGE_PASSWORD]({ }, { password }: { password: string }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'changePassword', data: { password } },
    });
  },
  async[ActionTypes.GET_LAST_ACCOUNT_USED]({ commit, getters }) {
    try {
      const accountName = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'getLastAccount' },
      });
      if (accountName) {
        commit(MutationTypes.SET_LAST_ACCOUNT, accountName);
      }
    } catch (e) {
      throw new Error('Extension:GetLastAccountUsed failed');
    }
    return getters['getLastAccount'];
  },
  async[ActionTypes.SET_LAST_ACCOUNT_USED]({ commit, getters }, { accountName }) {
    try {
      await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'setLastAccount', data: { accountName } },
      });
      commit(MutationTypes.SET_LAST_ACCOUNT, accountName);
    } catch (e) {
      throw new Error('Extension:SetLastAccount failed');
    }
    return getters['getLastAccount'];
  },
  async [ActionTypes.GET_MNEMONIC]({ commit }, { accountName, password }: { accountName: string; password: string }) {
    try {
      const account = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'getMnemonic', data: { accountName, password } },
      });
      if (!account) throw new Error('Password incorrect');
      commit(MutationTypes.SET_MNEMONIC, { account });
    } catch (e) {
      console.log(e);
      throw new Error('Extension:getMnemonic failed');
    }
  },
  async [ActionTypes.GET_ADDRESS]({ }, { chainId }: { chainId: string }) {
    try {
      const address = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'getAddress', data: { chainId } },
      });
      return address;
    } catch (e) {
      console.log(e);
      throw new Error('Extension:getAddress failed');
    }
  },
  async [ActionTypes.ACCOUNT_BACKED_UP]({ dispatch }, { accountName }: { accountName: string }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'updateAccount', data: { account: { accountName, setupState: AccountCreateStates.COMPLETE } } },
    });
    dispatch(ActionTypes.LOAD_SESSION_DATA);
  },
  async [ActionTypes.EXTENSION_RESET]() {
    return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'extensionReset' } });
  },
  async [ActionTypes.GET_WHITELISTED_WEBSITES]({ commit }) {
    const whitelistWebsites = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'getWhitelistedWebsite' },
    });
    commit(MutationTypes.SET_WHITELISTED_WEBSITES, whitelistWebsites);
  },
  async [ActionTypes.REMOVE_WHITELISTED_WEBSITE]({ dispatch }, { website }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'removeWhitelistedWebsite', data: { website } },
    });
    await dispatch(ActionTypes.GET_WHITELISTED_WEBSITES);
  },
  async [ActionTypes.WHITELIST_WEBSITE]({ dispatch }, { id, accept }) {
    await respond(id, { data: accept })
    await dispatch(ActionTypes.GET_WHITELISTED_WEBSITES);
  },
  async [ActionTypes.ACCEPT_TRANSACTION]({ }, { id, fees, memo }) {
    await respond(id, { data: { accept: true, fees, memo } })
  },
  async [ActionTypes.CANCEL_TRANSACTION]({ }, { id }) {
    await respond(id, { data: { accept: false } })
  },
  async [ActionTypes.SEND_LEDGER_SIGNATURE]({ }, { id, broadcastable }) {
    await respond(id, { data: { broadcastable } })
  },
  async [ActionTypes.GET_RAW_TRANSACTION]({ }, {
    messages,
    chainId,
    signingAddress,
    gas,
    fees,
    memo }) {
    return await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: {
        action: 'getRawTransaction', data: {
          messages,
          chainId,
          signingAddress,
          fee: {
            gas,
            amount: fees
          },
          memo
        }
      },
    });
  },
  [ActionTypes.SET_NEW_ACCOUNT]({ commit }, account: EmerisAccount & { route: string }) {
    commit(MutationTypes.SET_NEW_ACCOUNT, account)
    if (!account) {
      localStorage.removeItem('new_account')
    } else {
      localStorage.setItem('new_account', JSON.stringify(account))
    }
  },
  [ActionTypes.GET_NEW_ACCOUNT]({ commit }) {
    const newAccount = localStorage.getItem('new_account')
    if (newAccount) {
      const parsedAccount = JSON.parse(newAccount)
      commit(MutationTypes.SET_NEW_ACCOUNT, parsedAccount)
      return parsedAccount
    }
    return undefined
  },
};
