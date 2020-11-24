<template>
  <a-popover v-model="visible" :title="false" trigger="click" placement="top" arrow-point-at-center>
    <div slot="content" class="popover-add-shipping-content">
      <div>
        <div class="flex" style="background: #e8f4ff; border-radius: 4px; padding: 8px;">
          <a>
            <sh-icon :icon="['fas', 'info-square']" />
          </a>
          <div class="p-l-8">
            Shipping rate is synced from your Shopify shipping settings. If you want to edit the rate, click <a target="_blank" :href="settingUrl">Settings</a>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="p-t-16">
        <a-radio-group v-model="shipping_rate_handle">
          <a-radio :style="radioStyle" :value="item.handle" v-for="item in available_shipping_rates" :key="item.handle">
            {{ item.title }}
          </a-radio>

          <a-radio :style="radioStyle" value="">
            Custom
          </a-radio>
        </a-radio-group>
      </div>

      <div class="flex" v-if="shipping_rate_handle === ''">
        <a-input v-model="title" placeholder="Name" class="m-r-8 flex-1" />

        <a-input v-model="price" :suffix="shop_currency_symbol" style="width: 180px;" />
      </div>
      <!--  -->

      <div class="m-t-16 flex content-end">
        <fa-button v-if="shipping_line" type="danger" class="m-r-8" @click="onDelete">
          Delete
        </fa-button>

        <div class="flex-1"></div>
        <fa-button class="m-r-8" @click="onCancel">
          Cancel
        </fa-button>

        <fa-button type="primary" @click="onApply" :disabled="disabled">
          Apply
        </fa-button>
      </div>
      <!--  -->
    </div>
    <!--  -->
    <a>Add Shipping</a>
  </a-popover>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    shipping_line: {
      type: Object,
      default: () => {},
      required: false,
    },

    available_shipping_rates: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  data() {
    return {
      visible: false,

      title: '',
      price: '',
      shipping_rate_handle: undefined,

      radioStyle: {
        display: 'block',
        height: '32px',
        lineHeight: '30px',
      },
    }
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),

    settingUrl() {
      if (this.shop && this.shop.raw_domain) {
        return 'https://' + this.shop.raw_domain + '/admin/settings/shipping'
      }
      return '#'
    },

    disabled() {
      if (this.shipping_rate_handle === undefined) {
        return true
      }

      if (this.shipping_rate_handle === '') {
        if (this.title === '' || +this.price <= 0) {
          return true
        }
      }
      return false
    },
  },

  watch: {
    visible(visible) {
      if (visible) {
        if (this.shipping_line) {
          if (this.shipping_line.custom === true) {
            this.title = this.shipping_line.title
            this.price = this.shipping_line.original_price_set.amount
            this.shipping_rate_handle = ''
          } else {
            this.shipping_rate_handle = this.shipping_line.shipping_rate_handle
          }
        }
      }
    },
  },

  methods: {
    hide() {
      this.visible = false
      this.shipping_rate_handle = undefined
      this.title = ''
      this.price = ''
    },

    onDelete() {
      this.$emit('remove')
      this.hide()
    },

    onCancel() {
      this.hide()
    },

    onApply() {
      if (this.shipping_rate_handle === '') {
        this.$emit('change', {
          title: this.title,
          price: +this.price,
        })
      } else if (this.shipping_rate_handle) {
        this.$emit('change', {
          shipping_rate_handle: this.shipping_rate_handle,
        })
      }
      this.hide()
    },
  },
}
</script>

<style lang="scss" scoped>
.popover-add-shipping-content {
  width: 360px;
  padding: 4px 0;
}
</style>
