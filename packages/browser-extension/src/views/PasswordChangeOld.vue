<template>
  <div class="page">
    <Header title="Password" />
    <div @keyup.enter="submit" class="form">
      <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px">Enter your password</span>
      <div style="margin-bottom: 16px">
        <Input v-model="password" placeholder="Password" type="password" />
        <span class="form-info error" v-if="error">The password is wrong</span>
      </div>
      <div
        :style="{
          marginTop: 'auto',
        }"
      >
        <Button type="submit" name="Continue" @click="submit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Password Old',
  components: { Button, Input, Header },
  data: () => ({
    password: '',
    error: false,
  }),
  methods: {
    async submit() {
      this.error = false;
      const wallet = await this.$store.dispatch(GlobalActionTypes.UNLOCK_WALLET, { password: this.password });
      if (wallet) {
        this.$router.push('/passwordChange/new');
      } else {
        this.error = true;
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
