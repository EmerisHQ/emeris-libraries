<template>
  <span @click="copy" style="cursor: pointer" :content="copied ? 'Copied to clipboard' : address" v-tippy>{{
    shortenedAddress
  }}</span>
</template>

<script>
export default {
  name: 'Address',
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    copied: undefined,
  }),
  computed: {
    shortenedAddress() {
      return this.address.substr(0, 10) + '...' + this.address.substr(-8, 8);
    },
  },
  methods: {
    // TODO refactor
    copy() {
      navigator.clipboard.writeText(this.address);
      if (this.copied) {
        clearTimeout(this.copied);
      }
      this.copied = setTimeout(() => {
        navigator.clipboard.writeText('');
        this.copied = null;
      }, 1000 * 2);
    },
  },
};
</script>

<style>
</style>