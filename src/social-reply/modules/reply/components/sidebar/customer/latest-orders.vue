<template>
  <div class="panel-last-order border-t">
    <div class="flex items-center">
      <div class="flex-1">
        Latest Orders
      </div>

      <a @click="show_modal = true" class="f-12" v-if="orders.length > 3"> View alls ({{ orders.length }})</a>
    </div>

    <!--  -->
    <div v-if="is_loading && isEmpty(list_orders)" class="center p-t-16">
      <fa-spin />
    </div>

    <template v-else>
      <OrderItem v-for="item in list_orders" :key="item.id" :info="item" />
    </template>

    <!--  -->
    <fa-button type="primary" class="w-100 m-t-16" @click="updateContext('create-order')">
      Create New Order
    </fa-button>

    <ModalAllOrders :visible.sync="show_modal" :orders="orders" />
  </div>
</template>

<script>
import ModalAllOrders from './modal-orders'
import OrderItem from './order-item'
import api from '@reply/utils/api'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ModalAllOrders,
    OrderItem,
  },

  data() {
    return {
      is_loading: false,
      show_modal: false,

      orders: [],
    }
  },

  computed: {
    ...mapGetters({
      customer_info: 'Customer/getCustomerInfo',
    }),

    list_orders() {
      return this.orders.slice(0, 3)
    },
  },

  watch: {
    'customer_info.id'(val) {
      if (val) {
        this.fetchOrders()
      }
    },
  },

  created() {
    if (this.customer_info.id) {
      this.fetchOrders()
    }
  },

  methods: {
    ...mapActions({
      updateContext: 'Sidebar/updateContext',
    }),

    async fetchOrders() {
      this.is_loading = true
      try {
        const { data } = await api.SHOPIFY.CUSTOMERS.getOrders(this.customer_info.id)

        this.orders = data.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at)
        })
      } catch (error) {
      } finally {
        this.is_loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-last-order {
  padding: 16px 24px 16px 16px;
}

.order-item {
  height: 36px;
  display: flex;
  margin-bottom: 16px;

  img {
    border-radius: 4px;
    width: 36px;
    height: 36px;
    object-fit: cover;
  }
}
</style>
