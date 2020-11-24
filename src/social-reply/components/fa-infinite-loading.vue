<template>
  <div class="center">
    <fa-spin v-if="isLoading && useLoading" class="m-t-10" />
  </div>
</template>

<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 20,
    },

    isLoading: {
      type: Boolean,
      default: false,
      required: false,
    },

    noMore: {
      type: Boolean,
      default: false,
    },

    useLoading: {
      type: Boolean,
      default: true,
      required: false,
    },

    selector: {
      type: String,
      default: '',
      required: false,
    },

    direction: {
      type: String,
      default: 'bottom',
      required: false,
    },
  },

  data() {
    return {
      distanceFromBottom: -1,
      distanceFromTop: -1,

      event: null,

      el: null,
    }
  },

  watch: {
    distanceFromBottom(val) {
      if (val <= this.offset && !this.isLoading && !this.noMore && this.direction === 'bottom') {
        this.$emit('loadMore')
      }
    },

    distanceFromTop(val) {
      if (val <= this.offset && !this.isLoading && !this.noMore && this.direction === 'top') {
        this.$emit('loadMore')
      }
    },
  },

  mounted() {
    this.event = this.updateDistanceFromBottom

    setTimeout(() => {
      try {
        if (this.selector) {
          this.el = document.querySelector(this.selector)
          this.el.addEventListener('scroll', this.event)
        } else {
          window.addEventListener('scroll', this.event)
        }
      } catch (error) {}
    }, 0)
  },

  beforeDestroy() {
    try {
      if (this.event && this.selector) {
        this.el.removeEventListener('scroll', this.event)
      } else if (this.event) {
        window.removeEventListener('scroll', this.event)
      }
    } catch (error) {}
  },

  methods: {
    updateDistanceFromBottom() {
      let el = document.querySelector(this.selector)
      const scrollTop = el.scrollTop
      const clientHeight = el.clientHeight
      const scrollHeight = el.scrollHeight

      this.distanceFromBottom = Math.abs(scrollHeight - clientHeight - scrollTop)
      this.distanceFromTop = el.scrollTop
    },
  },
}
</script>
