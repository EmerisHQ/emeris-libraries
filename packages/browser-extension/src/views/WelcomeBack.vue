<template>
  <div
    :style="{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <img
      :src="require(`@@/assets/UnlockBG.png`)"
      style="max-width: 200%"
      :style="{
        position: 'fixed',
        zIndex: -1,
        // accounting for padding
        top: '-24px',
        left: '-24px',
        width: 'calc(100% + 24px)',
      }"
    />
    <Brandmark class="wordmark" />

    <h1 style="margin-top: 100px; margin-bottom: 16px">Welcome back</h1>
    <span style="color: #ffffffaa">Experience the power of cross-chain DeFi</span>

    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Input type="password" v-model="password" placeholder="Enter Password" />
      <Button name="Unlock" @click="checkPassword" />
      <Button name="Forgot Password" variant="link" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Brandmark from '@/components/common/Brandmark.vue';
import Input from '@/components/ui/Input.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Welcome',
  data: () => ({
    error: false,
  }),
  components: {
    Button,
    Brandmark,
    Input,
  },
  methods: {
    async checkPassword() {
      const result = await this.$store.dispatch(GlobalActionTypes.CHECK_PASSWORD, this.password);
      if (result) {
        this.$router.push('/');
      } else {
        this.error = true;
      }
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