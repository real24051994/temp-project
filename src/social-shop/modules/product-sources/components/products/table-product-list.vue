<template>
  <div class="table-product-list">
    <template v-if="getView == 'list'">
      <div class="table-header">
        <div class="column-title">
          Title
        </div>
        <!-- <div class="column-id">
          ID
        </div> -->
        <div class="column-source">
          Product source
        </div>
      </div>
      <div key="is-loading" v-if="is_loading" class="m-b-5 m-t-5">
        <a-skeleton
          v-for="item in 10"
          :key="`skeleton_${item}`"
          :loading="is_loading"
          active
          :avatar="{ shape: 'square' }"
          :paragraph="{ rows: 1, width: '100%' }"
        ></a-skeleton>
      </div>
      <div key="loading-success" v-else-if="is_shop_empty" class="shop-empty">
        <img src="@shop/assets/images/no-product-feed.svg" alt />
        <h4 class="m-t-20">You don’t have any product on Shopify to create feed</h4>
        <Button class="ant-btn ant-btn-primary m-t-20 custom-font-weight">
          <a target="_blank" :href="`https://${shop.domain}/admin/products`">Add Product</a>
        </Button>
      </div>
      <div v-else-if="products && products.length === 0" class="no-result-found">
        No result found
      </div>
      <template v-else>
        <div class="table-row" v-for="item in products" :key="item.id">
          <div class="column-title d-flex align-items-center">
            <div class="product-img">
              <img v-if="item.image_url" :src="item.image_url" alt="" />
              <img v-else src="@shop/assets/images/no-image.svg" alt />
            </div>

            <div class="product-name">
              <div class="d-inline-block" v-tooltip="tooltip" :title="item.title">
                <span>
                  {{ item.title }}
                </span>
              </div>
              <div style="color: #757575">{{ item.rest_id }}</div>
            </div>
          </div>
          <!-- <div class="column-id">
            {{ item.rest_id }}
          </div> -->
          <div class="column-source">
            <img v-if="getIconBySource(item.source)" :src="getIconBySource(item.source)" :alt="item.source" />
            {{ item.source }}
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div key="is-loading-grid" v-if="is_loading" class="m-b-5 m-t-5">
        <a-skeleton
          v-for="item in 10"
          :key="`skeleton_${item}`"
          :loading="is_loading"
          active
          :avatar="{ shape: 'square' }"
          :paragraph="{ rows: 1, width: '100%' }"
        ></a-skeleton>
      </div>
      <div key="loading-success-grid" v-else-if="is_shop_empty" class="shop-empty">
        <img src="@shop/assets/images/no-product-feed.svg" alt />
        <h4 class="m-t-20">You don’t have any product on Shopify to create feed</h4>
        <Button class="ant-btn ant-btn-primary m-t-20 custom-font-weight">
          <a target="_blank" :href="`https://${shop.domain}/admin/products`">Add Product</a>
        </Button>
      </div>
      <div v-else-if="products && products.length === 0" class="no-result-found">
        No result found
      </div>
      <template v-else>
        <div class="table-grid">
          <div v-for="item in products" :key="item.id" class="info-products">
            <div v-if="item.image_url" :style="{ 'background-image': 'url(' + item.image_url + ')' }" class="img-product-source"></div>
            <div v-else class="custom-no-image" :style="{ 'background-image': 'url(' + require(`@shop/assets/images/no-image.svg`) + ')' }"></div>
            <div class="id-product-source m-t-10 d-flex align-items-center justify-content-between">
              <div>{{ item.rest_id }}</div>
              <!-- <div><img src="@shop/assets/images/icon-gg-new.svg" alt /></div> -->
            </div>
            <div v-line-clamp:20="2" class="m-t-10 m-b-10">
              <a-popover overlayClassName="popover-products" trigger="hover">
                <template slot="content">
                  {{ item.title }}
                </template>
                {{ item.title }}
              </a-popover>
            </div>
            <div class="source-from-products d-flex align-items-center">
              <img v-if="getIconBySource(item.source)" :src="getIconBySource(item.source)" :alt="item.source" />
              <div class="m-l-10">{{ item.source }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    products: {
      type: Array,
      default: () => [],
      required: true,
    },

    is_loading: {
      type: Boolean,
      default: false,
    },

    is_shop_empty: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      tooltip: {
        contentAsHTML: true,
        side: 'bottom',
        maxWidth: 400,
      },
    }
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
      getView: 'product/getView',
    }),
  },

  methods: {
    ...mapMutations({
      setView: 'product/setView',
    }),
    getIconBySource(source) {
      if (source && source.toLowerCase() === 'shopify') {
        return require('@shop/assets/images/icon-shopify-3.svg')
      }
      return ''
    },
  },
  mounted() {
    if (!localStorage.hasOwnProperty(`isViewStatus_${this.shop.id}`)) {
      localStorage.setItem(`isViewStatus_${this.shop.id}`, this.getView)
    }
    this.setView(localStorage.getItem(`isViewStatus_${this.shop.id}`))
  },
}
</script>

<style lang="scss" scoped>
.table-product-list {
  color: #252627;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;

  .column-title {
    width: 55%;
  }

  .column-id {
    width: 20%;
  }

  .column-source {
    width: 25%;
    display: flex;
    align-items: center;
    text-transform: capitalize;

    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .table-header {
    height: 40px;
    border-bottom: 2px solid #e2e2e2;
    font-weight: 600;
    background: $white;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 30px 20px;
    display: flex;
    align-items: center;
    border: 0.5px solid #e2e2e2;
  }

  .table-row {
    background-color: #ffffff;
    border-bottom: 0.5px solid #e2e2e2;
    border-left: 0.5px solid #e2e2e2;
    border-right: 0.5px solid #e2e2e2;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    font-size: 14px;

    &:hover {
      background-color: $body-background;
    }

    .product-img {
      min-width: 48px;
      width: 48px;
      height: 48px;
      border-radius: 2px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
    }

    .product-name {
      flex-grow: 1;
      padding-left: 16px;
      padding-right: 30px;
      color: #252627;
      line-height: 17px;
      overflow: hidden;

      span {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }

  .no-result-found {
    padding-top: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #828282;
  }

  .shop-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
  }

  .table-grid {
    border-left: 0.5px solid #dddddd;
    border-top: 0.5px solid #dddddd;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-left: -5px;
    margin-right: -5px;

    .info-products {
      width: 16.66667%;
      padding: 10px 20px;
      border-right: 0.5px solid #dddddd;
      border-bottom: 0.5px solid #dddddd;
      background: $white;

      &:nth-child(6n + 6) {
        border-right: 0.5px solid #dddddd;
      }
      &:hover {
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        z-index: 1;
      }
      .img-product-source {
        background-color: #f2f2f2;
        background-size: cover;
        background-position: 50%;
        border-radius: 4px;
        height: 160px;
        border: 1px solid #e2e2e2;
        img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 6px;
        }
      }
      .custom-no-image {
        background-position: 50%;
        border-radius: 4px;
        background-repeat: no-repeat;
        background-size: contain;
        height: 160px;
      }
      .id-product-source {
        color: $dark-gray3;
      }
      .source-from-products {
        text-transform: capitalize;
      }
    }
  }
}
</style>

<style lang="scss">
.popover-products {
  .ant-popover-content {
    width: 300px;
    text-align: center;
  }
}
</style>
