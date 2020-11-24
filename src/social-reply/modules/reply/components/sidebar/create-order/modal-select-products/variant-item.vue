<template>
  <label class="variant-item border-b" :for="variant.id" :class="{ selected: is_selected }">
    <div class="flex items-center">
      <input v-if="!is_selected" type="checkbox" v-model="checked" :id="variant.id" />
      <div v-else class="m-r-12"></div>
    </div>

    <div class="product-name p-l-16 p-r-16 line-clamp-2 break-word flex-1">
      {{ variant.title }}
    </div>

    <div class="text-muted" style="min-width: 100px;">{{ variant.inventory_quantity }} available</div>
    <div class="flex items-center content-end" style="min-width: 120px;">{{ formatMoney(variant.price) }}</div>
  </label>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    variant: {
      type: Object,
      default: () => {},
      required: true,
    },

    selected: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      submit_info: 'Order/getSubmitInfo',
    }),

    is_selected() {
      if (this.submit_info && this.submit_info.line_items) {
        let index = this.submit_info.line_items.findIndex((item) => item.variant_id == this.variant.id)
        return index >= 0
      }

      return false
    },

    checked: {
      get() {
        const index = this.selected.findIndex((item) => item.id == this.variant.id)
        return index >= 0
      },

      set(checked) {
        if (checked) {
          this.$emit('check', this.variant)
        } else {
          this.$emit('uncheck', this.variant.id)
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.product-item {
  padding: 16px;
  min-height: 72px;
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-left: 16px;
    margin-right: 16px;
  }
}

.variant-item {
  padding: 16px;
  min-height: 50px;
  display: flex;
  align-items: center;

  &.selected {
    opacity: 0.7;
    cursor: default;
  }
}
</style>
