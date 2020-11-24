<template>
  <div class="border-t">
    <div class="box-total ">
      <div class="flex items-center">
        <div class="flex-1">
          <PopoverAddDiscount
            v-if="!isEmpty(calculated_info.line_items)"
            :applied_discount="calculated_info.applied_discount"
            @delete="onDeleteDiscount"
            @change="onChangeDiscount"
          >
            <a>Add Discount</a>
          </PopoverAddDiscount>

          <div v-else>
            Add Discount
          </div>
        </div>

        <div class="text-secondary">
          {{ formatMoney(calculated_info.applied_discount ? calculated_info.applied_discount.amount_v2.amount : 0, '-') }}
        </div>
      </div>

      <div class="flex items-center m-t-8">
        <div class="flex-1">
          Sub total
        </div>

        <div>
          {{ formatMoney(calculated_info.subtotal_price, '-') }}
        </div>
      </div>

      <div class="flex items-center m-t-8">
        <div class="flex-1">
          <PopoverAddShipping
            v-if="!isEmpty(calculated_info.line_items)"
            :available_shipping_rates="calculated_info.available_shipping_rates"
            :shipping_line="calculated_info.shipping_line"
            @remove="onRemoveShipping"
            @change="onChangeShipping"
          />

          <div v-else>
            Add Shipping
          </div>
        </div>

        <div class="text-secondary">
          {{ formatMoney(calculated_info.total_shipping_price, '0') }}
        </div>
      </div>

      <div class="flex items-center m-t-8">
        <div class="flex-1">
          Taxes
        </div>

        <div>
          {{ formatMoney(calculated_info.total_tax, '-') }}
        </div>
      </div>

      <div class="flex items-center font-medium f-16 m-t-8">
        <div class="flex-1">
          Total
        </div>

        <div>
          {{ formatMoney(calculated_info.total_price, 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopoverAddDiscount from '../popover-add-discount'
import PopoverAddShipping from './popover-add-shipping'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PopoverAddShipping,
    PopoverAddDiscount,
  },

  data() {
    return {
      show_modal_edit_shipping: false,
    }
  },

  computed: {
    ...mapGetters({
      calculated_info: 'Order/getCalculatedInfo',
    }),
  },

  methods: {
    ...mapActions({
      updateSubmitInfo: 'Order/updateSubmitInfo',
    }),

    onDeleteDiscount() {
      this.updateSubmitInfo({
        applied_discount: undefined,
      })
    },

    onChangeDiscount(info) {
      this.updateSubmitInfo({
        applied_discount: info,
      })
    },

    onRemoveShipping() {
      this.updateSubmitInfo({
        shipping_line: undefined,
      })
    },

    onChangeShipping(info) {
      this.updateSubmitInfo({
        shipping_line: info,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.box-total {
  border-radius: 5px;
  background-color: #f3f3f3;
  padding: 16px;
  margin: 16px 24px 16px 16px;
}
</style>
