<template>
  <div class="message-item-video" :class="{ 'is-page': is_page }">
    <div class="uploading flex items-center p-l-12 p-r-12 p-t-8 p-b-8" v-if="is_local_message || data.attachments[0].url === '#'">
      <a-icon v-if="!data.send_error" slot="indicator" type="loading" style="font-size: 18px;" class="m-r-8" spin />
      <template v-if="!data.send_error">Uploading</template> {{ data.attachments[0].name }}
    </div>

    <vue-plyr v-else :options="options">
      <video :src="data.attachments[0].url"></video>
    </vue-plyr>
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

    is_page: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      options: {
        controls: ['play-large', 'play', 'progress', 'current-time', 'settings', 'fullscreen'],
        fullscreen: {
          enabled: true,
        },
        settings: [],
        tooltips: {
          controls: true,
          seek: true,
        },
        invertTime: true,
        volume: 1,
      },
    }
  },

  computed: {
    is_local_message() {
      return this.data.message_id.toString().startsWith('srp_file__')
    },
  },
}
</script>

<style scoped>
.message-item-video >>> .plyr--full-ui input[type='range'] {
  color: #5b86e5 !important;
}

.message-item-video >>> .plyr__control--overlaid {
  background: #5b86e5 !important;
}

.message-item-video >>> video:not(:fullscreen) {
  width: auto !important;
  height: auto !important;
  max-height: 400px;
  max-width: 400px;
}

.message-item-video >>> .plyr__controls > .plyr__control:hover {
  background-color: unset !important;
}

/* .message-item-video >>> .plyr:fullscreen video {
  max-height: 100% !important;
} */

/* .message-item-video >>> .plyr__video-wrapper,
.message-item-video >>> .plyr--video {
  background: unset;
} */

/* .message-item-video >>> video {
  width: auto !important;
  height: 100% !important;
  max-height: 500px;
}

.message-item-video >>> .plyr--fullscreen-active video {
  max-height: 100% !important;
} */
</style>

<style lang="scss" scoped>
.message-item-video {
  border-radius: 8px;
  overflow: hidden;

  &.is-page .uploading {
    color: white !important;
    background: #5b86e5;
    border-radius: 8px 8px 0 8px;
  }
}
</style>
