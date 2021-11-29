<template>
  <div>
    <div class="backdrop" v-if="open"></div>
    <div class="slideout" ref="slideout" :class="{ open: open }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slideout',
  props: {
    open: { type: Boolean, required: true },
  },
  mounted() {
    // we need to calculate the element size as it is dynamic based on the slot
    this.$refs.slideout.style.bottom = '-' + this.$refs.slideout.offsetHeight + 'px';
    this.$refs.slideout.style.visibility = 'inherit';
  },
};
</script>
<style lang="scss" scoped>
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 67%;
}
.slideout {
  visibility: hidden; // to not show before position is calculated
  background: #171717;
  border-radius: 16px 16px 0px 0px;
  position: fixed;
  //   bottom: -467px;
  width: 100%;
  left: 0;
  padding: 24px;
  transition: 0.6s;

  &.open {
    bottom: 0 !important;
  }
}
</style>