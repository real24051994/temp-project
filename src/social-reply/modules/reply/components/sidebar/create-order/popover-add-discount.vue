<template>
  <a-popover v-model="visible" :title="false" trigger="click" :placement="placement" arrow-point-at-center>
    <div slot="content" class="popover-add-discount-content">
      <div class="font-medium">
        Appy Discount for this item
      </div>
      <!--  -->
      <div class="p-t-16 flex w-100">
        <div>
          <a-radio-group v-model="info.value_type" style="white-space: nowrap;">
            <a-radio-button value="PERCENTAGE" :style="radioStyle">
              %
            </a-radio-button>
            <a-radio-button value="FIXED_AMOUNT" :style="radioStyle">
              {{ shop_currency_symbol }}
            </a-radio-button>
          </a-radio-group>
        </div>

        <div class="flex-1 p-l-8">
          <a-input :suffix="suffix" v-model="info.value" />
        </div>
      </div>

      <div class="p-t-16 p-b-4 font-medium">
        Reason
      </div>

      <div>
        <a-input v-model="info.description" placeholder="Damge item, loyalty discount" class="flex-1" />
      </div>
      <!--  -->

      <div class="m-t-16 flex content-end">
        <fa-button v-if="applied_discount && applied_discount.value && applied_discount.value > 0" type="danger" class="m-r-8" @click="onDelete">
          Remove
        </fa-button>

        <div class="flex-1" />

        <fa-button @click="onCancel" class="m-r-8">
          Cancel
        </fa-button>

        <fa-button type="primary" @click="onApply" :disabled="disabled">
          Apply
        </fa-button>
      </div>
      <!--  -->
    </div>
    <!--  -->
    <slot></slot>
  </a-popover>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: 'top',
      required: false,
    },

    applied_discount: {
      type: Object,
      default: () => {},
      required: false,
    },
  },

  data() {
    return {
      info: {
        value_type: 'PERCENTAGE',
        value: 0,
        description: '',
      },

      visible: false,

      radioStyle: {
        width: '48px',
      },
    }
  },

  computed: {
    suffix() {
      return this.info.value_type === 'PERCENTAGE' ? '%' : this.shop_currency_symbol
    },
    // symbol: {
    //   get() {
    //     return this.info.value_type === 'PERCENTAGE' ? '%' : this.shop_currency_symbol
    //   },

    //   set(symbol) {
    //     if (symbol === '%') {
    //       this.info.value_type = 'PERCENTAGE'
    //     } else {
    //       this.info.value_type = 'FIXED_AMOUNT'
    //     }
    //   },
    // },

    disabled() {
      if (!this.info.value) {
        return true
      }
      return false
    },
  },

  watch: {
    visible(val) {
      if (val) {
        if (this.applied_discount) {
          this.info = {
            value_type: this.applied_discount.value_type,
            value: this.applied_discount.value,
            description: this.applied_discount.description || '',
          }
        } else {
          this.info = {
            value_type: 'PERCENTAGE',
            value: 0,
            description: '',
          }
        }
      }
    },
  },

  methods: {
    hide() {
      this.visible = false
    },

    onDelete() {
      this.hide()
      this.$emit('delete')
    },

    onCancel() {
      this.hide()
      this.info = {
        value_type: 'PERCENTAGE',
        value: 0,
        description: '',
      }
    },

    onApply() {
      if (+this.info.value > 0) {
        this.hide()
        this.info.value = +this.info.value
        this.$emit('change', this.info)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.popover-add-discount-content {
  width: 300px;
  padding: 4px 0;
}
</style>
