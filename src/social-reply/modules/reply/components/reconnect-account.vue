<template>
  <div class="box-reconnect-account flex flex-col w-100 h-100 center" v-if="account_info && account_info.connect_error">
    <div class="p-t-20 p-b-20">
      <img src="@reply/assets/svg-icon/modules/chat-widget/connection-lost-2.svg" height="110px" />
    </div>

    <div class="f-20 font-medium">
      Connection Lost
    </div>

    <div class="text-center">
      The connection with <strong>{{ account_info.name }}</strong> was lost, please reconnect.
    </div>

    <div class="p-t-16 p-b-28">
      <social-popup-auth
        social_type="facebook"
        action="reauth"
        :social_id="account_info.social_id"
        pusher_event_name="re_auth_social"
        @change-loading="changeReconnectingStatus"
        @success="visible = false"
      >
        <a-button class="m-r-8" type="primary" :loading="is_reconnecting">
          Re-Connect
        </a-button>
      </social-popup-auth>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    account_info: {
      type: Object,
      default: () => {},
      required: false,
    },
  },

  data() {
    return {
      is_reconnecting: false,
    }
  },

  methods: {
    changeReconnectingStatus(val) {
      this.is_reconnecting = val
    },
  },
}
</script>

<style lang="scss" scoped>
.box-reconnect-account {
  background-color: #f7f8fa;
}
</style>
