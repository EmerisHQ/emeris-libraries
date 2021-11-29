<template>
  <ConfirmationScreen title="Create or import another wallet in your extension">
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <AccountCreateSection />
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import AccountCreateSection from '@@/views/AccountCreateSection.vue';

export default defineComponent({
  name: 'Account Add Additional',
  components: {
    Button,
    ConfirmationScreen,
    AccountCreateSection,
  },
});
</script>