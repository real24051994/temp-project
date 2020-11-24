<template>
  <button :class="`fa-button ${type} ${outline ? 'outline' : ''}`" @click="$emit('click')" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
      required: false,
    },

    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    outline: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.fa-button {
  outline: 0;
  border-radius: 4px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
  transition: all 0.2s ease-out;

  &.default {
    padding: 0 16px;
    background: white;
    border: 1px solid #cecece;
  }

  &.primary {
    color: white;
    padding: 0 16px;
    background: $primary-color;
    border: 1px solid $primary-color;

    &.outline {
      background: white;
      color: $primary-color;
    }
  }

  &.danger {
    color: #eb5757;
    padding: 0 16px;
    background: white;
    border: 1px solid #eb5757;

    &.outline {
      background: white;
      color: #eb5757;
    }
  }

  &:disabled {
    // border: 1px solid #cecece;
    // background: #cecece;
    opacity: 0.7;
    pointer-events: none;
  }
}
</style>
