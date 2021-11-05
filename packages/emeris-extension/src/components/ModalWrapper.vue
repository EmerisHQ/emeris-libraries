<template>
  <div class="modal">
    <ApproveOrigin v-if="request.action=='enable'" v-on:response="respond" :request="request"/>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { ExtensionRequest } from '@@/types/index';
import ApproveOrigin from './RequestModals/ApproveOrigin.vue';

export default defineComponent({
  name: 'ModalWrapper',
  components: {
    ApproveOrigin
  },
  props: {
    request: {
      type: Object as PropType<ExtensionRequest>
    }
  },
  setup(props) {    
    const request = ref(props.request);
    const respond = (data) => {
      browser.runtime.sendMessage({ type: 'fromPopup', data: { action: 'setResponse', data: {id: props.request.id, data} } });
    }
    return { respond, request };
  },
});
</script>
