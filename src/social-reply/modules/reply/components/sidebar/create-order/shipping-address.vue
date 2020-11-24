<template>
  <div class="panel-shipping-address p-t-16">
    <div class="flex items-center">
      <div class="flex-1 font-medium">
        Address
      </div>

      <a @click="updateContext('edit-shipping-address')"> Edit </a>
    </div>

    <div class="m-t-4 f-12 text-secondary" v-if="!isEmpty(submit_info.shipping_address)">
      <p class="m-b-0">
        {{ `${submit_info.shipping_address.first_name || ''} ${submit_info.shipping_address.last_name || ''}` }}
      </p>

      <p class="m-b-0">
        {{ submit_info.shipping_address.company || '' }}
      </p>

      <p class="m-b-0">
        {{ `${submit_info.shipping_address.address1 || ''} ${submit_info.shipping_address.address2 || ''}` }}
      </p>

      <p class="m-b-0">
        {{ `${submit_info.shipping_address.city || ''} ${submit_info.shipping_address.zip || ''}` }}
      </p>

      <p class="m-b-0">
        {{ getCountryName(submit_info.shipping_address.country_code) }}
      </p>

      <p class="m-b-0">
        {{ submit_info.shipping_address.phone || '' }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import helper from '@reply/utils/helper'

export default {
  computed: {
    ...mapGetters({
      submit_info: 'Order/getSubmitInfo',
      customer_info: 'Customer/getCustomerInfo',
    }),
  },

  // created() {
  //   console.log(this.submit_info)
  //   if (!this.isEmpty(this.customer_info.default_address)) {
  //     console.log('111111111111')
  //     const { first_name, last_name, company, address1, address2, city, country_code, phone, province, zip } = this.customer_info.default_address

  //     const shipping_address = {
  //       first_name,
  //       last_name,
  //       company,
  //       address1,
  //       address2,
  //       city,
  //       country_code,
  //       phone,
  //       province,
  //       zip,
  //     }

  //     this.updateSubmitInfo({ shipping_address })
  //   }
  // },

  methods: {
    ...mapActions({
      updateSubmitInfo: 'Order/updateSubmitInfo',
      updateContext: 'Sidebar/updateContext',
    }),

    getCountryName(country_code) {
      let country = helper.getCountryByCode(country_code)
      return country ? country.name : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-shipping-address {
  padding: 16px 24px 16px 16px;
}

.modal-edit-shipping-address-body {
  padding: 24px;
  display: flex;
  flex-direction: column;

  .info-row {
    margin-top: 16px;
    display: flex;
    flex-direction: column;

    span {
      font-weight: 500;
      margin-bottom: 2px;
    }
  }
}

.btn-select-other-address {
  height: 32px;
  background: #f3f3f3;
  border: 1px solid #cecece;
  border-radius: 4px;
  display: flex;
}
</style>
