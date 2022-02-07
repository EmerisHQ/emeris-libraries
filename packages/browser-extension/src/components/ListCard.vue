<template>
  <div class="list-card-container">
    <img :src="img" />
    <span>{{ caption }}</span>
  </div>
</template>

<script>
export default {
  name: 'List Card',
  props: {
    img: { type: String, required: true },
    caption: { type: String, required: true },
  },
};
</script>
<style lang="scss" scoped>
.list-card-container {
  /* Auto Layout */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px;

  background: linear-gradient(0deg, #171717 0%, #040404 100%);
  mix-blend-mode: normal;
  /* elevation/button */

  box-shadow: 3px 9px 32px -4px rgba(0, 0, 0, 0.07);
  border-radius: 10px;

  /* Inside Auto Layout */

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;

  font-size: 13px;
}

img {
  margin-right: 16px;
  width: 32px;
}
</style>
