<template>
  <div style="text-align: left">
    <span style="margin-bottom: 12px; display: block">Custom transaction</span>

    <div
      style="display: flex; flex-direction: column; overflow: hidden; transition: max-height 0.5s ease-out"
      :style="{
        height: expand ? $refs.innerSlideout.clientHeight + 'px' : '36px',
      }"
    >
      <Yaml :json="message.raw" />
    </div>
    <div
      ref="innerSlideout"
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
import { EmerisTransactions } from '@emeris/types';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Icon from '@/components/ui/Icon.vue';
import Address from '@@/components/Address.vue';
import Yaml from '../Yaml.vue';
export default {
  props: {
    message: { type: EmerisTransactions.CustomData, required: true },
  },
  data: () => ({
    expand: false,
  }),
  components: {
    AmountDisplay,
    CircleSymbol,
    Address,
    Yaml,
    Icon,
  },

  Yaml,
};
</script>

<style>
</style>