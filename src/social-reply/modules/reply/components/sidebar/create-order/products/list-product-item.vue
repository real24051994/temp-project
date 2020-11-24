<template>
  <div class="list-product-item-wrap p-l-16 p-r-24">
    <div class="list-product-item">
      <img :src="info.image" alt="" />
      <!--  -->
      <div class="flex flex-col flex-1">
        <div class="product-name line-clamp-2 break-word">
          {{ info.title }}
        </div>

        <div class="product-variant-name break-word p-t-2">
          {{ info.variant_title ? info.variant_title : '' }}
        </div>
      </div>
      <!--  -->
      <div class="flex flex-col p-r-16 p-l-16 h-100" style="flex-direction: flex-start;">
        <PopoverAddDiscount placement="left" :applied_discount="info.applied_discount" @delete="onDeleteDiscount" @change="onChangeDiscount">
          <a> {{ formatMoney(info.discounted_unit_price.amount) }} </a>
        </PopoverAddDiscount>

        <div class="color-btn-outline flex-1 p-t-4">
          {{ info.applied_discount ? formatMoney(oGet(info, ['original_unit_price', 'amount'])) : '' }}
        </div>
      </div>
      <!--  -->
      <div class="flex flex-col items-end">
        <sh-icon :icon="['fas', 'times']" class="color-btn-outline pointer" @click="onRemove(info.variant_id)" />

        <div class="m-t-12">
          <div class="border quantity-input">
            <input type="text" v-model="quantity" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopoverAddDiscount from '../popover-add-discount'
import { mapActions } from 'vuex'

export default {
  components: {
    PopoverAddDiscount,
  },

  props: {
    info: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      timeout: null,

      quantity: 1,
    }
  },

  watch: {
    'info.quantity'(quantity) {
      this.quantity = quantity
    },

    quantity(val) {
      let isnum = /[0-9]$/.test(val.toString())

      if (!isnum) {
        this.quantity = val.toString().replace(/[^0-9]/g, '')
      } else {
        if (+val === 0) {
          this.quantity = 1
        } else if (+val > 1000000) {
          this.quantity = 1000000
        } else {
          const obj = {
            variant_id: this.info.variant_id,
            quantity: +val,
            applied_discount: this.info.applied_discount,
          }

          if (this.timeout) {
            clearTimeout(this.timeout)
          }

          this.timeout = setTimeout(() => {
            this.updateLineItem(obj)
          }, 500)

          // this.updateLineItem(obj)
        }
      }
    },
  },

  methods: {
    ...mapActions({
      updateLineItem: 'Order/updateLineItem',
      removeLineItem: 'Order/removeLineItem',
    }),

    onRemove(variant_id) {
      this.removeLineItem(variant_id)
    },

    onDeleteDiscount() {
      this.updateLineItem({
        variant_id: this.info.variant_id,
        quantity: this.info.quantity,
      })
    },

    onChangeDiscount(info) {
      this.updateLineItem({
        variant_id: this.info.variant_id,
        quantity: this.info.quantity,
        applied_discount: info,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.list-product-item {
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
  min-height: 78px;

  img {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 4px;
    margin-right: 8px;
    object-fit: cover;
  }

  .product-name {
    color: $text;
    font-size: 12px;
    line-height: 14px;
  }

  .product-variant-name {
    font-size: 12px;
    line-height: 14px;
    color: #828282;
  }

  .quantity-input {
    position: relative;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    overflow: hidden;

    &::before {
      border-radius: 4px;
      content: 'x';
      position: absolute;
      top: 5px;
      left: 5px;
      font-size: 14px;
    }

    input {
      height: 100%;
      width: 50px;
      border: none;
      outline: none;
      padding-left: 15px;
      padding-right: 4px;
    }
  }

  // &:hover {
  //   background: #f3f3f3;
  // }
}

.list-product-item-wrap:hover {
  background: #f3f3f3;
}
</style>
