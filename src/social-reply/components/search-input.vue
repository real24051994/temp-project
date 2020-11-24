<template>
  <a-input
    v-model="val"
    ref="search"
    :placeholder="placeholder"
    type="text"
    @keyup="onType"
    class="w-100"
  >
    <a-icon slot="prefix" type="search" />
  </a-input>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: 'Search',
    },
  },

  data() {
    return {
      timeout: null,
      val: '',
    }
  },

  watch: {
    value(value) {
      this.val = value
    },
  },

  created() {
    this.val = this.value
  },

  methods: {
    onType(event) {
      this.$emit('input', event.target.value)
      this.val = event.target.value

      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (event.keyCode === 27) {
        return
      }

      if (event.keyCode == 13) {
        this.$emit('submit', event.target.value)
      } else {
        this.timeout = setTimeout(() => {
          this.$emit('submit', event.target.value)
        }, 500)
      }
    },
  },
}
</script>
