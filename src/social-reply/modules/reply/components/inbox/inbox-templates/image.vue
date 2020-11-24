<template>
  <div class="message-item-image" :class="{ 'is-page': is_page }">
    <div
      :class="{ 'is-page': is_page }"
      :key="data.message_id"
      class="uploading flex items-center p-l-12 p-r-12 p-t-8 p-b-8"
      v-if="is_local_message || data.attachments[0].url === '#'"
    >
      <a-icon slot="indicator" type="loading" style="font-size: 18px;" class="m-r-8" spin />
      Uploading {{ data.attachments[0].name }}
    </div>

    <img v-else :src="data.attachments[0].url" alt="" @click="updateLightboxData" />
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
    is_local_message() {
      return this.data.message_id.toString().startsWith('srp_file__')
    },
  },

  methods: {
    ...mapActions({
      updateLightbox: 'Lightbox/update',
    }),

    updateLightboxData() {
      this.updateLightbox({
        items: [this.data.attachments[0].url],
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
  border: 1px solid #f3f3f3;

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
