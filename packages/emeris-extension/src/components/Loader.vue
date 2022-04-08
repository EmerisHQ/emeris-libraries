<template>
  <div style="position: fixed; width: 100%; height: 100%; background-color: var(--bg); top: 0; left: 0">
    <EphemerisSpinner
      style="width: 200px; margin-left: auto; margin-right: auto; margin-bottom: 100px; margin-top: 100px"
    />
    <div style="text-align: center; width: 100%; margin-top: 28px">
      <span class="secondary-text">Please wait</span>
    </div>
  </div>
</template>

<script>
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
export default {
  components: { EphemerisSpinner },
  name: 'Loader',
};
</script>

<style></style>
