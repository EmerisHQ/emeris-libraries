<template>
  <div class="page">
    <img
      style="margin-top: 156px; margin-bottom: 28px; margin-left: auto; margin-right: auto; width: 46px"
      :src="'/images/CheckIcon.svg'"
    />
    <h1 style="margin-bottom: 20px" name>Password changed</h1>
    <div class="secondary-text" style="text-align: center; margin-bottom: 24px">
      You have successfully changed your password.
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <router-link to="/security">
        <Button name="Ok" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Password Changed',
  data: () => ({
    error: false,
  }),
  components: {
    Button,
  },
});
</script>
<style scoped></style>
