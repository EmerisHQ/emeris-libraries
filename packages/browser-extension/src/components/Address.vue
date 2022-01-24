<template>
  <span>{{ shortenedAddress }}</span>
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
  computed: {
    shortenedAddress() {
      return this.address.substr(0, 10) + '...' + this.address.substr(-8, 8);
    },
  },
};
</script>

<style>
</style>