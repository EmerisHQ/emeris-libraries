<template>
  <Header :title="`Receive ${asset ? asset.display_name : 'Loading...'}`" />
  <div style="text-align: center; margin-top: -24px">
    <span class="secondary-text" style="font-size: 13px">on {{ asset ? asset.on_chain : 'Loading...' }}</span>
  </div>
  <template v-if="recipientAddress">
    <QrCode
      class="relative z-10"
      :value="recipientAddress"
      width="160"
      color="FFFFFF"
      style="margin-left: auto; margin-right: auto; margin-top: 79px; margin-bottom: 73px"
    />
    <div style="text-align: left; display: flex; flex-direction: column">
      <span>Address</span>
      <span class="secondary-text" style="margin-bottom: 24px; word-wrap: break-word">{{ recipientAddress }}</span>
      <div style="color: #4ef2e4; cursor: pointer; display: flex" @click="pasteClip">
        <Icon v-if="!copied" name="CopyIcon" :icon-size="1" style="margin-right: 12px" />
        <span style="margin-right: 12px" v-else>✓</span>
        Copy to clipboard
      </div>
    </div>
  </template>
</template>

<script>
import useAccount from '@/composables/useAccount';
import { computed } from '@vue/runtime-core';
import { getDisplayName } from '@/utils/actionHandler';
import * as orderBy from 'lodash.orderby';
import { useStore } from 'vuex';
import Header from '@@/components/Header.vue';
import QrCode from '@/components/common/QrCode.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { GlobalActionTypes } from '@@/store/extension/action-types';

export default {
  name: 'Receive QR',
  components: {
    Header,
    QrCode,
    Icon,
  },
  data: () => ({
    displayNameAddedList: [],
    recipientAddress: '',
    copied: false,
  }),
  props: {
    denom: { type: String, required: true },
  },
  computed: {
    asset() {
      return this.displayNameAddedList.find((asset) => asset.base_denom === this.denom);
    },
  },
  watch: {
    async asset(asset) {
      if (!asset) return;
      this.recipientAddress = await this.$store.dispatch(GlobalActionTypes.GET_ADDRESS, { chainId: asset.on_chain });
    },
    async assetsList(assetsList) {
      this.displayNameAddedList = await Promise.all(
        assetsList.map(async (asset) => {
          return {
            ...asset,
            display_name: await getDisplayName(
              asset.base_denom,
              this.$store.getters[GlobalDemerisGetterTypes.API.getDexChain],
            ),
          };
        }),
      );
    },
  },
  methods: {
    pasteClip() {
      navigator.clipboard.writeText(this.recipientAddress);

      if (this.copied) clearTimeout(this.copied);
      this.copied = setTimeout(() => (this.copied = false), 3000);
    },
  },
  setup() {
    const { nativeBalances } = useAccount();
    const store = useStore();

    const assetsList = computed(() => {
      if (!store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]) return [];
      return orderBy(nativeBalances.value, (item) => (item.base_denom.startsWith('pool') ? 1 : -1));
    });

    return { assetsList };
  },
};
</script>