<template>
  <div class="page">
    <Header title="Account Name" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >If you have multiple accounts this will help you to find the right one</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="name" placeholder="Account Name" />
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
import wordlist from '@@/wordlists/english.json';
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
    name: undefined,
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
    const hasPassword = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // the wallet is encrypted with the password so the existence is equal
    if (!hasPassword) {
      this.$router.push({ path: '/passwordCreate', query: { returnTo: this.$route.fullPath } });
    }

    const accounts = (await this.$store.dispatch(GlobalActionTypes.GET_WALLET)) || [];

    // find an unused account name
    let name;
    do {
      let i = 1;
      name = 'Account ' + i++;
    } while (accounts.find(({ accountName }) => accountName === name));

    this.name = name;
    this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
      ...this.newAccount,
      route: '/accountCreate',
    });
  },
  methods: {
    async submit() {
      if (this.error) return;

      try {
        await this.$store.dispatch(GlobalActionTypes.CREATE_ACCOUNT, {
          account: {
            accountName: this.name,
            accountMnemonic: bip39.generateMnemonic(256,null,wordlist), // will be overwritten by existing new account
            isLedger: false, // will be overwritten by existing new account
            setupState: this.newAccount.setupState || AccountCreateStates.CREATED, // if this is an import we don't need to check if the user backed up the mnemonic
            ...this.newAccount,
          },
        });
        // if the account is imported we don't need to show the backup seed screen
        let nextRoute;
        if (this.newAccount.setupState === AccountCreateStates.COMPLETE) {
          nextRoute = '/accountReady';
        } else {
          nextRoute = '/backup?new=true';
        }
        await this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, undefined); // remove new account from flow
        this.$router.push(nextRoute);
      } catch (err) {
        console.error(err);
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
