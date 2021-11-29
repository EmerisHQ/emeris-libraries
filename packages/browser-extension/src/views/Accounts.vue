<template>
  <div class="page">
    <Header title="Accounts" />
    <div v-for="wallet in wallets" :key="wallet.walletName" class="wallet">
      <img :src="require('@@/assets/Avatar.svg')" />
      <div>
        <h2 style="font-weight: 600">{{ wallet.walletName }}</h2>
        <span class="secondary-text" v-if="wallet.backedUp">$12,345.67</span>
        <span class="secondary-text" style="color: #ff6072; opacity: 1; font-size: 13px" v-else
          >$12,345.67 - Not backed up</span
        >
      </div>
      <Icon style="margin-left: auto" name="ThreeDotsIcon" :icon-size="1.5" @click="editWallet = wallet" />
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
    }),
  },
  data: () => ({
    editWallet: undefined,
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
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, this.editWallet); // TODO sets active wallet, which is unexpected UX? better go via route?
      this.$router.push('/accountRemove');
    },
    renameAccount() {
      this.$store.commit('extension/' + MutationTypes.SET_WALLET, this.editWallet); // TODO sets active wallet, which is unexpected UX? better go via route?
      this.$router.push('/accountRename');
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