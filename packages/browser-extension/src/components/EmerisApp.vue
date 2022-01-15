<template>
  <div>Loading...</div>
</template>

<script lang="ts">
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { ExtensionRequest } from '@@/types';
import { defineComponent, computed } from 'vue';
import Brandmark from '@/components/common/Brandmark.vue';
import ModalWrapper from '@@/components/ModalWrapper.vue';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

export default defineComponent({
  name: 'EmerisApp',
  components: {
    Brandmark,
    ModalWrapper,
  },
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
    const logLedger = () => {
      TransportWebUSB.create(10000).then((transport) => {
        console.log(transport);
      });
    };

    return { pending, respond, wallet, logLedger };
  },
});
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
