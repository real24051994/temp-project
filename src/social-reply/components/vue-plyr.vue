<template>
  <div class="fa-vue-plyr">
    <slot />
  </div>
</template>

<script>
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default {
  props: {
    options: {
      type: Object,
      default: () => {},
    },

    emit: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      player: null,
    }
  },

  computed: {
    opts() {
      const options = this.options
      if (!this.options.hasOwnProperty('hideYouTubeDOMError')) {
        options.hideYouTubeDOMError = true
      }
      return options
    },
  },

  mounted() {
    this.player = new Plyr(this.$el.firstChild, this.opts)
    this.emit.forEach((element) => {
      this.player.on(element, this.emitPlayerEvent)
    })
  },

  beforeDestroy() {
    try {
      this.player.destroy()
    } catch (e) {
      if (!(this.opts.hideYouTubeDOMError && e.message === 'The YouTube player is not attached to the DOM.')) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
  },

  methods: {
    emitPlayerEvent(event) {
      this.$emit(event.type, event)
    },
  },
}
</script>
