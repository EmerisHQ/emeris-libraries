<template>
  <div class="page" style="text-align: center">
    <Brandmark class="wordmark" />
    <p class="secondary-text">{{ url }} wants to connect to your wallet</p>
    <div class="box" style="margin-top: 96px">
      <span style="margin-bottom: 16px">Allow {{ url }} to:</span>
      <p class="secondary-text" style="font-size: 13px">
        View your account balances and activity<br />
        Request approval for transactions
      </p>
    </div>
    <div style="display: flex; margin-top: auto">
      <Button name="Reject" variant="secondary" style="margin-right: 16px; flex: 1" @click="close" />
      <Button name="Accept" style="flex: 1" @click="accept" />
    </div>
  </div>
</template>

<script>
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { GetterTypes } from '@@/store/extension/getter-types';
export default {
  components: {
    Brandmark,
    Button,
  },
  methods: {
    close() {
      window.close();
    },
    async accept() {
      await this.$store.dispatch(GlobalActionTypes.WHITELIST_WEBSITE, { website: this.url });
      this.$router.push('/');
    },
  },
  computed: {
    url() {
      const pending = this.$store.getters[GetterTypes.getPending];
      return pending && pending.length > 0 ? pending[0].origin : undefined;
    },
  },
  mounted() {
    this.$store.dispatch(GlobalActionTypes.GET_PENDING);
  },
};
</script>

<style>
.wordmark {
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.box {
  /* Auto Layout */

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  /* dark/surface */

  background: #171717;
  border: 1px solid #000000;
  box-sizing: border-box;
  border-radius: 10px;

  /* Inside Auto Layout */

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}
</style>
