<template>
  <div class="product-sources pt-4">
    <div class="container p-l-0 p-r-0">
      <div class="row">
        <div class="col col-12 p-l-0 p-r-0">
          <div class="d-flex align-items-center">
            <div class="count-products">
              <div class="number-products">{{ countProducts.total_products }}</div>
              <div class="txt-number-products">Total products</div>
            </div>
            <div class="vertical-line"></div>
            <div class="count-products">
              <div class="number-products">{{ countProducts.total_variants }}</div>
              <div class="txt-number-products">Total variants</div>
            </div>
            <div class="vertical-line"></div>
            <div class="product-list-search">
              <SearchInput v-model="keyword" @submit="onSubmitSearch" />
            </div>
          </div>
          <div class="mt-3">
            <TableProductList :products="products" :is_loading="is_loading" :is_shop_empty="is_shop_empty" />
          </div>
          <div class="mt-4" v-if="!is_shop_empty">
            <!-- <vue-pagination
        class="mb-0"
        v-if="!is_loading"
        :change="onChangePage"
        v-model="pagination.current_page"
        :total="pagination.total_page"
        :router-link="false"
      /> -->
            <template v-if="products.length">
              <div class="box-product-source">
                <a-button :disabled="pagination.prev_page == null" @click="prev()">
                  <sh-icon class="m-r-10" :icon="['far', 'long-arrow-alt-left']" /> Prev
                </a-button>
                <a-button :disabled="pagination.next_page == null" @click="next()">
                  Next <sh-icon class="m-l-10" :icon="['far', 'long-arrow-alt-right']" />
                </a-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableProductList from '../components/products/table-product-list'
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '../components/search-input'
export default {
  components: {
    TableProductList,
    SearchInput,
  },
  name: 'ProductList',
  metaInfo: {
    title: 'Product List',
  },
  data() {
    return {
      is_shop_empty: false,
      is_loading: false,
      limit: 24,
      keyword: '',
      params_sort: ['keyword', 'page'],
      countProducts: {},
    }
  },
  computed: {
    ...mapGetters({
      lastSearch: 'product/getSearchKeyword',
      pagination: 'product/getPagination',
      products: 'product/getProducts',
    }),
  },
  async created() {
    this.keyword = this.$route.query['keyword']
    if (this.$route.query['page']) {
      this.pagination.current_page = this.$route.query['page']
    }
    if (this.$route.query['keyword']) {
      this.pagination.keyword = this.$route.query['keyword']
    }
    this.fetchData(this.$route)
    this.$eventBus.$on('reload-syncing-shopify', this.reload)
  },
  methods: {
    reload() {
      this.fetchData(this.$route)
    },
    ...mapActions({
      fetchProducts: 'product/fetchProducts',
      updateSearch: 'product/updateSearch',
    }),
    async fetchData(route) {
      var query = this.getCurrentQuery(route)
      var current_page = query.page ? query.page : 1
      var keyword = query.keyword ? query.keyword : ''
      this.is_loading = true
      try {
        let data = await this.fetchProducts({
          current_page,
          limit: this.limit,
          keyword,
        })
        this.pagination.next_page = data.data.pagination.next_page
        this.pagination.prev_page = data.data.pagination.prev_page
        this.countProducts = data.data
        if (data.data.products === null) {
          this.is_shop_empty = true
        } else {
          this.is_shop_empty = false
        }
      } catch (e) {
      } finally {
        this.is_loading = false
      }
    },
    getCurrentQuery(route) {
      let query = {}
      if (route.query.page && this.$helper.isNumeric(route.query.page)) {
        query['page'] = route.query.page
      }
      if (route.query.keyword) {
        query['keyword'] = route.query.keyword
      }
      return query
    },
    onSubmitSearch() {
      let query = this.getCurrentQuery(this.$route)
      var keyword = this.keyword.trim()
      if (keyword) {
        query['keyword'] = this.keyword
      } else {
        delete query['keyword']
      }
      if (query.hasOwnProperty('page')) {
        delete query['page']
      }
      this.updateSearch(this.keyword)
      this.setQueryUrl(query)
    },
    setQueryUrl(object) {
      var query = {}
      this.params_sort.forEach((item) => {
        if (object.hasOwnProperty(item)) {
          query[item] = object[item]
        }
      })
      this.pushRouterLinkDefault({
        name: 'ProductSources',
        query: query,
      })
    },
    onChangePage(page) {
      this.fetchData(page)
    },
    next() {
      let query = this.getCurrentQuery(this.$route)
      if (this.pagination.next_page) {
        query['page'] = this.pagination.next_page
      }
      this.setQueryUrl(query)
    },
    prev() {
      let query = this.getCurrentQuery(this.$route)
      if (this.pagination.prev_page) {
        query['page'] = this.pagination.prev_page
      }
      this.setQueryUrl(query)
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to)
    next()
  },
  beforeDestroy() {
    this.$eventBus.$off('reload-syncing-shopify')
  },
}
</script>

<style lang="scss" scoped>
.product-list-search {
  width: 300px;
}
.product-sources {
  // max-width: 1500px;
  // margin: 0 auto;
  .count-products {
    .number-products {
      font-weight: bold;
      font-size: 18px;
      color: $text;
    }
    .txt-number-products {
      font-size: 12px;
      color: $dark-gray3;
    }
  }
  .vertical-line {
    height: 34px;
    width: 1px;
    background: $border-color;
    margin: 0 20px;
  }
  .box-product-source {
    text-align: center;
    margin-top: 10px;
    .ant-btn {
      margin: 0 6px;
      min-width: 80px;
    }
  }
}
</style>
