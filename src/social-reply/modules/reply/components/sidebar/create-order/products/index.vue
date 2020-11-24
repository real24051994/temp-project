<template>
  <div class="panel-products border-t">
    <div class="f-16 font-medium p-l-16 p-r-24">
      Product
    </div>
    <!--  -->
    <div class="p-t-8 p-b-8 p-l-16 p-r-24">
      <ModalSelectProduct @change="onAddProducts" />
    </div>
    <!--  -->
    <div class="flex flex-col">
      <ListProductItem v-for="item in calculated_info.line_items" :key="item.variant_id" :info="item" />
    </div>
    <!--  -->
  </div>
</template>

<script>
import ListProductItem from './list-product-item'
import ModalSelectProduct from '../modal-select-products'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ListProductItem,
    ModalSelectProduct,
  },

  computed: {
    ...mapGetters({
      calculated_info: 'Order/getCalculatedInfo',
      submit_info: 'Order/getSubmitInfo',
    }),
  },

  methods: {
    ...mapActions({
      updateSubmitInfo: 'Order/updateSubmitInfo',
    }),

    onAddProducts(items) {
      let line_items = items.map((item) => {
        return {
          variant_id: item.id,
          quantity: 1,
        }
      })

      let _items = [...this.submit_info.line_items, ...line_items]

      this.updateSubmitInfo({
        line_items: _items,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-products {
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
}
</style>
