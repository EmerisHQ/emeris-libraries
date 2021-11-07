<template>
  <div class="modal">
    <ApproveOrigin v-if="request.action == 'enable'" v-on:response="respond" :request="request" />
    <SignTransaction v-if="request.action == 'signTransaction'" v-on:response="respond" :request="request" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ExtensionRequest } from '@@/types/index';
import ApproveOrigin from './RequestModals/ApproveOrigin.vue';
import SignTransaction from './RequestModals/SignTransaction.vue';

export default defineComponent({
  name: 'ModalWrapper',
  components: {
    ApproveOrigin,
    SignTransaction,
  },
  props: {
    request: {
      type: Object as PropType<ExtensionRequest>,
    },
  },
  setup(props) {
    const respond = (data) => {
      browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'setResponse', data: { id: props.request.id, data } },
      });
    };
    return { respond };
  },
});
</script>
