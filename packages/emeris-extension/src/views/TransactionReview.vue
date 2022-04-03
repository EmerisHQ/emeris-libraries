<template>
  <div class="page" style="padding-bottom: 135px" v-if="pending">
    <h1>Confirm Transaction</h1>
    <span class="text-center w-full mb-6" style="color: #ffffffaa">{{
      pending.origin.replace(/http(s)?:\/\//, '')
    }}</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 16px; font-size: 13px; line-height: 24px">
      <div
        v-on:click="this.switchTab"
        :class="{ 'secondary-text': this.tab === 'Data' }"
        style="display: flex; flex-direction: row; cursor: pointer"
      >
        Details
        <div class="badge" style="margin-left: 8px">{{ transaction.messages.length }}</div>
      </div>
      <span
        v-on:click="this.switchTab"
        :class="{ 'secondary-text': this.tab === 'Details' }"
        style="margin-left: 16px; cursor: pointer"
        >Data</span
      >
    </div>

    <template v-if="this.tab === 'Details'">
      <div
        v-for="(message, index) in transaction.messages"
        :key="index"
        style="
          display: flex;
          flex-direction: column;
          padding: 16px;

          background: #171717;
          border-radius: 8px;
          margin-bottom: 16px;
        "
      >
        <Message style="flex: 1" :message="message" :chainId="transaction.chainId" />
      </div>
    </template>
    <template v-else-if="this.tab === 'Data'">
      <div class="p-4 rounded-xl" style="background: #171717">
        <h4 class="text-0 mb-3">Custom transaction</h4>
        <Yaml
          :json="this.transaction.messages?.length === 1 ? this.transaction.messages[0] : this.transaction.messages"
        />
      </div>
    </template>

    <div
      style="
        margin-top: auto;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        padding: 0 16px 16px 16px;
        background: var(--bg);
        z-index: 100;
      "
    >
      <div v-if="error" style="color: #ff6072; margin-top: 16px; text-align: center">{{ error }}</div>
      <div class="mt-6 mb-2 flex justify-between" style="font-size: 13px">
        <span class="secondary-text">Reference (memo)</span>
        <a
          @click="editMemo = true"
          style="max-width: 161px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden"
          >{{ memo ? memo : 'Add reference' }}</a
        >
      </div>
      <div
        style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 16px; font-size: 13px"
      >
        <span class="secondary-text">Fees (additional)</span>
        <a href="" @click.prevent="(e) => {}"><TotalPrice class="inline" :balances="fees" /></a>
      </div>
      <div style="display: flex; flex-direction: row">
        <Button name="Reject" variant="secondary" style="margin-right: 16px; flex: 1" @click="cancel" />
        <Button name="Accept" style="flex: 1" @click="accept" />
      </div>
    </div>
    <Slideout v-bind:open="editMemo" v-on:update:open="editMemo = $event">
      <div @keyup.enter="editMemo = false" class="form">
        <h1 style="margin-bottom: 16px">Reference</h1>
        <div class="secondary-text" style="margin-bottom: 32px">
          Add a reference for your transaction. This is often called a “memo” in other apps. If you’re sending to an
          exchange, be sure to include the correct reference provided by the exchange.
        </div>
        <Input v-model="memo" placeholder="Add a reference…" />
        <div style="display: flex; flex-direction: row; margin-top: 32px">
          <Button
            name="Cancel"
            variant="secondary"
            style="flex: 1; margin-right: 16px"
            @click="
              editMemo = false;
              memo = undefined;
            "
          />
          <Button type="submit" name="Done" style="flex: 1" @click="editMemo = false" />
        </div>
      </div>
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GlobalEmerisGetterTypes } from '@@/store/extension/getter-types';
import Button from '@/components/ui/Button.vue';
import Message from '@@/components/Transactions/Message.vue';
import Slideout from '@@/components/Slideout.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Input from '@/components/ui/Input.vue';
import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';
import { keyHashfromAddress } from '@/utils/basic';
import { MutationTypes } from '@@/store/extension/mutation-types';
import Yaml from '@@/components/Yaml.vue';

type TxTab = 'Details' | 'Data';
interface TxReviewData {
  tab: TxTab;
  memo: string;
  editMemo: boolean;
  editFees: boolean;
  fees: { amount: number; denom: string }[];
  gas: number;
  error?: string;
}
export default defineComponent({
  name: 'Transaction Review',
  components: {
    Yaml,
    Button,
    Message,
    Slideout,
    Input,
    TotalPrice,
  },
  data: (): TxReviewData => ({
    tab: 'Details',
    memo: 'Sent with Emeris',
    editMemo: false,
    editFees: false,
    fees: [
      {
        amount: 1,
        denom: 'uatom',
      },
    ],
    gas: 200000,
    error: undefined,
  }),
  computed: {
    pending() {
      const pending = this.$store.getters[GlobalEmerisGetterTypes.getPending][0];
      this.error = pending?.error;
      return pending;
    },
    transaction() {
      return this.pending?.data;
    },
  },
  methods: {
    switchTab() {
      this.tab = this.tab === 'Details' ? 'Data' : 'Details';
    },
    async cancel() {
      await this.$store.dispatch(GlobalEmerisActionTypes.CANCEL_TRANSACTION, this.pending);
      this.$router.push('/');
    },
    async accept() {
      this.error = undefined;
      try {
        const hasWallet = await this.$store.dispatch(GlobalEmerisActionTypes.HAS_WALLET); // checking if the password was set
        const wallet = await this.$store.dispatch(GlobalEmerisActionTypes.GET_WALLET); // never loaded before as root not hit
        // handle background locked
        if (hasWallet && !wallet) {
          this.$router.push('/');
        }

        const signingKeyHash = keyHashfromAddress(this.transaction?.signingAddress);
        const signingWallet = wallet.find(({ keyHashes }) => keyHashes.includes(signingKeyHash));
        if (!signingWallet) throw new Error('No account stored that can sign the transaction.');
        if (signingWallet.isLedger) {
          this.$store.commit('extension/' + MutationTypes.SET_LEDGER_SIGN_DATA, {
            fees: {
              gas: this.gas,
              amount: this.fees,
            },
            memo: this.memo,
          });
          const ledgerSigningLink = encodeURI('/ledger/sign');
          window.open('popup.html#/ledger?next=' + ledgerSigningLink);
          window.close();
          return;
        }

        await this.$store.dispatch(GlobalEmerisActionTypes.ACCEPT_TRANSACTION, {
          id: this.pending.id,
          // TODO currently setting default fee until fee selection works
          fees: {
            gas: this.gas,
            amount: this.fees,
          },
          memo: this.memo,
          ...this.transaction,
        });
        this.$router.push('/');
      } catch (err) {
        this.error = err.message;
      }
    },
  },
  mounted() {
    this.$store.dispatch(GlobalEmerisActionTypes.GET_PENDING);
  },
});
</script>
<style scoped>
.badge {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;

  position: static;
  width: 23px;
  height: 24px;
  left: 51px;
  top: 0px;

  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}
</style>
