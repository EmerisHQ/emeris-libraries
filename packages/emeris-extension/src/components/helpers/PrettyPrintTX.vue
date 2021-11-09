<template>
{{ prettyText}}
</template>

<script lang="ts">
import { SignAndBroadcastTransactionRequest, SignTransactionRequest } from '@@/types/api';
import { defineComponent, PropType, ref } from 'vue';
import { TransferData } from '../../../../types/EmerisTransactions';

export default defineComponent({
  name: 'PrettyPrintTX',
  props: {
    request: {
      type: Object as PropType<SignTransactionRequest | SignAndBroadcastTransactionRequest>,
    },
  },
  setup(props) {
    const prettyText=ref('');
    const tx = props.request.data.tx;
		switch (tx.transaction.type) {
      case 'transfer':
        prettyText.value = `Send ${(tx.transaction.data as TransferData).amount.amount} ${(tx.transaction.data as TransferData).amount.denom} to ${(tx.transaction.data as TransferData).to_address} on ${(tx.transaction.data as TransferData).chain_name}`
        break;

    }
    return { prettyText}
	}
});
</script>