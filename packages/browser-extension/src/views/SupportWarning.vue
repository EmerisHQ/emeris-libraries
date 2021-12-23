<template>
  <div class="page">
    <div style="margin-top: 100px">
      <Icon name="WarningTriangleIcon" icon-size="2" />
      <h1>Emeris support team will never ask you your recovery phras</h1>
      <span class="secondary-text">Please make sure to kepp it secret and store it in a secure place</span>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button class="reset-btn" name="Yes" @click="submit" />
      <Button name="No" variant="link" @click="$router.go(-1)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Support Warning',
  components: {
    Button,
    Icon,
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