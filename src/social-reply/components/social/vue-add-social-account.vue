<template>
  <div class="list-items-connect-social-account">
    <div class="item-connect-social-account" @click="onClick('facebook')">
      <div class="item-connect-social-account-content" :class="{ 'is-loading': is_loading_facebook }">
        <div class="item-connect-social-account-icon icon-facebook">
          <sh-icon :icon="['fab', 'facebook-square']" />
        </div>
        <div class="item-connect-social-account-text">
          Facebook
        </div>
        <div v-if="is_loading_facebook" class="item-connect-social-account-overlay">
          <a-spin>
            <a-icon slot="indicator" type="loading" style="font-size: 24px;" spin />
          </a-spin>
        </div>
      </div>
    </div>

    <!-- <div class="item-connect-social-account" @click="onClick('twitter')">
      <div class="item-connect-social-account-content" :class="{ 'is-loading': is_loading_twitter }">
        <div class="item-connect-social-account-icon icon-twitter">
          <sh-icon :icon="['fab', 'twitter-square']" /> 
        </div>
        <div class="item-connect-social-account-text">
          Twitter
        </div>
        <div v-if="is_loading_twitter" class="item-connect-social-account-overlay">
          <a-spin>
            <a-icon slot="indicator" type="loading" style="font-size: 24px;" spin />
          </a-spin>
        </div>
      </div>
    </div> -->

    <a-modal
      v-model="modal.visible"
      class="modal-connect-social-facebook"
      :after-close="afterClose"
      :body-style="{ padding: 0 }"
      :title="false"
      :footer="false"
      :destroy-on-close="true"
      width="520px"
    >
      <div v-if="modal.personal_info">
        <div class="modal-connect-social-facebook-header">
          <div class="modal-facebook-title m-b-16">
            You have loged in Facebook account
          </div>

          <div class="modal-facebook-account  m-b-12">
            <div class="item-social-avatar">
              <div class="item-social-account d-flex align-items-center">
                <social-avatar :src="modal.personal_info.avatar" social_type="facebook" />

                <div class="item-social-account-title font-medium" style="padding-left: 10px;">
                  {{ modal.personal_info.name }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="modal.data.length" class="modal-facebook-description  m-b-16">
            Choose which page you want to connect
          </div>
        </div>
        <template v-if="modal.data.length">
          <div class="modal-connect-social-facebook-body">
            <vue-simple class="list-row-socials">
              <template v-for="(item, index) in modal.data">
                <div
                  :key="`index_${index}`"
                  class="item-row-social"
                  :class="{ 'is-disabled': item.connected || item.is_available }"
                  @click="handleSelectFacebook(item)"
                >
                  <div class="item-row-social-info item-row-social-info-checkbox">
                    <div class="item-social-checkbox">
                      <label class="ant-checkbox-wrapper">
                        <span class="ant-checkbox" :class="{ 'ant-checkbox-checked': modal.selected.indexOf(item.social_id) >= 0 }">
                          <span class="ant-checkbox-inner" />
                        </span>
                      </label>
                    </div>

                    <div class="item-social-avatar">
                      <div class="item-social-account d-flex align-items-center">
                        <social-avatar :src="item.avatar" :social_type="item.social_type" />

                        <div class="item-social-account-title">
                          <div class="item-social-account-title-name font-medium line-clamp-1" style="padding-left: 10px; word-break: break-all;">
                            {{ item.name }}
                          </div>

                          <template v-if="item.connected">
                            <div class="item-social-account-title-status text-success p-l-10">
                              <sh-icon :icon="['far', 'check']" class="m-r-5" />
                              Connected
                            </div>
                          </template>

                          <template v-else-if="item.is_available">
                            <div class="item-social-account-title-status text-danger p-l-10">
                              <sh-icon :icon="['fas', 'exclamation-triangle']" class="m-r-5" />
                              Connected to another account
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="item-row-social-type">
                    <template v-if="item.social_type == 'facebook'">
                      Facebook Page
                    </template>
                    <template v-else-if="item.social_type == 'twitter'">
                      Twitter
                    </template>
                  </div>
                </div>
              </template>
            </vue-simple>
          </div>
        </template>

        <template v-else>
          <div class="modal-connect-social-facebook-body modal-connect-social-facebook-body-empty">
            <h3>No Facebook Page found</h3>
          </div>
        </template>

        <div class="modal-connect-social-facebook-footer">
          <a-button type="primary" block :loading="is_connecting" :disabled="!modal.selected.length" @click="handleConnectPage">
            Connect Pages
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const Pusher = require('pusher-js')
// Pusher.logToConsole = true
let popup = null

export default {
  name: 'VueAddSocialAccountPusher',

  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      is_loading: false,
      is_loading_facebook: false,
      is_loading_twitter: false,
      is_connecting: false,
      pusher: null,
      popup: null,
      timeout: null,
      social_type: '',
      modal: {
        visible: false,
        secret: '',
        personal_info: null,
        selected: [],
        data: [],
      },
    }
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),
  },

  beforeDestroy() {
    if (this.timeout) {
      clearInterval(this.timeout)
    }
    if (popup && popup.closed == false) {
      popup.close()
    }
    this.closePusher()
  },

  methods: {
    ...mapActions({
      // checkPageSelected: 'auth/checkPageSelected',
    }),

    handleConnectPage() {
      if (this.is_connecting) return
      this.is_connecting = true

      this.$api
        .checkPageSelected({
          social_info: this.modal.selected,
          secret: this.modal.secret,
        })
        .then((res) => {
          let { status = false, message = '', data = [] } = res
          if (status) {
            var connected_socials = this.modal.data.filter((item) => {
              return this.modal.selected.indexOf(item.social_id) >= 0
            })
            this.$emit('on-connect', connected_socials)
            this.toastSuccess({
              title: 'Done !',
              message: 'Connected Facebook Account !',
            })
            this.modal.visible = false
          } else {
            this.toastError({
              title: 'Error !',
              message: message,
            })
          }
        })
        .finally(() => {
          this.is_connecting = false
        })
    },

    handleSelectFacebook(item) {
      if (item.connected) return
      var index = this.modal.selected.indexOf(item.social_id)
      if (index >= 0) {
        this.modal.selected.splice(index, 1)
      } else {
        this.modal.selected.push(item.social_id)
      }
    },

    onClick(social_type) {
      this.$emit('on-twitter-error', null)
      if (this.is_loading_facebook || this.is_loading_twitter) return
      if (social_type == 'facebook') {
        this.is_loading_facebook = true
      } else if (social_type == 'twitter') {
        this.is_loading_twitter = true
      }
      this.social_type = social_type
      popup = window.open('', '_blank', 'menubar=1,resizable=1,width=900,height=500')
      this.timeout = setInterval(() => {
        if (popup.closed) {
          this.closeNewTab()
        }
      }, 500)

      this.$api
        .generalLinkSocial({ social: social_type })
        .then((res) => {
          let { status = false, data = '' } = res
          if (status) {
            popup.location = data
            this.initSocket()
          } else {
            this.closeNewTab()
          }
        })
        .catch((err) => {
          this.closeNewTab()
        })
        .finally(() => {})
    },

    closeNewTab() {
      if (this.timeout) {
        clearInterval(this.timeout)
      }
      if (popup && popup.closed == false) {
        popup.close()
      }
      this.is_loading_facebook = false
      this.is_loading_twitter = false
      this.social_type = ''
      this.closePusher()
    },

    initSocket() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: 'ap1',
        forceTLS: true,
      })

      var channel = this.pusher.subscribe(`${this.shop.id}`)
      channel.bind('auth_social', (payload) => {
        let { status = false, message = '', data = null, personal_info = null, social_type = null, secret = null } = payload
        if (status) {
          if (this.social_type == 'facebook') {
            this.modal.data = data.map((item) => {
              let temp = this.data.find((item2) => item2.social_id == item.social_id)
              item['connected'] = temp ? true : false
              return item
            })
            this.modal.visible = true
            this.modal.personal_info = personal_info
            this.modal.secret = secret
          } else if (this.social_type == 'twitter') {
            this.$emit('on-connect', data)
            this.toastSuccess({
              title: 'Done !',
              message: 'Connected Twitter Account !',
            })
          }
        } else {
          if (this.social_type == 'twitter') {
            this.$emit('on-twitter-error', { data, message })
          }
        }
        this.closeNewTab()
        this.closePusher()
      })

      channel.bind('auth_social_cancel', () => {
        this.closeNewTab()
        this.closePusher()
      })
    },

    closePusher() {
      if (this.pusher) {
        this.pusher.disconnect()
      }
    },

    afterClose() {
      this.modal.secret = ''
      this.modal.personal_info = null
      this.modal.selected = []
      this.modal.data = []
    },
  },
}
</script>

<style lang="scss" scoped>
.list-items-connect-social-account {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-connect-social-account {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 126px;
  height: 126px;
  border: 1px solid $border-color;
  border-radius: 4px;
  background-color: #fff;
  margin: 0 16px;
  padding: 16px;
  cursor: pointer;
  position: relative;

  &-content {
    text-align: center;
  }

  &-overlay {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-icon {
    font-size: 40px;
    line-height: 46px;

    &.icon {
      &-twitter {
        color: #1da1f2;
      }

      &-facebook {
        color: #4080ff;
      }
    }
  }

  &-text {
    color: #4f4f4f;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }

  &:hover {
    &:not(.is-loading) {
      border-color: $primary-color;
      background-color: rgba(24, 144, 255, 0.1);
    }
  }
}

.item-row-social {
  padding: 5px 24px;
  border-bottom: 1px solid $border-color;
  background-color: #fff;
  cursor: pointer;
  user-select: none;

  &.is-disabled {
    opacity: 0.5;
  }

  &:first-child {
    border-top: 1px solid $border-color;
  }

  &:hover {
    &:not(.is-disabled) {
      background-color: #f3f3f3;
    }
  }

  &::after {
    display: table;
    content: '';
    clear: both;
  }

  &-info {
    float: left;
    width: 75%;

    &-checkbox {
      &::after {
        display: table;
        content: '';
        clear: both;
      }

      .item-social-checkbox {
        width: 34px;
        float: left;
        height: 41px;
        display: flex;
        align-items: center;
      }

      .item-social-avatar {
        width: calc(100% - 34px);
        float: left;
      }
    }

    .item-social-account-title {
      flex-wrap: wrap;

      &-name {
        width: 100%;
      }

      &-status {
        width: 100%;
        font-size: 12px;

        &.status-success {
          color: $success;
        }

        &.status-error {
          color: $danger;
        }
      }
    }
  }

  &-type {
    float: left;
    width: 25%;
    line-height: 41px;
    font-size: 14px;
    text-align: right;
    text-transform: capitalize;
  }
}
</style>

<style lang="scss">
.modal-connect-social-facebook {
  &-header {
    padding: 24px 24px 0 24px;
  }

  &-body {
    .list-row-socials {
      max-height: 250px;
      overflow: hidden auto;
    }

    &-empty {
      padding: 80px 0;
      text-align: center;
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;

      h3 {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        margin: 0;
      }
    }
  }

  &-footer {
    padding: 24px;

    .ant-btn {
      height: 41px;
    }
  }

  .modal-facebook {
    &-title {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
    }

    &-description {
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>
