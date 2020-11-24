<template>
  <textarea :rows="rows" v-model="val" :placeholder="placeholder" @keydown="resize" @blur="$emit('blur')" />
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

    rows: {
      type: String,
      default: '1',
      required: false,
    },

    focus: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  computed: {
    val: {
      get() {
        return this.value
      },

      set(val) {
        this.$emit('input', val)
      },
    },
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      if (this.focus) {
        this.$el.focus()
      }
      this.resize()
    },

    resize() {
      setTimeout(() => {
        this.$el.style.height = 'auto'
        this.$el.style.height = this.$el.scrollHeight + 'px'
      }, 0)
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
  padding: 8px 10px !important;
  font-size: 14px;
  line-height: 16px;
  resize: none;
  outline: none;
  border: none;
  background: #f3f3f3;
  border-radius: 4px;
}

textarea:focus {
  box-shadow: none;
  border: none;
}
</style>
