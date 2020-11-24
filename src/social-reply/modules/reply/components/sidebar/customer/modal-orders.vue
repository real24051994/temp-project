<template>
  <a-modal v-model="show" class="modal-all-orders" :body-style="{ padding: 0 }" title="Latest Orders" :footer="false" width="420px">
    <div class="list-orders">
      <OrderItem v-for="item in orders" :key="item.id" :info="item" />
    </div>
  </a-modal>
</template>

<script>
import OrderItem from './order-item'

export default {
  components: {
    OrderItem,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },

    orders: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    show: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },
}
</script>

<style lang="scss">
.modal-all-orders {
  .ant-modal-header {
    height: 56px;
    padding: 0 16px;
    display: flex;
    align-items: center;

    .ant-modal-title {
      font-size: 20px;
      color: $text;
    }
  }
}
</style>

<style lang="scss" scoped>
.list-orders {
  padding: 0 24px 16px 24px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
