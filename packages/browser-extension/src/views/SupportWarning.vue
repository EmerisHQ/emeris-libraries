<template>
  <div class="page">
    <Header :title="$route.query.caption" backTo="/settings" />
    <div style="margin-top: 100px; text-align: center">
      <Icon name="WarningTriangleIcon" icon-size="2" style="color: #fc8c0b; margin-bottom: 24px" />
      <h1 style="margin-bottom: 24px">Emeris support team will never ask you your recovery phrase</h1>
      <span class="secondary-text">Please make sure to kepp it secret and store it in a secure place</span>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button :name="'Continue to ' + $route.query.caption" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';

export default defineComponent({
  name: 'Support Warning',
  components: {
    Button,
    Icon,
    Header,
  },
  methods: {
    async submit() {
      window.open(this.$route.query.url, '_blank');
    },
  },
});
</script>
<style lang="scss" scoped>
:deep(.reset-btn button) {
  background: #ff3d56 !important;
}
</style>
