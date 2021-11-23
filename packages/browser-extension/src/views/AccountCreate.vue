<template>
  <div
    :style="{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <Header title="Account Name" />
    <span style="opacity: 67%; margin-top: 16px; margin-bottom: 24px"
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
      <div style="margin-bottom: 32px; display: flex" class="terms-of-use">
        <Icon name="InformationIcon" style="margin-right: 9px" icon-size="1" />
        <span>By continuing you agree to <a>Terms of Use</a> & <a>Privacy Policy</a> of Emeris wallet</span>
      </div>
      <Button name="Continue" :disabled="!name" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as bip39 from 'bip39';

import CreateWallet from '@@/components/CreateWallet.vue';
import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Create Account',
  components: { CreateWallet, Button, Input, Header, Icon },
  props: {
    seed: { type: String, required: false, default: bip39.generateMnemonic(256) },
  },
  data: () => ({
    name: 'Account X',
  }),
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_PASSWORD);
    this.wallets = (await this.$store.dispatch(GlobalActionTypes.GET_WALLETS)) || [];
    this.name = 'Account ' + (this.wallets.length + 1);
    if (!hasPasswod) {
      this.$router.push('/passwordCreate');
    }
  },
  methods: {
    async submit() {
      const wallet = await this.$store.dispatch(GlobalActionTypes.CREATE_WALLET, {
        wallet: { walletMnemonic: this.seed, walletName: this.name },
        password: '', // TOOD needed?
      });
      if (wallet) {
        this.$router.push('/');
      }
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}

.terms-of-use {
  opacity: 67%;
}
</style>
