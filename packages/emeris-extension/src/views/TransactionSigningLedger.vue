<template>
  <div class="page">
    <div style="margin-bottom: 56px; margin-top: 150px; display: flex; flex-direction: column; align-items: center">
      <img class="loader" :src="'/images/EphemerisLoader.svg'" />
      <img :src="'/images/LedgerBox.svg'" style="width: 151px; margin-top: 32px" />
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <div style="text-align: center" class="secondary-text">Waiting for approval on Ledger...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';
import { keyHashfromAddress } from '@/utils/basic';
import config from '@@/chain-config';
import libs from '@@/lib/libraries';

export default defineComponent({
  name: 'Transaction Signing Ledger',
  async mounted() {
    const ledgerSignData = await this.$store.dispatch(GlobalEmerisActionTypes.GET_LEDGER_SIGN_DATA);
    try {
      const hasWallet = await this.$store.dispatch(GlobalEmerisActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalEmerisActionTypes.GET_WALLET); // never loaded before as root not hit
      const pendings = await this.$store.dispatch(GlobalEmerisActionTypes.GET_PENDING);
      // handle background locked
      if ((hasWallet && !wallet) || pendings.length === 0) {
        this.$router.push('/');
        return;
      }

      const transaction = pendings[0].data;
      const signingKeyHash = keyHashfromAddress(transaction?.signingAddress);
      const signingWallet = wallet.find(({ keyHashes }) => keyHashes.includes(signingKeyHash));
      if (!signingWallet) throw new Error('The requested signing address is not active in the extension');
      if (!signingWallet.isLedger) throw new Error('The requested signing address is not stored as a Ledger account.');

      const chain = config[transaction.chainId];
      if (!chain) {
        throw new Error('Chain not supported: ' + transaction.chainId);
      }

      const broadcastable = await this.sign(signingWallet, ledgerSignData, chain);

      await this.$store.dispatch(GlobalEmerisActionTypes.ACCEPT_TRANSACTION, {
        id: pendings[0].id,
        broadcastable,
      });

      this.$router.push('/');
    } catch (err) {
      this.$router.push(
        '/ledger/error?error=' +
          err.message +
          '&backto=' +
          encodeURI('/ledger&next=/ledger/sign') +
          '&retry=' +
          encodeURI('/ledger/sign'),
      );
    }
  },
  methods: {
    async sign(signingWallet, ledgerSignData, chainConfig) {
      const broadcastable = await libs[chainConfig.library].signLedger(
        signingWallet,
        chainConfig,
        ledgerSignData.rawTransaction.msgs, // rawTransaction is already the whole transaction, need to stitch again?
        ledgerSignData.fees,
        ledgerSignData.memo,
      );
      return broadcastable;
    },
  },
});
</script>

<style lang="scss" scoped>
.loader {
  animation-name: spin;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
