<template>
  <div class="page">
    <Header title="Account Name" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >If you have multiple accounts this will help you to find the right one</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="name" />
      <span class="form-info error" v-if="error">Name already in use</span>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <div style="margin-bottom: 32px; display: flex" class="terms-of-use">
        <Icon
          name="InformationIcon"
          style="margin-right: 9px; transform: rotate(180deg)"
          icon-size="1"
          class="secondary-text"
        />
        <div>
          <span class="secondary-text">By continuing you agree to </span
          ><a href="/" @click.prevent="open('https://emeris.com/terms')" style="opacity: 1">Terms of Use</a
          ><span class="secondary-text"> & </span
          ><a href="" @click.prevent="open('https://emeris.com/privacy')">Privacy Policy</a
          ><span class="secondary-text"> of Emeris wallet</span>
        </div>
      </div>
      <Button name="Continue" :disabled="!name" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import * as bip39 from 'bip39';

import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';
import { RootState } from '@@/store';
import { AccountCreateStates } from '@@/types';

export default defineComponent({
  name: 'Create Account',
  components: { Button, Input, Header, Icon },
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
      newAccount: (state: RootState) => state.extension.newAccount,
    }),
    error() {
      return this.wallet && this.wallet.find(({ accountName }) => accountName === this.name);
    },
  },
  data: () => ({
    name: 'Account X',
  }),
  watch: {
    name(name) {
      this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
        ...this.newAccount,
        accountName: name,
      });
    },
  },
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // the wallet is encrypted with the password so the existence is equal
    if (!hasPasswod) {
      this.$router.push({ path: '/passwordCreate', query: { returnTo: this.$route.path } });
    }

    const accounts = (await this.$store.dispatch(GlobalActionTypes.GET_WALLET)) || [];
    this.name = this.newAccount?.accountName || 'Account ' + (accounts.length + 1);
    this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
      ...this.newAccount,
      route: '/accountCreate',
    });
  },
  methods: {
    async submit() {
      if (this.error) return;

      const wallet = await this.$store.dispatch(GlobalActionTypes.CREATE_ACCOUNT, {
        account: {
          ...this.newAccount,
          accountName: this.name,
          accountMnemonic: bip39.generateMnemonic(256), // will be overwritten by existing new account
          isLedger: false,
          setupState: this.newAccount.setupState || AccountCreateStates.CREATED, // if this is an import we don't need to check if the user backed up the mnemonic
        },
      });
      if (wallet) {
        this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, undefined); // remove new account from flow
        this.$router.push('/backup?new=true');
      }
    },
    open(url) {
      window.open(url);
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
