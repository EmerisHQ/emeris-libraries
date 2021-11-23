<template>
  <div
    v-if="open"
    class="flex content-center items-center fixed overflow-y-auto h-full w-full"
    style="top: 0; left: 0; z-index: 1000"
  >
    <!--Overlay Effect-->
    <div
      class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
      style="background: black; top: 0; left: 0; opacity: 64%"
      @click="close"
    ></div>

    <!--modal content-->
    <div class="shadow-lg rounded-md" style="z-index: 1; margin-left: 24px; margin-right: 24px; background: #262626">
      <div class="text-center" style="padding-top: 19px">
        <h3 style="font-size: 16px; font-weight: 700; line-height: 21px; letter-spacing: 0em; text-align: center">
          {{ title }}
        </h3>
        <p
          style="
            font-size: 13px;
            line-height: 130.7%;

            text-align: center;

            color: rgba(255, 255, 255, 0.667);
            margin-top: 8px;
            margin-bottom: 18px;
          "
        >
          {{ description }}
        </p>
        <div class="items-center px-4 py-3" @click="close" style="cursor: pointer; border-top: 0.5px solid #ffffff17">
          <a> OK </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    open: { type: Boolean, required: true },
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style>
</style>