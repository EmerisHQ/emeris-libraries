<template>
  <ConfirmationScreen title="Welcome back" subtitle="Experience the power of cross-chain DeFi">
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
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import Input from '@/components/ui/Input.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Welcome Back',
  data: () => ({
    error: false,
    password: '',
  }),
  components: {
    Button,
    Input,
    ConfirmationScreen,
  },
  methods: {
    async checkPassword() {
      const wallet = await this.$store.dispatch(GlobalActionTypes.UNLOCK_WALLET, { password: this.password });
      if (wallet) {
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