<template>
  <div>
    <component :is="component" :message="message.data" :chain-name="chainId" />
  </div>
</template>

<script lang="ts">
import { EmerisTransactions } from '@emeris/types';
import { defineAsyncComponent } from '@vue/runtime-core';

import addliquidity from './addliquidity.vue';
import custom from './custom.vue';
import Fallback from './fallback';
import ibcTransfer from './ibcTransfer.vue';
import swap from './swap.vue';
import transfer from './transfer.vue';
import withdrawliquidity from './withdrawliquidity.vue';

export default {
  name: 'Message',
  props: {
    message: { type: Object as PropType<EmerisTransactions.AbstractTransaction>, required: true },
    chainId: { type: String, required: true },
  },
  computed: {
    component() {
      return defineAsyncComponent({
        loader: async () => {
          switch ((this.message as EmerisTransactions.AbstractTransaction).type) {
            case 'addLiquidity':
              return addliquidity;
            case 'withdrawLiquidity':
              return withdrawliquidity;
            case 'transfer':
              return transfer;
            case 'swap':
              return swap;
            case 'IBCtransfer':
              return ibcTransfer;
            case 'createPool':
              return addliquidity;
            default:
              return custom;
          }
        },
        errorComponent: Fallback,
      });
    },
  },
};
</script>

<style></style>
