<template>
  <div class="page">
    <Header title="Import account">
      <!-- <router-link to="/accountImport/advanced">
        <a>Advanced</a>
      </router-link> -->
    </Header>
    <img
      :src="require(`@@/assets/ImportLedgerBG.png`)"
      :style="{
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
      }"
    />
    <div
      style="margin-bottom: 56px; margin-top: 72px; margin-left auto; margin-right: auto; display: block; margin-left: auto;"
    >
      <img :src="require('@@/assets/LedgerBox.png')" style="width: 151px" />
    </div>
    <ListCard :img="require(`@@/assets/Step1.svg`)" caption="Unlock & connect your Ledger device with your computer" />
    <ListCard :img="require(`@@/assets/Step2.svg`)" caption="Open the ‘Cosmos’ app on your Ledger device" />
    <a class="secondary-text" style="margin-top: 24px">Having trouble connecting your Ledger?</a>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <router-link to="/ledger/connect">
        <Button name="Connect Ledger" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import ListCard from '@@/components/ListCard.vue';
import Slideout from '@@/components/Slideout.vue';

export default defineComponent({
  name: 'Connect Ledger',
  components: { ListCard, Header, Button, Slideout },
});
</script>
