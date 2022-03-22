<template>
  <div class="buttons">
    <router-link :to="{ name: 'Create Wallet' }">
      <Button name="Create Account" />
    </router-link>
    <router-link :to="{ name: 'Account Import' }">
      <Button name="Import Account" variant="secondary" />
    </router-link>
    <!-- <router-link :to="{ name: 'Import Ledger' }"> -->
    <!-- <router-link :to="undefined"> -->
    <Button name="Import Ledger" variant="link" @click="openLedgerScreen()" />
    <!-- </router-link> -->
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
  methods: {
    // to access USB we need to open a tab, the popup can't access USB
    openLedgerScreen() {
      window.open('popup.html/#/ledger?next=/ledger/connect', '_blank');
    },
  },
});
</script>

<style lang="scss" scoped>
.buttons > *:not(:last-child) {
  margin-bottom: 16px;
  display: block;
}
</style>
