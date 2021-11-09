<template>
  <div class="home">
    <Brandmark />
    <UnlockWallet />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Brandmark from '@/components/common/Brandmark.vue';
import UnlockWallet from '@@/components/UnlockWallet.vue';

export default defineComponent({
  name: 'Unlock',
  components: { UnlockWallet, Brandmark },
});
</script>
