<template>
  <div @click="openPopupWindow">
    <slot />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const Pusher = require("pusher-js");
// Pusher.logToConsole = true;

export default {
  name: "social-popup-auth",

  props: {
    pusher_event_name: {
      type: String,
      default: "sadf",
      required: false,
    },

    action: {
      type: String,
      default: "auth", // # auth | reauth
      required: false,
    },

    social_type: {
      type: String,
      default: "facebook",
      required: false,
    },

    social_id: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      pusher: null,
      popup: null,
      timeout: null,
    };
  },

  computed: {
    ...mapGetters({
      shop: "auth/getShop",
    }),
  },

  beforeDestroy() {
    if (this.timeout) {
      clearInterval(this.timeout);
    }

    if (this.popup && this.popup.closed == false) {
      this.popup.close();
    }

    this.closePusher();
  },

  methods: {
    async generateUrl() {
      if (this.social_type === "facebook") {
        if (this.action === "auth") {
        } else if (this.action === "reauth") {
          const { data, status } = await this.$api.generalLinkReconnectSocial({
            socialType: this.social_type,
            socialId: this.social_id,
          });
          return data;
        }
      } else if (this.social_type === "twitter") {
      }
    },

    async openPopupWindow() {
      try {
        this.popup = window.open(
          "",
          "Social Reply",
          "menubar=1,resizable=1,width=900,height=500"
        );
        this.$emit("change-loading", true);
        let url = await this.generateUrl();

        const width = 900;
        const height = 500;

        this.popup.location = url;

        this.timeout = setInterval(() => {
          if (this.popup.closed) {
            this.closeNewTab();
            this.popup = null;
          }
        }, 500);
        this.initSocket();
      } catch (error) {}
    },

    closeNewTab() {
      this.$emit("change-loading", false);
      if (this.timeout) {
        clearInterval(this.timeout);
      }
      if (this.popup && this.popup.closed == false) {
        this.popup.close();
      }
    },

    initSocket() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: "ap1",
        forceTLS: true,
      });

      var channel = this.pusher.subscribe(`${this.shop.id}`);

      channel.bind(this.pusher_event_name, (payload) => {
        this.$emit("success", payload);
        this.closeNewTab();
      });
    },

    closePusher() {
      if (this.pusher) {
        this.pusher.disconnect();
      }
    },
  },
};
</script>
