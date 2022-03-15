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
import { LedgerSigner } from '@cosmjs/ledger-amino';
// eslint-disable-next-line @typescript-eslint/naming-convention
import TransportWebUsb from '@ledgerhq/hw-transport-webusb';
import { AminoMsg, makeCosmoshubPath } from '@cosmjs/amino';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { AccountCreateStates } from '@@/types';
import { keyHashfromAddress } from '@/utils/basic';
import TxMapper from '@emeris/mapper';
import { SignTransactionRequest } from '@@/types/api';
import EmerisSigner from '@emeris/signer/lib/EmerisSigner';
import config from '@@/chain-config';
import libs from '@@/lib/libraries';

const interactiveTimeout = 120_000;
// TODO add advanced tab
const accountNumbers = [0];
const paths = accountNumbers.map(makeCosmoshubPath);

export default defineComponent({
  name: 'Transaction Signing Ledger',
  async mounted() {
    try {
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // never loaded before as root not hit
      const pendings = await this.$store.dispatch(GlobalActionTypes.GET_PENDING);
      // handle background locked
      if ((hasWallet && !wallet) || pendings.length === 0) {
        this.$router.push('/');
        return;
      }

      const transaction = pendings[0].data;

      const signingKeyHash = keyHashfromAddress(transaction?.signingAddress);
      const signingWallet = wallet.find(({ keyHashes }) => keyHashes.includes(signingKeyHash));
      if (!signingWallet) throw new Error('No account stored that can sign the transaction.');

      const chain = config[transaction.chainId];
      if (!chain) {
        throw new Error('Chain not supported: ' + transaction.chainId);
      }

      // @ts-ignore TODO write this as proper TS
      const chainMessages: AminoMsg[] = await TxMapper({
        ...transaction,
        chainName: transaction.chainId,
        txs: transaction.messages,
      }); // TODO change pending data flow to use property chainName instead of chainId
      const broadcastable = await libs[chain.library].signLedger(
        signingWallet,
        chain,
        chainMessages,
        transaction.fee,
        transaction.memo,
      );

      await this.$store.dispatch(GlobalActionTypes.SEND_LEDGER_SIGNATURE, { id: pendings[0].id, broadcastable });

      this.$router.push('/');
    } catch (err) {
      this.$router.push('/ledger?error=' + err.message + '&next=' + this.$route.path);
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
