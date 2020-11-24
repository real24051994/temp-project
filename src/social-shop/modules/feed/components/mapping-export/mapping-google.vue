<template>
  <div v-if="status" class="mapping-google">
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
        Mapping allows you to customize all available Google Shopping fields to further optimize your feed. You can choose a variant, combine multiple variants,
        or input text.
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <div class="search-box">
        <a-input @keyup="onKeyword" v-model="search" placeholder="Search" type="text">
          <a-icon slot="prefix" type="search" />
        </a-input>
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
          Feed Field
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
          <template v-if="filteredList.length > 0">
            <div class="table-row" v-for="(item, index) in filteredList" :key="`index_${index}`">
              <div class="column-title d-flex align-items-center">
                <div class="mapping-img">
                  <img src="@shop/assets/images/product-feed/info.svg" alt="" />
                </div>
                <div class="mapping-name">{{ item.field_name }}</div>
              </div>
              <div class="column-assigned d-flex">
                <div class="item-mapping">
                  <vue-mapping-export-gg-contenteditable
                    :modify.sync="is_modify"
                    :list_value.sync="item"
                    :tags.sync="tag"
                    v-model="item.assigned_fields"
                    :is_required.sync="isRequired"
                    :maxcharacters.sync="maxcharacters"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center not-found">No result found</div>
          </template>
        </div>
      </transition>
    </div>
  </div>
  <div v-else><VueErrorPage type="404" /></div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'MappingGoogle',
  metaInfo: {
    title: 'Mapping Google',
  },
  props :{
    value :{
      type : Object
    },
    modify :{
      type : Boolean,
    }
  },
  data() {
    return {
      spinning: true,
      listMapping: {
        universal_fields: [],
        product_mappings: [],
      },
      tag: [],
      timeout: null,
      isRequired: false,
      maxcharacters: [],
      loading: false,
      search: '',
      loadingFeed: false,
      status: true,
    }
  },
  computed: {
    ...mapGetters({
    //   getDetailFeed: 'feed/getDetailFeed',
      
    }),
    getDetailFeed : {
      get(){
        return this.value 
      },
      set(value){
        this.$emit('input', value)
      }
    },
    is_modify : {
      get(){
        return this.modify 
      },
      set(value){
        this.$emit('update:modify', value)
      }
    },
    filteredList() {
      return this.listMapping.universal_fields.filter((item) => {
        return item.field_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
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
    onKeyword() {
      clearTimeout(this.timeout)
      this.spinning = true
      this.timeout = setTimeout(() => {
        this.$nextTick(() => {
          this.spinning = false
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
              let { universal_fields  , product_mappings } = data 
              this.listMapping = {
                product_mappings,
                universal_fields : universal_fields.map((item)=>{
                  if( item.assigned_fields == null ){
                    item.assigned_fields = ''
                  }
                  return item
                })
              }
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
                    // this.renderList()
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
.mapping-google {
  position: relative;
  .notification-mapping {
    background: $light-primary2;
    border-radius: 4px;
    padding: 9px 15px;
    margin-bottom: 20px;
  }
  .search-box {
    width: 50%;
    .ant-input-affix-wrapper {
      .ant-input-prefix {
        color: #252627;
        opacity: 0.3;
      }
      .ant-input {
        border: none;
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
    padding-top: 100px;
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

    .column-title {
      width: 55%;
    }

    .column-assigned {
      width: 500px;
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
      padding: 20px;
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
        background-color: #f3f3f3;
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
