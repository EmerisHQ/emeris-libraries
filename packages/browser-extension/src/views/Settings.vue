<template>
  <div class="page">
    <Header title="" backTo="/account" />
    <div
      class="menu-item"
      @click="!account.isLedger && $router.push('/backup')"
      :style="{
        opacity: account.isLedger ? 0.6 : 1,
      }"
    >
      Back Up
      <span v-if="account.isLedger">(Not possible on Ledger devices)</span>
      <Icon v-if="!backedUp" name="WarningTriangleIcon" :icon-size="1" class="text-negative" />
    </div>
    <div class="menu-item" @click="$router.push('/whitelisted')">
      Manage connected sites <Icon name="ChevronRightIcon" :icon-size="1" />
    </div>
    <div class="menu-item" @click="$router.push('/security')">
      Security <Icon name="ChevronRightIcon" :icon-size="1" />
    </div>
    <!-- <div class="menu-item">Currency</div> -->
    <!-- <div class="menu-item">Networks</div> -->
    <!-- <div class="menu-item">Theme</div> -->

    <div class="bottom secondary-text" style="width: calc(100% - 48px)">
      <hr style="opacity: 0.14; margin-bottom: 24px" />
      <div
        class="menu-item"
        @click="$router.push({ path: '/support', query: { url: 'https://t.me/EmerisHQ', caption: 'Telegram' } })"
      >
        Join the Telegram community
      </div>
      <div
        class="menu-item"
        @click="$router.push({ path: '/support', query: { url: 'https://twitter.com/emerishq', caption: 'Twitter' } })"
      >
        Twitter
      </div>
      <div
        class="menu-item"
        @click="$router.push({ path: '/support', query: { url: 'https://emeris.com/support', caption: 'Support' } })"
      >
        Support
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { AccountCreateStates } from '@@/types';

export default defineComponent({
  name: 'Settings',
  computed: {
    account() {
      return this.$store.getters[GlobalGetterTypes.getAccount];
    },
    backedUp() {
      if (!this.account) return false;
      return this.account.setupState === AccountCreateStates.COMPLETE;
    },
  },
  components: {
    Icon,
    Header,
  },
});
</script>
<style lang="scss" scoped>
.menu-item {
  padding: 14px 0;
  cursor: pointer;

  .icon {
    display: inline-block;
    float: right;
  }
}

.bottom {
  position: absolute;
  bottom: 54px;
}
</style>
