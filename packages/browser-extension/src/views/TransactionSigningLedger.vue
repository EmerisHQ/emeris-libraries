<template>
  <div class="page">
    <div style="margin-bottom: 56px; margin-top: 150px; display: flex; flex-direction: column; align-items: center">
      <img class="loader" :src="require('@@/assets/EphemerisLoader.svg')" />
      <img :src="require('@@/assets/LedgerBox.svg')" style="width: 151px; margin-top: 32px" />
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
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Transaction Signing Ledger',
  async mounted() {
    const ledgerSignData = this.$store.state.extension.ledgerSignData;
    try {
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // never loaded before as root not hit
      const pendings = await this.$store.dispatch(GlobalActionTypes.GET_PENDING);
      // handle background locked
      if ((hasWallet && !wallet) || pendings.length === 0) {
        this.$router.push('/');
        return;
      }

      await this.$store.dispatch(GlobalActionTypes.ACCEPT_TRANSACTION, {
        id: pendings[0].id,
        ...pendings[0].data,
        ...ledgerSignData,
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
