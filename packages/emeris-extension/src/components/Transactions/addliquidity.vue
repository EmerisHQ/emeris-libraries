<template>
  <div style="text-align: left">
    <span style="margin-bottom: 12px; display: block">Add liquidity</span>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">Add</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px">
      <CircleSymbol :denom="message.coinA.denom" :glow="false" style="margin-right: 16px" />
      <AmountDisplay :amount="message.coinA" :chain="chainName" style="font-weight: 500; font-size: 21px" />
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px">
      <CircleSymbol :denom="message.coinB.denom" :glow="false" style="margin-right: 16px" />
      <AmountDisplay :amount="message.coinB" :chain="chainName" style="font-weight: 500; font-size: 21px" />
    </div>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">To</span>
    <span>{{ message.pool.reserve_coin_denoms.map((denom) => denom.toUpperCase()).join(' · ') }}</span>
  </div>
</template>

<script>
import { EmerisTransactions } from '@emeris/types';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Address from '@@/components/Address.vue';
export default {
  props: {
    message: { type: EmerisTransactions.AddLiquidityData, required: true },
    chainName: { type: String, required: true },
  },
  components: {
    AmountDisplay,
    CircleSymbol,
    Address,
  },
};
</script>

<style></style>
