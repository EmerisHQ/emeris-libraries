<template>
  <div class="page">
    <Header title="Choose a new password" />
    <PasswordCreateForm :onContinue="() => $router.push('/passwordChange/success')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@@/components/Header.vue';
import PasswordCreateForm from '@@/views/PasswordCreateForm.vue';

export default defineComponent({
  name: 'Password Change New',
  components: {
    Header,
    PasswordCreateForm,
  },
});
</script>
