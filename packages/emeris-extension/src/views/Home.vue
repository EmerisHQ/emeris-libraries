<template>
  <div class="home">    
    <EmerisApp/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EmerisApp from '@/components/EmerisApp.vue';

export default defineComponent({
  name: "Home",
  components: {EmerisApp}

});
</script>
