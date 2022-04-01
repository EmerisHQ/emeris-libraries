<template>
  <div class="page">
    <img :src="import(`@@/assets/WelcomeBG.png`)" class="background" />
    <img class="wordmark" :src="import(`@@/assets/EmerisWordmark.svg`)" style="margin-top: 48px" />

    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <AccountCreateSection />
      <div style="text-align: center; margin-top: 16px; font-size: 13px">
        Need help? Visit <a href="" @click="open('https://support.emeris.com/')">Emeris Support</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountCreateSection from '@@/views/AccountCreateSection.vue';

export default defineComponent({
  name: 'Welcome',
  components: {
    AccountCreateSection,
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
    open(url) {
      window.open(url);
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

:deep(.button-link) {
  height: 48px;
}
</style>
