<template>
  <div class="page">
    <Header title="Back up account" />
    <span class="secondary-text" style="margin-bottom: 16px"
      >If your device is lost or stolen, you will be able to recover your wallet</span
    >
    <ListCard
      :img="require(`@@/assets/NeverShare.png`)"
      caption="Emeris wallet will never ask you to share your recovery phrase."
    />
    <ListCard
      :img="require(`@@/assets/Secure.png`)"
      caption="Never share your recovery phrase with anyone, store it securily."
    />
    <ListCard
      :img="require(`@@/assets/Backup.png`)"
      caption="If you don’t backup your wallet, or loose your recovery phrase, you will not able to recover your walle"
    />

    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Continue" @click="goToShowMnemonic" />
      <Button name="Back up later" variant="link" @click="() => (backUpLater = true)" />
    </div>

    <Slideout :open="backUpLater">
      <h1 style="margin-bottom: 16px">Back up later</h1>
      <div class="secondary-text" style="margin-bottom: 24px; text-align: center">
        You may not be able to recover your account if you have not backed up your recovery phrase.
      </div>

      <Checkbox
        style="margin-bottom: 24px"
        v-model="checked"
        label="I have backed up my recovery phrase, I understand that if I loose my recovery phrase, I will loose my
          fund"
      />
      <div class="buttons">
        <Button name="Continue" :disabled="!checked" @click="() => $router.push('/accountReady')" />
        <Button name="Go back" variant="link" @click="() => (backUpLater = false)" />
      </div>
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ListCard from '@@/components/ListCard.vue';
import Slideout from '@@/components/Slideout.vue';
import Header from '@@/components/Header.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { MutationTypes } from '@@/store/extension/mutation-types';

export default defineComponent({
  name: 'Welcome',
  data: () => ({
    backUpLater: false,
    checked: false,
  }),
  components: {
    Button,
    ListCard,
    Header,
    Checkbox,
    Slideout,
  },
  methods: {
    goToShowMnemonic() {
      // TEMPORARY FOR DEV PURPOSES
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, {
        walletName: 'new',
        walletMnemonic: `alien settle divert turtle six weekend alien settle divert turtle six weekend weekend wife garment october weekend weekend wife garment october weekend weekend wife garment`,
      });
      this.$router.push({
        path: '/backup/show',
      });
    },
  },
});
</script>