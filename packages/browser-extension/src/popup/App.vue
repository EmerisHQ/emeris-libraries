<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
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
        { endpoint: process.env.VUE_APP_EMERIS_PROD_ENDPOINT || 'https://api.emeris.com/v1' },
        { root: true },
      );

      // TODO handle in the background and just get from there (hit cache first)
      const loadData = async () => {
        if (localStorage.getItem('denoms')) {
          store.commit('demerisAPI/' + DemerisMutationTypes.SET_VERIFIED_DENOMS, {
            value: JSON.parse(localStorage.getItem('denoms')),
          });
        }
        store
          .dispatch(GlobalDemerisActionTypes.GET_VERIFIED_DENOMS, {
            subscribe: true,
          })
          .then((denoms) => {
            localStorage.setItem('denoms', JSON.stringify(denoms));
          });
        if (localStorage.getItem('chains')) {
          store.commit('demerisAPI/' + DemerisMutationTypes.SET_CHAINS, {
            value: Object.values(JSON.parse(localStorage.getItem('chains'))),
          });
        }
        store
          .dispatch(GlobalDemerisActionTypes.GET_CHAINS, {
            subscribe: false,
          })
          .then(async (chains) => {
            await Promise.all(
              Object.values(chains).map(async (chain) => {
                await store.dispatch(GlobalDemerisActionTypes.GET_CHAIN, {
                  subscribe: true,
                  params: chain,
                });
                await store.dispatch(GlobalDemerisActionTypes.GET_CHAIN_STATUS, {
                  subscribe: true,
                  params: chain,
                });
              }),
            );
            localStorage.setItem('chains', JSON.stringify(store.getters['demerisAPI/getChains']));
          });
        try {
          if (localStorage.getItem('prices')) {
            store.commit('demerisAPI/' + DemerisMutationTypes.SET_PRICES, {
              value: JSON.parse(localStorage.getItem('prices')),
            });
          }
          store
            .dispatch(GlobalDemerisActionTypes.GET_PRICES, {
              subscribe: true,
            })
            .then((prices) => {
              localStorage.setItem('prices', JSON.stringify(prices));
            });
        } catch (e) {
          //
        }
        // init starport store
        store
          .dispatch('common/env/config', {
            apiNode: process.env.VUE_APP_EMERIS_PROD_LIQUIDITY_ENDPOINT || 'https://api.emeris.com/v1/liquidity',
            rpcNode: null,
            wsNode: null,
            chainId: 'cosmos-hub',
            addrPrefix: 'cosmos',
            sdkVersion: 'Stargate',
            getTXApi: null,
            offline: true,
            refresh: 10000,
          })
          .then(() => {
            store.dispatch(
              'tendermint.liquidity.v1beta1/QueryLiquidityPools',
              { options: { subscribe: false, all: true }, params: {} },
              { root: true },
            );
          });
      };
      loadData();

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
