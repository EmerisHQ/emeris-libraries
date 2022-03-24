<template>
  <div class="page">
    <Header title="Import account" backTo="/">
      <!-- <router-link to="/accountImport/advanced">
        <a>Advanced</a>
      </router-link> -->
    </Header>
    <img :src="require(`@@/assets/ImportLedgerBG.png`)" class="background" />
    <div
      style="margin-bottom: 56px; margin-top: 72px; margin-left auto; margin-right: auto; display: block; margin-left: auto;"
    >
      <img :src="require('@@/assets/LedgerBox.svg')" style="width: 151px" />
    </div>
    <ListCard :img="require(`@@/assets/Step1.svg`)" caption="Unlock & connect your Ledger device with your computer" />
    <ListCard :img="require(`@@/assets/Step2.svg`)" caption="Open the ‘Cosmos’ app on your Ledger device" />

    <div v-if="error" style="color: #ff6072; margin-top: 16px; text-align: center">{{ error }}</div>

    <a class="secondary-text" style="margin-top: 24px">Having trouble connecting your Ledger?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Connect Ledger" @click="next()" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import ListCard from '@@/components/ListCard.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Connect Ledger',
  components: { ListCard, Header, Button },
  computed: {
    error() {
      return this.$route.query.error;
    },
  },
  methods: {
    next() {
      // we use the same component for account gathering and signing
      this.$router.push(this.$route.query.next);
    },
  },
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // the wallet is encrypted with the password so the existence is equal
    if (!hasPasswod) {
      this.$router.push({ path: '/passwordCreate', query: { returnTo: this.$route.fullPath } });
    }
  },
});
</script>
