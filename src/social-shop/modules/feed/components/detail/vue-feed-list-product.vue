<template>
  <div class="list-feed-product-table">
    <vue-simple class="list-feed-product-table-scrollbar">
      <div class="list-feed-product-table-wrap">
        <div class="list-feed-product-table-header">
          <div class="item-row item-row-heading">
            <div class="item-col item-col-checkbox">
              <div class="item-col-content">
                <label class="ant-checkbox-wrapper" :class="{ 'ant-checkbox-wrapper-checked': check_all }">
                  <span class="ant-checkbox" :class="{ 'ant-checkbox-checked': check_all }">
                    <input type="checkbox" class="ant-checkbox-input" v-model="check_all" />
                    <span class="ant-checkbox-inner"></span>
                  </span>
                </label>
              </div>
            </div>
            <div class="item-col" v-for="(item, index) in table_header" :class="`item-col-${item.column}`" :key="`table_header_index${index}`">
              <div class="item-col-content" v-if="item.column == 'title'">
                <template v-if="selected.length">
                  <div class="d-flex align-items-center">
                    <span class="m-r-5">{{ selected.length }} selected</span>
                    <assign-value v-model="selected" @reload="reload">
                      <template slot="btn-trigger">
                        <a-button>Bulk Assign Value</a-button>
                      </template>
                    </assign-value>
                  </div>
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
              </div>
              <div class="item-col-content" v-else>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <transition name="fade-in" mode="out-in">
          <div class="list-feed-product-table-body" v-if="loading" key="loading">
            <div class="item-row" v-for="item in 5" :key="`item_${item}`">
              <a-skeleton class="p-t-10" active :avatar="false" :title="false" :paragraph="{ rows: 3, width: '100%' }"></a-skeleton>
            </div>
          </div>
          <div class="list-feed-product-table-body" v-else key="loaded">
            <template v-if="data.length">
              <template v-for="(item, index) in data">
                <div class="item-row" :key="item.id" :data-index="index">
                  <div class="item-col  item-col-checkbox">
                    <div class="item-col-content">
                      <label class="ant-checkbox-wrapper" :class="{ 'ant-checkbox-wrapper-checked': selected.indexOf(item.id) >= 0 }">
                        <span class="ant-checkbox" :class="{ 'ant-checkbox-checked': selected.indexOf(item.id) >= 0 }">
                          <input type="checkbox" class="ant-checkbox-input" v-model="selected" :value="item.id" />
                          <span class="ant-checkbox-inner"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div class="item-col" v-for="(col, index) in table_header" :class="`item-col-${col.column}`" :key="`table_header_index${index}`">
                    <div class="item-col-content" v-if="col.column == 'title'">
                      <div class="item-product-title">
                        <div class="item-product-title-image">
                          <img :src="item.image_link" alt="" />
                        </div>
                        <div class="item-product-title-content">
                          <div class="item-product-title-content-text" v-line-clamp:20="2">
                            {{ item.title }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'offer_id'">
                      <a-popover placement="bottomLeft" trigger="hover" :getPopupContainer="(event) => event.parentNode" :destroyTooltipOnHide="true">
                        <template slot="content">
                          {{ item.offer_id }}
                        </template>
                        <div class="text-ellipsis">
                          {{ item.offer_id }}
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'status'">
                      <div class="item-status" :class="`item-status-${item.status.toLowerCase()}`">
                        {{ item.status.toLowerCase() }}
                      </div>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'errors'">
                      <a-popover
                        v-if="item.app_errors !== null && item.app_errors.length !== 0"
                        placement="bottomLeft"
                        trigger="hover"
                        :getPopupContainer="(event) => event.parentNode"
                        :destroyTooltipOnHide="true"
                      >
                        <template slot="content">
                          <div class="feed-popover">
                            <span style="color: #5B86E5" class="m-r-5">
                              <sh-icon :icon="['fas', 'box']" />
                            </span>
                            <b class="title-internal">Internal Error</b>
                            <template v-for="(key, value) in item.app_errors">
                              <div :key="`key_${key}`">
                                <div class="m-t-10 space-text">
                                  {{ key }}
                                </div>
                                <div class="m-t-5 space-text" style="color: #5B86E5">
                                  <div v-for="(err, err_index) in value" :key="`error_index_${err_index}`">
                                    <small>- {{ err }}</small>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </template>
                        <div class="item-error">
                          <sh-icon class="m-r-10" style="color: #5B86E5" :icon="['fas', 'box']" />
                          <div class="hover-underline" v-line-clamp:20="1">
                            <span v-for="(error, i) in textError(item.app_errors)" :key="`item_index_${i}`">{{ error.title }}</span>
                          </div>
                        </div>
                      </a-popover>
                      <div v-if="item.errors">
                        <a-popover placement="bottomLeft" trigger="hover" :getPopupContainer="(event) => event.parentNode" :destroyTooltipOnHide="true">
                          <template slot="content">
                            <div class="feed-popover">
                              <template v-if="item.errors.disapproved && item.errors.unaffected">
                                <div>
                                  <span class="text-danger m-r-5">
                                    <sh-icon :icon="['far', 'exclamation-circle']" />
                                  </span>
                                  <b class="space-title">
                                    <template v-if="socialType == 'google'">
                                      Google Errors
                                    </template>
                                    <template v-if="socialType == 'facebook' || socialType == 'facebook_fbe'">
                                      Facebook Errors
                                    </template>
                                  </b>
                                  <br />
                                  <div v-for="(err, err_index) in item.errors.disapproved" :key="`error_index_${err_index}`">
                                    <small>- {{ err }}</small>
                                  </div>
                                </div>
                                <div>
                                  <span class="text-warning m-r-5">
                                    <sh-icon :icon="['far', 'exclamation-triangle']" />
                                  </span>
                                  <b class="space-title">Google Warning</b><br />
                                  <div v-for="(err, err_index) in item.errors.unaffected" :key="`error_index_${err_index}`">
                                    <small>- {{ err }}</small>
                                  </div>
                                </div>
                              </template>
                              <template v-else-if="item.errors.disapproved">
                                <div>
                                  <span class="text-danger m-r-5">
                                    <sh-icon :icon="['far', 'exclamation-circle']" />
                                  </span>
                                  <b class="space-title">
                                    <template v-if="socialType == 'google'">
                                      Google Errors
                                    </template>
                                    <template v-if="socialType == 'facebook' || socialType == 'facebook_fbe'">
                                      Facebook Errors
                                    </template>
                                  </b>
                                  <br />
                                  <div v-for="(err, err_index) in item.errors.disapproved" :key="`error_index_${err_index}`">
                                    <small>- {{ err }}</small>
                                  </div>
                                </div>
                              </template>
                              <template v-else-if="item.errors.unaffecte">
                                <div>
                                  <span class="text-warning m-r-5">
                                    <sh-icon :icon="['far', 'exclamation-triangle']" />
                                  </span>
                                  <b class="space-title">
                                    <template v-if="socialType == 'google'">
                                      Google Errors
                                    </template>
                                    <template v-if="socialType == 'facebook' || socialType == 'facebook_fbe'">
                                      Facebook Errors
                                    </template>
                                  </b>
                                  <div v-for="(err, err_index) in item.errors.unaffected" :key="`error_index_${err_index}`">
                                    <small>- {{ err }}</small>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </template>
                          <div class="item-error" v-if="item.errors.disapproved && item.errors.unaffected">
                            <sh-icon class="text-danger m-r-10" :icon="['fal', 'exclamation-circle']" />
                            <sh-icon class="text-warning m-r-10" :icon="['fal', 'exclamation-triangle']" />
                            <div v-line-clamp:20="1">{{ item.errors.disapproved.slice(0, 1).join('') }}</div>
                          </div>
                          <div class="item-error" v-else-if="item.errors.disapproved">
                            <sh-icon class="text-danger m-r-10" :icon="['fal', 'exclamation-circle']" />
                            <div v-line-clamp:20="1">{{ item.errors.disapproved.slice(0, 1).join('') }}</div>
                          </div>
                          <div class="item-error" v-else-if="item.errors.unaffected">
                            <sh-icon class="text-warning m-r-10" :icon="['fal', 'exclamation-triangle']" />
                            <div v-line-clamp:20="1">{{ item.errors.unaffected.slice(0, 1).join('') }}</div>
                          </div>
                        </a-popover>
                      </div>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'google_product_category'">
                      <a-popover trigger="hover" placement="bottom" :getPopupContainer="(event) => event.parentNode" :destroyTooltipOnHide="true">
                        <template slot="content">
                          <div class="feed-popover">
                            {{ item.google_product_category }}
                          </div>
                        </template>
                        <div class="text-ellipsis">
                          {{ item.google_product_category }}
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'link' || col.column == 'image_link'">
                      <a-popover trigger="hover" placement="bottom" :getPopupContainer="(event) => event.parentNode" :destroyTooltipOnHide="true">
                        <template slot="content">
                          <div class="feed-popover">
                            {{ item[col.column] }}
                          </div>
                        </template>
                        <div class="text-ellipsis">
                          <a class="" target="_blank" :href="item[col.column]">{{ item[col.column] }}</a>
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-line-clamp:20="1" v-else-if="col.column == 'additional_image_links'">
                      <a-popover trigger="hover" placement="bottom">
                        <template slot="content">
                          <div
                            class="feed-popover"
                            v-html="item.additional_image_links.join('<br>')"
                            v-if="item.additional_image_links !== null && item.additional_image_links.length > 0"
                          ></div>
                        </template>
                        <div class="text-ellipsis" v-if="item.additional_image_links !== null && item.additional_image_links.length > 0">
                          <a target="_blank" :href="item.additional_image_links">{{ item.additional_image_links[0] }}</a>
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-line-clamp:20="1" v-else-if="col.column == 'product_types'">
                      <a-popover trigger="hover" placement="bottom">
                        <template slot="content">
                          <div
                            class="feed-popover"
                            v-html="item.product_types.join('<br>')"
                            v-if="item.product_types !== null && item.product_types.length > 0"
                          ></div>
                        </template>
                        <div class="text-ellipsis" v-if="item.product_types !== null && item.product_types.length > 0">
                          {{ item.product_types[0] }}
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-line-clamp:20="1" v-else-if="col.column == 'sale_price_effective_date'">
                      <a-popover trigger="hover" placement="bottom">
                        <template slot="content">
                          <div class="feed-popover">
                            {{ item.sale_price_effective_date }}
                          </div>
                        </template>
                        <div class="text-ellipsis">
                          {{ item.sale_price_effective_date }}
                        </div>
                      </a-popover>
                    </div>
                    <div class="item-col-content" v-else-if="col.column == 'promotion_ids'">
                      <div class="text-ellipsis" v-if="item.promotion_ids !== null && item.promotion_ids.length > 0">
                        {{ item.promotion_ids[0] }}
                      </div>
                    </div>
                    <div class="item-col-content" v-else>
                      {{ item[col.column] }}
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="text-center p-t-50 p-b-50">
                <h3>Not find any product</h3>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </vue-simple>
  </div>
</template>
<script>
import VueFeedItemProduct from './vue-feed-item-product'
import AssignValue from '../assign-value'
export default {
  name: 'VueFeedListProduct',
  components: {
    VueFeedItemProduct,
    AssignValue,
  },
  props: {
    value: {
      type: Array,
    },
    showColumn: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    socialType: {
      type: String,
    },
  },
  data() {
    return {
      selected: [],
      observer: null,
    }
  },
  computed: {
    data: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    table_header() {
      return this.showColumn.filter((item) => item.isShow)
    },
    check_all: {
      get() {
        if (this.data.length) {
          var check = true
          for (let i = 0; i < this.data.length; i++) {
            if (this.selected.indexOf(this.data[i].id) == -1) {
              check = false
              break
            }
          }
          return check
        } else {
          return false
        }
      },
      set(value) {
        if (value) {
          this.selected = this.data.map((item) => item.id)
        } else {
          this.selected = []
        }
      },
    },
  },
  methods: {
    reload() {
      this.$emit('reload')
    },
  },
  watch: {},
  mounted() {},
  beforeDestroy() {},
}
</script>
<style lang="scss">
.list-feed-product-table {
  height: calc(100vh - #{$app-toolbar-height} - 96px - 50px);
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  border-left: 1px solid #e2e2e2;
  border-top: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  border-radius: 6px;
  &-scrollbar {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  &-wrap {
    position: relative;
  }
  &-header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
  }
  &-body {
  }
  &-footer {
  }
  .item-row {
    display: flex;
    white-space: nowrap;
    min-height: 71px;
    border-bottom: 1px solid $border-color;
    &.item-row-heading {
      min-height: 45px;
      background: $white;
      .item-col {
        height: 45px;
        font-weight: 600;
      }
    }
    .item-col {
      min-width: 0;
      display: inline-flex;
      padding: 10px 15px;
      overflow-wrap: break-word;
      background-color: #fff;
      align-items: center;
      position: relative;
      @include flex(200px);

      &:before {
        content: '';
        width: 100%;
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 1px;
        background-color: $border-color;
      }
      &-content {
        position: relative;
        width: 100%;
        .text-ellipsis {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
      }
      &-checkbox {
        @include flex(50px);
      }
      &-title {
        @include flex(500px);
      }
      &-offer_id {
        @include flex(120px);
      }
      &-status {
        @include flex(140px);
      }
      &-availability,
      &-material,
      &-condition,
      &-brand,
      &-age_group,
      &-gender,
      &-shipping {
        @include flex(120px);
      }
      &-errors,
      &-google_product_category,
      &-sale_price_effective_date,
      &-link,
      &-image_link,
      &-additional_image_links {
        @include flex(300px);
      }
    }
    .item {
      &-product-title {
        display: flex;
        white-space: normal;
        &-image {
          @include flex(50px);
          height: 50px;
          width: 50px;
          border: 1px solid $border-color;
          overflow: hidden;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        &-content {
          @include col;
          min-width: 0;
          padding-left: 12px;
        }
      }
      &-status {
        text-transform: capitalize;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        &-disapproved,
        &-error {
          background-color: #ffe5e6;
          color: $danger;
        }
        &-approved,
        &-activated {
          background-color: #c2f2d8;
          color: #35b26f;
        }
        &-pending {
          background-color: #fcf4db;
          color: #f2ce54;
        }
        &-deactivated {
          background-color: $light-gray3;
          color: $dark-gray3;
        }
      }
      &-error {
        display: flex;
        align-items: center;
      }
    }
  }
}
.feed-popover {
  max-width: 300px;
  min-width: 100%;
  word-wrap: break-word !important;
  max-height: 300px;
  overflow: auto;
}
</style>
