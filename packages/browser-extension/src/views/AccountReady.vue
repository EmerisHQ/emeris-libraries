<template>
  <div class="page">
    <img :src="require(`@@/assets/UnlockBG.png`)" class="background" />
    <Icon style="color: #89ff9b; margin-top: 156px" name="InformationIcon" :icon-size="2" />
    <h1 style="margin-bottom: 20px" name>You’re all set</h1>
    <div class="secondary-text" style="text-align: center; margin-bottom: 24px">
      You have successfully created and backed up your new wallet. Enjoy exploring the new era of DeFi with Emeris.
    </div>
    <router-link to="/portfolio">
      <Button name="Go to portfolio" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Account Ready',
  components: {
    Button,
    Icon,
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
