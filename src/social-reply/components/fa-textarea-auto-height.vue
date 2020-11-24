<template>
  <textarea
    v-model="val"
    rows="1"
    :placeholder="placeholder"
    data-min-rows="1"
    :class="customClass"
    @input="autosize"
    @blur="onBlur"
    @keydown.enter="handleEnter"
    @click="$emit('click')"
  />
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false,
    },

    value: {
      type: String,
      default: '',
      required: false,
    },

    customClass: {
      type: String,
      default: '',
      required: false,
    },

    lineHeight: {
      type: Number,
      default: 24,
      required: false,
    },

    resizeSignal: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  data() {
    return {
      val: '',
    }
  },

  watch: {
    value(val) {
      this.val = val
    },

    resizeSignal() {
      // setTimeout(() => {
      //   this.autosize()
      // }, 10)

      setTimeout(() => {
        this.autosize()
        setTimeout(() => {
          this.$el.focus()
        }, 1)
      }, 0)
    },
  },

  created() {
    this.val = this.value
  },

  mounted() {
    this.$el.baseScrollHeight = this.$el.scrollHeight
  },

  methods: {
    autosize() {
      let minRows = this.$el.getAttribute('data-min-rows') | 0
      this.$el.rows = minRows

      let rows = Math.round((this.$el.scrollHeight - this.$el.baseScrollHeight) / this.lineHeight)
      this.$el.rows = minRows + rows

      this.$emit('input', this.val)
    },

    handleEnter(e) {
      if (e.shiftKey) {
        setTimeout(() => {
          this.autosize()
        }, 10)
        return
      }

      if (e.ctrlKey || e.altKey) {
        this.val += '\r\n'

        setTimeout(() => {
          this.autosize()
        }, 10)

        return
      }

      this.$emit('submit')

      setTimeout(() => {
        this.autosize()
      }, 10)

      e.preventDefault()
    },

    onBlur() {
      this.$emit('blur')
      this.autosize()
    },
  },
}
</script>

<style lang="scss" scoped>
textarea {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: padding-box;
  overflow: hidden;
  padding: 12px 10px;
  font-size: 14px;
  line-height: 16px;
  min-height: 40px;
  resize: none;
  outline: none;
  transition: all 0.1s;
  border: none;
  background: #f3f3f3;
  border-radius: 4px;
}

textarea:focus {
  box-shadow: none;
  border: none;
}
</style>
