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
      <Button name="Reject" variant="secondary" style="margin-right: 16px; flex: 1" />
      <Button name="Accept" style="flex: 1" />
    </div>
  </div>
</template>

<script>
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';
export default {
  data: () => ({
    url: '',
  }),
  components: {
    Brandmark,
    Button,
  },
  mounted() {
    this.url = this.$route.query.url;
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