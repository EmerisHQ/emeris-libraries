<template>
  <Loader v-if="!account || balances === null" />

  <div class="page" v-else-if="balances.length === 0">
    <img :src="require(`@@/assets/EmptyPortfolioBG.png`)" class="background" />
    <div style="display: flex; position: relative; margin-bottom: 36px">
      <img
        style="height: 24px; width: 24px; position: absolute"
        :src="require('@@/assets/Avatar.svg')"
        @click="$router.push('/account')"
      />
    </div>
    <div style="margin-top: auto">
      <h1>Get started by funding your wallet</h1>
      <p class="secondary-text" style="margin-bottom: 32px; margin-top: 16px; text-align: center">
        Send your assets from an exchange or another wallet.
      </p>
      <Button name="Receive assets" @click="() => $router.push('/receive')" />
    </div>
  </div>

  <div class="page" v-else>
    <img :src="require(`@@/assets/PortfolioBG.png`)" class="background" />
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
      >{{ account.accountName }} <Icon name="ChevronRightIcon" :icon-size="1"
    /></span>
    <h1 style="font-size: 38px; text-align: left; margin-bottom: 24px">
      <TotalPrice :balances="balances" small-decimals />
    </h1>
    <div style="display: flex">
      <Button name="Receive" style="margin-right: 12px; flex: 1" @click="$router.push('/receive')" />
      <Button name="Send" variant="secondary" style="flex: 1" disabled />
    </div>

    <h1 style="font-size: 21px; text-align: left; margin-top: 56px; margin-bottom: 24px">Assets</h1>
    <AssetsTable
      style="margin-bottom: 24px"
      v-if="balances && balances.length > 0 && verifiedDenoms"
      :balances="balances"
      :hide-zero-assets="true"
      variant="balance"
      :show-headers="false"
      :limit-rows="4"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import AssetsTable from '@/components/assets/AssetsTable/AssetsTable.vue';
import Loader from '@@/components/Loader.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';

export default defineComponent({
  name: 'Portfolio',
  computed: {
    account() {
      return this.$store.getters[GlobalGetterTypes.getAccount];
    },
    verifiedDenoms() {
      return this.$store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
    },
    balances() {
      if (!this.account) return undefined;
      return this.$store.getters[GlobalGetterTypes.getAllBalances](this.account);
    },
  },
  components: {
    Button,
    Icon,
    AssetsTable,
    TotalPrice,
    Loader,
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

// HACK should be incorporated in demeris component
:deep(.assets-table__row) {
  position: relative;
  display: flex;
  width: 100%;

  td:nth-child(2) {
    position: absolute;
    left: 70px;
    top: 18px;
    text-align: left;
    opacity: 0.67;
    width: 1px;
    font-size: 13px;
  }

  td:nth-child(1) {
    width: 175px;
  }

  td:nth-child(1) > div > :nth-child(2) {
    position: relative;
    top: -10px;
  }

  td:nth-child(3) {
    width: 125px;
  }

  td:nth-child(4) {
    display: flex;

    span:nth-child(2) {
      display: none;
    }
  }
}
</style>
