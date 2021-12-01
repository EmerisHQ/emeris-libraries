<template>
  <div class="page">
    <Header title="Import account">
      <!-- <router-link to="/accountImport/advanced">
        <a>Advanced</a>
      </router-link> -->
    </Header>
    <span style="margin-top: 16px; margin-bottom: 16px">Enter your recovery phrase</span>
    <div style="margin-bottom: 16px">
      <MnemonicInput v-model="mnemonic" placeholder="Your recovery phrase" />
    </div>
    <span class="form-info error" v-if="invalidChar">Invalid character used</span>
    <a @click="infoOpen = true">What’s a recovery phrase?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Import" :disabled="!mnemonic" @click="submit" />
    </div>
    <Modal
      title="Invalid recovery phrase"
      description="Check you have entered your recovery phrase correctly and try again."
      :open="invalidRecoveryPhraseWarning"
      @close="invalidRecoveryPhraseWarning = false"
    ></Modal>
    <Slideout :open="infoOpen">
      <h1 style="margin-bottom: 16px">What’s a recovery phrase?</h1>
      <div class="secondary-text" style="margin-bottom: 24px">
        These phrases are usually 12 or 24 words long. Each word in the phrase tends to be unrelated to another. Wallet
        providers will usually provide you a mnemonic phrase when you open a new account, this phrase will help you to
        import your wallet.
      </div>
      <Button name="I understand" @click="() => (infoOpen = false)" />
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import MnemonicInput from '@@/components/MnemonicInput.vue';
import Header from '@@/components/Header.vue';
import Modal from '@@/components/Modal.vue';
import Slideout from '@@/components/Slideout.vue';

import { MutationTypes } from '@@/store/extension/mutation-types';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Create Account',
  components: { MnemonicInput, Header, Button, Modal, Slideout },
  data: () => ({
    mnemonic: undefined,
    invalidRecoveryPhraseWarning: false,
    infoOpen: false,
  }),
  watch: {
    mnemonic(mnemonic) {
      this.invalidChar = !/^[a-z ]*$/.test(mnemonic);

      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          walletMnemonic: this.mnemonic,
        },
        route: this.$route,
      });
    },
  },
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_PASSWORD);

    if (!hasPasswod) {
      this.$router.push('/passwordCreate');
    }

    const partialAccountCreation = await this.$store.dispatch(GlobalActionTypes.GET_PARTIAL_ACCOUNT_CREATION);
    if (partialAccountCreation) {
      this.mnemonic = partialAccountCreation.wallet.walletMnemonic;
    }
  },
  methods: {
    submit() {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, {
        walletName: 'new',
        walletMnemonic: this.mnemonic,
      });
      this.$router.push({ path: '/accountCreate' });
    },
  },
});
</script>
<style lang="scss" scoped>
.form-info {
  &.error {
    color: #ff6072;
  }
  &.success {
    color: #89ff9b;
  }
}
</style>
