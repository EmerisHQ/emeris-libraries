<template>
  <div class="page">
    <Header title="Recovery phrase" />
    <span class="secondary-text" style="margin-bottom: 36px"
      >Please write down your 12 words in a safe space manually on paper</span
    >
    <div class="words" style="margin-bottom: 20px">
      <div class="word" v-for="(word, index) in wallet.walletMnemonic.trim().split(' ')" :key="index">
        <div class="number">{{ index }}</div>
        <span>{{ word }}</span>
      </div>
    </div>
    <a style="margin-bottom: 38px; font-size: 13px; color: #89ff9b" v-if="copied" @click="copy">
      <Icon name="InformationIcon" :icon-size="0.5" style="margin-right: 8px" />Copied for 2 minutes</a
    >
    <a style="margin-bottom: 38px; font-size: 13px" v-else @click="copy">Click to copy</a>

    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <Checkbox
        style="margin-bottom: 22px"
        v-model="checked"
        label="I have backed up my recovery phrase, I understand that if I loose my recovery phrase, I will loose my
          fund"
      />
      <Button name="Continue" :disabled="!checked" @click="submit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import Icon from '@/components/ui/Icon.vue';
import { mapState } from 'vuex';
import { RootState } from '@@/store';

export default defineComponent({
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
  },

  name: 'Mnemonic Show',
  data: () => ({
    checked: false,
    copied: null,
  }),
  components: {
    Button,
    Header,
    Checkbox,
    Icon,
  },
  methods: {
    submit() {
      this.$router.push('/backup/confirm');
    },
    copy() {
      navigator.clipboard.writeText(this.wallet.walletMnemonic);
      if (this.copied) {
        clearTimeout(this.copied);
      }
      this.copied = setTimeout(() => {
        navigator.clipboard.writeText('');
        this.copied = null;
      }, 1000 * 120);
    },
  },
});
</script>
<style lang="scss" scoped>
.checkbox-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;

  background: #171717;
  border-radius: 10px;
}

.words {
  .word {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;

    .number {
      margin-right: 8px;
      background: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-weight: 600;
      font-size: 13px;
      line-height: 16px;
      color: #000000;
      padding-top: 4px;
      text-align: center;
    }

    span {
      line-height: 24px;
    }
  }
}

:deep(.checkbox) {
  background-color: #171717;

  .checkbox__label {
    font-size: 13px;
  }

  .checkbox__control:checked {
    background: linear-gradient(154.46deg, #64dafb 9.7%, #30ffdf 33.94%, #fffd38 69.44%);
  }
}
</style>