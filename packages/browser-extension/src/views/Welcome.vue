<template>
  <div
    :style="{
      'background-image': 'url(' + require(`@@/assets/WelcomeBG.png`) + ')',
      height: '100%',
      position: 'absolute',
      width: '100%',
    }"
  >
    <img class="wordmark" :src="require(`@@/assets/EmerisWordmark.svg`)" />
    <h1>Experience the power of cross-chain DeFi</h1>

    <div
      :style="{
        position: 'absolute',
        width: '100%',
        bottom: '24px',
      }"
      class="buttons"
    >
      <router-link :to="{ name: 'Create Wallet' }">
        <Button name="Create Account" @click="goTo('/create')" />
      </router-link>
      <Button name="Import Account" variant="secondary" />
      <Button name="Import Ledger" variant="link" />
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
      this.router.push(route);
    },
  },
});
</script>
<style scoped>
.wordmark {
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
h1 {
  position: relative;
  display: block;
  width: 327px;
  height: 72px;
  left: 24px;
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
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 0px 0px;
}

.buttons {
  padding-left: 24px;
  padding-right: 24px;
}
.buttons > *:not(:last-child) {
  margin-bottom: 16px;
  display: block;
}

:deep(.button-link) {
  height: 48px;
}
</style>