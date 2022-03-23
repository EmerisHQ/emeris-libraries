<template>
  <div class="page">
    <div style="margin-bottom: 56px; margin-top: 150px; display: flex; flex-direction: column; align-items: center">
      <img class="loader" :src="require('@@/assets/EphemerisLoader.svg')" />
      <img :src="require('@@/assets/LedgerBox.svg')" style="width: 151px; margin-top: 32px" />
      <div style="text-align: center" class="secondary-text; margin-top: 16px">Connecting Ledger...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LedgerSigner } from '@cosmjs/ledger-amino';
// eslint-disable-next-line @typescript-eslint/naming-convention
import TransportWebUsb from '@ledgerhq/hw-transport-webusb';
import { makeCosmoshubPath } from '@cosmjs/amino';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { AccountCreateStates } from '@@/types';
import { keyHashfromAddress } from '@/utils/basic';

const interactiveTimeout = 120_000;
// TODO add advanced tab
const accountNumbers = [0];
const paths = accountNumbers.map(makeCosmoshubPath);

export default defineComponent({
  name: 'Import Ledger',
  async mounted() {
    try {
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // never loaded before as root not hit
      // handle background locked
      if (hasWallet && !wallet) {
        this.$router.push('/');
      }

      const ledgerTransport = await TransportWebUsb.create(interactiveTimeout, interactiveTimeout);
      const signer = new LedgerSigner(ledgerTransport, { testModeAllowed: true, hdPaths: paths });

      const accounts = await signer.getAccounts();

      const keyHash = keyHashfromAddress(accounts[0].address);
      const existingAccount = wallet.find((account) => account.isLedger && account.keyHashes.includes(keyHash));
      if (existingAccount) {
        throw new Error('Ledger is already registered with account: ' + existingAccount.accountName);
      }

      await this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
        accountName: this.name,
        isLedger: true,
        setupState: AccountCreateStates.COMPLETE,
        keyHash: keyHashfromAddress(accounts[0].address),
        path: '/accountCreate',
      });

      this.$router.push('/accountCreate');
    } catch (err) {
      this.$router.push(
        '/ledger/error?error=' + err.message + '&backto=/ledger%3Fnext%3D%2Fledger%2Fconnect&retry=/ledger/connect',
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
