<template>
  <div class="vue-app-install-page container">
    <div class="row">
      <div class="col col-12">
        <div class="vue-app-install-page-wrap">
          <div class="vue-app-install-page-image">
            <img src="@shop/assets/images/login/install.png" alt="" />
          </div>
          <h3 class="vue-app-install-page-title">
            Multiple platforms product feed manager
          </h3>
          <div class="vue-app-install-page-description">
            List, sync and optimize your product feed to Google Merchant Center and Facebook Catalog in 1 click
          </div>
          <div class="vue-app-install-page-action">
            <a-button size="large" type="primary" :loading="is_loading" @click="handleLogin">
              Install app now!
            </a-button>
            <a href="https://apps.shopify.com/socialshop" target="_blank" class="m-l-16 ant-btn ant-btn-lg">
              <span>Learn more</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'InstallApps',
  metaInfo: {
    title: 'Install Apps',
  },
  data() {
    return {
      is_loading: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
    }),
  },
  methods: {
    ...mapActions({
      shopifyLogin: 'auth/shopifyLogin',
    }),
    handleLogin() {
      if (!this.is_loading) {
        this.is_loading = true
        var shop = this.user.shop_domain.replace(/.myshopify.com/gi, '')
        this.shopifyLogin({ shop })
          .then((res) => {
            let { status, data } = res.data
            if (status && data) {
              window.location.href = data
              this.is_loading = false
            } else {
              this.is_loading = false
            }
          })
          .catch((err) => {
            this.is_loading = false
          })
      }
    },
  },
}
</script>
<style lang="scss">
.vue-app-install-page {
  &-wrap {
    padding: 80px 15px;
    text-align: center;
  }
  &-image {
    margin-bottom: 24px;
  }
  &-title {
    font-weight: bold;
    font-size: 26px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  &-description {
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
    color: #828282;
  }
}
</style>
