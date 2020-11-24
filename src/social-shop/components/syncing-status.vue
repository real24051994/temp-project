<template>
  <div>
    <div class="notification-section" v-if="notifications">
      <template v-if="notifications.shopify_syncing == 'update' || notifications.shopify_syncing == 'import'">
        <div :class="{ 'hidden-box': isShow.import }" class="fixed-syncing-status">
          <template>
            <div class="d-flex align-items-center">
              <a-icon slot="indicator" type="sync" class="icon-sync" style="font-size: 29px;" spin />
              <div class="d-flex flex-column">
                <div v-if="notifications.shopify_syncing == 'import'">Product Importing</div>
                <div v-else>Product Syncing</div>
                <div class="count-product-import">{{ notifications.number_products }}/{{ notifications.total_products }} Products Imported</div>
              </div>
              <div class="close-section" @click="isShow.import = !isShow.import"><img class="effect-close" src="@shop/assets/images/close-ico.svg" alt /></div>
            </div>
          </template>
        </div>
      </template>
      <template v-else-if="notifications.shopify_syncing == false">
        <div class="fixed-syncing-status">
          <div class="m-r-10"><img src="@shop/assets/images/success.svg" alt="" /></div>
          <div>Import Completed</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
const Pusher = require('pusher-js')
Pusher.logToConsole = false
export default {
  name: 'SyncingStatus',
  data() {
    return {
      pusher: null,
      notifications: {
        feed_processing: [],
        shopify_syncing: null,
      },
      isShow: {
        import: false,
      },
    }
  },
  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
      setup_info: 'auth/getAuthSetupInfo',
      getListFeed: 'feed/getListFeed',
    }),
    syncing() {
      return this.setup_info.notification_flow || null
    },
    routePath() {
      return this.$route.path
    },
  },
  watch: {
    'setup_info.notification_flow'(syncing) {
      this.notifications = syncing
    },
  },
  created() {
    if (this.setup_info) {
      if (this.setup_info.notification_flow === null) {
        this.notifications = {
          feed_processing: [],
          shopify_syncing: null,
        }
      } else {
        this.notifications = this.setup_info.notification_flow
      }
    }
    this.initSocket()
  },
  methods: {
    ...mapMutations({
      setListFeed: 'feed/setListFeed',
      setIndexProcessing: 'feed/setIndexProcessing',
    }),
    displayAsRoute() {
      const regx = /^\/product-sources(\/)?/
      if (regx.test(this.routePath)) {
        return true
      }
      return false
    },
    initSocket() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: 'ap1',
        forceTLS: true,
      })
      var channel = this.pusher.subscribe(`${this.shop.id}`)
      channel.bind('ss_notification_flow', (res) => {
        var dataPusher = res.data
        var keys = Object.keys(dataPusher).filter(Boolean)
        var key = keys[0]
        this.notifications = this.setup_info.notification_flow
        if (keys.length && this.notifications !== null) {
          if (typeof this.notifications[key] != 'boolean' && key == 'feed_processing') {
            var index = _.findIndex(this.getListFeed, (o) => o.id === dataPusher.feed_processing.id)
            if (index >= 0) {
              this.setIndexProcessing(dataPusher.feed_processing)
            }
          } else {
            this.notifications.shopify_syncing = dataPusher.shopify_syncing
            this.notifications.number_products = dataPusher.number_products
            this.notifications.total_products = dataPusher.total_products
            this.notifications.feed_processing = this.setup_info.notification_flow.feed_processing
            if (!dataPusher.shopify_syncing) {
              setTimeout(() => {
                this.notifications.shopify_syncing = null
                this.reloadPage()
              }, 2000)
            }
          }
        }
      })
    },
    closePusher() {
      if (this.pusher) {
        this.pusher.disconnect()
      }
    },
    reloadPage() {
      if (this.routePath) {
        const regx = /^\/product-sources(\/)?$/
        // const regx2 = /^\/feed\/[a-zA-Z0-9-]+\/?$/
        if (regx.test(this.routePath)) {
          this.$eventBus.$emit('reload-syncing-shopify')
        }
      }
    },
  },
  beforeDestroy() {
    this.closePusher()
  },
}
</script>

<style lang="scss" scoped>
.notification-section {
  position: fixed;
  bottom: 80px;
  right: 30px;
  display: block;
  .fixed-syncing-status {
    font-size: 16px;
    border-radius: 6px;
    background: $base-color1;
    box-shadow: 0px 2px 10px rgba(66, 103, 178, 0.25);
    height: 70px;
    padding: 14px;
    width: 300px;
    display: flex;
    align-items: center;
    color: $text;
    font-weight: 500;
    margin-bottom: 10px;
    position: relative;
    .icon-sync {
      margin-right: 14px;
      font-size: 18px;
      color: $primary-color;
    }
    .close-section {
      position: absolute;
      right: 14px;
      top: 5px;
      cursor: pointer;
    }
    .count-product-import {
      color: #5b86e5;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .hidden-box {
    display: none;
  }
  img.effect-close {
    &:hover {
      filter: brightness(1.75);
    }
  }
}
</style>
<style lang="scss">
.notification-section {
  z-index: 3;
  .ant-collapse-header {
    height: 48px;
    padding: 14px;
    width: 300px;
    background: #4f4f4f;
    display: flex;
    align-items: center;
    color: $white;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    position: relative;
    font-size: 16px;
    cursor: pointer;
    .ant-collapse-extra {
      position: relative;
      right: -73px;
    }
    .anticon {
      margin-right: 10px;
    }
  }
  .ant-collapse-content {
    padding: 10px;
    background: #f7f8fa;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .ant-collapse-item {
    margin-bottom: 10px;
  }
  .box-notification {
    max-height: 150px;
    overflow: auto;
    .display-feed {
      background: #ffffff;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: #4f4f4f;
      .name-feed {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .blue-status {
        color: #5b86e5;
      }
      .green-status {
        color: #35b26f;
      }
    }
  }
  .arrow {
    transform: rotate(180deg);
  }
}
</style>
