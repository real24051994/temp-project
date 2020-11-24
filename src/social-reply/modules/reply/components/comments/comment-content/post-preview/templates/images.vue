<template>
  <div :class="`post-images max-${num}`">
    <template v-for="(item, i) in data.attachments">
      <div v-if="i < 3" class="post-image-item" :key="i">
        <img :src="item.url" alt="" />
      </div>

      <a :href="data.permalink_url" target="_blank" v-if="i === 3" class="post-image-item" :key="i">
        <img :src="item.url" alt="" />
        <div class="overlay" v-if="num > 3">+</div>
      </a>
    </template>
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

  computed: {
    imgs() {
      return this.data.attachments.map((item) => item.url)
    },

    num() {
      return this.data.attachments.length || 0
    },
  },
}
</script>

<style lang="scss" scoped>
.post-images {
  display: flex;

  .post-image-item {
    width: 100px;
    height: 100px;
    position: relative;
    margin-right: 8px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 25px;
      font-weight: 500;
    }
  }

  &.max-2 {
    display: flex;

    .post-image-item {
      width: 180px;
      height: 180px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
