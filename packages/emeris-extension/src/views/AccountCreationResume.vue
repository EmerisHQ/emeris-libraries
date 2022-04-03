<template>
  <ConfirmationScreen
    title="Continue creating your account?"
    subtitle="You closed the extension window before finishing your account creation. Do you wish to continue?"
  >
    <template #icon>
      <img
        :src="'/images/DotsIcon.svg'"
        style="width: 46px; margin-left: auto; margin-right: auto; margin-bottom: 35px"
      />
    </template>
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Continue" @click="resume" />
      <Button name="Cancel" variant="link" @click="abort" />
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';

export default defineComponent({
  name: 'Account Creation Resume',
  components: {
    Button,
    ConfirmationScreen,
  },
  methods: {
    async resume() {
      const newAccount = await this.$store.dispatch(GlobalEmerisActionTypes.GET_NEW_ACCOUNT);
      if (newAccount.route.startsWith('/ledger')) {
        window.open('popup.html#' + newAccount.route);
      } else {
        this.$router.push(newAccount.route);
      }
    },
    async abort() {
      this.$store.dispatch(GlobalEmerisActionTypes.SET_NEW_ACCOUNT, undefined);
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
