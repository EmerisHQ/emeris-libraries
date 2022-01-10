<template>
  <div class="page">
    <img :src="require(`@@/assets/UnlockBG.png`)" class="background" />
    <Brandmark class="wordmark" />

    <h1 style="margin-top: 100px; margin-bottom: 16px">{{ title }}</h1>
    <span style="color: #ffffffaa" v-if="subtitle">{{ subtitle }}</span>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Brandmark from '@/components/common/Brandmark.vue';

export default defineComponent({
  name: 'Confirmation',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false, default: undefined },
  },
  components: {
    Button,
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