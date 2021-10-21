<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent,onMounted } from "vue";

import EmerisApp from "@/components/EmerisApp.vue";
import { useExtensionStore } from "@/store";
import { GlobalActionTypes } from "@/store/extension/action-types";

export default defineComponent({
  name: "App",
  components: { EmerisApp },
  setup() {
    const store=useExtensionStore();
    onMounted(()=> {
      store.dispatch(GlobalActionTypes.GET_PENDING);
      browser.runtime.onMessage.addListener((message,sender)=> {
         if (message.type == 'toPopup' && message.data.action=='update') {
           store.dispatch(GlobalActionTypes.GET_PENDING);
         }
      });
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
