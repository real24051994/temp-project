<template>
  <div class="setting-source-account-info">
    <div class="source-icon">
      <img src="@shop/assets/images/icon-shopify-2.svg" alt width="20px" height="20px" />
    </div>

    <div class="flex-grow-1 d-flex flex-column">
      <div class="shop-name">
        {{ shopInfo.name }}
      </div>

      <div class="shop-email">
        {{ shopInfo.email }}
      </div>
    </div>

    <div class="count-product">
      Total
      <strong> {{ count_product }} Products </strong>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    count_product: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  computed: {
    ...mapGetters({
      shopInfo: 'auth/getShop',
    }),
  },
}
</script>

<style lang="scss" scoped>
.setting-source-account-info {
  display: flex;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 4px;
  padding: 16px;
  width: 415px;
  max-width: 100%;

  .shop-name {
    font-weight: 500;
  }

  .shop-email {
    font-size: 12px;
    color: #828282;
  }

  .count-product {
    font-size: 12px;
  }

  .source-icon {
    background-color: #95bf47;
    border-radius: 4px;
    height: 36px;
    width: 36px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
