<template>
  <div v-if="status" class="category-rule">
    <div class="box-assign-category m-b-20">
      <div class="d-flex header-function-assign">
        <div class="col col-5">Collection</div>
        <div class="col col-5 custom-space-header">Google Product Categories</div>
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
          <template v-if="categories.collection_categories.length > 0">
            <div v-for="(row, index) in categories.collection_categories" :key="`item_${index}`" class="section-assign m-b-20 d-flex">
              <div class="col col-md-5">
                <a-select
                  @change="(internal_id) => handleChange(index, internal_id)"
                  v-model="row.title"
                  style="width: 100%"
                  :class="{ 'force-validate-collection': row.validate_collection || row.validate_duplicated_collection }"
                  placeholder="Collection"
                >
                  <a-select-option v-for="(collection, index2) in categories.collections" :key="`collection_${index2}`" :value="collection.internal_id">{{
                    collection.title
                  }}</a-select-option>
                </a-select>
                <div class="validate-category m-t-5" v-if="row.validate_collection">Please choose collection</div>
                <div class="validate-category m-t-5" v-if="row.validate_duplicated_collection">Duplicated collection. Please choose another collection</div>
              </div>
              <div class="p-t-5">assigned</div>
              <div class="col col-md-5">
                <a-dropdown
                  :class="{ 'force-validate-category': row.validate_category }"
                  transitionName="none"
                  :getPopupContainer="(trigger) => trigger.parentNode"
                  :trigger="['click']"
                  v-model="row.visible"
                  @visibleChange="visibleChange(row.visible)"
                >
                  <slot name="btn-trigger">
                    <a-button class="btn-trigger custom-list-category">
                      <div class="custom-name-category" v-if="row.google_product_category">
                        <a-tooltip trigger="hover" placement="bottom">
                          <template slot="title">{{ row.google_product_category }}</template>
                          <div class="setting-name">{{ row.google_product_category }}</div>
                        </a-tooltip>
                      </div>
                      <div v-else style="color: #bfbfbf" class="custom-name-category">Categories</div>
                      <img class="gg-box-arr-down" src="@shop/assets/images/arrow-down.svg" alt="" />
                    </a-button>
                  </slot>
                  <a-menu slot="overlay">
                    <a-menu-item key="1">
                      <a-input v-model="search" @input="handleSearch($event)" placeholder="Search" type="text">
                        <a-icon slot="prefix" type="search" />
                      </a-input>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="2">
                      <div class="scroller-container" v-if="data.length > 0">
                        <RecycleScroller ref="scrollBack" :items="data" @scroll.native.passive="handleScroll" :min-item-size="30" class="scroller">
                          <template v-slot="{ item }">
                            <a-tooltip trigger="hover">
                              <template slot="title">{{ item.name }}</template>
                              <div @click="chooseCategory(item.name, row, (row.visible = false))">{{ item.name }}</div>
                            </a-tooltip>
                          </template>
                        </RecycleScroller>
                        <div class="is-loading" v-if="loading">
                          <a-spin class="demo-loading" />
                        </div>
                      </div>
                      <div v-else class="text-center">Not found category</div>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
                <div class="validate-category" v-if="row.validate_category">Please choose category</div>
              </div>
              <div class="col col-md-1 justify-content-end d-flex">
                <a-button @click="deleteField(index)"><sh-icon :icon="['fal', 'times']"/></a-button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center not-found">No categories</div>
          </template>
          <div class="mt-3 m-l-15">
            <a @click="addField()">
              <sh-icon :icon="['fal', 'plus']" />
              Add Collection
            </a>
          </div>
        </div>
      </transition>
      <div class="d-flex justify-content-end">
        <template v-if="modify">
          <button class="ant-btn custom-discard-btn m-r-16" @click="discard()">Discard Settings</button>
          <a-button type="primary" @click="submitCategories()" :loading="saving">Save Settings</a-button>
        </template>
      </div>
    </div>
  </div>
  <div v-else><VueErrorPage type="404" /></div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import google_product_category from '@/config/google-product-category.json'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
const LOAD_THRESHOLD_PX = 300
import { RecycleScroller } from 'vue-virtual-scroller'
export default {
  name: 'CategoryGoogle',
  props:{
	  modify :{
      type : Boolean
    }
  },
  data() {
    return {
      data: google_product_category.slice(0, 500),
      loading: false,
      saving: false,
      search: '',
      arrayItems: [],
      totalItemsFiltered: [],
      spinning: false,
      categories: { collections: [], collection_categories: [] },
      status: true,
      validated: true,
    }
  },
  components: {
    RecycleScroller,
  },
  computed: {
    ...mapGetters({
      getDetailFeed: 'feed/getDetailFeed',
    }),
    is_modify :{
      get(){
        return this.modify
      },
      set(value){
        this.$emit('update:modify' , value)
      }
    }
  },
  methods: {
    ...mapActions({
      getCategories: 'feed/getCategories',
      getFeedInfo: 'feed/getFeedInfo',
      updateCategories: 'feed/updateCategories',
      reassignCategories: 'feed/reassignCategories',
    }),
    ...mapMutations({
      setInfoFeedDetail: 'feed/setInfoFeedDetail',
    }),
    visibleChange(row) {
      if (row) {
        this.data = google_product_category.slice(0, 500)
      } else {
        this.$refs.scrollBack.forEach((item) => (item.$el.scrollTop = 0)) // scroll back on top when close dropdown
      }
      this.search = ''
    },
    resolveDuplicatedCollection() {
      var result = Object.values(
        this.categories.collection_categories.reduce((c, v, i) => {
          this.categories.collection_categories[i]['validate_duplicated_collection'] = false
          if (v.internal_id !== '') {
            let k = v.internal_id
            c[k] = c[k] || []
            c[k].push(i)
          }
          return c
        }, {})
      ).reduce((c, v) => (v.length > 1 ? c.concat(v) : c), [])
      result.forEach((element) => {
        this.categories.collection_categories[element]['validate_duplicated_collection'] = true
      })
    },
    handleChange(index, id) {
      this.is_modify = true
      this.categories.collection_categories[index]['internal_id'] = id
      this.resolveDuplicatedCollection()
    },
    addField() {
      this.is_modify = true
      this.categories.collection_categories.push({
        internal_id: '',
        google_product_category: '',
      })
    },
    deleteField(index) {
      this.is_modify = true
      this.categories.collection_categories.splice(index, 1)
      this.resolveDuplicatedCollection()
    },
    chooseCategory(selectedCategory, categoryName) {
      this.is_modify = true
      categoryName.google_product_category = selectedCategory
    },
    handleSearch(e) {
      this.search = e.target.value
      if (this.search != '') {
        this.arrayItems = google_product_category.filter((item) => {
          return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
        this.data = this.arrayItems
        this.totalItemsFiltered = this.data.length
      } else {
        this.data = google_product_category.slice(0, 500)
      }
    },
    handleScroll(e) {
      const { target } = e
      const currentScroll = target.scrollTop
      const scrollableDistance = Math.max(0, target.scrollHeight - target.offsetHeight)
      if (
        currentScroll >= scrollableDistance - LOAD_THRESHOLD_PX &&
        (this.data.length > this.totalItemsFiltered || this.totalItemsFiltered > this.data.length)
      ) {
        this.handleInfiniteOnLoad()
      }
    },
    handleInfiniteOnLoad() {
      if (this.loading) return
      this.loading = true
      setTimeout(() => {
        const data = this.data
        var temp = data.concat(google_product_category.slice(this.data.length, 500 + this.data.length))
        this.data = temp
        this.loading = false
      }, 1000)
    },
    showCategories() {
      this.spinning = true
      var ss_feed_id = this.$route.params.id
      return new Promise((resolve, reject) => {
        this.getCategories({ ss_feed_id })
          .then((res) => {
            let { status, data } = res.data
            this.status = status
            if (status) {
              this.categories = data
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
    submitCategories() {
      var ss_feed_id = this.$route.params.id
      var collection_categories = this.categories.collection_categories
      if (!this.is_modify) {
        return
      }
      this.saving = true
      this.validateField()
      if (!this.validated) {
        this.saving = false
        return null
      }
      this.removeUnuseField(collection_categories)
      this.updateCategories({
        ss_feed_id,
        collection_categories,
      })
        .then((res) => {
          let { status, message } = res.data
          if (status) {
            this.toastSuccess({
              title: 'Done !',
              message: 'Update Successfully',
            })
            this.showCategories()
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
          this.saving = false
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
          this.showCategories()
          this.is_modify = false
        },
        onCancel: () => {},
      })
    },

    validateField() {
      this.validated = true
      this.categories.collection_categories.forEach((element) => {
        element['validate_collection'] = element.internal_id === ''
        element['validate_category'] = element.google_product_category === ''
        if ((element.internal_id === '' || element['validate_category'] || element['validate_duplicated_collection']) && this.validated) {
          this.validated = false
        }
      })
    },

    removeUnuseField(categories) {
      categories.forEach((element) => {
        delete element.validate_collection
        delete element.validate_category
        delete element.visible
        delete element.validate_duplicated_collection
      })
    },
  },
  mounted() {
    if (this.getDetailFeed == null) {
      this.getSocialInfo()
    }
    this.showCategories()
  },
}
</script>

<style lang="scss" scoped>
.category-rule {
  width: 55%;
  margin: 0 auto;

  .not-found {
    color: #828282;
  }

  .validate-category {
    color: #f2545d;
    font-size: 12px;
  }

  .header-function-assign {
    color: $text;
    font-size: 14px;
    border-bottom: 2px solid #e2e2e2;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-weight: 500;

    .custom-space-header {
      margin-left: 57px;
    }
  }

  .custom-discard-btn {
    background: none;
    color: $text;
  }

  .box-mapping-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }
}
</style>
<style lang="scss">
.category-rule {
  .force-validate-collection {
    .ant-select-selection {
      border: 1px solid $danger !important;
    }
  }

  .force-validate-category {
    border-color: $danger !important;
  }

  *:focus {
    outline: none;
  }

  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    background: none;
  }
  .vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view {
    &:hover {
      background: #f3f3f3;
    }
  }

  .demo-loading {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }

  .scroller {
    height: 100%;
    overflow: hidden auto;
    position: relative;
    max-height: 200px;
    &-container {
      min-height: 20px;
      font-size: 14px;
      overflow: hidden;
      position: relative;
    }
  }

  .is-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .custom-name-category {
    font-weight: normal;
    .setting-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 90%;
    }
  }

  .custom-list-category {
    position: relative;
    width: 100%;
    text-align: left;
    .gg-box-arr-down {
      position: absolute;
      right: 16px;
      top: 30%;
      color: #e4e4e4;
      line-height: 14px;
      transition: 0.5s;
    }
    &.ant-dropdown-open .gg-box-arr-down {
      transform: rotate(180deg);
      transition: 0.3s;
    }
    &:hover {
      border: 1px solid #88adf2;
    }
  }
}
</style>
