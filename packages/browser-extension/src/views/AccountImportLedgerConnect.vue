<template>
  <div class="page">
    <Header backTo="/ledger?next=/ledger/connect" />
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
import TransportWebHid from '@ledgerhq/hw-transport-webhid';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { AccountCreateStates } from '@@/types';
import { keyHashfromAddress } from '@/utils/basic';
import Header from '@@/components/Header.vue';
import { getHdPath } from '@@/lib/libraries/cosmjs';
import { stringToPath } from '@cosmjs/crypto';
import chainConfigs from '../chain-config';

const interactiveTimeout = 120_000;

export default defineComponent({
  name: 'Import Ledger',
  components: {
    Header,
  },
  async mounted() {
    try {
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // never loaded before as root not hit
      // handle background locked
      if (hasWallet && !wallet) {
        this.$router.push('/');
      }

      const newAccount = await this.$store.dispatch(GlobalActionTypes.GET_NEW_ACCOUNT);

      // TODO put all in cosmos library and handle different hd paths?
      const chainConfig = chainConfigs['cosmos-hub'];
      const path = stringToPath(
        getHdPath(chainConfig, {
          hdPath: newAccount.hdPath,
        }),
      );

      const ledgerTransport = await TransportWebHid.create();
      const signer = new LedgerSigner(ledgerTransport, { testModeAllowed: true, hdPaths: [path] });

      const accounts = await signer.getAccounts();

      if (this._.isUnmounted) return; // handle component being unmounted by clicking on Go Back

      const keyHash = keyHashfromAddress(accounts[0].address);
      const existingAccount = wallet.find((account) => account.isLedger && account.keyHashes.includes(keyHash));
      if (existingAccount) {
        throw new Error('Ledger is already registered with account: ' + existingAccount.accountName);
      }

      await this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
        ...newAccount,
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
