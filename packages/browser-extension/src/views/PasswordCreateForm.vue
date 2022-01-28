<template>
  <span class="secondary-text" style="margin-top: 16px; margin-bottom: 24px"
    >You will need this password to unlock the extension</span
  >
  <div
    style="margin-bottom: 16px"
    :class="{
      error: password && (!length || !upperCaseChar || !symbolChar || !digitChar),
      success: password && length && upperCaseChar && symbolChar && digitChar,
    }"
  >
    <Input v-model="password" placeholder="Enter a Password" type="password" />
  </div>
  <div
    style="margin-bottom: 24px"
    :class="{
      error: passwordRepeated && !match,
      success: passwordRepeated && match,
    }"
  >
    <Input v-model="passwordRepeated" placeholder="Confirm Password" type="password" />
  </div>
  <span class="form-info" :class="{ error: password && !length, success: password && length }"
    >Minimum 8 characters</span
  >
  <span class="form-info" :class="{ error: password && !upperCaseChar, success: password && upperCaseChar }"
    >At least one upper case</span
  >
  <span class="form-info" :class="{ error: password && !symbolChar, success: password && symbolChar }"
    >At least one symbol</span
  >
  <span class="form-info" :class="{ error: password && !digitChar, success: password && digitChar }"
    >At least one digit</span
  >
  <span class="form-info error" v-if="passwordRepeated && !match">Passwords don’t match</span>
  <div
    :style="{
      marginTop: 'auto',
    }"
  >
    <div style="margin-bottom: 32px; display: flex">
      <span class="secondary-text">By continuing you agree to </span
      ><a href="/" @click.prevent="open('https://emeris.com/terms')" style="opacity: 1">Terms of Use</a
      ><span class="secondary-text"> & </span
      ><a href="" @click.prevent="open('https://emeris.com/privacy')">Privacy Policy</a
      ><span class="secondary-text"> of Emeris wallet</span>
    </div>
    <Button
      name="Continue"
      :disabled="!length || !upperCaseChar || !symbolChar || !digitChar || !match"
      @click="submit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Icon from '@/components/ui/Icon.vue';
import { GlobalActionTypes } from '@@/store/extension/action-types';
import { mapState } from 'vuex';
import { RootState } from '@@/store';

export default defineComponent({
  name: 'Password Create Form',
  components: {
    Button,
    Input,
    Icon,
  },
  data: () => ({
    password: '',
    passwordRepeated: '',

    length: false,
    upperCaseChar: false,
    symbolChar: false,
    digitChar: false,
    match: false,
  }),
  computed: {
    ...mapState({
      wallet: (state: RootState) => state.extension.wallet,
    }),
  },
  props: {
    onContinue: { type: Function, required: true },
  },
  methods: {
    async submit() {
      if (this.length && this.upperCaseChar && this.symbolChar && this.digitChar && this.match) {
        if (this.wallet) {
          await this.$store.dispatch(GlobalActionTypes.CHANGE_PASSWORD, { password: this.password });
        } else {
          await this.$store.dispatch(GlobalActionTypes.CREATE_WALLET, { password: this.password });
        }
        this.onContinue();
      }
    },
    open(url) {
      window.open(url);
    },
  },
  watch: {
    password(password) {
      this.length = password.length >= 8;
      this.upperCaseChar = /[A-Z]/g.test(password);
      this.symbolChar = /[$-/:-?{-~!"^_`[\]@]/g.test(password);
      this.digitChar = /[0-9]/g.test(password);
    },
    passwordRepeated(password) {
      this.match = password === this.password;
    },
  },
});
</script>
<style lang="scss" scoped>
.terms-of-use {
  font-size: 13px;
}
</style>
