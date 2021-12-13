<template>
  <div class="page">
    <img
      :src="require(`@@/assets/PortfolioBG.png`)"
      :style="{
        position: 'fixed',
        zIndex: -1,
        // accounting for padding
        top: '-24px',
        left: '-24px',
      }"
    />
    <div style="display: flex; position: relative; margin-bottom: 36px">
      <img
        style="height: 24px; width: 24px; position: absolute"
        :src="require('@@/assets/Avatar.svg')"
        @click="$router.push('/account')"
      />
      <img class="wordmark" :src="require(`@@/assets/EmerisWordmark.svg`)" />
    </div>

    <span
      class="secondary-text account-selector"
      style="margin-bottom: 8px; cursor: pointer"
      @click="$router.push('/accounts')"
      >{{ wallet.walletName }} <Icon name="ChevronRightIcon" :icon-size="1"
    /></span>
    <h1 style="font-size: 38px; text-align: left; margin-bottom: 24px">
      <TotalPrice :balances="balances" small-decimals />
    </h1>
    <div style="display: flex">
      <Button name="Receive" style="margin-right: 12px; flex: 1" />
      <Button name="Send" variant="secondary" style="flex: 1" />
    </div>

    <h1 style="font-size: 21px; text-align: left; margin-top: 56px; margin-bottom: 24px">Assets</h1>
    <AssetsTable
      v-if="balances && balances.length > 0 && verifiedDenoms"
      :balances="balances"
      :hide-zero-assets="true"
      variant="balance"
      :show-headers="false"
      :limit-rows="4"
    />
    <template v-else>
      <div class="list-card-container" style="margin-bottom: 16px">
        <h2>Purchase crypto</h2>
        <span class="secondary-text">Powered by Moonpay</span>
        <img :src="require('@@/assets/MoonpayListItemGraphic.svg')" />
      </div>
      <div class="list-card-container">
        <h2>Deposit assets</h2>
        <span class="secondary-text">From another wallet</span>
        <img :src="require('@@/assets/DepositListItemGraphic.svg')" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import AssetsTable from '@/components/assets/AssetsTable/AssetsTable.vue';
import TotalPrice from '@/components/common/TotalPrice';
import { mapState } from 'vuex';
import { RootState } from '@@/store';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';

export default defineComponent({
  name: 'Portfolio',
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
    balances() {
      return this.$store.getters[GlobalGetterTypes.getAllBalances];
    },
    verifiedDenoms() {
      return this.$store.getters['demeris/getVerifiedDenoms'];
    },
  },
  components: {
    Button,
    Icon,
    AssetsTable,
    TotalPrice,
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.wordmark {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.account-selector {
  .icon {
    display: inline-block;
    transform: rotate(90deg) translateX(2px);
  }
}

.list-card-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  height: 90px;
  cursor: pointer;

  background: linear-gradient(0deg, #171717 0%, #040404 100%);

  box-shadow: 3px 9px 32px -4px rgba(0, 0, 0, 0.07);
  border-radius: 10px;

  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    right: 0;
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 24px;
  }

  .secondary-text {
    font-size: 13px;
  }
}

// :deep(.assets-table__row) {
//   position: relative;

//   & > :nth-child(2) {
//     position: relative;
//     right: 52px;
//     opacity: 0.6;
//     top: 29px;
//     display: block;
//     text-align: left;
//   }

//   & > :nth-child(1) > div > :nth-child(2) {
//     position: relative;
//     top: -10px;
//   }
// }
</style>