<template>
  <div class="d-flex justify-content-center">
    <div v-if="loading_login" key="is-loading">
      <slot name="button"></slot>
    </div>
    <div key="loading-success" v-else class="d-flex flex-grow-1" @click="connect(social_type)">
      <slot name="popup"></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const Pusher = require('pusher-js')
Pusher.logToConsole = false
export default {
  name: 'OpenPopup',
  props: {
    loading_login: {
      type: Boolean,
    },
    allowClick: {
      type: Boolean,
    },
    social_type: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
    allow_uninstall: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pusher: null,
      popup: null,
      timeout: null,
    }
  },
  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
    }),
  },
  methods: {
    ...mapActions({
      connectSocial: 'auth/connectSocial',
      uninstallBusinessExtension: 'feed/uninstallBusinessExtension',
    }),
    async connect(social_type) {
      var uninstall_fbe = 'uninstall_fbe'
      var internal_id = this.info
      if (!this.allowClick) {
        this.$emit('update:loading_login', true)
        this.popup = window.open('', '_blank', 'menubar=1,resizable=0,width=565,height=500')
        this.timeout = setInterval(() => {
          if (this.popup.closed) {
            this.closeNewTab()
          }
        }, 500)
        try {
          if (this.social_type === 'facebook_fbe' && this.allow_uninstall == true) {
            await this.uninstallBusinessExtension({ uninstall_fbe, internal_id }).then((res) => {})
          }
          const response = await this.connectSocial({ social: social_type })

          let { data, status, message } = response.data

          if (status) {
            this.popup.location = data
            this.initSocket()
          } else {
            this.toastError({
              title: 'Error',
              message: message,
            })
            this.closeNewTab()
          }
        } catch (error) {
          this.toastError({
            title: 'Error',
            message: error,
          })
        }
      }
    },

    closeNewTab() {
      this.$emit('update:loading_login', false)

      if (this.timeout) {
        clearInterval(this.timeout)
      }
      if (this.popup && typeof this.popup.close == 'function') {
        this.popup.close()
      }
    },

    initSocket() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: 'ap1',
        forceTLS: true,
      })

      let channel = this.pusher.subscribe(`${this.shop.id}`)

      channel.bind('auth_social_shop', (res) => {
        this.$emit('on-pusher', res)
        this.closeNewTab()
      })
    },

    closePusher() {
      if (this.pusher) {
        this.pusher.disconnect()
        this.$emit('update:loading_login', false)
      }
    },
  },

  beforeDestroy() {
    if (this.timeout) {
      clearInterval(this.timeout)
    }

    if (this.popup && typeof this.popup.close == 'function') {
      this.popup.close()
    }

    this.closePusher()
  },
}
</script>

<style lang="scss" scoped></style>
