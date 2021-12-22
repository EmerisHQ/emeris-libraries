<template>
  <div class="page">
    <Header title="" />
    <div class="menu-item" @click="$router.push('/backup')">
      Back Up
      <Icon v-if="!wallet.backedUp" name="WarningTriangleIcon" :icon-size="1" class="text-negative" />
    </div>
    <div class="menu-item">Manage connected sites</div>
    <div class="menu-item">Security</div>
    <!-- <div class="menu-item">Currency</div> -->
    <!-- <div class="menu-item">Networks</div> -->
    <!-- <div class="menu-item">Theme</div> -->

    <div class="bottom secondary-text">
      <div class="menu-item">Join the telegram community</div>
      <div class="menu-item">Twitter</div>
      <div class="menu-item">Support</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import Header from '@@/components/Header.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';

export default defineComponent({
  name: 'Settings',
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
  },
  components: {
    Icon,
    Header,
  },
});
</script>
<style lang="scss" scoped>
.menu-item {
  padding: 14px 0;
  cursor: pointer;

  .icon {
    display: inline-block;
    float: right;
  }
}

.bottom {
  position: absolute;
  bottom: 54px;
}
</style>