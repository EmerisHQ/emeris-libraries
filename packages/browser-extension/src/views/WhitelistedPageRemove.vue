<template>
  <ConfirmationScreen :title="`Are you sure you want to disconnect from ${site.name}?`">
    <div
      :style="{
        marginTop: 'auto',
      }"
      class="buttons"
    >
      <Button name="Remove" />
      <router-link to="/whitelisted">
        <Button name="Cancel" variant="link" />
      </router-link>
    </div>
  </ConfirmationScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import ConfirmationScreen from '@@/views/ConfirmationScreen.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';

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
    Brandmark,
    Header,
    Button,
    ConfirmationScreen,
  },
});
</script>
<style lang="scss" scoped>
</style>