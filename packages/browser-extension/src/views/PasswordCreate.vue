<template>
  <div
    :style="{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <Header title="Choose Password" />
    <span style="opacity: 67%; margin-top: 16px; margin-bottom: 24px"
      >You will need this password to unlock the extension</span
    >
    <div style="margin-bottom: 16px">
      <Input v-model="password" placeholder="Enter a Password" />
    </div>
    <div style="margin-bottom: 24px">
      <Input v-model="passwordRepeated" placeholder="Confirm Password" />
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
    <span
      class="form-info"
      :class="{ error: password && passwordRepeated && !match, success: password && passwordRepeated && match }"
      >Passwords don’t match</span
    >
    <div
      :style="{
        marginTop: 'auto',
      }"
    >
      <div style="margin-bottom: 32px">
        <span class="terms-of-use">By continuing you agree to Terms of Use & Privacy Policy of Emeris wallet</span>
      </div>
      <Button
        name="Continue"
        :disabled="!length || !upperCaseChar || !symbolChar || !digitChar || !match"
        @click="submit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Header from '@@/components/Header.vue';

export default defineComponent({
  name: 'Welcome',
  components: {
    Button,
    Input,
    Header,
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
  methods: {
    submit() {
      if (this.length && this.upperCaseChar && this.symbolChar && this.digitChar && this.match) {
        this.router.push('/create');
      }
    },
  },
  watch: {
    password(password) {
      if (password.length >= 8) {
        this.length = true;
      }
      if (/[A-Z]/g.test(password)) {
        this.upperCaseChar = true;
      }
      if (/[$-/:-?{-~!"^_`[\]]/g.test(password)) {
        this.symbolChar = true;
      }
      if (/[0-9]/g.test(password)) {
        this.digitChar = true;
      }
    },
    passwordRepeated(password) {
      if (password === this.password) {
        this.match = true;
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.form-info,
.terms-of-use {
  font-size: 13px;
}

.terms-of-use {
  opacity: 67%;
}

.form-info {
  &.error {
    color: #ff6072;
  }
  &.success {
    color: #89ff9b;
  }
}
</style>