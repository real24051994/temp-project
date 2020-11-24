<template>
  <transition name="fade" mode="out-in">
    <div v-if="is_loading" key="is-loading" class="app-layout-loading">
      <a-spin>
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>
    <div v-else key="loaded">
      <div class="app-layout app-layout-no-sidebar" id="app-layout-master">
        <template v-if="loading_error">
          <div>
            <vue-error type="500"></vue-error>
          </div>
        </template>
        <template v-else>
          <div class="app-layout-toolbar">
            <app-toolbar></app-toolbar>
          </div>
          <div class="app-layout-container">
            <div class="app-layout-content">
              <transition name="fade-in" mode="out-in">
                <router-view />
              </transition>
            </div>
            <div class="app-layout-footer">
              <app-footer></app-footer>
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import AppToolbar from '@/layouts/partials/toolbar'
import AppFooter from '@/layouts/partials/footer.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DefaultLayout',
  components: {
    AppToolbar,
    AppFooter,
  },
  metaInfo: {
    titleTemplate: '%s - Socialshop',
  },
  data() {
    return {
      is_loading: true,
      is_loading_error: false,
    }
  },
  computed: {
    ...mapGetters({
      loading_error: 'getLoadingError',
	    user: 'auth/getUser',
      chat_box_token : 'auth/getChatBoxToken',
			chat_box_data : 'auth/getChatBoxData',
    }),
  },
  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
    }),
  },
  mounted() {
    this.is_loading = false
    this.is_loading_error = false
    if( this.chat_box_data ){
			this.$crisp.init({
				token : this.chat_box_token,
				data : this.chat_box_data,
			})
		}else{
			this.$crisp.init({})
		}
  },
}
</script>
<style lang="scss">
$app-banner-height: 38px;
.app-layout {
  &-banner {
    position: fixed;
    z-index: 501;
    right: 0;
    top: $app-toolbar-height;
    background: #fff;
    left: $app-sidebar-width;
    height: $app-banner-height;
    overflow: hidden;
  }
  &-container {
    transition: none;
  }
  &.app-layout-show-banner {
    .app-layout-container {
      padding-top: #{$app-toolbar-height + $app-banner-height};
      .page-container-aside {
        top: #{$app-toolbar-height + $app-banner-height};
      }
    }
    .app-layout-content {
      min-height: calc(100vh - #{$app-toolbar-height + $app-banner-height});
    }
  }
  &-toolbar {
    // rgba(61, 90, 153, 0.2)
    .vue-pricing-toolbar-post-quota {
      color: #ffffff;
      .vue-pricing-progress {
        .vue-pricing-progress-bar-inner {
          background-color: rgba(61, 90, 153, 0.2);
        }
        .vue-pricing-progress-bar {
          .vue-pricing-progress-bar-active {
            background: #ffffff !important;
          }
        }
      }
    }
  }
}
</style>
