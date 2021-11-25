<template>
  <div class="page">
    <Header title="Forgot Password" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >There is no way to recover your lost or forgotten password<br /><br />If you have backed up the recovery phrase
      for your accounts, you can import them again by resetting this wallet</span
    >
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <router-link to="/extensionReset/confirm">
        <Button name="Reset wallet" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';

export default defineComponent({
  name: 'Extension Reset',
  components: {
    Button,
    Header,
  },
});
</script>