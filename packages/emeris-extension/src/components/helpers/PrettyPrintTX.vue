<template>
  {{ prettyText }}
</template>

<script lang="ts">
import { SignAndBroadcastTransactionRequest, SignTransactionRequest } from '@@/types/api';
import { TransferData } from 'EmerisTransactions';
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  name: 'PrettyPrintTX',
  props: {
    request: {
      type: Object as PropType<SignTransactionRequest | SignAndBroadcastTransactionRequest>,
    },
  },
  setup(props) {
    const prettyText = ref('');
    // eslint-disable-next-line
    const tx = props.request.data.tx;
    switch (tx.transaction.type) {
      case 'transfer':
        prettyText.value = `Send ${(tx.transaction.data as TransferData).amount.amount} ${
          (tx.transaction.data as TransferData).amount.denom
        } to ${(tx.transaction.data as TransferData).to_address} on ${
          (tx.transaction.data as TransferData).chain_name
        }`;
        break;
    }
    return { prettyText };
  },
});
</script>
