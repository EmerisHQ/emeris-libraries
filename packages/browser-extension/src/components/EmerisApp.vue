<template>
  <Loader />
</template>

<script lang="ts">
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { AccountCreateStates, ExtensionRequest } from '@@/types';
import { defineComponent, computed } from 'vue';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Loader from '@@/components/Loader.vue';

// TODO this component should be refactored into sth more speaking imo

export default defineComponent({
  name: 'EmerisApp',
  components: {
    Loader,
  },
  methods: {
    async route() {
      const pending = await this.$store.dispatch(GlobalActionTypes.GET_PENDING);
      const hasWallet = await this.$store.dispatch(GlobalActionTypes.HAS_WALLET); // checking if the password was set
      const wallet = await this.$store.dispatch(GlobalActionTypes.GET_WALLET); // if able to load the wallet, the extension is unlocked

      // if we are in a popup and there are no more pending requests, close
      if (pending.length === 0 && location.search !== '?browser=true') {
        window.close();
      }

      // if the use has a password set but the extension is not unlocked
      if (hasWallet && !wallet) {
        this.$router.push('/welcomeBack');
        return;
      }
      // if there are pending requests show those first
      else if (pending.length > 0) {
        switch (pending[0].action) {
          case 'enable':
            this.$router.push({ path: '/whitelist' });
            break;
          case 'signTransaction':
          case 'signAndBroadcastTransaction':
            this.$router.push({ path: '/transaction/review' });
            break;
          default:
            this.$router.push('/portfolio');
        }
        return;
      }
      // if the user has not yet created an account
      else if (!hasWallet || (wallet && wallet.length === 0)) {
        this.$router.push('/welcome');
        return;
      }

      await this.$store.dispatch(GlobalActionTypes.LOAD_SESSION_DATA);

      // return to account creation
      const newAccount = await this.$store.dispatch(GlobalActionTypes.GET_NEW_ACCOUNT);
      if (newAccount) {
        this.$router.push('/accountCreationResume');
        return;
      }

      // default case go to portfolio
      this.$router.push('/portfolio');
    },
  },
  mounted() {
    this.route();
  },
  setup() {
    const store = useExtensionStore();

    const pending = computed<ExtensionRequest[]>(() => {
      return store.getters[GlobalGetterTypes.getPending];
    });
    const wallet = computed<ExtensionRequest[]>(() => {
      return store.getters[GlobalGetterTypes.getWallet];
    });
    const respond = (id) => {
      browser.runtime.sendMessage({
        type: 'fromPopup',
        data: { action: 'setResponse', data: pending.value.find((item) => item.id == id) },
      });
    };
    const logLedger = () => {
      TransportWebUSB.create(10000).then((transport) => {
        console.log(transport);
      });
    };

    return { pending, respond, wallet, logLedger };
  },
});
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
