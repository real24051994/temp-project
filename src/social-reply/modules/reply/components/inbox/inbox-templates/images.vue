<template>
  <div :class="`message-item-images max-${num_attachments} ${is_page ? 'is-page' : ''}`">
    <div class="item-image" v-for="(item, i) in data.attachments" :key="i" @click="updateLightboxData(i)">
      <img :src="item.url" alt="" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },

    is_page: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  computed: {
    num_attachments() {
      return this.data.attachments.length
    },

    imgs() {
      return this.data.attachments.map((item) => item.url)
    },
  },

  methods: {
    ...mapActions({
      updateLightbox: 'Lightbox/update',
    }),

    updateLightboxData(index) {
      this.updateLightbox({
        items: this.imgs,
        index,
      })
    },
  },
}
</script>

<style>
.cool-lightbox .cool-lightbox__slide img {
  background-color: transparent !important;
  box-shadow: unset !important;
}
</style>

<style lang="scss" scoped>
.message-item-images {
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px 8px 8px 0;
  overflow: hidden;
  max-width: calc(150px + 150px + 150px + 8px);

  &.is-page {
    border-radius: 8px 8px 0 8px;
  }

  .item-image {
    width: 150px;
    height: 150px;
    margin-top: 4px;
    margin-right: 4px;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:nth-child(1) {
      margin-top: 0 !important;
    }

    &:nth-child(2) {
      margin-top: 0 !important;
    }

    &:nth-child(3) {
      margin-top: 0 !important;
    }

    &:nth-child(3n) {
      margin-right: 0 !important;
    }
  }

  &.is-page .item-image {
    &:nth-child(3n) {
      margin-right: 0 !important;
    }
  }

  &.max-2 .item-image {
    &:nth-child(2) {
      margin-right: 0 !important;
    }
  }
}
</style>
