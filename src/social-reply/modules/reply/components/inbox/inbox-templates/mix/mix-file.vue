<template>
  <a :href="attachment.url" :download="attachment.name" target="_blank" class="message-item-file items-center" :class="{ 'is-page': is_page }">
    <div class="icon-download center">
      <sh-icon :icon="['fas', 'arrow-to-bottom']" />
    </div>

    <div class="flex center">
      {{ attachment.name }}
    </div>
  </a>
</template>

<script>
export default {
  props: {
    attachment: {
      type: Object,
      default: () => {},
      required: true,
    },

    message: {
      type: String,
      default: '',
      required: false,
    },

    is_page: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.message-item-file {
  display: flex;
  white-space: nowrap !important;

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
