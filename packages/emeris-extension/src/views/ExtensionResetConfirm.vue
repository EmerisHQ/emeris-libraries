<template>
  <div class="page">
    <div style="margin-top: 100px">
      <Icon name="InformationIcon" icon-size="2" style="margin-bottom: 24px" />
      <h1>Are you sure you want to reset your wallet?</h1>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button class="reset-btn" name="Reset wallet" @click="submit" style="margin-bottom: 24px" />
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

import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Extension Reset',
  components: {
    Button,
    Header,
    Icon,
  },
  methods: {
    async submit() {
      await this.$store.dispatch(GlobalEmerisActionTypes.EXTENSION_RESET);
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
