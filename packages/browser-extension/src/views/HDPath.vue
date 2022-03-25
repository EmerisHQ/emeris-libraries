<template>
  <div class="page">
    <Header title="Advanced" :backTo="this.$route.query.previous" />
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

const defaultHdPath = ["0'", '0', '0'];
const hdPathRegex = /^[0-9]+'?$/;

const updateHdPath = (position, value, store) => {
  const newAccount = store.state.extension.newAccount;
  const hdPath = newAccount?.hdPath || new Array(...defaultHdPath);
  hdPath[position] = value;
  store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
    ...newAccount,
    hdPath,
  });
};

export default defineComponent({
  name: 'Create Account',
  components: { Header, Button, Slideout, Input },
  data: () => ({
    account: defaultHdPath[0],
    change: defaultHdPath[1],
    addressIndex: defaultHdPath[2],

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
    newAccount(account) {
      if (account?.hdPath) {
        this.account = account.hdPath[0];
        this.change = account.hdPath[1];
        this.addressIndex = account.hdPath[2];
      }
    },
    account(account) {
      this.accountError = !hdPathRegex.test(account);

      if (!this.accountError) {
        updateHdPath(0, account, this.$store);
      }
    },
    change(change) {
      this.changeError = !hdPathRegex.test(change);

      if (!this.changeError) {
        updateHdPath(1, change, this.$store);
      }
    },
    addressIndex(index) {
      this.addressIndexError = !hdPathRegex.test(index);

      if (!this.addressIndexError) {
        updateHdPath(2, index, this.$store);
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(GlobalActionTypes.GET_NEW_ACCOUNT);
    this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
      ...this.newAccount,
      route: '/accountImportHdPath?previous=' + encodeURI(this.$route.query.previous),
    });
  },
});
</script>
<style lang="scss" scoped>
:deep(input) {
  text-align: center;
}
</style>
