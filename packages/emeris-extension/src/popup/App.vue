<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useExtensionStore } from '@/store';
import { GlobalActionTypes } from '@/store/extension/action-types';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useExtensionStore();
    const router = useRouter();
    onMounted(async () => {

      const wallet = await store.dispatch(GlobalActionTypes.GET_WALLET);
      if (!wallet) {
        router.push('/create')
      }
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
