<template>
  <div>
    <component :is="component" :message="message" :chainName="chainId" />
  </div>
</template>

<script>
import { EmerisTransactions } from '@emeris/types';
import { defineAsyncComponent } from '@vue/runtime-core';
import Fallback from './fallback';

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
      return defineAsyncComponent({
        loader: () => import(`./${this.message.type}`),
        errorComponent: Fallback,
      });
    },
  },
};
</script>

<style>
</style>