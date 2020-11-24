<template>
  <div class="message-item-image" :class="{ 'is-page': is_page }">
    <img :src="attachment.url" alt="" @click="updateLightboxData" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    attachment: {
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

  methods: {
    ...mapActions({
      updateLightbox: 'Lightbox/update',
    }),

    updateLightboxData() {
      this.updateLightbox({
        items: [this.attachment.url],
        index: 0,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.message-item-image {
  overflow: hidden;
  border-radius: 8px 8px 8px 0;
  cursor: pointer;

  img {
    height: auto;
    width: auto;
    max-width: 400px;
    max-height: 400px;
  }

  &.is-page {
    border-radius: 8px 8px 0 8px;

    .uploading {
      background: #5b86e5;
    }
  }
}
</style>
