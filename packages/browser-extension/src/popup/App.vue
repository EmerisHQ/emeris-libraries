<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { MutationTypes } from '@@/store/extension/mutation-types';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useExtensionStore();
    const router = useRouter();
    const route = useRoute();
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
      store.commit('extension/' + MutationTypes.SET_WALLET, wallets[0]);
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
