<template>
  <a-modal v-model="visible" :title="false" :footer="false" :centered="true" class="modal-choose-pages" :body-style="{ padding: '' }" width="460px">
    <div class="flex flex-col">
      <div class="f-20 font-medium p-l-16 p-t-20 p-b-20 border-b">
        Connection Lost
      </div>

      <div class="flex flex-col text-center">
        <div class="p-t-20 p-b-20">
          <img src="@reply/assets/svg-icon/modules/chat-widget/connection-lost-2.svg" />
        </div>

        <div class="text-center p-l-40 p-r-40">
          The connection with <strong>{{ account_name }}</strong> was lost, <br />please reconnect.
        </div>

        <div class="p-t-24 p-b-28">
          <social-popup-auth
            social_type="facebook"
            action="reauth"
            :social_id="social_id"
            pusher_event_name="re_auth_social"
            @change-loading="changeConnectingStatus"
            @success="visible = false"
          >
            <a-button class="m-r-8" type="primary" :loading="is_connecting">
              Re-Connect
            </a-button>
          </social-popup-auth>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    social_id: {
      type: String,
      default: '',
    },

    account_name: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      is_connecting: false,
    }
  },

  computed: {
    visible: {
      get() {
        return this.show
      },

      set(val) {
        this.$emit('update:show', val)
      },
    },
  },

  methods: {
    changeConnectingStatus(val) {
      this.is_connecting = val
    },
  },
}
</script>
