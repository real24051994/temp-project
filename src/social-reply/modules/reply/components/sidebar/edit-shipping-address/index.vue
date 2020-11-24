<template>
  <div class="panel-edit-customer">
    <div class="f-18 font-medium flex items-center">
      <sh-icon :icon="['fas', 'chevron-left']" class="pointer" @click="updateContext('create-order')" />

      <div class="p-l-16" style="line-height: 1;">
        Edit Address
      </div>
    </div>

    <div class="p-t-16 flex flex-col">
      <div class="input-info">
        <span>First name</span>
        <a-input placeholder="" v-model="shipping_address.first_name" />
      </div>

      <div class="input-info">
        <span>Last name</span>
        <a-input placeholder="" v-model="shipping_address.last_name" />
      </div>

      <div class="input-info">
        <span>Phone Number</span>
        <v-phone-input v-model="shipping_address.phone" />
      </div>

      <div class="border-t m-t-16" style="height: 1px;"></div>

      <div class="input-info">
        <span>Company</span>

        <a-input placeholder="" v-model="shipping_address.company" />
      </div>

      <div class="input-info">
        <span>Address</span>

        <fa-textarea rows="2" v-model="shipping_address.address1" class="bg-white border" />
      </div>

      <div class="input-info">
        <span>Apartment, suite, etc. (optional)</span>

        <a-input placeholder="" v-model="shipping_address.address2" />
      </div>

      <div class="flex">
        <div class="w-50 p-r-4">
          <div class="input-info">
            <span>City</span>

            <a-input placeholder="" v-model="shipping_address.city" />
          </div>
        </div>

        <div class="w-50 p-l-4">
          <div class="input-info">
            <span>Country</span>

            <a-select show-search v-model="shipping_address.country_code" placeholder="Select country" :filter-option="filterOption">
              <a-select-option :value="item.alpha2Code" v-for="item in countries" :key="item.alpha2Code" :title="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="input-info">
        <span>Province/Region</span>
        <a-input placeholder="" v-model="shipping_address.province" />
      </div>
      <!--  -->
      <div class="input-info">
        <span>Zip/Postal Code</span>
        <a-input placeholder="" v-model="shipping_address.zip" />
      </div>
      <!--  -->
    </div>

    <div class="flex items-center m-t-16">
      <fa-button :disabled="is_submiting" type="primary" class="m-r-8" @click="handleOnSave">
        <a-icon v-if="is_submiting" type="loading" style="font-size: 14px; color: white;" spin class="m-r-16" />
        Save
      </fa-button>

      <fa-button type="default" @click="handleOnCancel">
        Cancel
      </fa-button>
    </div>
  </div>
</template>

<script>
import helper from '@reply/utils/helper'
import { mapGetters, mapActions } from 'vuex'
import VPhoneInput from '@reply/components/utils/v-phone-input'

export default {
  components: {
    VPhoneInput,
  },

  data() {
    return {
      phoneSelectedCode: 'US',
      is_submiting: false,

      shipping_address: {
        first_name: '',
        last_name: '',
        phone: '',

        company: '',
        address1: '',
        address2: '',
        city: '',
        country_code: '',
        province: '',
        zip: '',
      },
    }
  },

  computed: {
    ...mapGetters({
      customer_info: 'Customer/getCustomerInfo',
      submit_info: 'Order/getSubmitInfo',
    }),

    countries() {
      return helper.getCountries()
    },
  },

  created() {
    this.shipping_address = Object.assign(this.shipping_address, this.submit_info.shipping_address)
  },

  methods: {
    ...mapActions({
      updateSubmitInfo: 'Order/updateSubmitInfo',
      updateContext: 'Sidebar/updateContext',
    }),

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    //
    async handleOnSave() {
      this.updateSubmitInfo({
        shipping_address: this.shipping_address,
      })
      this.updateContext('create-order')
    },

    handleOnCancel() {
      this.updateContext('create-order')
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-edit-customer {
  padding: 16px 24px 16px 16px;

  .input-info {
    display: flex;
    flex-direction: column;
    margin-top: 16px;

    span {
      font-weight: 500;
      margin-bottom: 4px;
    }
  }
}
</style>
