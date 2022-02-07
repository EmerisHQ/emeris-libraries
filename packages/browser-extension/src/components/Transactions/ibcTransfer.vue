<template>
  <div style="text-align: left">
    <span style="margin-bottom: 12px; display: block">Move</span>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">Amount</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px">
      <CircleSymbol :denom="message.amount.denom" style="margin-right: 16px" />
      <AmountDisplay :amount="message.amount" style="font-weight: 500; font-size: 21px" />
    </div>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">From</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px; align-items: center">
      <CircleSymbol variant="chain" :chain-name="chainName" :glow="false" style="margin-right: 16px" />
      <div style="display: flex; flex-direction: column">
        <span>{{ chainName }}</span>
      </div>
    </div>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">To</span>
    <div style="display: flex; flex-direction: row; align-items: center">
      <CircleSymbol variant="chain" :chain-name="message.to_chain" :glow="false" style="margin-right: 16px" />
      <div style="display: flex; flex-direction: column">
        <span>{{ message.to_chain }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { IBCData } from '@@/../../types/lib/EmerisTransactions';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Address from '@@/components/Address.vue';
export default {
  props: {
    message: { type: IBCData, required: true },
    chainName: { type: String, required: true },
  },
  components: {
    AmountDisplay,
    CircleSymbol,
    Address,
  },
};
</script>

<style>
</style>