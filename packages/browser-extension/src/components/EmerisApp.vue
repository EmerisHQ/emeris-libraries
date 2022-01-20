<template>
  <div>Loading...</div>
</template>

<script lang="ts">
import { useExtensionStore } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';
import { ExtensionRequest } from '@@/types';
import { defineComponent, computed } from 'vue';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

export default defineComponent({
  name: 'EmerisApp',
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
