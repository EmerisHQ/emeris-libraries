<template>
  <div class="header-container">
    <slot name="backButton">
      <div class="back-button" @click="goBack">
        <Icon name="CaretLeftIcon" :icon-size="1" class="ml-2" />
      </div>
    </slot>
    <span class="title">{{ title }}</span>
    <div class="additional-button" style="position: absolute; right: 16px">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Header',
  props: {
    title: { type: String, required: true },
    backTo: { type: String, required: false, default: undefined },
  },
  components: {
    Icon,
  },
  methods: {
    goBack() {
      this.backTo ? this.$router.push(this.backTo) : this.$router.go(-1);
    },
  },
});
</script>

<style>
.header-container {
  width: 100%;
  padding-bottom: 24px;
  display: flex;
  align-content: space-between;
}
.title {
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
}
.back-button {
  margin-left: -11px;
  margin-right: -20px;
  margin-top: 4px;
}
</style>
