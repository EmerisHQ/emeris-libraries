<template>
  <div class="page">
    <img :src="require(`@@/assets/UnlockBG.png`)" class="background" />

    <div style="margin-top: 100px; text-align: center">
      <slot name="icon"></slot>
      <h1 style="margin-bottom: 8px">{{ title }}</h1>
      <span style="color: #ffffffaa" v-if="subtitle">{{ subtitle }}</span>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Brandmark from '@/components/common/Brandmark.vue';

export default defineComponent({
  name: 'Confirmation',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false, default: undefined },
  },
  components: {
    Brandmark,
  },
});
</script>
<style scoped>
.wordmark {
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
