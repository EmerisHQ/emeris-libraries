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

export default defineComponent({
  name: 'Account Creation Resume',
  components: {
    Button,
    ConfirmationScreen,
  },
  methods: {
    async resume() {
      // const { route, wallet } = await this.$store.dispatch(GlobalActionTypes.GET_PARTIAL_ACCOUNT_CREATION);
      // this.$store.commit('extension/' + MutationTypes.SET_WALLET, wallet);
      // this.$router.push(route);
    },
    async abort() {
      // await this.$store.dispatch(GlobalActionTypes.SET_PARTIAL_ACCOUNT_CREATION, { wallet: undefined });
      this.$router.push('/accounts');
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
