<template>
  <div class="i-svg-icon" v-html="src"></div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },

    width: {
      type: String,
      default: '',
      required: false,
    },

    height: {
      type: String,
      default: '',
      required: false,
    },

    size: {
      type: String,
      default: '',
      required: false,
    },

    fill: {
      type: String,
      default: '',
    },

    fillWhite: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      component: null,
    }
  },

  computed: {
    src() {
      return require(`!html-loader!@reply/assets/svg-icon/${this.name}.svg`)
    },
  },

  watch: {
    width(width) {
      if (width) {
        this.$el.firstChild.setAttribute('width', width)
      }
    },

    height(height) {
      if (height) {
        this.$el.firstChild.setAttribute('height', height)
      }
    },

    size(size) {
      if (size) {
        this.$el.firstChild.setAttribute('width', '1em')
        this.$el.firstChild.setAttribute('height', '1em')
        this.$el.firstChild.setAttribute('margin-top', '-0.125em')
        this.$el.firstChild.setAttribute('font-size', size)
      }
    },
  },

  mounted() {
    if (this.fill) {
      const items = this.$el.querySelectorAll('path:not([fill="white"])')
      for (const el of items) {
        el.setAttribute('fill', this.fill)
      }
    }

    if (this.fillWhite) {
      const elems = this.$el.querySelectorAll('path[fill="white"]')
      for (const el of elems) {
        el.setAttribute('fill', this.fillWhite)
      }
    }

    if (this.width || this.height) {
      this.$el.firstChild.removeAttribute('height')
      this.$el.firstChild.removeAttribute('width')
    }

    if (this.width) {
      this.$el.firstChild.setAttribute('width', this.width)
    }

    if (this.height) {
      this.$el.firstChild.setAttribute('height', this.width)
    }

    if (this.size) {
      this.$el.firstChild.setAttribute('width', '1em')
      this.$el.firstChild.setAttribute('height', '1em')
      this.$el.firstChild.setAttribute('margin-top', '-0.125em')
      this.$el.firstChild.setAttribute('font-size', this.size)
    }
  },
}
</script>

<style>
.i-svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
