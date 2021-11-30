<template>
  <div class="page">
    <Header title="Accounts">
      <a @click="edit = true" v-if="!edit">Edit</a>
      <a @click="edit = false" v-else>Done</a>
    </Header>
    <div v-for="account in wallets" :key="account.walletName" class="wallet" @click="goToAccount(wallet)">
      <img :src="require('@@/assets/Avatar.svg')" />
      <div>
        <h2 style="font-weight: 600">{{ account.walletName }}</h2>
        <span class="secondary-text" v-if="account.backedUp">$12,345.67</span>
        <span class="secondary-text" style="color: #ff6072; opacity: 1; font-size: 13px" v-else
          >$12,345.67 - Not backed up</span
        >
      </div>
      <Icon
        style="margin-left: auto; cursor: pointer"
        name="ThreeDotsIcon"
        :icon-size="1.5"
        @click="editWallet = account"
        v-if="edit"
      />
      <div style="margin-left: auto; line-height: 48px" v-else-if="account">✓</div>
    </div>
    <div style="margin-top: auto">
      <Button name="Add account" @click="addAccount" />
    </div>
    <Slideout :open="!!editWallet">
      <Button name="Remove account" variant="link" @click="removeAccount" />
      <Button name="Edit wallet name" variant="link" @click="renameAccount" />
      <div style="font-weight: 600">
        <Button name="Close" variant="link" @click="editWallet = null" />
      </div>
    </Slideout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';
import Slideout from '@@/components/Slideout.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';
import { MutationTypes } from '@@/store/extension/mutation-types';

export default defineComponent({
  name: 'Accounts',
  computed: {
    ...mapState({
      wallets: (state: RootState) => state.extension.wallets,
      wallet: (state: RootState) => state.extension.wallet,
    }),
    editWalletIndex() {
      return this.editWallet
        ? this.wallets.findIndex((wallet) => wallet.walletName === this.editWallet.walletName)
        : undefined;
    },
  },
  data: () => ({
    editWallet: undefined,
    edit: false,
  }),
  components: {
    Button,
    Icon,
    Header,
    Slideout,
  },
  methods: {
    addAccount() {
      this.$router.push('/accountAddAdditional');
    },
    removeAccount() {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, this.editWallet);
      this.$router.push('/accountRemove/' + this.editWalletIndex);
    },
    renameAccount() {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, this.editWallet);
      this.$router.push('/accountRename/' + this.editWalletIndex);
    },
    goToAccount(wallet) {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, wallet);
      this.$router.push('/account');
    },
  },
});
</script>
<style lang="scss" scoped>
.wallet {
  display: flex;
  margin-bottom: 24 px;

  img {
    height: 48px;
    width: 48px;
    margin-right: 16px;
    margin-top: 2px;
  }
}
</style>