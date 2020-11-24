<template>
  <div>
    <slot>
      <fa-button @click="show = true">
        Select Product
      </fa-button>
    </slot>

    <a-modal v-model="show" :title="false" :footer="false" :centered="true" class="modal-select-products" :body-style="{ padding: '' }" width="600px">
      <div class="modal-select-products">
        <div class="modal-select-products--header f-20 font-medium flex items-center p-l-16" style="height: 64px;">
          Product
        </div>
        <!--  -->
        <div class="border-b p-l-16 p-r-16 p-b-16">
          <search-input v-model="keyword" @input="is_typing = true" @submit="onSearch" />
        </div>
        <!--  -->
        <div v-if="is_loading" class="list-products-wraper center">
          <fa-spin />
        </div>

        <div class="list-products-wraper center" v-else-if="!is_loading && !is_typing && keyword === '' && isEmpty(products)">
          You don't have any product on Shopify
        </div>

        <div class="list-products-wraper center" v-else-if="!is_loading && !is_typing && !isEmpty(keyword) && isEmpty(products)">
          Product not found
        </div>

        <div v-else class="list-products-wraper list-products overflow-auto">
          <template v-for="item in products">
            <ProductSimpleItem v-if="item.variants.length === 1" :key="item.id" :product="item" v-model="selected" />
            <ProductVariants v-if="item.variants.length > 1" :key="item.id" :product="item" v-model="selected" />
          </template>
        </div>

        <!--  -->
        <div class="p-t-16 p-b-16 flex content-center border-t">
          <fa-button
            class="m-r-4"
            :type="`${isEmpty(previous) ? 'default' : 'primary outline'}`"
            :disabled="isEmpty(previous) || is_loading"
            @click="handleFetch({ rel: 'previous', cursor: previous })"
          >
            Prev
          </fa-button>

          <fa-button
            class="m-l-4"
            :type="`${isEmpty(next) ? 'default' : 'primary outline'}`"
            :disabled="isEmpty(next) || is_loading"
            @click="handleFetch({ rel: 'next', cursor: next })"
          >
            Next
          </fa-button>
        </div>
        <!--  -->

        <div class="p-b-16 p-t-16 p-r-16 border-t flex content-end">
          <fa-button @click="onCancel">
            Cancel
          </fa-button>

          <fa-button type="primary" @click="onApply" class="m-l-8" :disabled="disabled">
            Apply
          </fa-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import ProductSimpleItem from './product-simple-item'
import ProductVariants from './product-variants'

export default {
  components: {
    ProductSimpleItem,
    ProductVariants,
  },

  data() {
    return {
      is_loading: false,
      is_typing: false,

      show: false,

      keyword: '',

      selected: [],

      next: '',
      previous: '',

      products: [],
    }
  },

  computed: {
    disabled() {
      return this.selected.length <= 0
    },
  },

  watch: {
    show(val) {
      if (val) {
        this.handleFetch({})
      }
    },
  },

  methods: {
    async handleFetch({ cursor, rel }) {
      this.is_loading = true
      try {
        const { data } = await this.$api.SHOPIFY.fetchProducts({
          keyword: this.keyword ? this.keyword : null,
          cursor,
          rel,
        })

        this.products = data.rows
        this.previous = data.previous
        this.next = data.next
      } catch (error) {
      } finally {
        this.is_loading = false
      }
    },

    onSearch() {
      this.is_typing = false
      this.handleFetch({})
    },

    onApply() {
      const items = JSON.parse(JSON.stringify(this.selected))
      this.$emit('input', items)

      this.$emit('change', items)

      this.keyword = ''
      this.show = false
      this.products = []

      this.selected = []
    },

    onCancel() {
      this.show = false
      this.keyword = ''
      this.products = []

      this.selected = []
    },
  },
}
</script>

<style lang="scss" scoped>
.list-products {
  padding: 0;
}

.list-products-wraper {
  height: 450px;
  max-height: 450px;
}
</style>
