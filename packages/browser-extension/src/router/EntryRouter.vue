<template>Loading ...</template>

<script>
import { GlobalActionTypes } from '@@/store/extension/action-types';
export default {
  methods: {
    async route() {
      const pending = await this.$store.dispatch(GlobalActionTypes.GET_PENDING);
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // if able to load the wallet, the extension is unlocked

      // if the use has a password set but the extension is not unlocked
      if (hasWallet && !wallet) {
        this.$router.push('/welcomeBack');
      }
      // if there are pending requests show those first
      else if (pending.length > 0) {
        switch (pending[0].action) {
          case 'enable':
            this.$router.push({ path: '/whitelist', query: { url: pending[0].data.origin } });
            break;
          default:
            this.$router.push('/portfolio');
        }
      }
      // if the user has not yet created an account
      else if (!hasWallet || (wallet && wallet.length === 0)) {
        this.$router.push('/welcome');
        // extension is ready to use
      } else if (wallet) {
        this.$router.push('/portfolio');
      } else {
        this.error = true;
      }
    },
  },
  async mounted() {
    this.route();
  },
};
</script>

<style>
</style>