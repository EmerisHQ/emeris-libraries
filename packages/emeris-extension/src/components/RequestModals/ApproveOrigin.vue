<template>
<button v-on:click="approve">approve</button>
<button v-on:click="reject">reject</button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { ExtensionRequest } from '@@/types/index';

export default defineComponent({
  name: 'ApproveOrigin',
  emits: ['response'],
  props: {
    request: {
      type: Object as PropType<ExtensionRequest>
    }
  },
  setup(props,{emit}) {    
    const request = ref(props.request);
    const approve = () => {
      emit('response',true)
    }
    const reject = () => {
      emit('response',false)
    }
    return { approve, request, reject };
  },
});
</script>