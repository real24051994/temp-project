<template>
  <div class="list-account vue-list-account-table list-items-table">
    <div class="list-account-heading mx-4">
      <div class="list-account-heading--name">
        Account Name
      </div>

      <div class="list-account-heading--type">
        Account Type
      </div>

      <div class="list-account-heading--action" />
    </div>

    <transition name="fade-in" mode="out-in">
      <div
        v-if="loading && isEmpty(data)"
        class="py-5 d-flex align-items-center justify-content-center"
      >
        <fa-spin />
      </div>

      <div v-else-if="data.length" class="list-account-items">
        <ListAccountItem
          v-for="(item, index) in data"
          :key="index"
          :account_info="item"
          @reload="reload"
        />
      </div>

      <ListAccountEmpty v-else />
    </transition>

    <vue-reconnect-social
      v-if="reconnect.visible"
      v-model="reconnect.visible"
      :social="reconnect.social"
      :url="reconnect.url"
      @on-pusher="onPusher"
    />
    <vue-reconnect-social-error
      v-if="reconnect.error"
      v-model="reconnect.error"
      :social="reconnect.social"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import VueReconnectSocial from "@reply/components/social/vue-reconnect-social";
import VueReconnectSocialError from "@reply/components/social/vue-reconnect-social-error";
import ListAccountEmpty from "./list-account-empty";
import ListAccountItem from "./list-account-item";

export default {
  name: "VueListPostTable",

  components: {
    VueReconnectSocial,
    VueReconnectSocialError,
    ListAccountEmpty,
    ListAccountItem,
  },

  props: {
    value: {
      required: true,
    },

    loading: {
      type: Boolean,
    },
  },

  data() {
    return {
      is_reconnecting: [],
      is_removing: false,
      reconnect: {
        visible: false,
        url: "",
        social: "",
        error: false,
      },
    };
  },

  computed: {
    data: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    ...mapActions({
      dataLayer: "auth/dataLayer",
    }),

    reload() {
      this.$emit("reload");
    },

    reConnectSocial(item) {
      if (this.is_reconnecting.indexOf(item.social_id) >= 0) {
        return;
      }

      this.is_reconnecting.push(item.social_id);

      this.$api
        .generalLinkReconnectSocial({
          socialType: item.social_type,
          socialId: item.social_id,
        })
        .then((res) => {
          let { status = false, data } = res.data;
          if (status) {
            this.reconnect.social = item;
            this.reconnect.url = data;
            this.reconnect.visible = true;
          } else {
            this.toastError({
              title: "Error",
              message: "Cannot reconnect social",
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          this.is_reconnecting.splice(
            this.is_reconnecting.indexOf(item.social_id),
            1
          );
        });
    },

    onPusher(payload) {
      let { status = false } = payload;
      if (status) {
        var id = this.reconnect.social.social_id;
        this.is_reconnecting.splice(this.is_reconnecting.indexOf(id), 1);
        this.reconnect.visible = false;
        this.reconnect.social = null;
        this.reconnect.url = "";
        this.reconnect.error = false;
        this.reload();
        this.toastSuccess({
          title: "Done !",
          message: "Reconnect social success",
        });
      } else {
        this.reconnect.visible = false;
        this.reconnect.error = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-manage-account-popover {
  max-width: 200px;

  .ant-popover-content {
    .ant-popover-inner-content {
      min-height: 45px;
      height: auto;
    }
  }
}

.list-account {
  &-items {
    border: 1px solid $light-gray2;
    border-radius: 4px;
  }
  .list-account-heading {
    display: flex;
    align-items: center;
    font-weight: 500;
    height: 40px;

    .list-account-heading--name {
      width: 50%;
    }

    .list-account-heading--type {
      width: 25%;
    }

    .list-account-heading--action {
      width: 25%;
    }
  }
}
</style>
