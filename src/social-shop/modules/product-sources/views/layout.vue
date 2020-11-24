<template>
  <div class="page-product-sources">
    <div class="custom-wrapper-import">
      <div class="d-flex justify-content-between align-items-center">
        <h1>Product Sources</h1>
        <div class="box-view d-flex align-items-center">
          <div :class="{ 'active-view': getView == 'grid' }" @click="changeView('grid')" class="m-r-10 content-view">
            <sh-icon :icon="['fas', 'th-large']" />
            Grid view
          </div>
          <div :class="{ 'active-view': getView == 'list' }" @click="changeView('list')" class="content-view">
            <sh-icon :icon="['fas', 'th-list']" />
            List view
          </div>
        </div>
      </div>
    </div>
    <transition name="fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'VueLayout',
  computed: {
    ...mapGetters({
      getView: 'product/getView',
      shop: 'auth/getShop',
    }),
  },
  methods: {
    ...mapMutations({
      setView: 'product/setView',
    }),
    changeView(tab) {
      this.setView(tab)
      localStorage.setItem(`isViewStatus_${this.shop.id}`, tab)
    },
  },
}
</script>
<style lang="scss" scoped>
.page-product-sources {
  padding: 24px;
  color: #252627;
  background-color: #f7f8fa;
  .custom-wrapper-import {
    padding: 10px 24px 10px 24px;
    margin: -24px -24px 0 -24px;
    width: auto;
    background: $white;
    border-bottom: 1px solid $border-color;
    .box-view {
      background: $light-primary2;
      border-radius: 10px;
      padding: 6px;
      .content-view {
        color: #8ea0c7;
        font-weight: 500;
        font-size: 13px;
        padding: 4px 10px;
        cursor: pointer;
      }
      .active-view {
        background: $white;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        color: $primary-color;
      }
    }
  }
  h1 {
    font-size: 24px;
  }
  .tab-select {
    display: flex;
    border-bottom: 1px solid #e2e2e2;
    .tab-item {
      position: relative;
      font-size: 14px;
      color: $dark-gray3;
      font-weight: 600;
      margin-right: 30px;
      padding-bottom: 10px;
      &:before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 3px;
        background: transparent;
        transition: all 0.2s ease;
      }
      &.is-actived {
        color: $primary-color;
        &:before {
          background: $primary-color;
        }
        &:hover {
          &:before {
            background: $primary-color;
          }
        }
      }
    }
  }
}
</style>
