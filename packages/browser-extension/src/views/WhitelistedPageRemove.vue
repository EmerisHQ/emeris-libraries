<template>
  <ConfirmationScreen :title="`Are you sure you want to disconnect from ${site.name}?`">
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Remove" />
      <Button name="Cancel" variant="link" @click="$router.go(-1)" />
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'Whitelisted Page Remove',
  computed: {
    ...mapState({}),
    site() {
      return this.sites.find((site) => site.url === this.url);
    },
  },
  data: () => ({
    sites: [
      {
        name: 'Emeris',
        url: 'app.emeris.com',
      },
      {
        name: 'Emeris2',
        url: 'app2.emeris.com',
      },
    ],
  }),
  props: {
    url: { type: String, required: true },
  },
  components: {
    Button,
    ConfirmationScreen,
  },
});
</script>
<style lang="scss" scoped></style>
