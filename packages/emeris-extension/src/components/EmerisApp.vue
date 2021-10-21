<template>
  <div>
    <p v-on:click="respond">{{ pending }}</p>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { GlobalGetterTypes } from '@/store/extension/getter-types';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'EmerisApp',
  setup() {
    const store=useStore();

    const pending =computed(()=> {
      return store.getters[GlobalGetterTypes.getPending];
    });
    const respond = () => {
      browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'setResponse', data: pending.value[0] } });
    }
    return {pending, respond};
  },
});
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
