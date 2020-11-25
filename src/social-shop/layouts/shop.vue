<template>
  <div class="app-socical-shop" :class="{ 'app-social-shop-has-banner' : show_banner_rate}">
    <transition name="fade" mode="out-in">
      <div v-if="is_loading" key="is-loading" class="app-layout-loading">
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
      </div>
      <div v-else key="loaded">
        <div class="app-layout" id="app-layout-master" :class="{ 'app-layout-collapsed': collapse }">
          <template v-if="is_loading_error">
            <div>
              <vue-error type="500"></vue-error>
            </div>
          </template>
          <template v-else>
            <!-- <div class="app-layout-collapse">
              <a-button class="btn-sidebar-collapse" shape="circle" @click="handleCollapse">
                <i v-if="collapse" class="far fa-bars"></i>
                <i v-else class="far fa-chevron-left"></i>
              </a-button>
            </div> -->
            <div class="app-layout-sidebar">
              <app-sidebar :logo="logo" :modules="sidebar.modules" :data="sidebar.data" :collapse.sync="collapse"></app-sidebar>
            </div>
            <div class="app-layout-toolbar">
              <app-toolbar></app-toolbar>
            </div>
            <div class="app-layout-container">
              <div class="app-layout-content">
			          <transition name="fade-in" mode="out-in">
                 	<vue-rate-on-shopify v-if="show_banner_rate" />
                </transition>
                <transition name="fade-in" mode="out-in">
                  <router-view />
                </transition>
              </div>
              <!-- <div class="app-layout-footer">
                <app-footer></app-footer>
              </div> -->
            </div>
          </template>
        </div>
      </div>
    </transition>

    <SyncingStatus v-if="getAuthSetupInfo" />
    <template v-if="displayAsVersion()">
      <a-modal :width="720" class="modal-permission-form" :footer="false" :title="false" :visible="visible" :closable="false">
        <div class="d-flex">
          <div class="box-left">
            <h2 class="title-update">We need your permission</h2>
            <p class="m-t-20">
              Socialshop would like to access your store's metafields <br />
              data to bring you better feed customization
            </p>
            <!-- <div class="d-flex">
              <div class="m-r-15">
                <img src="@shop/assets/images/img-big-update.png" alt="" />
              </div>
              <div class="d-flex flex-column">
                <div class="txt-feature">New features include this update</div>
                <div class="content-update">Enhance catalog</div>
                <div class="content-update">New Submitting Feed Flow</div>
                <div class="content-update">Encourage Creating Feed</div>
              </div>
            </div> -->
            <p class="m-t-20">
              To learn more about the permission
              <a target="_blank" href="https://socialhead.io/blog/socialshop-update-rock-all-shopping-channel-with-better-product-feed/">click here</a>
            </p>
            <div class="d-flex align-items-center box-bulk-action">
              <a-button :loading="btnLoading" class="m-r-20" style="width: 163px; height: 40px;" type="primary" @click="submitPermission">APPROVE</a-button>
              <!-- <a href="" @click.stop.prevent="closeBoxUpdate()" style="text-decoration: underline">Remind me later</a> -->
            </div>
          </div>
          <div class="box-right">
            <div class="img-update">
              <img width="227" src="@shop/assets/images/specif-cate.png" alt="" />
            </div>
          </div>
        </div>
      </a-modal>
    </template>
  </div>
</template>

<script>
import AppToolbar from '@/layouts/partials/toolbar'
import AppSidebar from '@/layouts/partials/sidebar.vue'
import { mapActions, mapGetters } from 'vuex'
import SyncingStatus from '../components/syncing-status'
export default {
  name: 'shop',
  components: {
    AppToolbar,
    AppSidebar,
    SyncingStatus,
  },
  metaInfo: {
    titleTemplate: '%s - Socialshop',
  },
  data() {
    return {
      visible: true,
      btnLoading: false,
      is_loading: true,
      is_loading_error: false,
      collapse: true,
      logo: {
        collapse: require('@shop/assets/images/logo-social-shop.svg'),
        expand: require('@shop/assets/images/logo-social-shop-expand.svg'),
      },
      sidebar: {
        data: [
          {
            items: [
              {
                title: 'Feed Center',
                route: 'FeedCenter',
                type: 'router-link',
                id: 'vue-sidebar-feed-center',
                icon: 'tag',
              },
            ],
          },
        ],
        modules: {
          FeedCenter: ['FeedCenter','CreateFeed', 'FeedDetail', 'FeedDetailMapping', 'FeedDetailCategory'],
          GooglePromotion: ['GooglePromotion'],
          GoogleMerchant: ['GoogleMerchant'],
        },
      },
      
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
      chat_box_token: 'auth/getChatBoxToken',
      chat_box_data: 'auth/getChatBoxData',
      getBannerRate : 'auth/getBannerRate',
      getRateRoutes : 'auth/getRateRoutes',
      getAuthSetupInfo : 'auth/getAuthSetupInfo'
    }),
    show_banner_rate : function(){
      return this.getBannerRate && this.getRateRoutes.indexOf(this.$route.name) >= 0 
    }
  },
  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
      dataLayer: 'auth/dataLayer',
      accessPermission: 'auth/accessPermission',
      fetchAuthSetupInfo : 'auth/getAuthSetupInfo'
    }),
    handleCollapse() {
      this.collapse = !this.collapse
    },
    handleCancel(e) {
      this.closeBoxUpdate()
    },
    submitPermission() {
      this.btnLoading = true
      this.accessPermission()
        .then((res) => {
          let { status, data } = res
          if (status) {
            window.location.href = data.url
            this.visible = false
          }
        })
        .catch((err) => {})
        .finally(() => {
          this.btnLoading = false
        })
    },
    displayAsVersion() {
      if (this.user && this.user.shop.app_version !== process.env.VUE_APP_SOCIAL_SHOP_APP_VERSION) {
        return true
      }
      return false
    },
  },
  async mounted() {
    this.is_loading = false
    this.is_loading_error = false
    // if (!this.is_loading_error) {
    //   if (this.user) {
    //     if (this.chat_box_data) {
    //       this.$crisp.init({
    //         token: this.chat_box_token,
    //         data: this.chat_box_data,
    //       })
    //     }
    //     this.$userpilot.init({ app_id: '32sm45e10' }).then(() => {
    //       this.$userpilot.register({
    //         id: `ss_${this.user.shop.id}`,
    //         data: {
    //           app_name: 'Socialshop',
    //           name: this.user.shop.name,
    //           email: this.user.shop.email,
    //           created_at: this.user.shop.created_at,
    //         },
    //       })
    //       this.$watch('$route', () => {
    //         this.$userpilot.reload()
    //       })
    //     })
    //     this.dataLayer({
    //       userId: this.user ? this.user.id : 'unknown',
    //     })
    //   }
    //   if( !this.getAuthSetupInfo ){
    //     this.fetchAuthSetupInfo({responseInfo :true})
    //   }
    // }
  },
}
</script>
<style lang="scss">
.modal-permission-form {
  .ant-modal-body {
    padding: 0;
  }
  .box-left {
    flex: 0 0 70%;
    max-width: 70%;
    padding: 40px;
    .title-update {
      font-weight: 600;
      font-size: 24px;
    }
    .txt-feature {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 12px;
      margin-top: 20px;
    }
    .content-update {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      margin-left: 5px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #bdbdbd;
        margin-right: 10px;
      }
    }
    .box-bulk-action {
      margin: 60px 0 0 0;
    }
  }
  .box-right {
    flex: 0 0 30%;
    max-width: 30%;
    background-color: $light-primary2;
    padding: 25px 0;
    position: relative;
    .img-update {
      position: absolute;
      left: -33px;
      top: 53px;
    }
  }
}
</style>
