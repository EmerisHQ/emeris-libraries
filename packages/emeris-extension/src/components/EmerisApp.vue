<template>
  <div>
    {{wallet}}
    <p
      v-for="item in pending"
      :key="item.id"
      v-on:click="
        () => {
          respond(item.id);
        }
      "
    >
      {{ item }}
    </p>
  </div>
</template>

<script lang="ts">
import { useExtensionStore } from '@/store';
import { GlobalActionTypes } from '@/store/extension/action-types';
import { GlobalGetterTypes } from '@/store/extension/getter-types';
import { ExtensionRequest } from '@/types';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'EmerisApp',
  setup() {
    const store = useExtensionStore();

    const pending = computed<ExtensionRequest[]>(() => {
      return store.getters[GlobalGetterTypes.getPending];
    });
    const wallet = computed<ExtensionRequest[]>(() => {
      return store.getters[GlobalGetterTypes.getWallet];
    });
    const respond = (id) => {
      browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'setResponse', data: pending.value.find((item) => item.id == id) },
      });
      store.dispatch(GlobalActionTypes.COMPLETE_REQUEST, { requestId: id });
    };
    return { pending, respond,wallet };
  },
});
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
