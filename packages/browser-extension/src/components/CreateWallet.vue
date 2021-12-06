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
import { WalletCreateStates } from '@@/types';
import * as bip39 from 'bip39';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CreateWallet',
  setup() {
    const walletName = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const mnemonic = ref('');
    const store = useExtensionStore();
    const router = useRouter();
    const validatePassword = () => {
      return password.value == confirmPassword.value;
    };
    const createWallet = async () => {
      if (validatePassword()) {
        mnemonic.value = bip39.generateMnemonic(256);
        const wallet = await store.dispatch(GlobalActionTypes.CREATE_WALLET, {
          wallet: { walletMnemonic: mnemonic.value, walletName: walletName.value, setupState: WalletCreateStates.CREATED },
          password: password.value,
        });
        if (wallet) {
          router.push('/');
        }
      }
    };
    return { walletName, password, confirmPassword, createWallet, mnemonic };
  },
});
</script>
