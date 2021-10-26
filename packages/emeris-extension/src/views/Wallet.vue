<template>
  <div class="home">
    <CreateWallet/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CreateWallet from '@/components/CreateWallet.vue';

export default defineComponent({
  name: 'Wallet',
  components: { CreateWallet },
});
</script>
