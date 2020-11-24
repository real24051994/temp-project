<template>
  <div class="select-source-collections mt-4">
    <div class="">
      <!-- <a-input-search placeholder="Seach collection" @search="onSearch" @keyup="onKeyword">
        <a-button slot="enterButton">
          Select Collection
        </a-button>
      </a-input-search> -->
      <a-button @click="is_show_modal = true">Select Collection</a-button>
    </div>

    <div class="collection-items mt-3" v-if="selected_collections.length > 0">
      <div class="collection-header">
        <div class="collection-info">Selected Collections</div>
        <div class="item-type" style="margin-left: -10px">
          Collections Type
        </div>
        <div class="item-bulk"></div>
      </div>

      <div class="collection-list-body" id="style-scroll-bar">
        <div v-for="(item, i) in selected_collections" :key="i + item.internal_id" class="collection-item">
          <div class="collection-info">
            <div class="item-img">
              <img v-if="item.image" :src="item.image" alt />
              <img v-else src="@shop/assets/images/no-image.svg" alt />
            </div>

            <div class="collection-title" :title="item.title">
              {{ item.title }}
            </div>

            <div class="collection-counter">({{ getCounter(item.internal_id) }})</div>
          </div>

          <div class="item-type">
            {{ getTypeName(item.type) }}
          </div>

          <div class="item-action">
            <!-- <a-button type="danger" class="btn-action-delete" @click="removeCollection(item.internal_id)">
              Delete
            </a-button> -->
            <div @click="removeCollection(item.internal_id)"><sh-icon style="color: #CECECE; cursor: pointer; font-size: 16px" :icon="['fal', 'times']" /></div>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <ModalSelectCollections
      :visible="is_show_modal"
      @close="is_show_modal = false"
      :selected="selected_collections"
      :search_keyword="search_keyword"
      @change="changeCollections"
      :count_products="count_products"
    />
  </div>
</template>

<script>
import ModalSelectCollections from './modal-select-collections'

export default {
  components: {
    ModalSelectCollections,
  },

  props: {
    collections: {
      type: Array,
      default: () => [],
    },

    count_products: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      timeout: null,
      selected_collections: [],

      is_show_modal: false,
      search_keyword: '',
    }
  },

  created() {
    this.initData(this.collections)
  },

  watch: {
    collections(val) {
      if (val) {
        this.initData(val)
      }
    },
  },

  methods: {
    onSearch(value) {
      this.search_keyword = value
      this.is_show_modal = true
    },

    initData(collections) {
      if (collections) {
        this.selected_collections = JSON.parse(JSON.stringify(collections))
      }
    },

    getCounter(internal_id) {
      const item = this.count_products.find((item) => item.id === internal_id)

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
    },

    onKeyword(event) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (event.keyCode === 27 || !event.target.value) {
        return
      }

      if (event.keyCode == 13) {
        // this.onSearch(event.target.value)
      } else {
        this.timeout = setTimeout(() => {
          this.onSearch(event.target.value)
        }, 500)
      }
    },

    changeCollections(collections) {
      this.selected_collections = JSON.parse(JSON.stringify(collections))
      this.$emit('update:collections', JSON.parse(JSON.stringify(collections)))
    },

    removeCollection(id) {
      const index = this.selected_collections.findIndex((item) => item.internal_id === id)

      if (index >= 0) {
        this.selected_collections.splice(index, 1)
      }

      this.$emit('update:collections', JSON.parse(JSON.stringify(this.selected_collections)))
    },
  },
}
</script>

<style lang="scss" scoped>
.select-source-collections {
  max-width: 100%;
  width: 600px;
}

.collection-items {
  width: 100%;
  max-width: 100%;
  font-size: 14px;

  .collection-header {
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0px 0px;
    height: 40px;
    font-weight: 500;
    padding: 0 16px;
    justify-content: space-between;
    color: #000000;
    border-bottom: 2px solid #e2e2e2;
  }

  .collection-list-body {
    max-height: 260px;
    overflow-y: auto;
  }

  .collection-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e2e2e2;
    padding: 8px 16px;
    justify-content: space-between;

    &:hover {
      background-color: rgb(239, 239, 239, 0.6);

      .btn-action-delete {
        display: inline-block;
      }
    }
  }

  .collection-info {
    width: 50%;
    display: flex;
    align-items: center;
    padding-right: 16px;

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

    .collection-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .collection-counter {
      padding-left: 4px;
    }
  }

  .item-type {
    width: 26%;
  }

  .item-action {
    .btn-action-delete {
      display: none;
      transition: all 0.1s linear;

      &:hover {
        border: 1px solid;
      }
    }
  }
}
</style>
