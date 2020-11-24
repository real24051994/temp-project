<template>
  <div class="reply-sidebar">
    <fa-simplebar class="h-100 w-100">
      <Customer v-if="context === 'customer-info'" :is_loading="is_loading" />

      <EditCustomer v-else-if="context === 'edit-customer'" />

      <CreateOrder v-else-if="context === 'create-order'" />
      <EditShippingAddress v-else-if="context === 'edit-shipping-address'" />
    </fa-simplebar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Customer from './customer'
import EditCustomer from './edit-customer'
import CreateOrder from './create-order'
import EditShippingAddress from './edit-shipping-address'

export default {
  components: {
    Customer,
    EditCustomer,
    CreateOrder,
    EditShippingAddress,
  },

  data() {
    return {
      is_loading: false,
    }
  },

  computed: {
    ...mapGetters({
      conversation: 'Conversation/getConversationInfo',
      context: 'Sidebar/getCurrentContext',
      submit_info: 'Order/getSubmitInfo',
    }),
  },

  watch: {
    conversation(val, oldVal) {
      if (val && val.customer_id) {
        if (oldVal && oldVal.customer_id === val.customer_id) {
          return
        }
        this.fetchInfo()
      } else {
        this.removeCustomerInfo()
      }
    },
  },

  created() {
    if (this.conversation && this.conversation.customer_id) {
      this.fetchInfo()
    } else {
      this.removeCustomerInfo()
    }
  },

  methods: {
    ...mapActions({
      fetchInfoCustomer: 'Customer/fetchInfo',
      removeCustomerInfo: 'Customer/removeInfo',
      updateContext: 'Sidebar/updateContext',
    }),

    async fetchInfo() {
      if (!this.conversation || !this.conversation.customer_id) {
        return
      }
      this.is_loading = true
      try {
        await this.fetchInfoCustomer({ customer_id: this.conversation.customer_id })
      } catch (error) {
        this.is_loading = false
      } finally {
        this.is_loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.reply-sidebar {
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-left: 1px solid #eaeaea;
}
</style>
