<template>
  <div class="d-flex wrapper-upgrade">
    <div class="box-update-left m-r-50"><img src="@shop/assets/images/upgrade-icon.svg" alt /></div>
    <div class="d-flex box-update-right flex-column align-items-start">
      <img class="m-b-30" src="@shop/assets/images/logo-socialshop.svg" alt />
      <h1 class="m-b-0 f-size-38">New Version released</h1>
      <p class="introduction">Socialshop with a whole new look!</p>
      <p>In this new version, we have completely redesigned Socialshop to offer you the optimal experience.</p>
      <div class="news-notification">
        <div class="d-flex align-items-center">
          <sh-icon class="m-r-10" :icon="['fal', 'star']" />
          <div class="txt-news">What' news</div>
        </div>
        <div class="d-flex new-feature flex-column">
          <div class="title-feature">Product List page</div>
          <div>View and manage all your products in one place</div>
        </div>
        <div class="d-flex new-feature flex-column m-t-20">
          <div class="title-feature">Feed Center page</div>
          <div>Understand your feed better with distinct items’ status</div>
        </div>
      </div>
      <div class="d-flex m-t-30">
        <a-spin class="box-product-loading" size="large" :spinning="spinning">
          <a-icon slot="indicator" type="loading" style="font-size: 33px" spin />
        </a-spin>
        <div class="d-flex m-l-20 flex-column">
          <div class="process-text">Processing...</div>
          <div class="text-design">The new design is on the way to you in a couple of minutes</div>
        </div>
      </div>
    </div>
    <a-modal
      :maskClosable="false"
      :closable="false"
      width="600px"
      v-model="visible"
      :footer="false"
      style="top: 100px;"
      v-if="visible"
      wrap-class-name="modal-get-help"
      ><div class="d-flex flex-column justify-content-center align-items-center">
        <img src="@shop/assets/images/get-help.svg" alt="" />
        <div class="error">Oops, something happened</div>
        <div>Please contact Customer Service team to get support</div>
        <a-button class="m-t-20" @click="clickHelp" type="primary">Get Help</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
const Pusher = require('pusher-js')
Pusher.logToConsole = false
export default {
  name: 'Upgrade',
  metaInfo: {
    title: 'Upgrade version',
  },
  data: function() {
    return {
      spinning: true,
      pusher: null,
      visible: false,
    }
  },
  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
      infoUser: 'auth/getUser',
    }),
  },
  methods: {
    ...mapActions({
      dataLayer: 'auth/dataLayer',
    }),
    initSocket() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: 'ap1',
        forceTLS: true,
      })
      var channel = this.pusher.subscribe(`${this.shop.id}`)
      channel.bind('migrate', (res) => {
        if (res.status) {
          this.redirect({ name: 'FeedCenter' })
        } else {
          this.visible = true
        }
      })
    },
    clickHelp() {
      this.visible = false
      if (typeof this.$crisp != 'undefined') {
        this.$crisp.toggle()
      }
    },
    closePusher() {
      if (this.pusher) {
        this.pusher.disconnect()
      }
    },
  },
  created() {
    this.initSocket()
    this.dataLayer({
      userId: this.infoUser.id,
    })
  },
  beforeDestroy() {
    this.closePusher()
  },
}
</script>

<style lang="scss" scoped>
.wrapper-upgrade {
  position: absolute;
  top: 120px;
  padding: 0 10px;
  .box-update-right {
    .bold {
      font-weight: 500;
    }
    .introduction {
      font-size: 16px;
      color: $primary-color;
    }
    .news-notification {
      border: 1px solid #cecece;
      border-radius: 4px;
      padding: 16px;
      width: 428px;
      .txt-news {
        font-weight: 500;
        font-size: 16px;
        color: #000000;
      }
      .new-feature {
        color: $app-sidebar-text-color;
        .title-feature {
          font-weight: 500;
          font-size: 14px;
        }
      }
    }
    .process-text {
      font-weight: 500;
      font-size: 16px;
      color: $primary-color;
    }
    .text-design {
      color: #828282;
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss">
.modal-get-help {
  .error {
    font-weight: 500;
    font-size: 18px;
    color: $text;
    text-transform: uppercase;
    margin-top: 40px;
  }
}
</style>
