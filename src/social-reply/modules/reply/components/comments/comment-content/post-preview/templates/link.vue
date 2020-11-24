<template>
  <div class="post-link">
    <img :src="data.attachments[0].url" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.post-link {
  width: 100%;

  img {
    width: auto;
    height: auto;
    max-width: 100px;
    max-height: 100px;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
