import { ActionTypes } from './action-types';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { RootState } from '..';
import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types/index';
import { MutationTypes } from './mutation-types';
import { keyHashfromAddress } from '@/utils/basic';
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { GlobalDemerisActionTypes } from '@/store/demeris-api/action-types';
import { DemerisMutationTypes } from '@/store/demeris-api/mutation-types';

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
  [ActionTypes.GET_PARTIAL_ACCOUNT_CREATION](
    { getters }: ActionContext<State, RootState>,
    { },
  ): Promise<{ wallet: EmerisWallet, route: string }>;
  [ActionTypes.SET_PARTIAL_ACCOUNT_CREATION](
    { getters }: ActionContext<State, RootState>,
    { wallet: EmerisWallet, route: string },
  ): Promise<void>;
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
  async [ActionTypes.SET_PARTIAL_ACCOUNT_CREATION]({ }, { wallet, route }) {
    await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'setPartialAccountCreation', data: { wallet, route } } });
  },
  async [ActionTypes.GET_PARTIAL_ACCOUNT_CREATION]({ }) {
    return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getPartialAccountCreation' } });
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
    { commit, getters, dispatch },
    { walletName, password }: { walletName: string; password: string },
  ) {
    try {
      const wallet = await browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'unlockWallet', data: { walletName, password } },
      });
      if (wallet) {
        commit(MutationTypes.SET_WALLET, wallet as EmerisWallet);

        // TODO refactor into actions

        commit("demerisAPI/" + DemerisMutationTypes.INIT, { endpoint: process.env.VUE_APP_EMERIS_ENDPOINT }, { root: true })


        // HACK to demo

        // const hdWallet = await Secp256k1HdWallet.fromMnemonic(wallet.walletMnemonic, /* config for hdPath and prefix go here */)
        // const [{ address }] = await hdWallet.getAccounts()
        // const keyHash = keyHashfromAddress(address)
        const keyHash = "7ee143fd1d91345128da542f27ccd8d0e3d78fc0"
        await dispatch(GlobalDemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }, { root: true })
      }
    } catch (e) {
      console.log(e);
      throw new Error('Extension:UnlockWallet failed');
    }
    return getters['getWallet'];
  },
  async [ActionTypes.GET_WALLETS]({ commit, dispatch, getters }) {
    try {
      const wallets = await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'getWallets' } });
      if (wallets) {
        commit(MutationTypes.SET_WALLETS, wallets as EmerisEncryptedWallet[]);

        // HACK
        await dispatch(ActionTypes.UNLOCK_WALLET, { walletName: wallets[0].walletName, password: '' })
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
  async [ActionTypes.SET_PASSWORD]({ }, password) {
    await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'setPassword', data: { password } } });
  },
  async [ActionTypes.CHECK_PASSWORD]({ }, password) {
    return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'checkPassword', data: { password } } });
  },
  async [ActionTypes.HAS_PASSWORD]() {
    return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'hasPassword' } });
  },
  async [ActionTypes.EXTENSION_RESET]() {
    return await browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'extensionReset' } });
  },
};

