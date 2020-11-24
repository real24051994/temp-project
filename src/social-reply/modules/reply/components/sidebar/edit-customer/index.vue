<template>
  <div class="panel-edit-customer">
    <div class="f-18 font-medium">
      Edit Customer
    </div>

    <div class="p-t-16 flex flex-col">
      <div>
        <SelectCustomer v-if="!selected_customer_info" @change="onSelectCustomer" />

        <div class="flex items-center" v-else style="background: #f3f3f3; border-radius: 4px; padding: 8px 16px;">
          <div class="flex flex-col flex-1 p-r-8">
            <div class="font-medium">
              {{ `${selected_customer_info.first_name || ''} ${selected_customer_info.last_name || ''}` }}
            </div>

            <div class="line-clamp-1 break-word f-12">
              {{ `${selected_customer_info.email || ''} ${selected_customer_info.phone || ''}` }}
            </div>
          </div>

          <div>
            <sh-icon :icon="['fas', 'times']" class="pointer" @click="removeMapping" />
          </div>
        </div>
      </div>

      <div class="input-info">
        <span>First name</span>
        <a-input placeholder="" v-model="submit_info.first_name" />
      </div>

      <div class="input-info">
        <span>Last name</span>
        <a-input placeholder="" v-model="submit_info.last_name" />
      </div>

      <div class="input-info">
        <span>Email</span>
        <a-input placeholder="" v-model="submit_info.email" />
      </div>

      <div class="input-info">
        <span>Phone Number</span>
        <v-phone-input v-model="submit_info.phone" />
      </div>

      <div class="border-t m-t-16" style="height: 1px;"></div>

      <div class="input-info">
        <span>Address</span>

        <fa-textarea rows="2" v-model="submit_info.address.address1" class="bg-white border" />
      </div>

      <div class="flex">
        <div class="w-50 p-r-4">
          <div class="input-info">
            <span>City</span>

            <a-input placeholder="" v-model="submit_info.address.city" />
          </div>
        </div>

        <div class="w-50 p-l-4">
          <div class="input-info">
            <span>Country</span>

            <a-select show-search v-model="submit_info.address.country" placeholder="Select country" :filter-option="filterOption">
              <a-select-option :value="item.alpha2Code" v-for="item in countries" :key="item.alpha2Code" :title="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="input-info">
        <span>Postal Code</span>
        <a-input placeholder="" v-model="submit_info.address.zip" />
      </div>
      <!--  -->
    </div>

    <ModalConflictCustomers :visible.sync="show_modal_conflict" :conflict_customers="conflict_customers" @select="handleConflict" />

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
import SelectCustomer from './select-with-search-customer'
import api from '@reply/utils/api'
import { mapGetters, mapActions } from 'vuex'
import ModalConflictCustomers from './modal-conflict-customers'
import VPhoneInput from '@reply/components/utils/v-phone-input'
import pickBy from 'lodash/pickBy'

export default {
  components: {
    SelectCustomer,
    ModalConflictCustomers,
    VPhoneInput,
  },

  data() {
    return {
      selected_customer_info: undefined,
      phoneSelectedCode: 'US',

      submit_info: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',

        address: {
          address1: '',
          city: '',
          zip: '',
          country: '',
        },
      },

      is_submiting: false,

      show_modal_conflict: false,
      conflict_customers: [],
    }
  },

  computed: {
    ...mapGetters({
      conversation_info: 'Conversation/getConversationInfo',
      customer_info: 'Customer/getCustomerInfo',
    }),

    countries() {
      return helper.getCountries()
    },
  },

  watch: {
    'submit_info.phone'(val) {
      if (val && val.indexOf(' ') >= 0) {
        this.submit_info.phone = val.replace(' ', '')
      }
    },
  },

  created() {
    if (!this.isEmpty(this.customer_info)) {
      this.selected_customer_info = this.clone(this.customer_info)

      const { first_name, last_name, email, phone } = this.customer_info
      this.submit_info = Object.assign(this.submit_info, {
        first_name,
        last_name,
        email,
        phone,
      })

      if (this.customer_info.default_address) {
        const { address1, city, zip, country_code } = this.customer_info.default_address
        this.submit_info.address = Object.assign(this.submit_info.address, {
          address1,
          city,
          zip,
          country: country_code,
        })
      }
    } else {
      this.submit_info = Object.assign(this.submit_info, {
        email: this.conversation_info.email,
      })
    }
  },

  methods: {
    ...mapActions({
      updateConversation: 'Conversation/updateConversation',

      updateConversationInfo: 'Conversation/updateConversationInfo',
      updateConversationBySenderId: 'Conversation/updateConversationBySenderId',

      updateContext: 'Sidebar/updateContext',

      fetchInfoCustomer: 'Customer/fetchInfo',

      updateSubmitInfo: 'Order/updateSubmitInfo',
    }),

    getCountryByCode(code) {
      return helper.getCountryByCode(code)
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    async onSelectCustomer(customer_info) {
      this.selected_customer_info = JSON.parse(JSON.stringify(customer_info))

      try {
        let { data } = await api.SHOPIFY.CUSTOMERS.get(customer_info.id)
        this.selected_customer_info = JSON.parse(JSON.stringify(data))

        this.submit_info = Object.assign(this.submit_info, {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        })

        const { address1, city, zip, country_code } = data.default_address

        this.submit_info.address = Object.assign(this.submit_info.address, {
          address1,
          city,
          zip,
          country: country_code,
        })
      } catch (error) {
        this.is_loading = false
      } finally {
        this.is_loading = false
      }
    },

    //
    async handleOnSave(overwrite_data) {
      this.is_submiting = true

      let submit_info = this.clone(this.submit_info)

      submit_info.address = Object.assign(this.submit_info.address, {
        first_name: submit_info.first_name,
        last_name: submit_info.last_name,
        phone: submit_info.phone,
      })

      if (this.selected_customer_info) {
        submit_info = Object.assign(this.submit_info, {
          customer_id: this.selected_customer_info.id,
        })
      }

      if (overwrite_data) {
        submit_info = Object.assign(submit_info, overwrite_data)
      }

      try {
        if (!this.selected_customer_info) {
          submit_info.address = pickBy(submit_info.address, (v) => v !== null && v !== undefined && v !== '')
          submit_info = pickBy(submit_info, (v) => !this.isEmpty(v))
        } else {
          submit_info.address = pickBy(submit_info.address, (v) => v !== null && v !== undefined)
          submit_info = pickBy(submit_info, (v) => v !== null && v !== undefined)
        }

        let data = await api.SOCIAL.mappingUserWithCustomer(this.conversation_info.sender_id, submit_info)

        this.updateConversationBySenderId({
          sender_id: this.conversation_info.sender_id,
          customer_id: data.data.id,
        })

        this.updateConversationInfo(
          Object.assign(this.conversation_info, {
            customer_id: data.data.id,
          })
        )

        try {
          let rs = await this.fetchInfoCustomer({ customer_id: data.data.id })
          const { first_name, last_name, company, address1, address2, city, country_code, phone, province, zip } = rs.default_address
          this.updateSubmitInfo({
            shipping_address: {
              first_name,
              last_name,
              company,
              address1,
              address2,
              city,
              country_code,
              phone,
              province,
              zip,
            },
          })
        } catch (error) {}

        this.handleOnCancel()
      } catch (error) {
        if (this.oGet(error, ['status']) === 409 && error.data) {
          this.conflict_customers = error.data.data || []
          this.show_modal_conflict = true
          return
        }

        this.toastError({
          title: 'Error !',
          message: this.$helper.upperFirst(this.oGet(error, ['data', 'message'])),
        })
      } finally {
        this.is_submiting = false
      }
    },

    handleOnCancel() {
      this.updateContext('customer-info')
    },

    removeMapping() {
      this.selected_customer_info = undefined
      delete this.submit_info.customer_id
      delete this.submit_info.address.id
    },

    handleConflict(data) {
      this.handleOnSave({
        email: data.email,
        phone: data.phone,
      })
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
