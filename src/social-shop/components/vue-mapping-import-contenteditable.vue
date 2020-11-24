<template>
  <div class="mapping-source-import d-flex">
    <div
      class="vue-mapping-box-contenteditable"
      :class="{ 'custom-style-metafields': listFields.type !== 'productMetafield' && listFields.type !== 'variantMetafield' && listFields.type !== '' }"
    >
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div v-if="listFields.type == 'productMetafield'" class="type-metafields m-r-10">Product:</div>
          <div v-else-if="listFields.type == 'variantMetafield'" class="type-metafields m-r-10">Variant:</div>
          <div class="vue-mapping-box-contenteditable-content" v-if="listFields.assigned_field_name !== ''">
            <template v-if="listFields.assigned_field_name.length > 25">
              <a-popover placement="bottom" trigger="hover">
                <template slot="content">
                  {{ listFields.assigned_field_name }}
                </template>
                <div class="m-r-5" v-line-clamp:25="1">{{ listFields.assigned_field_name }}</div>
              </a-popover>
            </template>
            <template v-else>{{ listFields.assigned_field_name }}</template>
          </div>
        </div>
        <!-- <div class="d-flex">
          <div><sh-icon style="color: #E2E2E2; font-size: 14px" :icon="['fal', 'times']" /></div>
        </div> -->
      </div>
    </div>
    <template v-if="listFields.type == 'productMetafield' || listFields.type == 'variantMetafield' || listFields.type == ''">
      <a-button @click="showSelectSource" class="select-source d-flex align-items-center justify-content-center"
        ><sh-icon style="color: #828282" :icon="['far', 'clipboard-list']"
      /></a-button>
    </template>
    <a-modal
      @cancel="handleCancel"
      :destroyOnClose="true"
      class="modal-select-sourcefield"
      title="Select Metafield"
      :width="760"
      :visible="visible"
      :footer="false"
    >
      <div class="search-metafields">
        <a-input @keyup="onKeyword" v-model="pagination.keyword" :autoFocus="mouseFocus" placeholder="Search" type="text">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="header-metafields d-flex">
        <div class="header-field">Field</div>
        <div class="header-namespace d-flex">
          <div class="m-r-5">Name Space</div>
          <a-popover overlayClassName="popover-filter" placement="bottom" trigger="click">
            <template slot="content">
              <div>
                <label class="ant-checkbox-wrapper">
                  <span class="ant-checkbox" @click="selectAll" :class="{ 'ant-checkbox-checked': allSelected }">
                    <span class="ant-checkbox-inner"></span>
                  </span>
                  All
                </label>
                <div class="d-flex flex-column">
                  <label v-for="(item, index) in filterNameSpace" :key="`index2_${index}`" class="ant-checkbox-wrapper" @click="handleChangeCheckbox(item)">
                    <span class="ant-checkbox" :class="{ 'ant-checkbox-checked': isChecked(item) }">
                      <span class="ant-checkbox-inner"></span>
                    </span>
                    {{ item }}
                  </label>
                </div>
              </div>
            </template>
            <div>
              <sh-icon :icon="['fal', 'filter']" />
            </div>
          </a-popover>
        </div>
        <div class="header-assigned">Assigned to</div>
        <div class="header-type">Owner Type</div>
      </div>
      <div v-if="spinning" key="is-loading" class="m-t-10">
        <a-skeleton
          :title="false"
          :loading="spinning"
          v-for="item in 6"
          :key="`skeleton_${item}`"
          active
          :paragraph="{ rows: 1, width: '100%' }"
          style="padding: 0 20px"
        ></a-skeleton>
      </div>
      <div v-else key="loading-success" class="wrapper-metafields">
        <template v-if="metafields">
          <template v-if="metafields.length">
            <vue-simple class="metafields-scroll">
              <div
                @click="selectMetafields(item, index)"
                v-for="(item, index) in metafields"
                :key="`index_${index}`"
                class="metafields-block d-flex"
                :class="{ 'disabled-choose': disabledSelected(item) }"
              >
                <div class="metafields-items">{{ item.key }}</div>
                <div class="name-space">{{ item.namespace }}</div>
                <div class="assigned-item d-flex align-items-center" v-if="item.custom_field_name">
                  <img class="m-r-5" src="@shop/assets/images/product-feed/info.svg" alt="" />
                  <div>[P] {{ item.custom_field_name }}</div>
                </div>
                <div class="assigned-item" v-else></div>
                <div class="type-product-fields">{{ item.owner_resource }}</div>
              </div>
            </vue-simple>
          </template>
          <template v-else>
            <div class="text-center not-found-metafields">
              Not found Metafields
            </div>
          </template>
        </template>
        <template v-else>
          <div class="text-center not-found-metafields">
            No Metafields
          </div>
        </template>
      </div>
      <div v-if="metafields !== null && metafields.length" class="box-mapping-btn">
        <a-button :disabled="pagination.prev_page == null" @click="prev()"> <sh-icon class="m-r-10" :icon="['far', 'long-arrow-alt-left']" /> Prev </a-button>
        <a-button :disabled="pagination.next_page == null" @click="next()"> Next <sh-icon class="m-l-10" :icon="['far', 'long-arrow-alt-right']" /> </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'VueMappingImport',
  props: {
    value: {
      type: Object,
      required: true,
    },
    modify: {
      type: Boolean,
      default: false,
    },
    array_check_selected: {
      type: Array,
      default: () => [],
    },
    list_mapping: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      metafields: [],
      spinning: false,
      mouseFocus: false,
      pagination: {
        current_page: 1,
        keyword: '',
        limit: 50,
        next_page: null,
        prev_page: null,
      },
      filterNameSpace: [],
      arrayTemp: [],
      allSelected: false,
      timeout: null,
    }
  },
  computed: {
    isNotification: {
      get() {
        return this.modify
      },
      set(value) {
        this.$emit('update:modify', value)
      },
    },
    listFields: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:input', value)
      },
    },
    disabled_item: {
      get() {
        return this.array_check_selected
      },
      set(value) {
        this.$emit('update:array_check_selected', value)
      },
    },
  },
  methods: {
    ...mapActions({
      getListMetafields: 'product/getListMetafields',
    }),
    disabledSelected(item) {
      var isDisabled = false
      var index = _.findIndex(this.disabled_item, { assigned_field: item.assigned_field })
      if (index >= 0) {
        // check disable or not when user select metafields real time
        var nameCustomField = ''
        this.disabled_item.forEach((element) => {
          nameCustomField = element.field_name
        })
        item['custom_field_name'] = nameCustomField
      }
      // check disable or not when load api metafields
      this.list_mapping.forEach((element) => {
        if (element.assigned_field == item.assigned_field) {
          item['custom_field_name'] = element.field_name
          isDisabled = true
        }
      })

      return isDisabled
    },
    setCheckAllBtn() {
      var allProductSelected = true
      this.filterNameSpace.forEach((eachItem) => {
        let indexProduct = this.arrayTemp.indexOf(eachItem)
        if (indexProduct === -1) {
          allProductSelected = false
        }
      })
      if (allProductSelected) {
        this.allSelected = true
      } else {
        this.allSelected = false
      }
    },
    handleChangeCheckbox(item) {
      var index = this.arrayTemp.indexOf(item)
      clearTimeout(this.timeout)
      if (index == -1) {
        this.arrayTemp.push(item)
      } else {
        this.arrayTemp.splice(index, 1)
      }
      this.timeout = setTimeout(() => {
        this.showMetafields()
      }, 1000)
      this.setCheckAllBtn()
    },
    isChecked(item) {
      return this.arrayTemp.indexOf(item) > -1
    },
    selectAll() {
      clearTimeout(this.timeout)
      if (!this.allSelected) {
        this.filterNameSpace.forEach((item) => {
          var index = this.arrayTemp.indexOf(item)
          if (index == -1) {
            this.arrayTemp.push(item)
          }
        })
        this.allSelected = true
      } else {
        this.allSelected = false
        this.filterNameSpace.forEach((item) => {
          var index = this.arrayTemp.indexOf(item)
          if (index !== -1) {
            this.arrayTemp.splice(index, 1)
          }
        })
      }
      this.timeout = setTimeout(() => {
        this.showMetafields()
      }, 1000)
      this.showMetafields()
    },
    showMetafields(rel) {
      this.spinning = true
      var keyword = this.pagination.keyword
      var limit = this.pagination.limit
      var page = rel ? rel : 1
      var filter = this.arrayTemp
      return new Promise((resolve, reject) => {
        this.getListMetafields({
          keyword,
          limit,
          page,
          filter,
        })
          .then((res) => {
            let { status, data, message, pagination } = res.data
            if (status) {
              if (data) {
                this.metafields = data.metafields
                this.filterNameSpace = data.namespaces
                this.pagination.current_page = pagination.current_page
                this.pagination.next_page = pagination.next_page
                this.pagination.prev_page = pagination.prev_page
              } else {
                this.metafields = null
              }
            } else {
              this.toastError({
                title: 'Error',
                message: message,
              })
            }
            resolve()
          })
          .catch((res) => {
            reject()
          })
          .finally(() => {
            this.spinning = false
            resolve()
          })
      })
    },
    selectMetafields(item) {
      this.visible = false
      this.isNotification = true
      this.listFields.assigned_field_name = this.regexNameFields(item.assigned_field)
      this.listFields.type = item.type
      this.listFields.assigned_field = item.assigned_field
      this.disabled_item.push(this.listFields)
    },
    regexNameFields(item) {
      return item.replace(/^.+?\{\{(.+?)\}\}(.+?)$/g, '$1.$2')
    },
    onChange() {
      this.pagination.current_page = 1
      this.showMetafields()
    },
    onKeyword(event) {
      clearTimeout(this.timeout)
      if (event.keyCode == 13) {
        this.onChange()
      } else {
        this.timeout = setTimeout(() => {
          this.onChange()
        }, 500)
      }
      this.mouseFocus = true
    },
    showSelectSource() {
      this.visible = true
      this.showMetafields()
    },
    handleCancel() {
      this.arrayTemp = []
      this.visible = false
    },
    next() {
      if (this.pagination.next_page) {
        this.showMetafields(this.pagination.next_page)
      }
    },
    prev() {
      if (this.pagination.prev_page) {
        this.showMetafields(this.pagination.prev_page)
      }
    },
  },
}
</script>
<style lang="scss">
.mapping-source-import {
  width: 100%;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  .vue-mapping-box-contenteditable {
    position: relative;
    background: #f3f3f3;
    border-radius: 4px 0 0 4px;
    height: 32px;
    padding: 4px 6px;
    border-right: 1px solid #e2e2e2;
    width: 85%;
    &-content {
      display: inline-block;
      background: #f7f8fa;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 12px;
      color: $text;
      font-weight: 500;
    }
    .type-metafields {
      font-size: 12px;
      color: $dark-gray3;
    }
  }
  .custom-style-metafields {
    border-right: none !important;
    width: 100% !important;
  }

  .select-source {
    width: 15%;
    border: none;
    background: #f7f8fa;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .item-import {
    background: #d8d8d8;
    border-radius: 4px;
    margin: 0 2px 1px 0;
  }
  .vue-mapping-box-variant-menu {
    min-width: 228px;
    max-height: 300px;
    overflow: auto;
    left: -186px;
    .item-value-column {
      padding: 7px 16px;
      height: 32px;
      &:hover {
        width: 100%;
        background: #f3f3f3;
      }
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: #f5f5f5;
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 7px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.5);
    }
    .ant-dropdown-menu {
      padding: 0;
      border: 1px solid $border-color;
      &-item {
        padding: 8px 16px;
        width: 218px;
        &:hover {
          background: #f3f3f3;
        }
      }
    }
  }
}
.modal-select-sourcefield {
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
  .search-metafields {
    padding: 5px 16px 16px 16px;
  }
  .header-metafields {
    border-bottom: 2px solid #e2e2e2;
    padding: 10px 29px;
    font-weight: 600;
    .header-field {
      flex: 0 0 30%;
      max-width: 30%;
    }

    .header-namespace {
      flex: 0 0 20%;
      max-width: 20%;
    }

    .header-assigned {
      flex: 0 0 30%;
      max-width: 30%;
    }

    .header-type {
      flex: 0 0 20%;
      max-width: 20%;
    }
  }
  .wrapper-metafields {
    height: 310px;
    overflow: hidden;
    .metafields-scroll {
      height: 100%;
      overflow: hidden auto;
    }
    .not-found-metafields {
      margin-top: 130px;
    }
    .metafields-block {
      margin: 0 16px;
      padding: 16px 13px;
      border-bottom: 1px solid $light-gray3;
      cursor: pointer;

      .metafields-items {
        flex: 0 0 30%;
        max-width: 30%;
      }

      .name-space {
        flex: 0 0 20%;
        max-width: 20%;
      }

      .assigned-item {
        flex: 0 0 30%;
        max-width: 30%;
        font-weight: 600;
      }

      .type-product-fields {
        flex: 0 0 20%;
        max-width: 20%;
      }

      &:hover {
        background: #f7f8fa;
      }
      &.disabled-choose {
        color: #cecece !important;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
        pointer-events: none;
      }
    }
  }
  .box-mapping-btn {
    text-align: center;
    margin-top: 20px;
    padding-bottom: 20px;
    .ant-btn {
      margin: 0 6px;
      min-width: 80px;
    }
  }
}
.popover-filter {
  .ant-popover-content {
    width: 215px;
    .ant-checkbox-wrapper {
      margin-left: 0;
      margin-bottom: 10px;
    }
  }
}
</style>
