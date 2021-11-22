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
      <router-link to="/accountImport/advanced">
        <a>Advanced</a>
      </router-link>
    </Header>
    <span style="margin-top: 16px; margin-bottom: 16px">Enter your recovery phrase</span>
    <div style="margin-bottom: 16px">
      <MnemonicInput v-model="seed" placeholder="Your recovery phrase" />
    </div>
    <a href="">What’s a recovery phrase?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Import" :disabled="!seed" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import CreateWallet from '@@/components/CreateWallet.vue';
import MnemonicInput from '@@/components/MnemonicInput.vue';
import Header from '@@/components/Header.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Create Account',
  components: { CreateWallet, MnemonicInput, Header, Button },
  data: () => ({
    seed: undefined,
  }),
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
