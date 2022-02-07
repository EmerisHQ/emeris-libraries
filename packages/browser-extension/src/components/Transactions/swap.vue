<template>
  <div style="text-align: left">
    <span style="margin-bottom: 12px; display: block">Swap</span>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">Amount</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px">
      <AmountDisplay :amount="message.from.amount" style="font-weight: 500; font-size: 21px" />
    </div>

    <div style="display: flex; flex-direction: column">
      <div>
        <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">From</span>
        <div style="display: flex; flex-direction: row; align-items: center">
          <CircleSymbol variant="chain" :denom="message.from.denom" :glow="false" style="margin-right: 16px" />
          <div style="display: flex; flex-direction: column">
            <span>{{ message.from.denom }}</span>
          </div>
        </div>
      </div>
      <div>
        <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">To</span>
        <div style="display: flex; flex-direction: row; align-items: center">
          <CircleSymbol variant="chain" :denom="message.to.denom" :glow="false" style="margin-right: 16px" />
          <div style="display: flex; flex-direction: column">
            <span>{{ message.to.denom }}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column">
      <dir style="display: flex; flex-direction: row">
        <span class="seconday-text">Limit price</span>
        <span>1 ATOM = 1.234567 AKT</span>
      </dir>
      <dir style="display: flex; flex-direction: row">
        <span class="seconday-text">Swap fee</span>
        <span>3.703701 ATOM (3%)</span>
      </dir>
    </div>
  </div>
</template>

<script>
import { SwapData } from '@@/../../types/lib/EmerisTransactions';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Address from '@@/components/Address.vue';
export default {
  props: {
    message: { type: SwapData, required: true },
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