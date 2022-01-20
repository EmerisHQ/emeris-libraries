<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setStore } from '@/utils/useStore';
import { GlobalDemerisActionTypes } from '@/store/demeris-api/action-types';
import { DemerisMutationTypes } from '@/store/demeris-api/mutation-types';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    setStore(store);

    onMounted(async () => {
      store.commit(
        'demerisAPI/' + DemerisMutationTypes.INIT,
        { endpoint: process.env.VUE_APP_EMERIS_ENDPOINT },
        { root: true },
      );

      const hasWallet = await store.dispatch(GlobalActionTypes.HAS_WALLET); // if there is a last account used, the extension is initialized
      const wallet = await store.dispatch(GlobalActionTypes.GET_WALLET); // if able to load the wallet, the extension is unlocked

      if (!hasWallet) {
        router.push('/welcome');
      } else if (!wallet) {
        // not unlocked
        router.push('/welcomeBack');
      } else if (wallet.length === 0) {
        // unlocked but no account
        router.push('/welcome');
      } else {
        router.push('/portfolio');
      }

      // TODO handle in the background and just get from there (hit cache first)
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
