<template>
  <div class="srp-saved-reply-editor" v-html="message"></div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
      required: false,
    },
  },
}
</script>
