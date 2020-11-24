<template>
  <img :src="src" :alt="name" :style="{ width: width, height: height }" />
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
      default: 'auto',
      required: false,
    },

    height: {
      type: String,
      default: 'auto',
      required: false,
    },
  },

  computed: {
    src() {
      return require(`@reply/assets/svg-icon/${this.name}.svg`)
    },
  },
}
</script>
