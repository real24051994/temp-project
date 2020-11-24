<template>
  <div class="message-item-audio" :class="{ 'is-page': is_page }">
    <vue-plyr ref="plyr" :options="options">
      <audio data-plyr-config>
        <source :src="attachment.url" type="audio/mp3" />
      </audio>
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
      is_playing: false,

      options: {
        controls: ['play-large', 'play', 'progress', 'current-time'],
        settings: [],
        tooltips: {
          controls: false,
          seek: false,
        },
        invertTime: false,
        volume: 1,
        resetOnEnd: true,
      },
    }
  },
}
</script>

<style scoped>
.message-item-audio >>> .plyr--audio .plyr__controls {
  background: unset !important;
  padding: 6px 8px !important;
}

.message-item-audio >>> .plyr--audio .plyr__control {
  border-radius: 50%;
}

.message-item-audio >>> .plyr--audio .plyr__control:hover {
  background: #5b86e5 !important;
}

.message-item-audio >>> .plyr--full-ui input[type='range'] {
  color: #5b86e5 !important;
}

/* is-page */
.message-item-audio.is-page >>> .plyr--audio .plyr__control {
  color: white !important;
}

.message-item-audio.is-page >>> .plyr--audio .plyr__time {
  color: white !important;
}
</style>

<style lang="scss" scoped>
.message-item-audio {
  background: #f3f3f3;
  border: 1px solid #f3f3f3;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  color: #252627 !important;
  border-radius: 8px 8px 8px 0;

  &.is-page {
    color: white !important;
    background: #5b86e5;
    border-radius: 8px 8px 0 8px;
  }

  .icon-download {
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;

    i {
      color: $primary-color;
    }
  }
}
</style>
