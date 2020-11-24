<template>
  <label class="product-item border-b" :for="variant.id">
    <div class="flex items-center">
      <input
        type="checkbox"
        v-model="checked"
        :id="variant.id"
        v-show="limit !== 1"
        :disabled="disabled"
      />

      <img v-if="imgSrc" :src="imgSrc" alt />
      <div
        v-else
        class="w-40 h-40 border m-r-16 rounded"
        style="background: #f7f8fa;"
      ></div>
    </div>

    <div class="product-name p-r-16 line-clamp-2 break-word flex-1">
      {{ product.title }}
    </div>

    <div
      class="td text-muted text-left"
      style="min-width: 100px; white-space: nowrap; flex-basis: 0;"
    >
      {{ `${variant.inventory_quantity} available` }}
    </div>

    <div class="td flex items-center content-end" style="min-width: 120px;">
      {{ formatMoney(variant.price, "-") }}
    </div>
  </label>
</template>

<script>
import { mapGetters } from "vuex";

export default {
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

  computed: {
    ...mapGetters({
      shop: "auth/getShop",
    }),

    variant() {
      return this.product.variants[0];
    },

    disabled() {
      if (
        this.limit !== 1 &&
        !this.checked &&
        this.value.length >= this.limit
      ) {
        return true;
      }
      return false;
    },

    checked: {
      get() {
        const index = this.value.findIndex(
          (item) => item.id == this.variant.id
        );
        return index >= 0;
      },

      set(checked) {
        let arr = JSON.parse(JSON.stringify(this.value));

        if (checked) {
          if (arr.findIndex((item) => item.id == this.variant.id) < 0) {
            let _variant = JSON.parse(JSON.stringify(this.variant));
            _variant = Object.assign(_variant, {
              product_title: this.product.title,
              product_id: this.product.id,
              url: this.product.url,
              image: _variant.image ? _variant.image : this.imgSrc,
            });

            arr.push(_variant);
            this.$emit("input", arr);
          }
        } else {
          const index = arr.findIndex((item) => item.id == this.variant.id);
          if (index >= 0) {
            arr.splice(index, 1);
            this.$emit("input", arr);
          }
        }
      },
    },

    imgSrc() {
      return this.variant.image || this.product.main_image;
    },
  },
};
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
</style>
