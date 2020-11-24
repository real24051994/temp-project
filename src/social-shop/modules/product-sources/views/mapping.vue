<template>
  <div class="mapping pt-4">
    <transition name="fade-in" mode="out-in">
      <div class="mapping-form-navbar" v-if="modify">
        <template>
          <button class="ant-btn custom-discard-btn m-r-16" @click="discard()">Discard Settings</button>
          <a-button class="custom-save-btn" @click="onSubmit" :loading="loading">Save Settings</a-button>
        </template>
      </div>
    </transition>
    <div class="d-flex justify-content-between">
      <div class="search-box">
        <a-input @keyup="onKeyword" v-model="search" placeholder="Search" type="text">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
    </div>
    <div class="table-mapping-list">
      <div class="table-header">
        <div class="column-title">
          System Field
        </div>
        <!-- <div class="column-data-type">
          Data Type
        </div> -->
        <div class="column-assigned">
          Source field (Shopify)
        </div>
        <div class="column-label">
          Label (optional)
        </div>
        <div class="column-action"></div>
      </div>
      <transition name="fade-in" mode="out-in">
        <div v-if="spinning" key="is-loading" class="m-t-10">
          <a-skeleton
            :loading="spinning"
            v-for="item in 10"
            :key="`skeleton_${item}`"
            active
            :title="false"
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
                <div class="mapping-name">[P] {{ item.field_name }}</div>
              </div>
              <!-- <div class="column-data-type">
                {{ item.data_type }}
              </div> -->
              <div class="column-assigned d-flex flex-column">
                <div class="item-mapping" :class="{ 'force-validate-metafields': item.validate_metafields }">
                  <vue-mapping-import-contenteditable
                    :list_mapping="listMapping"
                    :array_check_selected.sync="arrayCheckSelected"
                    :modify.sync="modify"
                    :value.sync="item"
                  />
                </div>
                <div class="validate-metafields" v-if="item.validate_metafields">Field is required</div>
              </div>
              <div class="column-label">
                <a-input @input="change(filteredList[index])" v-model="item.label" class="custom-input-weight" />
              </div>
              <div v-if="showDelete(item)" class="column-action d-flex justify-content-end">
                <button class="ant-btn" @click="deleteRow(item)"><sh-icon style="color: #828282" :icon="['fal', 'times']" /></button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center not-found">No result found</div>
          </template>
          <div class="mt-3">
            <a @click="addField()">
              <sh-icon class="m-r-2" :icon="['far', 'plus']" />
              Add System Field
            </a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProductSourcesMapping',
  metaInfo: {
    title: 'Product Sources Mapping',
  },
  data() {
    return {
      spinning: true,
      listMapping: [],
      listMappingLength: 0,
      tag: [],
      modify: false,
      timeout: null,
      loading: false,
      search: '',
      customFieldID: 0,
      submitData: [],
      validated: false,
      arrayCheckSelected: [],
    }
  },
  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),
    filteredList() {
      return this.listMapping.filter((item) => {
        return item.field_name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
  },
  methods: {
    ...mapActions({
      getListImportMapping: 'product/getListImportMapping',
      updateImport: 'product/updateImport',
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

    showDelete(item) {
      if (item.field_key.indexOf('custom_fields_') <= -1) {
        return false
      } else {
        return true
      }
    },
    deleteRow(rowData) {
      this.modify = true
      this.listMapping = this.listMapping.filter((item) => item.field_key !== rowData.field_key)
      this.submitData = this.submitData.filter((item) => item.field_key !== rowData.field_key)
      this.arrayCheckSelected = this.arrayCheckSelected.filter((item) => item.field_key !== rowData.field_key)

      var find = _.find(this.submitData, { field_key: rowData.field_key })
      if (!find) {
        if (!rowData.hasOwnProperty('status') || rowData.status == 'add') {
          rowData['status'] = 'delete'
          this.submitData.push(rowData)
        }
      }
    },
    getItemKey() {
      let HighestKey = 1
      const tempArray = []
      this.listMapping.map((item) => {
        if (item.field_key.indexOf('custom_fields') !== -1) {
          const itemKey = parseInt(item.field_key.replace('custom_fields_', ''))
          tempArray.push({
            ...item,
            key: itemKey,
          })
        }
      })
      tempArray.sort(function(a, b) {
        return a.key - b.key
      })

      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].key > HighestKey) {
          break
        }
        HighestKey++
      }
      return HighestKey
    },

    addField() {
      this.modify = true
      // if (this.listMapping.length >= this.listMappingLength + 50) {
      //   return null
      // }
      const itemKey = this.getItemKey()

      this.listMapping.push({
        id: this.customFieldID,
        key: itemKey,
        field_name: 'Custom Fields ' + itemKey,
        field_key: 'custom_fields_' + itemKey,
        assigned_field: '',
        assigned_field_name: '',
        label: '',
        data_type: 'String',
        status: 'add',
        type: '',
      })

      this.submitData.push({
        id: this.customFieldID,
        field_name: 'Custom Fields ' + itemKey,
        field_key: 'custom_fields_' + itemKey,
        assigned_field: '',
        assigned_field_name: '',
        label: '',
        data_type: 'String',
        status: 'add',
        type: '',
      })
    },
    renderList() {
      this.spinning = true
      var shop_id = `${this.shop.id}`
      return new Promise((resolve, reject) => {
        this.getListImportMapping({ shop_id })
          .then((res) => {
            let { status, data } = res.data
            if (status) {
              this.listMapping = data.import_product_mappings
              this.listMappingLength = this.listMapping.length
            }
          })
          .catch((res) => {
            console.log(res)

            reject()
          })
          .finally(() => {
            this.spinning = false
            resolve()
          })
      })
    },
    dataToSubmit() {
      if (this.submitData.length) {
        this.submitData = this.submitData.map((obj) => this.listMapping.find((o) => o.field_key === obj.field_key) || obj)
      } else {
        this.submitData = this.listMapping
      }
    },
    validateField() {
      this.validated = true
      this.listMapping.forEach((element) => {
        element['validate_metafields'] = element.assigned_field_name === ''
        if (element['validate_metafields'] && this.validated) {
          this.validated = false
        }
      })
    },
    removeUnuseField(metafields) {
      metafields.forEach((element) => {
        delete element.validate_metafields
      })
    },
    onSubmit() {
      var shop_id = `${this.shop.id}`
      this.dataToSubmit()
      var import_product_mappings = this.submitData
      clearTimeout(this.timeout)
      this.loading = true
      this.validateField()
      if (!this.validated) {
        this.loading = false
        return null
      }
      this.removeUnuseField(this.listMapping)
      this.timeout = setTimeout(() => {
        this.updateImport({
          shop_id,
          import_product_mappings,
        })
          .then((res) => {
            let { status, message } = res.data
            if (status) {
              this.submitData = []
              this.toastSuccess({
                title: 'Done !',
                message: 'Update Successfully',
              })
              this.renderList()
            } else {
              this.toastError({
                title: 'Error',
                message: message,
              })
            }
          })
          .catch((res) => {})
          .finally(() => {
            this.modify = false
            this.loading = false
          })
      }, 1000)
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
          this.modify = false
          this.arrayCheckSelected = []
        },
        onCancel: () => {},
      })
    },

    change(value) {
      var find = _.find(this.submitData, { field_key: value.field_key })
      this.submitData.forEach((item) => {
        if (item.field_key == value.field_key) {
          item.label = value.label
        }
      })

      if (!find) {
        this.submitData.push(value)
      }

      this.modify = true
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.modify) {
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
      })
    } else {
      next()
    }
  },
  created() {
    this.renderList()
  },
}
</script>

<style lang="scss" scoped>
.mapping {
  position: relative;

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

  .validate-metafields {
    color: $danger;
    font-size: 12px;
    position: absolute;
    bottom: -19px;
    font-weight: 600;
  }

  .force-validate-metafields {
    border: 1px solid $danger !important;
    border-radius: 4px;
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
      width: 25%;
    }

    .column-data-type {
      width: 10%;
    }

    .column-label {
      width: 25%;
    }

    .column-assigned {
      width: 25%;
      position: relative;
      .item-mapping {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 calc(100% - 32px);
        flex: 0 0 calc(100% - 32px);
        max-width: calc(100% - 32px);

        .fields {
          position: relative;
          border: 1px solid $border-color;
          border-radius: 4px;
          height: 32px;
          padding: 6px 11px;
          line-height: 20px;
          overflow: hidden;

          .btn {
            position: absolute;
            right: 15px;
            top: 6px;
            z-index: 1;
            border: none;
            background: transparent;
            &:hover,
            &:focus {
              border: none;
              background: none;
            }
          }

          .list-mapping {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            border: none;
            background: transparent;
            min-width: 228px;
            max-height: 300px;
            overflow: hidden;
          }
        }
      }
    }

    .column-action {
      width: 25%;
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
      padding: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;

      &:hover {
        background-color: $light-gray3;
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
