<template>
  <div class="layout-inbox w-100 h-100" v-if="conversationId">
    <InboxHeader />

    <div class="layout-chatbox" v-if="is_loading && items.length === 0">
      <div :class="`center ${items.length === 0 ? 'flex-1' : ''}`">
        <fa-spin />
      </div>
    </div>

    <div class="layout-chatbox" v-else>
      <div
        class="chatbox flex flex-col position-relative"
        style="width: calc(2 / 3 * 100%);"
      >
        <template>
          <fa-infinite-loading
            direction="top"
            :isLoading="is_loading"
            :noMore="no_more"
            selector="#chatbox .simplebar-content-wrapper"
            @loadMore="handleFetchMessages(false)"
            :useLoading="false"
          />

          <div v-if="is_loading && items.length > 0" class="mt-4 pr-4">
            <div class="d-flex row justify-content-end mx-4">
              <a-skeleton :avatar="{ size: 20 }" active title />
            </div>
          </div>

          <InboxContent :items="items" :is_loading="is_loading" />

          <div v-if="is_loading && items.length === 0" class="chatbox-skeleton">
            <div class="w-100 d-flex row justify-content-end my-2">
              <div class="w-50">
                <a-skeleton active title />
              </div>
            </div>
            <div class="w-50 my-2">
              <a-skeleton active :avatar="{ size: 20 }" title />
            </div>
            <div class="w-100 d-flex row justify-content-end my-2">
              <div class="w-50">
                <a-skeleton active title />
              </div>
            </div>
          </div>

          <InboxEditor />
        </template>
      </div>

      <div style="width: calc(1 / 3 * 100%); min-width: 290px;">
        <ReplySidebar />
      </div>
    </div>
  </div>
</template>

<script>
import InboxHeader from "../components/inbox/inbox-header";
import InboxEditor from "../components/inbox/inbox-editor";
import InboxContent from "../components/inbox/inbox-content";
import ReplySidebar from "../components/sidebar";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    InboxHeader,
    InboxEditor,
    InboxContent,
    ReplySidebar,
  },

  data() {
    return {
      is_loading: true,
      no_more: false,

      limit: 20,

      last_selector: "",
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
      conversations: "Conversation/getAll",
      messages: "Message/getMessages",

      conversation_info: "Conversation/getConversationInfo",

      lightbox_images: "Lightbox/getAll",
      lightbox_index: "Lightbox/getIndex",
    }),

    items() {
      return this.messages.filter(
        (item) => item.social_conversation_id === this.conversationId
      );
    },

    accountId() {
      if (this.$route.params && this.$route.params.accountId) {
        return this.$route.params.accountId;
      }
      return false;
    },

    conversationId() {
      if (this.$route.params && this.$route.params.conversationId) {
        return this.$route.params.conversationId;
      }
      return null;
    },
  },

  watch: {
    conversationId(val) {
      this.removeCustomerInfo();
      this.resetOrderInfo();

      if (val) {
        this.page = 1;
        this.handleFetchMessages(true);

        this.reLoadConversationInfo();
      }
    },

    conversations(val) {
      if (val && val.length > 0) {
        const accountConversations = val.filter(
          (item) => item.social_account_id == this.accountId
        );

        if (!accountConversations || accountConversations.length == 0) {
          return;
        }

        const conversation = accountConversations.find(
          (item) => item.conversation_id === this.conversationId
        );

        if (!conversation) {
          if (!this.isEmpty(this.conversation_info)) {
            return;
          }

          this.$router.push("/account/" + this.accountId);
        }
      }
      this.reLoadConversationInfo();
    },
  },

  created() {
    this.handleFetchMessages(true);
    this.reLoadConversationInfo();
  },

  mounted() {
    $("body,html").css("overflow-y", "hidden");
  },

  beforeDestroy() {
    $("body,html").css("overflow-y", "auto");
    this.removeCustomerInfo();
  },

  methods: {
    ...mapActions({
      fetchMessages: "Message/fetch",
      markConversationAsRead: "Conversation/markAsRead",
      updateAccount: "Account/update",
      uninstallAccount: "Account/uninstall",

      updateLightbox: "Lightbox/update",

      updateConversationInfo: "Conversation/updateConversationInfo",
      removeCustomerInfo: "Customer/removeInfo",
      resetOrderInfo: "Order/reset",
    }),

    async handleFetchMessages(reset) {
      if (reset) {
        this.last_selector = "";
        this.no_more = false;
      }

      this.is_loading = true;

      try {
        const offset = this.items.length || 0;

        if (offset > 0) {
          this.last_selector = this.items[0] ? this.items[0].message_id : "";
        }

        let heightOld = $("#chatbox .inbox-content").height() || 0;

        let data = await this.fetchMessages({
          offset,
          limit: this.limit,
          conversation_id: this.conversationId,
          reset,
        });

        if (offset === 0) {
          this.handleMarkAsRead();
        }

        if (!data || data.rows.length < this.limit) {
          this.no_more = true;
        }

        if (offset > 0 && this.last_selector) {
          try {
            let heightNew = $("#chatbox .inbox-content").height() || 0;
            $("#chatbox .simplebar-content-wrapper").scrollTop(
              heightNew - heightOld
            );
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        if (
          error &&
          error.data &&
          error.data.message === "The selected conversation id is invalid."
        ) {
          if (this.accountId) {
            return this.$router.push(`/account/${this.accountId}`);
          }
        }

        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.code === 190
        ) {
          this.uninstallAccount(this.accountId);
          return;
        }

        if (this.oGet(error, ["data", "message"]) === "Data not found") {
          return;
        }

        this.toastError({
          title: "Error !",
          message: error.message || "Something went wrong !",
        });
      } finally {
        this.is_loading = false;
      }
    },

    reLoadConversationInfo() {
      const rs = this.conversations.find(
        (item) => item.conversation_id === this.conversationId
      );
      if (rs) {
        if (rs.social_account_id != this.accountId) {
          this.$router.push("/account/" + this.accountId);
        }

        this.updateConversationInfo(rs);
      }
    },

    async handleMarkAsRead() {
      try {
        if (this.conversation_info && this.conversation_info.unread_count > 0) {
          await this.markConversationAsRead(
            this.conversation_info.conversation_id || this.conversationId
          );

          const account = this.accounts.find(
            (item) =>
              item.social_id === this.conversation_info.social_account_id
          );

          this.updateAccount({
            social_id: this.conversation_info.social_account_id,
            unread_count:
              account.unread_count > 0 ? account.unread_count - 1 : 0,
          });
        }
      } catch (error) {
        throw error;
      }
    },

    updateLightboxData() {
      this.updateLightbox({
        items: this.lightbox_images,
        index: null,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chatbox-skeleton {
  // position: absolute;
  // bottom: 73px;
  margin: 16px 24px;
  z-index: 1;
  background: #ffffff;
}
.layout-inbox {
  width: 50%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  max-height: calc(100vh - 56px);

  .layout-chatbox {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .chatbox {
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 1200px) {
  .layout-inbox {
    min-height: 0;
    max-height: calc(100vh - 56px - 17px) !important;
  }
}
</style>
