<template>
  <div class="page">
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
      <div :class="{ error: error }">
        <Input type="password" v-model="password" placeholder="Enter Password" />
      </div>
      <span class="form-info error" v-if="error">Wrong Password</span>
      <Button name="Unlock" @click="checkPassword" />
      <router-link to="/extensionReset">
        <Button name="Forgot Password" variant="link" />
      </router-link>
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
</style>