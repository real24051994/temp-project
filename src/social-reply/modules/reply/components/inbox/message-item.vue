<template>
  <div
    class="message-item w-100"
    :class="{ 'is-page': is_page }"
    :id="data.message_id"
  >
    <div class="sender-avatar-wrap">
      <social-avatar
        v-if="!is_page && !hideSenderAvatar"
        :src="conversation_info.avatar"
        size="24"
      />
    </div>

    <a-tooltip :placement="`${is_page ? 'right' : 'left'}`">
      <template slot="title">
        <div class="f-14">{{ getTime(data.created_time) }}</div>
      </template>

      <div class="message-item-content">
        <div class="message-item-detail">
          <component
            :is="component"
            :data="data"
            :is_page="is_page"
            v-if="component"
          />
          <!-- <div v-if="is_page">
            <template v-if="data.message_id.toString().startsWith('srp_')">
              <sh-icon
                class="d-flex ml-2"
                :icon="['far', 'circle']"
                color="#CCDCFF"
              />
            </template>
            <template v-else>
              <sh-icon
                class="d-flex ml-2"
                :icon="['far', 'check-circle']"
                color="#CCDCFF"
              />
            </template>
          </div> -->
        </div>
        <div v-if="data.send_error" class="d-block message-error">
          {{ data.send_error }}
        </div>
      </div>
    </a-tooltip>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "message-item",

  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },

    next: {
      type: Object,
      default: null,
      required: false,
    },
  },

  data() {
    return {
      component: null,
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
      conversations: "Conversation/getConversations",
      conversation_info: "Conversation/getConversationInfo",
    }),

    loader() {
      let type = "text.vue";

      if (
        this.isEmpty(this.data.attachments) &&
        this.isEmpty(this.data.message) &&
        this.isEmpty(this.data.template)
      ) {
        type = "none.vue";
      } else if (
        !this.isEmpty(this.data.attachments) &&
        !this.isEmpty(this.data.message)
      ) {
        type = "mix";
      } else if (this.oGet(this.data, ["template", "type"]) === "generic") {
        type = "template_generic.vue";
      } else if (this.oGet(this.data, ["template", "type"]) === "receipt") {
        type = "template_receipt.vue";
      } else if (this.data.attachments && this.data.attachments.length === 1) {
        type = this.data.attachments[0].type + ".vue";
      } else if (this.data.attachments && this.data.attachments.length > 1) {
        const found = this.data.attachments.find(
          (item) => item.type !== "image"
        );

        if (found) {
          type = "mix";
        } else {
          type = "images.vue";
        }
      }

      return () => import(`./inbox-templates/${type}`);
    },

    is_page() {
      return this.data.social_account_id === this.data.sender_id;
    },

    hideSenderAvatar() {
      if (!this.next) {
        return false;
      }

      return this.next && +this.next.sender_id === +this.data.sender_id;
    },
  },

  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader();
      })
      .catch(() => {
        this.component = () => import("./inbox-templates/text.vue");
      });
  },

  methods: {
    getTime(timestamp) {
      const time = new Date(timestamp);

      if (this.isToday(time)) {
        return this.dateFormat(time, "p");
      }
      return this.dateFormat(time, "PP p");
    },
  },
};
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: 8px;

  .sender-avatar-wrap {
    min-width: 25px;
    margin-right: 10px;
  }

  .sender-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;

    img {
      border: 1px solid #cecece;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .page-avatar {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 5px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .message-item-content {
    max-width: 470px;
    overflow: hidden;
  }

  .message-item-detail {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  &.is-page {
    justify-content: flex-end;

    .message-item-content {
      color: white;
    }
  }
}
</style>

<style scoped>
.message-item-content >>> .message-item-images {
  background: white;
}

.message-error {
  padding-top: 8px;
  color: #eb5757;
}
</style>
