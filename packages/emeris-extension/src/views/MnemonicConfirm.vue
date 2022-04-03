<template>
  <div class="page">
    <Header title="Confirm recovery phrase" />
    <img :src="'/images/Stepper-'+step+'.svg'" style="margin-bottom: 34px" />
    <span class="secondary-text" style="margin-bottom: 48px"
      >Select the <b>{{ positionWord }}</b> word in your recovery phrase</span
    >
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; height: 192px">
      <Button
        :class="{ error: error === word }"
        style="width: 127.5px"
        :name="word"
        variant="link"
        v-for="word in possibleWords"
        :key="word"
        @click="() => check(word)"
      />
    </div>
    <div v-if="error" style="color: #ff6072; margin-top: 80px; text-align: center">Incorrect word. Try again.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as bip39 from 'bip39';
import wordlist from '@@/wordlists/english.json';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import { GlobalEmerisGetterTypes } from '@@/store/extension/getter-types';
import { GlobalEmerisActionTypes } from '@@/store/extension/action-types';

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

export default defineComponent({
  computed: {
    account() {
      return this.$store.getters[GlobalEmerisGetterTypes.getAccount];
    },
    positionWord() {
      switch (this.positions[this.step] + 1) {
        case 1:
          return '1st';
        case 2:
          return '2nd';
        case 3:
          return '3rd';
        case 21:
          return '21st';
        case 22:
          return '22nd';
        case 23:
          return '23rd';
        default:
          return this.positions[this.step] + 1 + 'th';
      }
    },
  },
  watch: {
    account: {
      immediate: true,
      handler() {
        this.wordList = this.account.accountMnemonic.trim().split(' ');
        while (this.positions.length < 3) {
          const position = Math.floor(Math.random() * this.wordList.length);
          if (!this.positions.includes(position)) this.positions.push(position);
        }
        this.showWords();
      },
    },
  },

  name: 'Mnemonic Confirm',
  data: () => ({
    step: 0,
    positions: [],
    error: null,
    possibleWords: [],
    wordList: [],
  }),
  components: {
    Button,
    Header,
  },
  methods: {
    showWords() {
      const possibleWords = [this.wordList[this.positions[this.step]]];
      while (possibleWords.length < 6) {
        const wordIndex = Math.floor(Math.random() * wordlist.length);
        if (possibleWords.includes(wordlist[wordIndex])) continue;
        possibleWords.push(wordlist[wordIndex]);
      }
      this.possibleWords = shuffleArray(possibleWords);
    },
    check(word) {
      if (this.wordList[this.positions[this.step]] === word) {
        this.error = null;
        if (this.step === 2) {
          this.$store.dispatch(GlobalEmerisActionTypes.ACCOUNT_BACKED_UP, { accountName: this.account.accountName });
          this.$router.push('/accountReady');
        }
        this.step++;
        this.showWords();
      } else {
        this.error = word;
      }
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

:deep(.error button) {
  background: #ff3d56 !important;
}

:deep(.button-link) {
  height: 48px;

  &:hover {
    background-color: #262626;
  }

  &:active {
    background-color: #ffffff;
    color: white;
  }
}
</style>
