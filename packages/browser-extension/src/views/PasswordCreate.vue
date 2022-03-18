<template>
  <div class="page">
    <Header title="Choose Password" />
    <PasswordCreateForm :is-first="true" :onContinue="() => $router.push(String($route.query.returnTo) || '/create')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@@/components/Header.vue';
import PasswordCreateForm from '@@/views/PasswordCreateForm.vue';

export default defineComponent({
  name: 'Password Create',
  components: {
    Header,
    PasswordCreateForm,
  },
});
</script>
