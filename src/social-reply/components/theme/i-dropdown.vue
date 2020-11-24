<template>
  <div class="i-dropdown">
    <div v-on-clickaway="onClickOutside" @click.stop="show = !show">
      <slot />
    </div>

    <div v-show="show" class="i-dropdown-content" :class="{ right: right }" :style="contentStyle">
      <slot name="list" />
    </div>
  </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'

export default {
  directives: {
    onClickaway: onClickaway,
  },

  props: {
    right: {
      type: Boolean,
      default: () => false,
      required: false,
    },

    contentStyle: {
      type: String,
      default: () => '',
      required: false,
    },
  },

  data() {
    return {
      show: false,
    }
  },

  methods: {
    onClickOutside() {
      this.show = false
    },
  },
}
</script>

<style lang="scss" scoped>
.i-dropdown {
  position: relative;
  display: inline-block;
}

.i-dropdown-content {
  position: absolute;
  background: white;
  width: auto;
  top: 32px;
  z-index: 20;
  transition: all 0.3s;
  // box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  box-shadow: rgba(9, 30, 66, 0.25) 0 4px 8px -2px, rgba(9, 30, 66, 0.31) 0 0 1px;
  border-radius: 5px;
  overflow: hidden;
  border-width: 1px;
}

.i-dropdown-content.right {
  right: 0;
}

.i-dropdown-content:not(.right)::before {
  position: absolute;
  display: inline-block;
  content: '';
  top: -7px;
  border-right: 7px solid transparent;
  border-left: 7px solid transparent;
  border-bottom: 7px solid #fff;
  left: 20px;
}

.i-dropdown-content.right::before {
  position: absolute;
  display: inline-block;
  content: '';
  top: -7px;
  border-right: 7px solid transparent;
  border-left: 7px solid transparent;
  border-bottom: 7px solid #fff;
  right: 20px;
}

.i-dropdown-content li {
  list-style: none;
  padding: 20px 20px;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    cursor: pointer;
  }
}

.list--item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  svg {
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }

  &:hover {
    background: #efefef;
  }
}
</style>
