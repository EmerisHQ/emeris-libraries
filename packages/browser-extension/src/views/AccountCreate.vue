<template>
  <div class="page">
    <Header title="Account Name" />
    <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
      >If you have multiple accounts this will help you to find the right one</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="name" />
      <span class="form-info error" v-if="error">Name already in use</span>
    </div>
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <div style="margin-bottom: 32px; display: flex" class="terms-of-use">
        <Icon
          name="InformationIcon"
          style="margin-right: 9px; transform: rotate(180deg)"
          icon-size="1"
          class="secondary-text"
        />
        <div>
          <span class="secondary-text">By continuing you agree to </span
          ><a href="/" @click.prevent="open('https://emeris.com/terms')" style="opacity: 1">Terms of Use</a
          ><span class="secondary-text"> & </span
          ><a href="" @click.prevent="open('https://emeris.com/privacy')">Privacy Policy</a
          ><span class="secondary-text"> of Emeris wallet</span>
        </div>
      </div>
      <Button name="Continue" :disabled="!name" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { EmerisAccount } from '@@/types';
import * as bip39 from 'bip39';

import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { GlobalActionTypes } from '@@/store/extension/action-types';
import { RootState } from '@@/store';
import { AccountCreateStates } from '@@/types';
import { memoryStore } from '@@/store/customStore';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';

export default defineComponent({
  name: 'Create Account',
  components: { Button, Input, Header, Icon },
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
      newAccount: (state: RootState) => state.extension.newAccount,
    }),
    error() {
      return this.wallet && this.wallet.find(({ accountName }) => accountName === this.name);
    },
  },
  data: () => ({
    name: 'Account X',
  }),
  watch: {
    name(name) {
      this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, {
        ...this.newAccount,
        accountName: name,
      });
    },
  },
  async mounted() {
    const hasTempPassword = memoryStore.get('EMERIS_TEMP_PASSWORD');
    if (!hasTempPassword) {
      this.$router.push({ path: '/passwordCreate', query: { returnTo: this.$route.path } });
    }

    const accounts = (await this.$store.dispatch(GlobalActionTypes.GET_WALLET)) || [];
    this.name = this.newAccount?.accountName || 'Account ' + (accounts.length + 1);
  },
  methods: {
    async submit() {
      if (this.error) return;

      try {
        let storedMnemonic, wallet;
        try {
          const pw = memoryStore.getAndDelete('EMERIS_TEMP_PASSWORD');
          if (!pw) throw new Error('Password was not persisted');

          //  will throw if not imported account
          try {
            storedMnemonic = await this.$store.dispatch(GlobalActionTypes.GET_MNEMONIC, {
              accountName: 'EMERIS_PRIVATE_TEMP',
              password: pw,
            });
            if (!storedMnemonic) throw new Error('failed to fetch mnemonic');
          } catch (e) {
            storedMnemonic = bip39.generateMnemonic(256);
          }
        } catch (e) {
          // TODO : Probably better to send the user back to the start than assigning a new mnemonic?
          storedMnemonic = bip39.generateMnemonic(256);
          console.error('Error while retrieving/generating mnemonic', e);
        }
        await this.$store.dispatch(GlobalActionTypes.CREATE_ACCOUNT, {
          account: {
            accountName: this.name,
            accountMnemonic: storedMnemonic, // will be overwritten by existing new account
            isLedger: false,
            setupState: wallet?.setupState || AccountCreateStates.CREATED, // if this is an import we don't need to check if the user backed up the mnemonic
            ...this.newAccount,
          },
        });
        //  remove temp account
        await this.$store.dispatch(GlobalActionTypes.REMOVE_ACCOUNT, { accountName: 'EMERIS_PRIVATE_TEMP' });
        // if the account is imported we don't need to show the backup seed screen
        let nextRoute;
        if (this.newAccount.setupState === AccountCreateStates.COMPLETE) {
          nextRoute = '/accountReady';
        } else {
          nextRoute = '/backup?new=true';
        }
        await this.$store.dispatch(GlobalActionTypes.SET_NEW_ACCOUNT, undefined); // remove new account from flow
        this.$router.push(nextRoute);
      } catch (err) {
        console.error(err);
      }
    },
    open(url) {
      window.open(url);
    },
  },
});
</script>
<style scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
