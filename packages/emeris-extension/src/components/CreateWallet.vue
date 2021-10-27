<template>
  <div>
    Wallet name: <input type="text" name="walletName" v-model="walletName" /><br />
    Password: <input type="password" name="password" v-model="password" /><br />
    Confirm Password: <input type="password" name="confirmPassword" v-model="confirmPassword" /><br />
    <button v-on:click="createWallet">Create</button>
    {{ mnemonic }}
  </div>
</template>

<script lang="ts">
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import * as bip39 from 'bip39';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CreateWallet',
  setup() {
    const walletName = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const mnemonic = ref('');
    const store = useExtensionStore();

    const validatePassword = () => {
      return password.value == confirmPassword.value;
    };
    const createWallet = () => {
      if (validatePassword()) {
        mnemonic.value = bip39.generateMnemonic(256);
        store.dispatch(GlobalActionTypes.GET_PENDING);
      }
    };
    return { walletName, password, confirmPassword, createWallet, mnemonic };
  },
});
</script>