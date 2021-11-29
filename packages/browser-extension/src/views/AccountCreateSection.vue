<template>
  <div class="buttons">
    <router-link :to="{ name: 'Create Wallet' }">
      <Button name="Create Account" />
    </router-link>
    <router-link :to="{ name: 'Account Import' }">
      <Button name="Import Account" variant="secondary" />
    </router-link>
    <router-link :to="{ name: 'Import Ledger' }">
      <Button name="Import Ledger" variant="link" />
    </router-link>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Account Create Section',
  components: {
    Button,
  },
});
</script>

<style lang="scss" scoped>
.buttons > *:not(:last-child) {
  margin-bottom: 16px;
  display: block;
}
</style>