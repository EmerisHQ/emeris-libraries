<template>
  <div class="page">
    <Header title="" />
    <h1>Managed connected sites</h1>
    <div class="website" v-for="site in whitelistedWebsites" :key="site.origin">
      <Brandmark class="wordmark" style="margin-top: auto; margin-bottom: auto; margin-right: 18px" />
      <div style="display: flex; flex-direction: column">
        <span>{{ site.origin }}</span>
        <span style="opacity: 67%">{{ site.origin }}</span>
        <a @click="$router.push('/whitelisted/remove/' + site.origin)" style="color: #ff6072">disconnect</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Whitelisted Pages',
  components: {
    Brandmark,
    Header,
    Button,
  },
  computed: {
    whitelistedWebsites() {
      return this.$store.state.extension.whitelistedWebsites;
    },
  },
  mounted() {
    this.$store.dispatch(GlobalActionTypes.GET_WHITELISTED_WEBSITES);
  },
});
</script>
<style lang="scss" scoped>
.website {
  padding: 24px;

  background: linear-gradient(0deg, #171717 0%, #040404 100%);
  mix-blend-mode: normal;

  box-shadow: 3px 9px 32px -4px rgba(0, 0, 0, 0.07);
  border-radius: 10px;

  margin-bottom: 24px;

  display: flex;
}
</style>