<template>
  <div class="product-sources-filter px-5">
    <div v-if="Object.keys(this.last_filter_setting).length === 0" class="mt-5 pt-5 d-flex align-items-center justify-content-center">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>
    <template v-else>
      <div class="py-4">
        <div class="row align-items-baseline">
          <div class="col col-md-2 p-r-0">
            <h2 class="title m-b-0">
              Source Filter
            </h2>
          </div>
          <div class="col col-md-10">
            <div class="setting-row">
              <div class="setting-value">
                <a-radio-group :options="type_get_product_options" v-model="filter_setting.type_get_product" />
                <div v-if="filter_setting.type_get_product === 'specific_collections'">
                  <SelectSourceCollections :collections.sync="filter_setting.collections" :count_products="filter_setting.count_products" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <AdditionFilter /> -->
      <!--  -->
      <div class="setting-footer">
        <a-button v-show="is_changing_settings" @click="onClickDiscardSettings">
          Discard Settings
        </a-button>

        <a-button type="primary" class="ml-3" :disabled="disabled_submit" @click="onSubmit">
          Save & Update feed
        </a-button>
      </div>
      <!--  -->
    </template>
  </div>
</template>

<script>
import api from '../api'
import { mapGetters, mapActions } from 'vuex'
import SelectSourceCollections from '../components/filter/select-source-collections'
import { isEqual } from 'lodash'
// import AdditionFilter from '../components/filter/addition-filter'

export default {
  components: {
    SelectSourceCollections,
    // AdditionFilter
  },

  name: 'ProductSourcesFilter',

  metaInfo: {
    title: 'Filter',
  },

  data() {
    return {
      is_submiting: false,

      type_get_product_options: [
        { label: 'All Product', value: 'all_product' },
        { label: 'Specific Collections', value: 'specific_collections' },
      ],

      filter_setting: {
        type_get_product: '',
        collection_ids: [],
        collections: [],
        count_products: [],
      },
    }
  },

  created() {
    if (Object.keys(this.last_filter_setting).length === 0) {
      this.fetchData()
    } else {
      this.filter_setting = JSON.parse(JSON.stringify(this.last_filter_setting))
      this.fetchData()
    }
  },

  computed: {
    ...mapGetters({
      last_filter_setting: 'product/getFilterSettings',
    }),

    is_changing_settings() {
      return !isEqual(this.filter_setting, this.last_filter_setting)
    },

    disabled_submit() {
      if (this.is_submiting) {
        return true
      }

      if (this.filter_setting.type_get_product === 'specific_collections') {
        if (this.filter_setting.collections.length === 0) {
          return true
        }
      }

      if (!this.is_changing_settings) {
        return true
      }
      return false
    },
  },

  methods: {
    ...mapActions({
      setFilterSettings: 'product/setFilterSettings',
    }),

    async fetchData() {
      try {
        let response = await api.getProductSourcesFilter()
        let { status, message, data } = response.data

        if (!status) {
          this.toastError({
            title: 'Error',
            message,
          })
          return
        }
        this.setData(data)
      } catch (error) {
        this.toastError({
          title: 'Error',
          message: 'There was an error retrieving data from the server.',
        })
      }
    },

    async onSubmit() {
      this.filter_setting.collection_ids = this.filter_setting.collections.map((item) => item.internal_id)

      let { type_get_product, collection_ids } = this.filter_setting

      if (type_get_product === 'all_product') {
        collection_ids = []
      } else if (collection_ids.length === 0) {
        return
      }

      try {
        this.is_submiting = true
        const response = await api.updateProductSourcesFilter({
          type_get_product,
          collection_ids,
        })

        const { status, message, data } = response.data

        if (!status) {
          this.toastError({
            title: 'Error',
            message,
          })
          return
        }

        this.setData(data)

        this.toastSuccess({
          title: 'Success',
          message: 'Update successful.',
        })
      } catch (error) {
        this.toastError({
          title: 'Error',
          message: 'An error occurred while saving data.',
        })
      } finally {
        this.is_submiting = false
      }
    },

    setData(data) {
      try {
        const { type_get_product, collection_ids, collections, count_products } = data
        this.filter_setting = {
          type_get_product: type_get_product.toLowerCase(),
          collection_ids,
          collections,
          count_products,
        }

        this.setFilterSettings({
          type_get_product: type_get_product.toLowerCase(),
          collection_ids,
          collections,
          count_products,
        })
      } catch (error) {}
    },

    onClickDiscardSettings() {
      this.$confirm({
        btnSaveClass: 'btn btn-primary',
        title: 'Cancel Without Saving',
        content: 'Are you sure you want to cancel this setting?',
        okText: 'Discard',
        cancelText: 'Cancel',
        onClose: null,
        okType: 'outline-danger',
        onOk: () => {
          this.filter_setting = JSON.parse(JSON.stringify(this.last_filter_setting))
        },
      })
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.is_changing_settings && Object.keys(this.last_filter_setting).length) {
      this.$confirm({
        title: 'Discard Changes',
        content: "The changes won't be saved. Do you want to leave this page?",
        okText: 'Discard',
        cancelText: 'Cancel',
        okType: 'outline-danger',
        zIndex: 10002,
        onOk: () => {
          next()
        },
        onCancel: () => {},
      })
    } else {
      next()
    }
  },
}
</script>

<style lang="scss" scoped>
.product-sources-filter {
  width: 100%;
  font-size: 14px;
  max-width: 846px;
  margin: 0 auto;
  h2.title {
    font-size: 18px;
  }

  .setting-row {
    display: flex;
    padding: 11px 0;

    .setting-label {
      width: 120px;
      font-weight: 500;
    }

    .setting-value {
      padding-left: 20px;
    }
  }

  .addition-filter {
    border-top: 1px solid #d8d8d8;
    padding: 24px 0;
  }

  .setting-footer {
    border-top: 1px solid #d8d8d8;
    padding: 30px 0 60px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
