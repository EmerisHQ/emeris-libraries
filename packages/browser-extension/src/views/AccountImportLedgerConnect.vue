<template>
  <div class="page">
    <Header v-if="error" title="Import account" backTo="/" />
    <div style="margin-bottom: 56px; margin-top: 150px; display: flex; flex-direction: column; align-items: center">
      <img v-if="!error" class="loader" :src="require('@@/assets/EphemerisLoader.svg')" />
      <img :src="require('@@/assets/LedgerBox.svg')" style="width: 151px; margin-top: 32px" />
      <div v-if="!error" style="text-align: center" class="secondary-text; margin-top: 16px">Connecting Ledger...</div>
      <div v-if="error" style="text-align: center; margin-top: 32px">
        <span>{{ error }}</span>
        <br />
        <span class="secondary-text">Please try again or contact our Emeris support</span>
        <br />
        <a
          href=""
          @click="$router.push({ path: '/support', query: { url: 'https://emeris.com/support', caption: 'Support' } })"
          >Visit Emeris Support ↗️</a
        >
      </div>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Try again" @click="connect" />
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
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';

const interactiveTimeout = 120_000;
// TODO add advanced tab
const accountNumbers = [0];
const paths = accountNumbers.map(makeCosmoshubPath);

export default defineComponent({
  name: 'Import Ledger',
  components: {
    Header,
    Button,
  },
  data: () => ({
    error: undefined,
  }),
  methods: {
    async connect() {
      this.error = undefined;
      try {
        const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // never loaded before as root not hit
        // handle background locked
        if (!wallet) {
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
        this.error = err.message;
      }
    },
  },
  mounted() {
    this.connect();
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
