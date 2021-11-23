<template>
  <div
    :style="{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <Header title="Import account">
      <!-- <router-link to="/accountImport/advanced">
        <a>Advanced</a>
      </router-link> -->
    </Header>
    <span style="margin-top: 16px; margin-bottom: 16px">Enter your recovery phrase</span>
    <div style="margin-bottom: 16px">
      <MnemonicInput v-model="seed" placeholder="Your recovery phrase" />
    </div>
    <span class="form-info error" v-if="invalidChar">Invalid character used</span>
    <a href="">What’s a recovery phrase?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Import" :disabled="!seed" @click="submit" />
    </div>
    <Modal
      title="Invalid recovery phrase"
      description="Check you have entered your recovery phrase correctly and try again."
      :open="invalidRecoveryPhraseWarning"
      @close="invalidRecoveryPhraseWarning = false"
    ></Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import CreateWallet from '@@/components/CreateWallet.vue';
import MnemonicInput from '@@/components/MnemonicInput.vue';
import Header from '@@/components/Header.vue';
import Modal from '@@/components/Modal.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Create Account',
  components: { CreateWallet, MnemonicInput, Header, Button, Modal },
  data: () => ({
    seed: undefined,
    invalidRecoveryPhraseWarning: false,
  }),
  watch: {
    seed(seed) {
      console.log(seed);
      this.invalidChar = !/^[a-z ]*$/.test(seed);
    },
  },
  async mounted() {
    const hasPasswod = await this.$store.dispatch(GlobalActionTypes.HAS_PASSWORD);

    if (!hasPasswod) {
      this.$router.push('/passwordCreate');
    }
  },
  methods: {
    submit() {
      this.$router.push({ path: '/passwordCreate', props: { seed: this.seed } });
    },
  },
});
</script>
<style lang="scss" scoped>
.form-info {
  &.error {
    color: #ff6072;
  }
  &.success {
    color: #89ff9b;
  }
}
</style>
