<template>
  <div class="page">
    <img :src="require(`@@/assets/UnlockBG.png`)" class="background" />
    <Icon style="color: #89ff9b; margin-top: 156px; margin-bottom: 28px" name="InformationIcon" :icon-size="2" />
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
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Password Changed',
  data: () => ({
    error: false,
  }),
  components: {
    Button,
    Icon,
  },
});
</script>
<style scoped></style>
