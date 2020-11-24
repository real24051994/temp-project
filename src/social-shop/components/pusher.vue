<template>
  <div />
</template>

<script>
import { mapGetters } from 'vuex'
const Pusher = require('pusher-js')

export default {
  name: 'Pusher',
  props: {
    url: {
      type: String,
      required: true,
    },
    loading_login: {
      type: Boolean,
    },
    is_hidden: {
      type: Boolean,
      required: false,
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

  created() {
    this.initSocket()
  },

  mounted() {
    this.openNewTab()
  },

  methods: {
    openNewTab() {
      let width = 900
      let height = 700
      this.popup = window.open(this.url, '_blank', 'menubar=1,resizable=1,width=' + width + ',height=' + height + '')
      this.timeout = setInterval(() => {
        if (this.popup.closed) {
          clearInterval(this.timeout)
          this.popup = null
          this.$emit('update:is_hidden', false)
          this.$emit('close-popup')
        }
      }, 100)
      this.initSocket()
    },

    closeNewTab() {
      if (this.timeout) {
        clearInterval(this.timeout)
      }
      if (this.popup && typeof this.popup.close == 'function') {
        this.popup.close()
      }
      this.$emit('update:is_hidden', false)
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
