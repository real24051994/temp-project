<template>
  <div class="box-product-type">
    <a-dropdown transitionName="none" :getPopupContainer="(trigger) => trigger.parentNode" :trigger="['click']" v-model="visible">
      <slot name="btn-trigger">
        <a-button :class="{ 'form-group--error': $v.valueField.$invalid && form_state }" class="btn-trigger custom-list-category">
          <div class="custom-name-category" v-if="valueField">
            <a-tooltip placement="bottom">
              <template slot="title">{{ valueField }}</template>
              {{ valueField }}
            </a-tooltip>
          </div>
          <div v-else>List Google Product Category</div>
          <sh-icon class="gg-box-arr-down" :icon="['fas', 'chevron-down']" />
        </a-button>
      </slot>
      <a-menu slot="overlay">
        <a-menu-item key="1">
          <a-input @input="handleSearch($event)" placeholder="Search" type="text">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <div class="scroller-container" v-if="data.length > 0">
            <RecycleScroller :items="data" @scroll.native.passive="handleScroll" :min-item-size="30" class="scroller">
              <template v-slot="{ item }">
                <a-tooltip placement="bottom" @click="chooseCategory(item.name)">
                  <template slot="title">{{ item.name }}</template>
                  {{ item.name }}
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
    <div v-if="$v.valueField.$invalid && form_state" class="d-flex m-t-10">
      <sh-icon class="text-danger m-r-5" :icon="['far', 'exclamation-circle']" />
      <span class="custom-error-message">Please choose Product Category</span>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import google_product_category from '@/config/google-product-category.json'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
const LOAD_THRESHOLD_PX = 300
import { RecycleScroller } from 'vue-virtual-scroller'

export default {
  props: ['form_state', 'assign_value', 'is_validate'],
  data: function() {
    return {
      data: google_product_category.slice(0, 500),
      loading: false,
      visible: false,
      search: '',
      arrayItems: [],
      tooltip: {
        contentAsHTML: true,
        side: 'right',
        maxWidth: 230,
      },
      totalItemsFiltered: [],
    }
  },
  components: {
    RecycleScroller,
  },
  computed: {
    valueField: {
      get() {
        return this.assign_value
      },
      set(value) {
        this.$emit('update:assign_value', value)
      },
    },
  },
  methods: {
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

    chooseCategory(item) {
      this.valueField = item
      this.visible = false
    },
    updateValidateStatus() {
      if (this.is_validate != this.$v.$invalid) {
        this.$emit('update:is_validate', this.$v.$invalid)
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
  },

  validations() {
    return {
      valueField: {
        required,
      },
    }
  },
  watch: {
    $v: {
      handler: function() {
        this.updateValidateStatus()
      },
      deep: true,
    },
  },

  mounted() {
    this.updateValidateStatus()
  },
}
</script>

<style lang="scss">
.box-product-type {
  width: 100%;
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    background: none;
  }
  .vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view {
    &:hover {
      background: #f3f3f3;
    }
  }
  .custom-error-message {
    font-size: 11px;
    color: $danger;
  }

  .form-group--error {
    .ant-select-selection {
      border: 1px solid $danger !important;
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
    &-container {
      height: 200px;
      font-size: 12px;
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
  .item-text {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
  }

  .form-group--error {
    border: 1px solid $danger !important;
  }

  .custom-list-category {
    width: 100%;
    text-align: left;
  }

  .custom-name-category {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 400px;
  }
  .custom-list-category {
    position: relative;
    .gg-box-arr-down {
      position: absolute;
      right: 16px;
      top: 30%;
      color: #252627;
      font-size: 16px;
      font-weight: 900;
      line-height: 14px;
      transition: 0.5s;
    }
    &:hover .gg-box-arr-down {
      color: #40a9ff;
    }
    &:focus .gg-box-arr-down {
      color: #40a9ff;
    }
    &.ant-dropdown-open .gg-box-arr-down {
      transform: rotate(180deg);
      transition: 0.3s;
      color: #40a9ff;
    }
  }
}
</style>
