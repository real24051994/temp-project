<template>
  <div class="flex flex-col">
    <label class="product-item border-b" :for="product.id">
      <div class="flex items-center">
        <input type="checkbox" v-model="checked" :id="product.id" v-if="limit !== 1" :disabled="disabled" />

        <img :src="imgSrc" alt="" />
      </div>

      <div class="product-name p-r-16 line-clamp-2 break-word flex-1">
        {{ product.title }}
      </div>
    </label>

    <div class="flex flex-col p-l-30">
      <VariantItem
        v-for="item in product.variants"
        :key="item.id"
        :limit="limit"
        :selected="value"
        :variant="item"
        @check="onCheckVariant"
        @uncheck="onUnCheckVariant"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VariantItem from './variant-item'

export default {
  components: {
    VariantItem,
  },

  props: {
    product: {
      type: Object,
      default: () => {},
      required: true,
    },

    value: {
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

  data() {
    return {
      checked: false,
    }
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),

    imgSrc() {
      return this.product.main_image || this.product.variants[0].main_image
    },

    disabled() {
      if (this.limit !== 1 && !this.checked && this.value.length >= this.limit) {
        return true
      }
      return false
    },
  },

  watch: {
    value(val, oldVal) {
      if (val.length === 0 && oldVal.length > 0) {
        this.checked = false
      }
    },

    checked(checked) {
      let arr = JSON.parse(JSON.stringify(this.value))

      if (checked) {
        for (const variant of this.product.variants) {
          if (arr.findIndex((item) => item.id == variant.id) < 0) {
            let _variant = JSON.parse(JSON.stringify(variant))
            _variant = Object.assign(_variant, {
              product_title: this.product.title,
              product_id: this.product.id,
            })
            if (arr.length >= 5) {
              break
            }
            arr.push(_variant)
            this.$emit('input', arr)
          }
        }
      } else {
        for (const variant of this.product.variants) {
          const index = arr.findIndex((item) => item.id == variant.id)
          if (index >= 0) {
            arr.splice(index, 1)
          }
        }
        this.$emit('input', arr)
      }
    },
  },

  methods: {
    onCheckVariant(variant) {
      let arr = JSON.parse(JSON.stringify(this.value))
      if (arr.findIndex((item) => item.id == variant.id) < 0) {
        let _variant = JSON.parse(JSON.stringify(variant))
        _variant = Object.assign(_variant, {
          product_title: this.product.title,
          product_id: this.product.id,
          url: this.product.url,
          image: _variant.image ? _variant.image : this.imgSrc,
        })

        arr.push(_variant)
        this.$emit('input', arr)
      }
    },

    onUnCheckVariant(variantId) {
      let arr = JSON.parse(JSON.stringify(this.value))
      const index = arr.findIndex((item) => item.id == variantId)
      if (index >= 0) {
        arr.splice(index, 1)
      }
      this.$emit('input', arr)
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

  input {
    margin-right: 16px;
  }

  img {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 16px;
  }

  &:hover {
    background-color: #f7f8fa;
    cursor: pointer;
  }
}

.variant-item {
  padding: 16px;
  min-height: 50px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f7f8fa;
    cursor: pointer;
  }
}
</style>
