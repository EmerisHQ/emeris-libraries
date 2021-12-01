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

export default defineComponent({
  name: 'Create Account',
  components: { Button, Input, Header, Icon },
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
  },
  data: () => ({
    name: 'Account X',
  }),
  watch: {
    wallet(wallet) {
      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          walletName: this.name,
          walletMnemonic: wallet.walletMnemonic,
        },
        route: this.$route,
      });
    },
    name(name) {
      if (!this.wallet) return;
      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          walletName: name,
          walletMnemonic: this.wallet.walletMnemonic,
        },
        route: this.$route,
      });
    },
  },
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_PASSWORD);
    this.wallets = (await this.$store.dispatch(GlobalActionTypes.GET_WALLETS)) || [];
    this.name = 'Account ' + (this.wallets.length + 1);
    if (!hasPasswod) {
      this.$router.push('/passwordCreate');
    }

    // if it is an import we have the seed in the store
    // if it is a new wallet we create a seed
    if (!this.wallet) {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, {
        walletName: 'new',
        walletMnemonic: bip39.generateMnemonic(256),
      });
    } else {
      const partialAccountCreation = await this.$store.dispatch(GlobalActionTypes.GET_PARTIAL_ACCOUNT_CREATION);
      if (partialAccountCreation && partialAccountCreation.wallet.walletName) {
        this.name = partialAccountCreation.wallet.walletName;
      }

      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          walletName: this.name,
          walletMnemonic: this.wallet.walletMnemonic,
        },
        route: this.$route,
      });
    }
  },
  methods: {
    async submit() {
      const wallet = await this.$store.dispatch(GlobalActionTypes.CREATE_WALLET, {
        wallet: { ...this.wallet, walletName: this.name },
        password: '', // TOOD needed?
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
