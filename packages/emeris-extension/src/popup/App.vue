<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent,onMounted } from "vue";

import EmerisApp from "@/components/EmerisApp.vue";
import { useStore } from "@/store";
import { GlobalActionTypes } from "@/store/extension/action-types";

export default defineComponent({
  name: "App",
  components: { EmerisApp },
  setup() {
    const store=useStore();
    onMounted(()=> {
      store.dispatch(GlobalActionTypes.GET_PENDING);
    });
  }
});
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
