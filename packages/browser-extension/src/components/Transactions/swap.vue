<template>
  <div style="text-align: left">
    <span style="margin-bottom: 12px; display: block">Swap</span>

    <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">Amount</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 12px">
      <AmountDisplay :amount="message.from" style="font-weight: 500; font-size: 21px" />
    </div>

    <div style="display: flex; flex-direction: row; margin-bottom: 16px">
      <div style="flex: 1">
        <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">From</span>
        <div style="display: flex; flex-direction: row; align-items: center">
          <CircleSymbol :denom="message.from.denom" :glow="false" style="margin-right: 16px" />
          <div style="display: flex; flex-direction: column">
            <span>{{ fromDenom }}</span>
          </div>
        </div>
      </div>
      <div style="flex: 1">
        <span class="secondary-text" style="font-size: 13px; margin-bottom: 8px; display: block">To</span>
        <div style="display: flex; flex-direction: row; align-items: center">
          <CircleSymbol :denom="message.to.denom" :glow="false" style="margin-right: 16px" />
          <div style="display: flex; flex-direction: column">
            <span>{{ toDenom }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      style="display: flex; flex-direction: column; overflow: hidden; transition: height 0.5s ease-out"
      :style="{
        height: expand ? $refs.innerSlideout.clientHeight + 'px' : '0px',
      }"
    >
      <div
        ref="innerSlideout"
        style="display: flex; flex-direction: column; padding-top: 16px; padding-bottom: 16px; background: #222222"
      >
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <span class="secondary-text">Limit price</span>
          <span>1 {{ fromDenom }} = {{ Math.round((1 / message.orderPrice) * 100000) / 100000 }} {{ toDenom }}</span>
        </div>
        <!-- TODO swap fee not in data model -->
        <!-- <div style="display: flex; flex-direction: row; justify-content: space-between">
          <span class="secondary-text">Swap fee</span>
          <span>3.703701 ATOM (3%)</span>
        </div> -->
      </div>
    </div>
    <div
      style="
        display: flex;
        flex-direction: column;
        vertical-align: center;
        border-top: 1px solid #ffffff24;
        width: calc(100% + 32px);
        margin-left: -16px;
      "
      @click.native="expand = !expand"
    >
      <Icon
        :name="'CaretDownIcon'"
        :icon-size="1"
        class="transform transition-transform -ml-2"
        :class="{ 'rotate-180': expand }"
        style="margin-top: 16px"
      />
    </div>
  </div>
</template>

<script>
import { SwapData } from '@@/../../types/lib/EmerisTransactions';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Icon from '@/components/ui/Icon.vue';
import Address from '@@/components/Address.vue';
import { getTicker } from '@/utils/actionHandler';
import { GlobalDemerisGetterTypes } from '@/store';
export default {
  props: {
    message: { type: SwapData, required: true },
  },
  watch: {
    async message(message) {
      this.toDenom = await getTicker(message.to.denom, this.$store.getters[GlobalDemerisGetterTypes.API.getDexChain]);
      this.fromDenom = await getTicker(
        message.from.denom,
        this.$store.getters[GlobalDemerisGetterTypes.API.getDexChain],
      );
    },
  },
  data: () => ({
    expand: false,
    fromDenom: '-',
    toDenom: '-',
  }),
  components: {
    AmountDisplay,
    CircleSymbol,
    Address,
    Icon,
  },
};
</script>

<style>
</style>