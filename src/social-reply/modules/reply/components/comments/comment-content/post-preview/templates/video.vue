<template>
  <div class="post-video">
    <vue-plyr :options="options">
      <video :src="oGet(data, ['attachments', 0, 'url'])"></video>
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
.post-video >>> .plyr--full-ui input[type='range'] {
  color: #5b86e5 !important;
}

.post-video >>> .plyr__control--overlaid {
  background: #5b86e5 !important;
}

.post-video >>> .plyr__video-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-video >>> .plyr:not(:fullscreen) video {
  width: auto !important;
  height: auto !important;
  max-height: 496px;
  max-width: 496px;
}

.post-video >>> .plyr__controls > .plyr__control:hover {
  background-color: unset !important;
}
</style>

<style lang="scss" scoped>
.post-video {
  border-radius: 4px;
  overflow: hidden;
  max-width: 100%;
}
</style>
