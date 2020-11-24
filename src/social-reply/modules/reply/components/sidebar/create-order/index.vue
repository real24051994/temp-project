<template>
  <div class="panel-create-order">
    <div class="flex items-center p-t-16 p-r-24 p-l-16">
      <div class="flex-1 f-18 font-medium">
        Create Order
      </div>

      <div>
        <sh-icon :icon="['fas', 'times']" class="f-17 pointer" style="color: #cecece;" @click="updateContext('customer-info')" />
      </div>
    </div>
    <!--  -->

    <ShippingAddress />

    <OrderNote />

    <Products />

    <Summary />

    <div class="p-t-16 p-b-16 p-l-16">
      <fa-button type="primary" :disabled="disabled" @click="handleSubmitCreateOrder">
        <a-icon v-if="is_loading" type="loading" style="font-size: 14px; color: white;" spin class="m-r-16" />
        Create
      </fa-button>
    </div>
  </div>
</template>

<script>
import ShippingAddress from './shipping-address'
import OrderNote from './order-note'
import Products from './products'
import Summary from './summary'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ShippingAddress,
    OrderNote,
    Products,
    Summary,
  },

  data() {
    return {
      is_loading: false,
    }
  },

  computed: {
    ...mapGetters({
      submit_info: 'Order/getSubmitInfo',
      customer_info: 'Customer/getCustomerInfo',
      conversation_info: 'Conversation/getConversationInfo',
    }),

    disabled() {
      if (!this.is_loading && this.submit_info && this.submit_info.line_items.length > 0) {
        return false
      }
      return true
    },
  },

  created() {
    if (this.customer_info && this.customer_info.id) {
      if (this.customer_info.default_address && this.isEmpty(this.submit_info.shipping_address)) {
        const { first_name, last_name, company, address1, address2, city, country_code, phone, province, zip } = this.customer_info.default_address
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
      }
    } else {
      this.updateSubmitInfo({
        customer_id: undefined,
      })
    }
  },

  methods: {
    ...mapActions({
      updateSubmitInfo: 'Order/updateSubmitInfo',
      resetOrderInfo: 'Order/reset',

      updateConversationBySenderId: 'Conversation/updateConversationBySenderId',
      updateConversationInfo: 'Conversation/updateConversationInfo',

      sendMessage: 'Message/sendMessage',

      updateContext: 'Sidebar/updateContext',

      updateSendingReceiptStatus: 'Sidebar/updateSendingReceiptStatus',
    }),

    async handleSubmitCreateOrder() {
      if (this.is_loading) {
        return
      }

      this.is_loading = true

      try {
        let customer_id = null

        if (!this.customer_info || !this.customer_info.id) {
          try {
            let { data } = await this.$api.SOCIAL.mappingUserWithCustomer(this.conversation_info.sender_id, {
              email: this.conversation_info.email,
              note: '',
            })

            if (data && data.id) {
              customer_id = data.id
            }
          } catch (error) {}
        } else {
          customer_id = this.customer_info.id
        }

        let rs = await this.$api.SHOPIFY.ORDERS.create(
          Object.assign(this.submit_info, {
            customer_id,
          })
        )

        try {
          this.updateConversationBySenderId({
            sender_id: this.conversation_info.sender_id,
            customer_id,
          })

          this.updateConversationInfo(
            Object.assign(this.conversation_info, {
              customer_id,
            })
          )
        } catch (error) {}

        try {
          if (rs.data && rs.data.id && this.$route.name != 'Comment') {
            this.updateSendingReceiptStatus(true)
            await this.$api.SOCIAL.sendReceipt({
              social_account_id: this.conversation_info.social_account_id,
              sender_id: this.conversation_info.sender_id,
              order_id: rs.data.id,
            })
            this.updateSendingReceiptStatus(false)
          }
        } catch (error) {
          this.updateSendingReceiptStatus(false)
        }

        try {
          if (rs.data && rs.data.id && this.$route.name != 'Comment') {
            await this.sendMessage({
              social_conversation_id: this.conversation_info.conversation_id,
              text: `These items will be reserved for you. Complete your purchase in the checkout link below: \n ${this.oGet(rs, ['data', 'invoice_url'])}`,
              tag: 'POST_PURCHASE_UPDATE',
            })
          }
        } catch (error) {}

        this.resetOrderInfo()
        this.updateContext('customer-info')
      } catch (error) {
        this.toastError({
          title: 'Error !',
          message: error.message || 'Something went wrong',
        })
      } finally {
        this.is_loading = false
      }
    },
  },
}
</script>
