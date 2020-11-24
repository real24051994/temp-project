<template>
  <div class="i-video">
    <vue-plyr :options="options">
      <video :src="src"></video>
    </vue-plyr>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
      required: true,
    },

    options: {
      type: Object,
      required: false,
      default: () => {
        return {
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
        }
      },
    },
  },
}
</script>

<style scoped>
.i-video {
  border-radius: 4px;
  overflow: hidden;
}

.i-video >>> .plyr--full-ui input[type='range'] {
  color: #5b86e5 !important;
}

.i-video >>> .plyr__control--overlaid {
  background: #5b86e5 !important;
}

.i-video >>> .plyr:not(:fullscreen) video {
  width: auto !important;
  height: auto !important;
  max-height: 300px;
  max-width: 300px;
}

.i-video >>> .plyr__controls > .plyr__control:hover {
  background-color: unset !important;
}

.i-video >>> .plyr:not(:fullscreen) .plyr__control.plyr__control--overlaid[data-plyr='play'] {
  display: none;
}
</style>
