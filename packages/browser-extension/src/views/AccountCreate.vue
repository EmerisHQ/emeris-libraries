<template>
  <div class="page">
    <Header title="Account Name" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >If you have multiple accounts this will help you to find the right one</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="name" />
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <div style="margin-bottom: 32px; display: flex" class="terms-of-use secondary-text">
        <Icon name="InformationIcon" style="margin-right: 9px" icon-size="1" />
        <span
          >By continuing you agree to <a href="/">Terms of Use</a> &
          <a href="https://emeris.com/privacy">Privacy Policy</a> of Emeris wallet</span
        >
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
import { MutationTypes } from '@@/store/extension/mutation-types';
import { RootState } from '@@/store';
import { AccountCreateStates } from '@@/types';

export default defineComponent({
  name: 'Create Account',
  components: { Button, Input, Header, Icon },
  computed: {
    ...mapState({
      newAccount: (state: RootState) => state.extension.newAccount,
    }),
  },
  data: () => ({
    name: 'Account X',
  }),
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // the wallet is encrypted with the password so the existence is equal
    debugger;
    if (!hasPasswod) {
      this.$router.push({ path: '/passwordCreate', query: { returnTo: this.$route.path } });
    }

    const accounts = (await this.$store.dispatch(GlobalActionTypes.GET_WALLET)) || [];
    this.name = 'Account ' + (accounts.length + 1);
    // if it is an import we have the seed in the store
    // if it is a new wallet we create a seed
    if (!this.newAccount) {
      this.$store.commit('extension/' + MutationTypes.SET_NEW_ACCOUNT, {
        accountMnemonic: bip39.generateMnemonic(256),
      });
    }
  },
  methods: {
    async submit() {
      const wallet = await this.$store.dispatch(GlobalActionTypes.CREATE_ACCOUNT, {
        account: {
          ...this.newAccount,
          accountName: this.name,
          isLedger: false,
          setupState: this.newAccount.setupState || AccountCreateStates.CREATED, // if this is an import we don't need to check if the user backed up the mnemonic
        },
      });
      if (wallet) {
        this.$router.push('/backup');
      }
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
