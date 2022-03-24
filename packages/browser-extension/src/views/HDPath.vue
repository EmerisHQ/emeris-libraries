<template>
  <div class="page">
    <Header title="Advanced" :backTo="this.$route.query.previous" />
    <div @keyup.enter="submit" class="form">
      <span style="margin-top: 16px; margin-bottom: 16px">HD derivation path</span>
      <div style="display: flex; flex-direction: row; margin-bottom: 16px">
        <span style="line-height: 48px; margin-right: 8px" class="secondary-text">m/44’/...’/</span>
        <div style="margin-right: 8px" :class="{ error: accountError }">
          <Input v-model="account" />
        </div>
        <div style="margin-right: 8px" :class="{ error: changeError }">
          <Input v-model="change" />
        </div>
        <div style="margin-right: 8px" :class="{ error: addressIndexError }">
          <Input v-model="addressIndex" />
        </div>
      </div>
      <span class="form-info error" style="margin-bottom: 16px" v-if="accountError || changeError || addressIndexError"
        >Invalid derivation path</span
      >
      <a @click="infoOpen = true">What is an HD derivation path?</a>
    </div>
    <Slideout v-bind:open="infoOpen" v-on:update:open="infoOpen = $event">
      <h1 style="margin-bottom: 16px">What does it mean HD derivation path?</h1>
      <div class="secondary-text" style="margin-bottom: 24px">
        Derivation path, help you to have multiple accounts under one recovery phrase, please make sure to understand
        before to set it. What each number represents: m / purpose' / coin_type' / account' / change / address_index
      </div>
      <Button name="Ok" @click="() => (infoOpen = false)" />
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Slideout from '@@/components/Slideout.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Create Account',
  components: { Header, Button, Slideout, Input },
  data: () => ({
    account: "0'",
    change: '0',
    addressIndex: '0',

    accountError: undefined,
    changeError: undefined,
    addressIndexError: undefined,

    infoOpen: false,
  }),
  computed: {
    newAccount() {
      return this.$store.state.extension.newAccount;
    },
  },
  watch: {
    account(account) {
      this.accountError = !/^[0-9]+'?$/.test(account);

      if (!this.accountError)
        this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
          ...this.newAccount,
          hdPath: [account, this.newAccount.hdPath[1], this.newAccount.hdPath[2]],
        });
    },
    change(change) {
      this.changeError = !/^[0-9]+'?$/.test(change);

      if (!this.changeError)
        this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
          ...this.newAccount,
          hdPath: [this.newAccount.hdPath[0], change, this.newAccount.hdPath[2]],
        });
    },
    addressIndex(index) {
      this.addressIndexError = !/^[0-9]+'?$/.test(index);

      if (!this.addressIndexError)
        this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
          ...this.newAccount,
          hdPath: [this.newAccount.hdPath[0], this.newAccount.hdPath[1], index],
        });
    },
  },
  mounted() {
    if (this.newAccount?.hdPath) {
      this.account = this.newAccount.hdPath[0];
      this.change = this.newAccount.hdPath[1];
      this.addressIndex = this.newAccount.hdPath[2];
    }
    this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
      ...this.newAccount,
      hdPath: this.newAccount?.hdPath || ["0'", '0', '0'],
      route: '/accountImportHdPath?previous=' + this.$route.query.previous,
    });
  },
});
</script>
<style lang="scss" scoped>
:deep(input) {
  text-align: center;
}
</style>
