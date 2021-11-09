<template>
  <div>
    Select Wallet:
    <select name="walletName" v-model="toUnlock">
      <option v-for="wallet in wallets" :key="wallet.walletName" :value="wallet.walletName">
        {{ wallet.walletName }}
      </option></select
    ><br />
    Password: <input type="password" name="password" v-model="password" /><br />
    <button v-on:click="unlockWallet">Unlock</button>
  </div>
</template>

<script lang="ts">
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { EmerisEncryptedWallet } from '@@/types';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'UnlockWallet',
  setup() {
    const store = useExtensionStore();
    const router = useRouter();
    const wallets = computed<EmerisEncryptedWallet[]>(() => store.getters[GlobalGetterTypes.getWallets]);
    const password = ref('');
    const toUnlock = ref('');
    const unlockWallet = async () => {
      const wallet = await store.dispatch(GlobalActionTypes.UNLOCK_WALLET, {
        walletName: toUnlock.value,
        password: password.value,
      });
      if (wallet) {
        router.push('/');
      }
    };
    return { wallets, password, toUnlock, unlockWallet };
  },
});
</script>
