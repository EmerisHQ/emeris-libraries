<template>
  <div class="page">
    <img
      :src="require(`@@/assets/WelcomeBG.png`)"
      :style="{
        position: 'fixed',
        zIndex: -1,
        // accounting for padding
        top: '-24px',
        left: '-24px',
      }"
    />
    <img class="wordmark" :src="require(`@@/assets/EmerisWordmark.svg`)" />
    <h1>Experience the power of cross-chain DeFi</h1>

    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <router-link :to="{ name: 'Create Wallet' }">
        <Button name="Create Account" @click="goTo('/create')" />
      </router-link>
      <Button name="Import Account" variant="secondary" @click="goTo('/accountImport')" />
      <Button name="Import Ledger" variant="link" @click="goTo('/ledger')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Welcome',
  components: {
    Button,
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
  },
});
</script>
<style scoped>
.wordmark {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

h1 {
  position: relative;
  display: block;
  width: 327px;
  height: 72px;
  top: 32px;

  /* 📕title/2 bold */

  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 127%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.02em;

  /* dark/text */

  color: #ffffff;

  /* Inside Auto Layout */

  flex: none;
  align-self: stretch;
  flex-grow: 0;
  margin: 0px 0px;
}

.buttons > *:not(:last-child) {
  margin-bottom: 16px;
  display: block;
}

:deep(.button-link) {
  height: 48px;
}
</style>