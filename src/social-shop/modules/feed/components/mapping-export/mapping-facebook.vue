<template>
  <div v-if="status" class="mapping-facebook">
    <transition name="fade-in" mode="out-in">
      <div class="mapping-form-navbar" v-if="is_modify">
        <template>
          <button class="ant-btn custom-discard-btn m-r-16" @click="discard()">Discard Settings</button>
          <a-button class="custom-save-btn" @click="onSubmit" :loading="loading">Save Settings</a-button>
        </template>
      </div>
    </transition>
    <div class="notification-mapping d-flex align-items-center">
      <sh-icon style="font-size: 22px; color:#5B86E5" :icon="['fas', 'info-square']" />
      <div class="m-l-10">
        Mapping allows you to customize all available Facebook Catalog fields to further optimize your feed. You can choose a variant, combine multiple
        variants, or input text.
      </div>
    </div>
    <div class="d-flex justify-content-between row">
      <div class="search-box col-md-3 p-r-0">
        <a-input @keyup="onKeyword($event)" placeholder="Search" type="text">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="col-md-9 p-l-37">
        <div class="d-flex align-items-center">
          <div class="m-r-20">Display</div>
          <div>
            <a-select v-model="activeContent" style="width: 120px" @change="handleFiltersContent">
              <a-select-option v-for="(item, index) in filterContentFields" :value="item.type" :key="`content_${index}`">{{ item.name }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <!-- <div class="d-flex align-items-center">
        <a-button class="m-r-10" @click="reApplyFeed" :loading="loadingFeed">Re-assign all</a-button>
        <div style="width: 30px">
          <a-popover placement="bottomLeft" trigger="hover" class="d-flex align-items-center">
            <template slot="content">
              <div class="custom-popover-mapping">
                Re-apply this set of Mapping rules to all existing product data. All previous data will be overriden
              </div>
            </template>
            <sh-icon style="color: #5B86E5;" :icon="['far', 'question-circle']" />
          </a-popover>
        </div>
      </div> -->
    </div>
    <div class="table-mapping-list">
      <div class="table-header">
        <div class="column-title">
          Type
        </div>
        <div class="column-assigned">
          Assigned
        </div>
        <!-- <div class="column-source">
          Source
        </div> -->
      </div>
      <transition name="fade-in" mode="out-in">
        <div v-if="spinning" key="is-loading" class="m-t-10">
          <a-skeleton
            :title="false"
            :loading="spinning"
            v-for="item in 10"
            :key="`skeleton_${item}`"
            active
            :paragraph="{ rows: 1, width: '100%' }"
            class="m-b-10"
          ></a-skeleton>
        </div>
        <div v-else key="loading-success">
          <div class="d-flex m-0 row style-border">
            <div @click="collapseBox" class="row-box-left col-md-3 d-flex justify-content-between">
              <div class="title-default-field">
                Universal Field <br /><span style="font-size: 14px; color:#828282; font-weight: normal">(All Categories)</span>
              </div>
              <div class="m-t-5">
                <sh-icon style="font-size: 16px; transition: 0.5s;" :class="{ 'rotate-arrow': isRotateArrow }" :icon="['far', 'angle-right']" />
              </div>
            </div>
            <template v-if="universalFields.length > 0">
              <div class="d-flex p-l-0 p-r-0 col-md-9 flex-column row-box-right">
                <div
                  v-if="universalFields && universalFields.length > 0 && index <= limitationFields"
                  class="table-row row m-0"
                  v-for="(item, index) in universalFields"
                  :key="`index_${index}`"
                >
                  <div class="column-title col-md-4 d-flex align-items-center">
                    <div class="mapping-img">
                      <img src="@shop/assets/images/product-feed/info-mapping.svg" alt="" />
                    </div>
                    <div class="mapping-name">[F] {{ item.field_name }}</div>
                  </div>
                  <div class="column-assigned col-md-8 d-flex">
                    <div class="item-mapping">
                      <vue-mapping-export-fb-contenteditable
                        :modify.sync="is_modify"
                        :list_value.sync="item"
                        :tags.sync="tag"
                        :key="item.id"
                        v-model="item.assigned_fields"
                        :is_required.sync="isRequired"
                        :maxcharacters.sync="maxcharacters"
                      />
                    </div>
                  </div>
                </div>
                <template v-if="search == ''">
                  <div class="d-flex justify-content-center view-all">
                    <button class="ant-btn" @click="changeLimitation()">
                      <span v-html="showArrow()"></span>
                    </button>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="text-center not-found d-flex justify-content-center col-md-9 flex-column">No result found</div>
            </template>
          </div>
          <div class="d-flex m-0 row style-border">
            <div class="row-box-left p-0 col-md-3">
              <div class="title-default-field">
                <div class="d-flex align-items-center custom-title-specific">Category specific field</div>
                <div class="d-flex category-specific row">
                  <div
                    @click.stop.prevent="chooseTab(item)"
                    v-for="(item, index) in listMapping.categories"
                    :key="`categories_${index}`"
                    class="col-md-6 detail-category justify-content-center p-0 d-flex flex-column align-items-center"
                    :class="{ 'is-active': activeCategory == item.type }"
                  >
                    <sh-icon class="m-t-10" style="font-size: 20px" :icon="['far', iconCategories(item.type)]" />
                    <div class="m-t-10 m-b-10">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="specificFields.length > 0">
              <div class="d-flex p-l-0 p-r-0 col-md-9 flex-column row-box-right">
                <template v-if="filterSubCategory.length > 0">
                  <div class="d-flex wrapper-sub align-items-center">
                    <div class="title-sub m-r-20 m-l-20">{{ title }} Category</div>
                    <a-select v-model="activeType" style="width: 160px" @change="handleFiltersSubcategory">
                      <a-select-option v-for="(item, index) in filterSubCategory" :value="item.type" :key="`index_${index}`">{{ item.name }}</a-select-option>
                    </a-select>
                  </div>
                </template>
                <transition name="fade-in" mode="out-in">
                  <list-items v-if="!is_changing" v-model="specificFields" :modify.sync="is_modify" :tags.sync="tag" />
                </transition>
              </div>
            </template>
            <template v-else>
              <div class="text-center not-found d-flex justify-content-center col-md-9 flex-column">No result found</div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <div v-else><VueErrorPage type="404" /></div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { faAngleUp, faAngleDown } from '@fortawesome/pro-regular-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'
import ListItems from './list-items'
export default {
  name: 'MappingFacebook',
  metaInfo: {
    title: 'Mapping Facebook',
  },
  props :{
    value :{
      type : Object
    },
    modify :{
      type : Boolean,
    }
  },
  components: {
    ListItems,
  },
  data() {
    return {
	  spinning: true,
      listMapping: {
        universal_fields: [],
        product_mappings: [],
        categories: [],
        specific_fields: [],
      },
      tag: [],
      timeout: null,
      isRequired: false,
      maxcharacters: [],
      loading: false,
      search: '',
      loadingFeed: false,
      status: true,
      limitationFields: 1,
      isRotateArrow: false,
      activeCategory: 'all',
      filterSubCategory: [],
      title: '',
      activeType: 'all',
      activeContent: 'all',
      filterContentFields: [
        {
          type: 'all',
          name: 'All',
        },
        {
          type: 'assigned',
          name: 'Assigned',
        },
        {
          type: 'unassigned',
          name: 'Unassigned',
        },
      ],
      filter_universal_field_ids: [],
      filter_specific_field_ids: [],
      is_changing: false,
    }
  },
  computed: {
    ...mapGetters({
      getDetailFeed: 'feed/getDetailFeed',
    }),
    is_modify:{
      get(){
        return this.modify
      },
      set(value){
        this.$emit('update:modify', value)
      }
    },
    universalFields() {
      return this.listMapping.universal_fields.filter((item) => {
        var filterInputFields = this.activeContent == 'all' ? true : this.filter_universal_field_ids.indexOf(item.id) >= 0
        return this.matchedSearch(item) && filterInputFields
      })
    },
    specificFields() {
      return this.listMapping.specific_fields.filter((item) => {
        let matchedCategory = true
        var filterInputFields = this.activeContent == 'all' ? true : this.filter_specific_field_ids.indexOf(item.id) >= 0
        if (this.activeCategory !== 'all') {
          matchedCategory = item.types && item.types[this.activeCategory]
          if (this.activeType !== 'all') {
            matchedCategory = matchedCategory && item.types[this.activeCategory].indexOf(this.activeType) > -1
          }
        }
        return matchedCategory && this.matchedSearch(item) && filterInputFields
      })
    },
  },
  methods: {
    ...mapActions({
      getValueMapping: 'feed/getValueMapping',
      updateMapping: 'feed/updateMapping',
      reassignMapping: 'feed/reassignMapping',
      getFeedInfo: 'feed/getFeedInfo',
    }),
    ...mapMutations({
      setInfoFeedDetail: 'feed/setInfoFeedDetail',
    }),
    showArrow() {
      if (this.limitationFields == 1) {
        return `<span class="m-r-5">View full field</span>${icon(faAngleDown).html[0]}`
      } else {
        return `<span class="m-r-5">View less</span>${icon(faAngleUp).html[0]}`
      }
    },
    matchedSearch(item) {
      if (this.search.length === 0) {
        return true
      }
      return item.field_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
    },
    handleFiltersContent(value) {
      this.is_changing = true
      if (value == 'all') {
        this.filter_universal_field_ids = []
        this.filter_specific_field_ids = []
      } else {
        this.filter_universal_field_ids = this.listMapping.universal_fields
          .filter((item) => {
            return value == 'unassigned' ? item.assigned_fields == '' : item.assigned_fields != ''
          })
          .map((item) => item.id)
        this.filter_specific_field_ids = this.listMapping.specific_fields
          .filter((item) => {
            return value == 'unassigned' ? item.assigned_fields == '' : item.assigned_fields != ''
          })
          .map((item) => item.id)
      }
      this.$nextTick(() => {
        this.is_changing = false
      })
    },
    handleFiltersSubcategory(value) {
      this.is_changing = true
      this.activeType = value
      this.$nextTick(() => {
        this.is_changing = false
      })
    },
    chooseTab(item) {
      this.is_changing = true
      this.title = item.name
      this.activeCategory = item.type
      this.activeType = 'all'
      this.filterSubCategory = item.item_sub_types
      this.$nextTick(() => {
        this.is_changing = false
      })
    },
    iconCategories(type) {
      if (type == 'all') {
        return 'columns'
      } else if (type == 'clothing_accessories') {
        return 'tshirt'
      } else if (type == 'home') {
        return 'home-lg'
      } else if (type == 'jewelry_watches') {
        return 'gem'
      } else if (type == 'health_beauty') {
        return 'first-aid'
      } else if (type == 'electronics') {
        return 'atom-alt'
      } else if (type == 'baby_products') {
        return 'baby-carriage'
      }
    },
    changeLimitation() {
      if (this.limitationFields == this.universalFields.length) {
        this.isRotateArrow = false
        this.limitationFields = 1
      } else {
        this.isRotateArrow = true
        this.limitationFields = this.universalFields.length
      }
    },
    collapseBox() {
      if (!this.isRotateArrow) {
        this.isRotateArrow = true
      } else {
        this.isRotateArrow = false
      }
      this.changeLimitation()
    },
    onKeyword(event) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.search = event.target.value
        this.is_changing = true
        this.$nextTick(() => {
          this.is_changing = false
        })
      }, 500)
    },
    renderList() {
      this.spinning = true
      var ss_feed_id = this.$route.params.id
      return new Promise((resolve, reject) => {
        this.getValueMapping({ ss_feed_id })
          .then((res) => {
            let { status, data } = res.data
            this.status = status
            if (status) {
              let { universal_fields  , product_mappings , categories , specific_fields } = data 
              this.listMapping = {
                product_mappings , categories ,
                universal_fields : universal_fields.map((item)=>{
                  if( item.assigned_fields == null ){
                    item.assigned_fields = ''
                  }
                  return item
                }),
                specific_fields : specific_fields.map((item)=>{
                  if( item.assigned_fields == null ){
                    item.assigned_fields = ''
                  }
                  return item
                })
              }
              // this.listMapping = data
              this.tag = data.product_mappings
            }
            this.spinning = false
            resolve(res)
          })
          .catch((err) => {
            this.status = false
            reject(err)
          })
      })
    },
    onSubmit(isRender = true) {
      clearTimeout(this.timeout)
      var ss_feed_id = this.$route.params.id
      var feed_product_mappings = this.listMapping
      if (!this.is_modify) {
        return
      }
      return new Promise((resolve) => {
        if (!this.isRequired && this.maxcharacters.length == 0) {
          this.loading = true
          this.timeout = setTimeout(() => {
            this.updateMapping({
              ss_feed_id,
              feed_product_mappings,
            })
              .then((res) => {
                let { status, message } = res.data
                if (status) {
                  this.toastSuccess({
                    title: 'Done !',
                    message: 'Mapping settings created sucessfully',
                  })
                  if (isRender) {
                    this.renderList()
                  }
                } else {
                  this.toastError({
                    title: 'Error',
                    message: message,
                  })
                }
              })
              .catch((res) => {})
              .finally(() => {
                this.is_modify = false
                this.loading = false
                resolve()
              })
          }, 1000)
        }
      })
    },
    reApplyFeed() {
      if (this.isRequired || this.maxcharacters.length != 0) {
        return
      }
      this.loadingFeed = true
      var ss_feed_id = this.$route.params.id
      this.$confirm({
        confirmLoading: true,
        title: 'Re-assign all',
        content: 'This set of Mapping rules will override all existing product data<br>Do you want to apply these rules to all products?',
        okText: 'Re-assign',
        cancelText: 'Cancel',
        okType: 'primary',
        onOk: () => {
          this.loadingFeed = false
          return new Promise(async (resolve) => {
            await this.onSubmit(false)
            await this.reassignMapping({ ss_feed_id })
              .then((res) => {
                let { status, message } = res.data
                if (status) {
                  this.toastSuccess({
                    title: 'Re-assign Success',
                    message: 'Feed re-assigned success',
                  })
                  this.renderList()
                } else {
                  this.toastError({
                    title: 'Error',
                    message: message,
                  })
                }
              })
              .catch((err) => {})
              .finally(() => {
                this.loadingFeed = false
                resolve()
              })
          })
        },
        onCancel: () => {
          this.loadingFeed = false
        },
      })
    },
    discard() {
      this.$confirm({
        title: 'Discard Changes',
        content: "The changes won't be saved. Do you want to leave this page?",
        okText: 'Discard',
        cancelText: 'Cancel',
        okType: 'outline-danger',
        zIndex: 10002,
        onOk: () => {
          this.renderList()
          this.is_modify = false
        },
        onCancel: () => {},
      })
    },
    getSocialInfo() {
      var ss_feed_id = this.$route.params.id
      this.getFeedInfo({ ss_feed_id })
        .then((res) => {
          let { status, data } = res.data
          this.status = status
          if (status) {
            this.setInfoFeedDetail(data)
          }
        })
        .catch((res) => {
          console.log(res)
        })
        .finally(() => {})
    },
  },
  mounted() {
    /* prevent drag and drop on browser */
    window.addEventListener(
      'dragover',
      function(e) {
        e = e || event
        e.preventDefault()
      },
      false
    )
    window.addEventListener(
      'drop',
      function(e) {
        e = e || event
        e.preventDefault()
      },
      false
    )
    if (this.getDetailFeed == null) {
      this.getSocialInfo()
    }
    this.renderList()
  },
}
</script>

<style lang="scss" scoped>
.mapping-facebook {
  position: relative;
  .notification-mapping {
    background: $light-primary2;
    border-radius: 4px;
    padding: 9px 15px;
    margin-bottom: 20px;
  }
  .search-box {
    .ant-input-affix-wrapper {
      .ant-input-prefix {
        color: #252627;
        opacity: 0.3;
      }
      .ant-input {
        border: none;
        background: #f3f3f3 !important;
        &::placeholder {
          color: #252627;
          opacity: 0.3;
        }
        &:not(:first-child) {
          padding-left: 26px;
          padding-top: 0;
          padding-bottom: 0;
        }
      }
      .ant-input-prefix {
        left: 2px;
      }
    }
  }
  .not-found {
    color: #828282;
  }
  .mapping-form-navbar {
    position: fixed;
    top: 0;
    right: 0;
    left: $app-sidebar-width;
    height: $app-toolbar-height;
    background: $primary-color;
    z-index: 502;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 24px;
    .custom-discard-btn {
      background: none;
      color: $white;
    }
    .custom-save-btn {
      color: $primary-color;
    }
  }
  .box-mapping-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
  }
  .table-mapping-list {
    color: #252627;
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    .style-border {
      border-bottom: 1px solid $border-color;
    }
    .column-type {
      width: 27%;
    }
    .row-box-left {
      background: $light-gray3;
      padding: 20px;
      cursor: pointer;
      .title-default-field {
        font-weight: 600;
        font-size: 18px;
        .custom-title-specific {
          padding: 14px;
        }
        .category-specific {
          > div:nth-child(odd) {
            border-bottom: 1px solid #edecec;
            border-right: 1px solid #edecec;
          }
          > div:nth-child(even) {
            border-bottom: 1px solid #edecec;
          }
          margin: 0;
          background: #f9f9f9;
          .detail-category {
            font-weight: normal;
            font-size: 12px;
            color: $dark-gray3;
            &.is-active {
              background: $white;
              color: $primary-color;
            }
          }
        }
      }
      .rotate-arrow {
        transform: rotate(90deg);
        transition: 0.3s;
      }
    }
    .row-box-right {
      .wrapper-sub {
        border-bottom: 1px solid #e2e2e2;
        padding: 11px 20px;
        .title-sub {
          font-weight: 600;
          font-size: 18px;
          color: #252627;
        }
      }
      .view-all {
        padding: 20px;
        background-color: $light-gray4;
      }
    }
    .column-title {
      width: 28%;
      padding-left: 20px;
      &.custom-column-title {
        width: 26%;
      }
    }
    .column-assigned {
      .item-mapping {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 calc(100% - 32px);
        flex: 0 0 calc(100% - 32px);
        max-width: calc(100% - 32px);
        background: $white;
      }
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
      padding: 20px 20px 20px 0px;
      display: flex;
      align-items: center;
    }
    .table-row {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e2e2;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:hover {
        background-color: $base-color1;
      }
      .mapping-img {
        max-width: 20px;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 2px;
        }
      }
      .mapping-name {
        flex-grow: 1;
        padding-left: 16px;
        padding-right: 30px;
        color: #252627;
        line-height: 17px;
        overflow: hidden;
        font-weight: 500;
        margin-top: 4px;
        span {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.custom-popover-mapping {
  width: 348px;
}
</style>
