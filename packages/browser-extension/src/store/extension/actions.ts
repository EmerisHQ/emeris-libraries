import { ActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { EmerisAccount, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { keyHashfromAddress } from '@/utils/basic';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { GlobalDemerisActionTypes } from '@/store/demeris-api/action-types';

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
  ): Promise<EmerisWallet>;
  [ActionTypes.UPDATE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { oldAccountName, newAccountName }: { oldAccountName: string; newAccountName: string },
  ): Promise<EmerisWallet>;
  [ActionTypes.REMOVE_ACCOUNT](
    { commit }: ActionContext<State, RootState>,
    { accountName }: { accountName: string },
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
  [ActionTypes.GET_ADDRESS]({}: ActionContext<State, RootState>, { chainId }: { chainId: string }): Promise<string>;
  [ActionTypes.REMOVE_WHITELISTED_WEBSITE](
    {}: ActionContext<State, RootState>,
    { website }: { website: string },
  ): Promise<void>;
}
export type GlobalActions = Namespaced<Actions, 'extension'>;

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
  // async [ActionTypes.LOAD_SESSION_DATA]({ state, commit, dispatch, getters }) {
  //   const lastAccountUsed = await dispatch(ActionTypes.GET_LAST_ACCOUNT_USED) // also loads the last account to the state

  //   // TODO move to background
  //   const keyHashLookup = await Promise.all(state.wallet.map(async ({ accountName, accountMnemonic }) => {
  //     const hdWallet = await Secp256k1HdWallet.fromMnemonic(accountMnemonic, /* config for hdPath and prefix go here */)
  //     const [{ address }] = await hdWallet.getAccounts()
  //     const keyHash = keyHashfromAddress(address)

  //     return {
  //       accountName,
  //       keyHash
  //     }
  //   }))
  //   commit(MutationTypes.SET_KEY_HASHES, keyHashLookup)

  //   const keyHash = keyHashLookup.find(({ accountName }) => lastAccountUsed === accountName)

  //   await dispatch(GlobalDemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }, { root: true })
  // },
  async [ActionTypes.GET_WALLET]({ commit, dispatch, getters }) {
    try {
      const wallet = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getWallet' } });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);
        const lastAccountUsed = await dispatch(ActionTypes.GET_LAST_ACCOUNT_USED); // also loads the last account to the state

        const keyHashLookup: {
          accountName: string;
          keyHash: string;
        }[] = await Promise.all(
          wallet.map(async ({ accountName, accountMnemonic }) => {
            const hdWallet = await Secp256k1HdWallet.fromMnemonic(
              accountMnemonic /* config for hdPath and prefix go here */,
            );
            const [{ address }] = await hdWallet.getAccounts();
            const keyHash = keyHashfromAddress(address);

            return {
              accountName,
              keyHash,
            };
          }),
        );
        commit(MutationTypes.SET_KEY_HASHES, keyHashLookup);

        const keyHashRecord = keyHashLookup.find(({ accountName }) => lastAccountUsed === accountName);
        if (!keyHashRecord) return;
        await dispatch(
          GlobalDemerisActionTypes.GET_BALANCES,
          { subscribe: true, params: { address: keyHashRecord.keyHash } },
          { root: true },
        );
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
  async [ActionTypes.CREATE_WALLET]({ commit, getters }, { password }: { password: string }) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createWallet', data: { password } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.CREATE_ACCOUNT]({ commit, getters }, { account }: { account: EmerisAccount }) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'createAccount', data: { account } },
    });
    commit(MutationTypes.SET_WALLET, response as EmerisWallet);
    return getters['getWallet'];
  },
  async [ActionTypes.UPDATE_ACCOUNT](
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
  async [ActionTypes.REMOVE_ACCOUNT]({ commit, getters }, { accountName }: { accountName: string }) {
    const response = await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'removeAccount', data: { accountName } },
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
        dispatch(ActionTypes.GET_WALLET);
        return getters['getWallet'];
      }
    } catch (e) {
      console.log(e);
      throw new Error('Extension:UnlockWallet failed');
    }
  },
  async [ActionTypes.CHANGE_PASSWORD]({}, { password }: { password: string }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'changePassword', data: { password } },
    });
  },
  async [ActionTypes.GET_LAST_ACCOUNT_USED]({ commit, getters }) {
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
  async [ActionTypes.SET_LAST_ACCOUNT_USED]({ commit, getters }, { accountName }) {
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
  async [ActionTypes.GET_MNEMONIC]({}, { accountName, password }: { accountName: string; password: string }) {
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
  async [ActionTypes.GET_ADDRESS]({}, { chainId }: { chainId: string }) {
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
  async [ActionTypes.WHITELIST_WEBSITE]({ dispatch, getters }, { website }) {
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'addWhitelistedWebsite', data: { website } },
    });
    await browser.runtime.sendMessage({
      type: 'fromPopup',
      data: { action: 'setResponse', data: getters['getPending'][0] },
    });
    await dispatch(ActionTypes.GET_WHITELISTED_WEBSITES);
  },
  async [ActionTypes.ACCEPT_TRANSACTION]({}, { id }) {
    await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'acceptTransaction', data: { id } } });
  },
  async [ActionTypes.CANCEL_TRANSACTION]({}, { id }) {
    await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'cancelTransaction', data: { id } } });
  },
};
