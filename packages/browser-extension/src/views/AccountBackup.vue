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
      <Button name="Back up now" @click="goToShowMnemonic" />
      <Button name="Back up later" variant="link" @click="backUpLater = true" />
    </div>

    <Slideout v-bind:open="backUpLater" v-on:update:open="backUpLater = $event">
      <h1 style="margin-bottom: 16px">Back up later</h1>
      <div class="secondary-text" style="margin-bottom: 24px; text-align: center">
        You may not be able to recover your account if you have not backed up your recovery phrase.
      </div>

      <Checkbox
        style="margin-bottom: 24px"
        v-model="checked"
        label="I understand if I don’t back up my account, or if I lost my recovery phrase, I will lose access to my account."
      />
      <div class="buttons">
        <Button name="Continue" :disabled="!checked" @click="() => $router.push('/account')" />
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
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { AccountCreateStates } from '@@/types';

export default defineComponent({
  name: 'Welcome',
  computed: {
    account() {
      return this.$store.getters[GlobalGetterTypes.getAccount];
    },
  },
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
    onContinue() {
      if (this.account && this.account.setupState !== AccountCreateStates.COMPLETE) {
        const localStorageKey = `nextBackupCheck-${this.account.accountName}`;
        const nowInSeconds = Math.floor(Date.now() / 1000);
        //  display next backup check in an hour
        window.localStorage.setItem(localStorageKey, `${nowInSeconds + 60 * 60}`);
      }
      this.$router.push('/accountReady');
    },
    goToShowMnemonic() {
      this.$router.push({
        // if this is a new account we don't force to reenter the password
        path: this.$route.query.new ? '/backup/show' : '/backup/password',
      });
    },
  },
});
</script>

<style>
/* overrides checkbox component label class */
.leading-copy {
  font-size: 13px;
}
/* overrides disabled button component background and text color */
.text-inactive {
  background-color: #333333;
  color: #ffffff;
}
</style>
