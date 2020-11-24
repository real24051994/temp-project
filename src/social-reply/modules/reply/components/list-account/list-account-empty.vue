<template>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <img v-if="!is_collapsed" src="@reply/assets/images/icons/empty-social.png" alt="" class="mt-4" />
    <p class="mt-4 text-center">
      No connected account
    </p>
  </div>
</template>

<script>
export default {
  props: {
    is_collapsed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
