<template>
  <div>
    <component :is="component" :message="message.data" :chainName="chainId" />
  </div>
</template>

<script>
import { EmerisTransactions } from '@emeris/types';
import { defineAsyncComponent } from '@vue/runtime-core';
import Fallback from './fallback.vue';

// dynamically loads messages by message type
// files nmaes in ./ need have the same name as the message type
export default {
  name: 'Message',
  props: {
    message: { type: EmerisTransactions.TransactionData, required: true },
    chainId: { type: String, required: true },
  },
  computed: {
    component() {
      return defineAsyncComponent(() => {
      console.log('this.message.type',this.message.type)
        return {
          loader: async () => await import( /* @vite-ignore */ `@@/components/Transactions/${this.message.type}.vue`),
          errorComponent: Fallback,
        }
      });
    },
  },
};
</script>

<style>
</style>