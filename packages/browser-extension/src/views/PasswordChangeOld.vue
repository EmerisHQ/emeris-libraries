<template>
  <div class="page">
    <Header title="Password" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px">Enter your password</span>
    <div style="margin-bottom: 16px">
      <Input v-model="password" placeholder="Password" />
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

import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Password Old',
  components: { Button, Input, Header },
  data: () => ({
    password: '',
  }),
  methods: {
    async submit() {
      // TODO
      this.$router.push('/passwordChange/new');
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
