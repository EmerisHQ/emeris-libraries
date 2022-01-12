<template>
  <Header title="Select asset to receive" />
  <div class="search-bar relative flex-1 min-h-0 flex flex-col">
    <Search v-model:keyword="keyword" placeholder="Search assets" class="w-full mx-auto max-w-md pb-3" />
    <div class="scroll-container overflow-y-auto flex-grow min-h-0 pt-1">
      <div class="mx-auto max-w-md mb-20">
        <CoinList
          v-if="keywordFilteredAssets.length > 0"
          :data="keywordFilteredAssets"
          :type="'receive'"
          :show-balance="true"
          :keyword="keyword"
          @select="(asset) => $router.push('/receive/' + asset.base_denom)"
        >
        </CoinList>
      </div>
    </div>
  </div>
</template>

<script>
import useAccount from '@/composables/useAccount';
import { computed } from '@vue/runtime-core';
import { getDisplayName } from '@/utils/actionHandler';
import orderBy from 'lodash.orderby';
import { useStore } from 'vuex';
import Search from '@/components/common/Search.vue';
import CoinList from '@/components/common/CoinList.vue';
import Header from '@@/components/Header.vue';
import { GlobalDemerisGetterTypes } from '@/store';

export default {
  name: 'Receive Denom',
  data: () => ({
    keyword: '',
    displayNameAddedList: [],
  }),
  components: {
    Header,
    Search,
    CoinList,
  },
  computed: {
    keywordFilteredAssets() {
      const filteredAssets = (this.displayNameAddedList.length > 0 ? this.displayNameAddedList : []).filter((asset) => {
        return asset.display_name?.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1;
      });

      return filteredAssets;
    },
  },
  watch: {
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

<style lang="scss" scoped>
:deep(.scroll-container > div > div) {
  margin: 0;
}
:deep(.search) {
  padding-left: 0;
  padding-right: 0;
}
</style>