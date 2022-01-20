<template>
  <ConfirmationScreen
    :title="`Are you sure hat you want to remove ${wallet ? account.accountName : '...loading...'}?`"
    subtitle="If you have not backed up this wallet, you will lose access entirely"
  >
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Remove" @click="removeWallet" />
      <router-link to="/accounts">
        <Button name="Cancel" variant="link" />
      </router-link>
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Account Remove',
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
    account() {
      return this.wallet[this.index];
    },
  },
  props: {
    index: { type: String, required: true },
  },
  components: {
    Button,
    ConfirmationScreen,
  },
  methods: {
    async removeWallet() {
      await this.$store.dispatch(GlobalActionTypes.REMOVE_ACCOUNT, { accountName: this.account.accountName });
      this.$router.push('/accounts');
    },
  },
});
</script>
