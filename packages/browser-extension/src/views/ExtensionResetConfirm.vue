<template>
  <div class="page">
    <Header title="Reset Wallet" />
    <div style="margin-top: 100px">
      <Icon name="InformationIcon" icon-size="2" />
      <h1>Are you sure you want to reset your wallet?</h1>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button class="reset-btn" name="Reset wallet" @click="submit" />
      <router-link to="/">
        <Button name="Cancel" variant="link" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import Icon from '@/components/ui/Icon.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Extension Reset',
  components: {
    Button,
    Header,
    Icon,
  },
  methods: {
    async submit() {
      await this.$store.dispatch(GlobalActionTypes.EXTENSION_RESET);
      this.$router.push('/welcome');
    },
  },
});
</script>
<style lang="scss" scoped>
:deep(.reset-btn button) {
  background: #ff3d56 !important;
}
</style>
