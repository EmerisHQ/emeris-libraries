<template>
  <ConfirmationScreen :title="`Are you sure you want to disconnect from ${site.origin}?`">
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Remove" @click="remove" />
      <Button name="Cancel" variant="link" @click="$router.go(-1)" />
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default defineComponent({
  name: 'Whitelisted Page Remove',
  computed: {
    site() {
      return this.$store.state.extension.whitelistedWebsites.find((site) => site.origin === this.url);
    },
    url() {
      return this.$route.query.url;
    },
  },
  components: {
    Button,
    ConfirmationScreen,
  },
  methods: {
    async remove() {
      await this.$store.dispatch(GlobalActionTypes.REMOVE_WHITELISTED_WEBSITE, { website: this.url });
      this.$router.push('/whitelisted');
    },
  },
});
</script>
<style lang="scss" scoped></style>
