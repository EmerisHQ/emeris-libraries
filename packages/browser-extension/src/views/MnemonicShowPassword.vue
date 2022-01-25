<template>
  <div class="page">
    <Header title="Back up account" />
    <span class="secondary-text" style="margin-bottom: 36px"
      >If your device is lost or stolen, you will be able to recover your wallet. Write down your sentence on a paper or
      in a password manager</span
    >
    <Input v-model="password" placeholder="Password" type="password" />
    <div v-if="error" style="color: #ff6072; margin-top: 16px; text-align: center">Incorrect word. Try again.</div>

    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <ListCard
        :img="require(`@@/assets/Secure.png`)"
        caption="Never share your recovery phrase with anyone, store it securily."
      />
      <Button name="Show Mnemonic" @click="submit" />
      <Button name="Cancel" variant="link" @click="$router.go(-1)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import Input from '@/components/ui/Input.vue';
import ListCard from '@@/components/ListCard.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';

export default defineComponent({
  name: 'Mnemonic Show Password',
  data: () => ({
    password: undefined,
    error: false,
  }),
  components: {
    Button,
    Header,
    Input,
    ListCard,
  },
  computed: {
    account() {
      return this.$store.getters[GlobalGetterTypes.getAccount];
    },
  },
  methods: {
    async submit() {
      this.error = false;
      try {
        await this.$store.dispatch(GlobalActionTypes.GET_MNEMONIC, {
          accountName: this.account.accountName,
          password: this.password,
        });
        this.$router.push('/backup/show');
      } catch (e) {
        this.error = true;
      }
    },
  },
});
</script>
