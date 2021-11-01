<template>
  <div class="home">
    <Brandmark />
    <CreateWallet />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Brandmark from '@/components/common/Brandmark.vue';
import CreateWallet from '@@/components/CreateWallet.vue';

export default defineComponent({
  name: 'Wallet',
  components: { CreateWallet, Brandmark },
});
</script>
