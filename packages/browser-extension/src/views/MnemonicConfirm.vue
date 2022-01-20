<template>
  <div class="page">
    <Header title="Confirm recovery phrase" />
    <img :src="require('@@/assets/Stepper.png')" style="margin-bottom: 34px" />
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
        :key="position + word"
        @click="() => check(word)"
      />
    </div>
    <div v-if="error" style="color: #ff6072; margin-top: 80px; text-align: center">Incorrect word. Try again.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as bip39 from 'bip39';
import Button from '@/components/ui/Button.vue';
import Header from '@@/components/Header.vue';
import { GlobalGetterTypes } from '@@/store/extension/getter-types';

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

export default defineComponent({
  computed: {
    account() {
      return this.$store.getters[GlobalGetterTypes.getAccount];
    },
    positionWord() {
      switch (this.position + 1) {
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
          return this.position + 1 + 'th';
      }
    },
  },
  watch: {
    account: {
      immediate: true,
      handler() {
        this.wordList = this.account.accountMnemonic.trim().split(' ');
        this.showWords();
      },
    },
  },

  name: 'Mnemonic Confirm',
  data: () => ({
    position: 0,
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
      const possibleWords = [this.wordList[this.position]];
      while (possibleWords.length < 6) {
        const wordIndex = Math.floor(Math.random() * bip39.wordlists.english.length);
        if (possibleWords.includes(bip39.wordlists.english[wordIndex])) continue;
        possibleWords.push(bip39.wordlists.english[wordIndex]);
      }
      this.possibleWords = shuffleArray(possibleWords);
    },
    check(word) {
      if (this.wordList[this.position] === word) {
        this.error = null;
        if (this.position === this.wordList.length - 1) {
          this.$router.push('/accountReady');
        }
        this.position++;
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
