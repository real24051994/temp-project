<template>
  <label class="variant-item border-b" :for="variant.id">
    <div class="flex items-center">
      <input type="checkbox" v-model="checked" :id="variant.id" v-show="limit !== 1" :disabled="disabled" />
      <div v-if="limit === 1" style="width: 10px;"></div>
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

    limit: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),

    disabled() {
      if (this.limit !== 1 && !this.checked && this.selected.length >= this.limit) {
        return true
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
}
</style>
