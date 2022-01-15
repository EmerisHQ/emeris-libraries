<template>
  <div class="page">
    <Header title="">
      <template v-slot:backButton>
        <!-- TODO add icon to Demeris -->
        <img :src="require('@@/assets/CoqIcon.svg')" @click="$router.push('/settings')" />
      </template>
      <Icon name="ChevronRightIcon" @click="$router.go(-1)" />
    </Header>
    <img
      style="height: 72px; width: 72px; margin-top: 40px; margin-left: auto; margin-right: auto"
      :src="require('@@/assets/Avatar.svg')"
    />
    <span
      class="secondary-text account-selector"
      style="text-align: center; margin-bottom: 32px; cursor: pointer"
      @click="$router.push('/accounts')"
      >{{ account.accountName }} <Icon name="ChevronRightIcon" :icon-size="1"
    /></span>
    <div class="list-card-container" style="margin-bottom: 16px" @click="$router.push('/backup')">
      <h2>Back up your wallet</h2>
      <span class="secondary-text" v-if="!backedUp">Your wallet is currently not secured</span>
      <Icon name="ChevronRightIcon" :icon-size="1" />
    </div>
    <div class="list-card-container" style="margin-bottom: 16px">
      <h2>Swap</h2>
      <span class="secondary-text">Swap assets wih Emeris</span>
      <img :src="require('@@/assets/SwapListItemGraphic.svg')" />
    </div>
    <div class="list-card-container">
      <h2>Add liquidity to a pool</h2>
      <span class="secondary-text">Browse our pool on Emeris</span>
      <img :src="require('@@/assets/LiquidityListItemGraphic.svg')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';
import { AccountCreateStates } from '@@/types';

export default defineComponent({
  name: 'Account',
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
      // TODO get active wallet
    }),
    account() {
      return this.$store.getters.getAccount;
    },
    backedUp() {
      return this.account.setupState === AccountCreateStates.COMPLETE;
    },
  },
  components: {
    Button,
    Icon,
    Header,
  },
});
</script>
<style lang="scss" scoped>
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
</style>