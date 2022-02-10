<template>
  <div class="page">
    <Header title="Accounts" backTo="/account">
      <a @click="edit = true" v-if="!edit">Edit</a>
      <a @click="edit = false" v-else>Done</a>
    </Header>
    <div v-for="account in wallet" :key="account.accountName" class="wallet" @click="!edit && goToAccount(account)">
      <img :src="require('@@/assets/Avatar.svg')" style="width: 40px; height: 40px" />
      <div style="cursor: pointer">
        <h2 style="font-weight: 600">{{ account.accountName }}</h2>
        <!-- TODO -->
        <span class="secondary-text" v-if="backedUp(account)"
          ><TotalPrice :balances="balances(account)" small-decimals
        /></span>
        <span v-else
          ><TotalPrice
            :balances="balances(account)"
            small-decimals
            style="display: inline-block"
            class="secondary-text"
          /><span style="color: #ff6072; font-size: 13px"> · Not backed up</span></span
        >
      </div>
      <Icon
        style="margin-left: auto; cursor: pointer"
        name="ThreeDotsIcon"
        :icon-size="1.5"
        @click="editWallet = account"
        v-if="edit"
      />
      <div style="margin-left: auto; line-height: 48px" v-else-if="account.accountName === lastAccount">✓</div>
    </div>
    <div style="margin-top: auto">
      <Button name="Add account" @click="addAccount" />
    </div>
    <Slideout v-bind:open="!!editWallet" v-on:update:open="editWallet = $event">
      <Button name="Remove account" variant="link" @click="removeAccount" />
      <Button name="Edit wallet name" variant="link" @click="renameAccount" />
      <div style="font-weight: 600">
        <Button name="Close" variant="link" @click="editWallet = null" />
      </div>
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';
import Slideout from '@@/components/Slideout.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';
import { AccountCreateStates } from '@@/types';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { GlobalDemerisActionTypes } from '@/store';

export default defineComponent({
  name: 'Accounts',
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
      lastAccount: (state: RootState) => state.extension.lastAccount,
    }),
    editWalletIndex() {
      return this.editWallet
        ? this.wallet.findIndex((wallet) => wallet.walletName === this.editWallet.walletName)
        : undefined;
    },
  },
  data: () => ({
    editWallet: undefined,
    edit: false,
  }),
  components: {
    Button,
    Icon,
    Header,
    Slideout,
    TotalPrice,
  },
  methods: {
    addAccount() {
      this.$router.push('/accountAddAdditional');
    },
    removeAccount() {
      this.$router.push('/accountRemove/' + this.editWalletIndex);
    },
    renameAccount() {
      this.$router.push('/accountRename/' + this.editWalletIndex);
    },
    goToAccount(account) {
      this.$store.dispatch(GlobalActionTypes.SET_LAST_ACCOUNT_USED, { accountName: account.accountName });
      this.$store.dispatch(GlobalActionTypes.GET_WALLET);
      this.$store.dispatch(GlobalActionTypes.LOAD_SESSION_DATA);
      this.$router.push('/portfolio');
    },
    backedUp(account) {
      return account.setupState === AccountCreateStates.COMPLETE;
    },
    loadBalances() {
      this.wallet.forEach((account) => {
        if (!this.$store.getters[GlobalGetterTypes.getAllBalances](account)) {
          this.$store.dispatch(GlobalDemerisActionTypes.API.GET_BALANCES, {
            subscribe: true,
            params: { address: account.keyHash },
          });
        }
      });
    },
    balances(account) {
      return this.$store.getters[GlobalGetterTypes.getAllBalances](account) || [];
    },
  },
  watch: {
    wallet: {
      handler(wallet) {
        if (wallet && wallet.length > 0) this.loadBalances();
        if (wallet && wallet.length === 0) this.$router.push('/welcome');
      },
      immediate: true,
    },
  },
});
</script>
<style lang="scss" scoped>
.wallet {
  display: flex;
  margin-bottom: 24px;

  img {
    height: 48px;
    width: 48px;
    margin-right: 16px;
    margin-top: 6px;
  }
}

:deep(.total-price) {
  * {
    font-size: 13px !important;
  }
}
</style>
