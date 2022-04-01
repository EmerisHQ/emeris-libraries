<template>
  <div class="page">
    <Header title="Import account" :backTo="$route.query.backto" />
    <div style="margin-bottom: 56px; margin-top: 150px; display: flex; flex-direction: column; align-items: center">
      <img :src="import('@@/assets/LedgerBox.svg')" style="width: 151px; margin-top: 32px" />
      <div style="text-align: center; margin-top: 32px">
        <span>{{ $route.query.error }}</span>
        <br />
        <span class="secondary-text">Please try again or contact our Emeris support</span>
        <br />
        <a
          href=""
          @click="$router.push({ path: '/support', query: { url: 'https://emeris.com/support', caption: 'Support' } })"
          >Visit Emeris Support ↗️</a
        >
      </div>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Button name="Try again" @click="$router.push($route.query.retry)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Ledger Error',
  components: {
    Header,
    Button,
  },
});
</script>

<style lang="scss" scoped>
.loader {
  animation-name: spin;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
