<template>
  <ConfirmationScreen title="Continue creating your account?">
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Continue" @click="resume" />
      <Button name="Abort account creation" variant="link" @click="abort" />
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Account Creation Resume',
  components: {
    Button,
    ConfirmationScreen,
  },
  methods: {
    async resume() {
      const newAccount = await this.$store.dispatch(GlobalActionTypes.GET_NEW_ACCOUNT);
      this.$router.push(newAccount.route);
    },
    async abort() {
      this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, undefined);
      this.$router.push('/');
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
