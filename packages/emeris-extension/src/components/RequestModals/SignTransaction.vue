<template>
  <PrettyPrintTX :request="request" />
  <button v-on:click="approve">approve</button>
  <button v-on:click="reject">reject</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ExtensionRequest } from '@@/types/index';
import PrettyPrintTX from '@@/components/helpers/PrettyPrintTX.vue';

export default defineComponent({
  name: 'SignTransaction',
  components: {
    PrettyPrintTX,
  },
  emits: ['response'],
  props: {
    request: {
      type: Object as PropType<ExtensionRequest>,
    },
  },
  setup(props, { emit }) {
    const approve = () => {
      emit('response', true);
    };
    const reject = () => {
      emit('response', false);
    };
    return { approve, reject };
  },
});
</script>
