<template>
  <div class="page">
    <Header title="Advanced" />
    <span style="margin-top: 16px; margin-bottom: 16px">HD derivation path</span>
    <div style="display: flex; margin-bottom: 16px">
      <span style="line-height: 48px; margin-right: 8px" class="secondary-text">m/44’/...’/</span>
      <div style="margin-right: 8px" :class="{ error: accountError }">
        <Input v-model="account" />
      </div>
      <div style="margin-right: 8px" :class="{ error: changeError }">
        <Input v-model="change" />
      </div>
      <div :class="{ error: addressIndexError }">
        <Input v-model="addressIndex" />
      </div>
    </div>
    <span class="form-info error" style="margin-bottom: 16px" v-if="accountError || changeError || addressIndexError"
      >Invalid derivation path</span
    >
    <a @click="infoOpen = true">What is an HD derivation path?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Import" :disabled="accountError || changeError || addressIndexError" @click="submit" />
    </div>
    <Slideout :open="infoOpen">
      <h1 style="margin-bottom: 16px">What does it mean HD derivation path?</h1>
      <div class="secondary-text" style="margin-bottom: 24px">
        Derivation path, help you to have multiple accounts under one recovery phrase, please make sure to understand
        before to set it. What each number represents: m / purpose' / coin_type' / account' / change / address_index
      </div>
      <Button name="Ok" @click="() => (infoOpen = false)" />
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import MnemonicInput from '@@/components/MnemonicInput.vue';
import Header from '@@/components/Header.vue';
import Slideout from '@@/components/Slideout.vue';

import { MutationTypes } from '@@/store/extension/mutation-types';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { RootState } from '@@/store';

export default defineComponent({
  name: 'Create Account',
  components: { MnemonicInput, Header, Button, Slideout, Input },
  data: () => ({
    account: '0',
    change: '0',
    addressIndex: '0',

    accountError: undefined,
    changeError: undefined,
    addressIndexError: undefined,

    infoOpen: false,
  }),
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
  },
  watch: {
    account(account) {
      this.accountError = !/^[0-9]+'?$/.test(account);

      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          ...this.wallet,
          hdPath: [account, this.change, this.addressIndex],
        },
        route: this.$route,
      });
    },
    change(change) {
      this.changeError = !/^[0-9]+'?$/.test(change);

      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          ...this.wallet,
          hdPath: [this.account, change, this.addressIndex],
        },
        route: this.$route,
      });
    },
    addressIndex(index) {
      this.addressIndexError = !/^[0-9]+'?$/.test(index);

      this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, {
        wallet: {
          ...this.wallet,
          hdPath: [this.account, this.change, index],
        },
        route: this.$route,
      });
    },
  },
  async mounted() {
    const partialAccountCreation = await this.$store.dispatch(GlobalActionTypes.GET_PARTIAL_ACCOUNT_CREATION);
    if (partialAccountCreation && partialAccountCreation.wallet.hdPath) {
      [this.account, this.change, this.addressIndex] = partialAccountCreation.wallet.hdPath;
    }
  },
  methods: {
    submit() {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, {
        walletMnemonic: this.mnemonic,
        hdPath: [this.account, this.change, this.addressIndex],
      });
      this.$router.push({ path: '/accountCreate' });
    },
  },
});
</script>
<style lang="scss" scoped>
:deep(input) {
  text-align: center;
}
</style>