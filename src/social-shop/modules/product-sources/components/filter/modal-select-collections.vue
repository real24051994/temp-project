<template>
  <a-modal
    class="modal-select-collection"
    title="Select Collection"
    width="600px"
    :visible="visible"
    :footer="false"
    @cancel="closeModal()"
  >
    <div class="search-collection">
      <SearchInput v-model="keyword" @submit="onSearch" />
    </div>

    <div v-if="is_loading" class="d-flex align-items-center justify-content-center p-5">
      <a-spin size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>

    <div v-else class="list-collections">
      <template v-if="collections.length > 0">
        <label v-for="item in collections" :key="item.id" class="collection-item" @click="onChangeCollection(item)">
          <div class="item-name">
            <div>
              <label class="ant-checkbox-wrapper m-r-10">
                <span class="ant-checkbox" :class="{ 'ant-checkbox-checked': isChecked(item.internal_id) }">
                  <span class="ant-checkbox-inner"></span>
                </span>
              </label>
            </div>

            <div class="item-img">
              <img v-if="item.image" :src="item.image" alt />
              <img v-else src="@shop/assets/images/no-image.svg" alt />
            </div>

            <div class="item-title" :title="item.title">
              {{ item.title }}
            </div>

            <div class="item-counter">
              ({{ getCounter(item.internal_id) }})
            </div>
          </div>

          <div class="item-type">
            {{ getTypeName(item.type) }}
          </div>
        </label>
      </template>

      <template v-else>
        <div class="d-flex align-items-center justify-content-center p-5">Collection not found</div>
      </template>

      <div class="list-pagination">
        <vue-pagination :change="onChangePage" v-model="pagination.current_page" :total="pagination.total_page" :router-link="false" />
      </div>
    </div>

    <div class="modal-action">
      <a-button @click="closeModal()">Cancel</a-button>
      <a-button @click="onClickApply" class="m-l-10" type="primary">Apply</a-button>
    </div>
  </a-modal>
</template>

<script>
import SearchInput from '../search-input';
import { mapActions } from 'vuex'

export default {
  components: {
    SearchInput
  },

  props: {
    search_keyword: {
      type: String,
      default: '',
      required: false
    },

    visible: {
      type: Boolean,
      default: false
    },

    selected: {
      type: Array,
      default: () => []
    },

    count_products: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      is_loading: false,
      collections: [],

      keyword: '',

      pagination: {
        current_page: 1,
        per_page: 10,
        total_page: 1,
        total: 0
      },

      selected_items: []
    }
  },

  created() {
    if (this.search_keyword) {
      this.keyword = this.search_keyword
    }

    if (this.selected) {
      this.selected_items = JSON.parse(JSON.stringify(this.selected))
    }

    if (this.visible) {
      this.fetchCollections()
    }
  },

  watch: {
    selected(val) {
      this.selected_items = JSON.parse(JSON.stringify(val))
    },

    visible(val) {
      if (val === true) {
        this.keyword = this.search_keyword
        this.fetchCollections()
      }
    },

    search_keyword(val) {
      this.keyword = val
    }
  },

  methods: {
    ...mapActions({
      getCollection: "auth/getCollection",
    }),

    async fetchCollections() {
      this.is_loading = true
      try {
        let response = await this.getCollection({
          page: this.pagination.current_page,
          limit: this.pagination.per_page,
          keyword: this.keyword
        })

        const { status, message, data, pagination } = response.data

        if (!status) {
          this.toastError({
            title: 'Error',
            message
          })
          return
        }

        this.collections = data
        this.pagination = JSON.parse(JSON.stringify(pagination))
      } catch (error) {
        this.toastError({
          title: 'Error',
          message: 'There was an error retrieving data from the server.'
        })
      } finally {
        this.is_loading = false
      }
    },

    onChangePage(page) {
      this.pagination.current_page = page
      this.fetchCollections()
    },

    onSearch() {
      this.pagination.current_page = 1
      this.fetchCollections()
    },

    onClickApply() {
      this.$emit('change', this.selected_items)
      this.$emit('close')
    },

    onChangeCollection(item) {
      const index = this.selected_items.findIndex(collection => collection.internal_id === item.internal_id)

      if (index >= 0) {
        this.selected_items.splice(index, 1)
      } else {
        this.selected_items.push(item)
      }
    },

    isChecked(internal_id) {
      return this.selected_items.findIndex(item => item.internal_id === internal_id) >= 0
    },

    closeModal() {
      if (this.selected) {
        this.selected_items = JSON.parse(JSON.stringify(this.selected))
      }
      this.$emit('close')
    },

    getCounter(internal_id) {
      const item = this.count_products.find(item => item.id === internal_id)

      if (item) {
        return item.products_count
      }
      return 0
    },

    getTypeName(type) {
      if (type === 'custom') {
        return 'Manual Collection'
      } else if (type === 'smart') {
        return 'Smart Collection'
      }
      return type
    }
  }
}
</script>

<style lang="scss">
.modal-select-collection {
  top: 25px;

  .ant-modal-title {
    font-size: 20px;
    color: #252627;
  }

  .ant-modal-header {
    border-bottom: unset !important;
  }

  .ant-modal-body {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.modal-select-collection {
  .collection-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e2e2e2;
    padding: 8px 16px;
    cursor: pointer;

    .item-name {
      width: 70%;
      display: flex;
      align-items: center;

      .item-img {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 2px;
        overflow: hidden;
        margin-right: 16px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .item-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-counter {
        padding-left: 4px;
      }
    }

    .item-type {
      width: 30%;
      text-align: right;
    }
  }

  .is-activated {
    border-bottom: 2px solid $primary-color;
    color: $primary-color;
    font-weight: 500;
  }

  .search-collection {
    padding: 5px 16px 16px 16px;
    border-bottom: 1px solid #e1e1e1;
  }

  .list-collections {
    padding: 16px 16px 0 16px;
  }

  .list-pagination {
    padding: 20px 0 6px 0;
  }

  .modal-action {
    border-top: 1px solid #e1e1e1;
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
