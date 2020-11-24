<template>
  <div class="message-item-video" :class="{ 'is-page': is_page }">
    <vue-plyr :options="options">
      <video :src="attachment.url"></video>
    </vue-plyr>
  </div>
</template>

<script>
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
}
</script>

<style scoped>
.message-item-video >>> .plyr--full-ui input[type='range'] {
  color: #5b86e5 !important;
}

.message-item-video >>> .plyr__control--overlaid {
  background: #5b86e5 !important;
}

.message-item-video >>> .plyr:not(:fullscreen) video {
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
