<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { MutationTypes } from '@@/store/extension/mutation-types';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setStore } from '@/utils/useStore';
import { GlobalDemerisActionTypes } from '@/store/demeris-api/action-types';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    setStore(store);

    onMounted(async () => {
      const hasPassword = await store.dispatch(GlobalActionTypes.HAS_PASSWORD);
      // TODO check if already unlocked
      // if (hasPassword) {
      //   router.push('/welcomeBack');
      //   return;
      // }

      const partialAccountCreation = await store.dispatch(GlobalActionTypes.GET_PARTIAL_ACCOUNT_CREATION);
      if (partialAccountCreation) {
        router.push('/accountCreationResume');
        return;
      }

      const wallets = await store.dispatch(GlobalActionTypes.GET_WALLETS);
      if (wallets.length === 0) {
        router.push('/welcome');
        return;
      }

      // TODO get last wallet
      store.commit('extension/' + MutationTypes.SET_WALLET, {
        ...wallets[0],
        keyHash: '7ee143fd1d91345128da542f27ccd8d0e3d78fc0',
      });
      // TODO handle availability async in components and getters to not block rendering
      // probably do in the background and just get from there (hit cache first)
      const loadData = async () => {
        await store.dispatch(GlobalDemerisActionTypes.GET_VERIFIED_DENOMS, {
          subscribe: true,
        });
        let chains = await store.dispatch(GlobalDemerisActionTypes.GET_CHAINS, {
          subscribe: false,
        });
        for (let chain in chains) {
          await store.dispatch(GlobalDemerisActionTypes.GET_CHAIN, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          });
          await store.dispatch(GlobalDemerisActionTypes.GET_CHAIN_STATUS, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          });
        }
        try {
          await store.dispatch(GlobalDemerisActionTypes.GET_PRICES, {
            subscribe: true,
          });
        } catch (e) {
          //
        }
        // init starport store
        await store.dispatch('common/env/config', {
          apiNode: process.env.VUE_APP_EMERIS_LIQUIDITY_ENDPOINT,
          rpcNode: null,
          wsNode: null,
          chainId: 'cosmos-hub',
          addrPrefix: 'cosmos',
          sdkVersion: 'Stargate',
          getTXApi: null,
          offline: true,
          refresh: 10000,
        });
        await store.dispatch(
          'tendermint.liquidity.v1beta1/QueryLiquidityPools',
          { options: { subscribe: false, all: true }, params: {} },
          { root: true },
        );
      };
      loadData();

      router.push('/portfolio');

      store.dispatch(GlobalActionTypes.GET_PENDING);
      browser.runtime.onMessage.addListener((message) => {
        if (message.type == 'toPopup' && message.data.action == 'update') {
          store.dispatch(GlobalActionTypes.GET_PENDING);
        }
      });
    });
  },
});
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
