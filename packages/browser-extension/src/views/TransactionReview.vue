<template>
  <div class="page">
    <h1>Confirm Transaction</h1>
    <span style="color: #ffffffaa; text-align: center; width: 100%">{{
      pending.origin.replace(/http(s)?:\/\//, '')
    }}</span>
    <div style="display: flex; flex-direction: row; margin-bottom: 16px; font-size: 13px; line-height: 24px">
      <div style="display: flex; flex-direction: row; cursor: pointer">
        Details
        <div class="badge" style="margin-left: 8px">{{ transaction.messages.length }}</div>
      </div>
      <span class="secondary-text" style="margin-left: 16px; cursor: pointer">Data</span>
    </div>

    <div
      style="
        display: flex;
        padding: 16px;

        background: #171717;
        border-radius: 8px;
      "
    >
      <component
        :is="message.type"
        v-for="(message, index) in transaction.messages"
        :message="message"
        :chainName="transaction.chainId"
        :key="index"
      />
    </div>

    <div
      style="
        margin-top: auto;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        padding: 0 16px 16px 16px;
        background: var(--bg);
      "
    >
      <div
        style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 8px; font-size: 13px"
      >
        <span class="secondary-text">Reference (memo)</span>
        <a href="">Add reference</a>
      </div>
      <div
        style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 16px; font-size: 13px"
      >
        <span class="secondary-text">Fees (additional)</span>
        <a href="">~$1.98</a>
      </div>
      <div style="display: flex; flex-direction: row">
        <Button name="Reject" variant="secondary" style="margin-right: 16px; flex: 1" @click="cancel" />
        <Button name="Accept" style="flex: 1" @click="accept" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import Button from '@/components/ui/Button.vue';
import transfer from '@@/components/Transactions/transfer.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Transaction Review',
  components: {
    Button,
    transfer,
  },
  computed: {
    pending() {
      return this.$store.getters[GlobalGetterTypes.getPending][0];
    },
    transaction() {
      return this.pending.data;
    },
  },
  methods: {
    async cancel() {
      await this.$store.dispatch(GlobalActionTypes.CANCEL_TRANSACTION, this.pending);
      this.$router.push('/');
    },
    async accept() {
      await this.$store.dispatch(GlobalActionTypes.ACCEPT_TRANSACTION, this.pending);
      this.$router.push('/');
    },
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
