<template>
  <div class="page">
    <Header title="Account Name" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >If you have multiple accounts this will help you to find the right one</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="accountName" />
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Continue" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';
import { RootState } from '@@/store';
import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Account Rename',
  components: { Button, Input, Header },
  data: () => ({
    accountName: '',
  }),
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
    account() {
      return this.wallet[this.index];
    },
  },
  mounted() {
    this.$data.accountName = this.account.accountName;
  },
  props: {
    index: { type: String, required: true },
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch(GlobalEmerisActionTypes.UPDATE_ACCOUNT, {
          targetAccountName: this.account.accountName,
          newAccountName: this.accountName,
        });
        this.$store.dispatch(GlobalEmerisActionTypes.GET_WALLET);
        this.$router.push('/accounts');
      } catch (err) {
        console.error(err);
      }
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
