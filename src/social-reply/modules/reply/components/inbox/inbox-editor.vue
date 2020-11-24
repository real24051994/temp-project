<template>
  <div class="position-relative">
    <div v-if="is_sending_receipt" class="sending-receipt">
      <div class="flex items-center text-primary">
        <fa-spin class="m-r-8" size="14px" />Sending Receipt
      </div>
    </div>

    <div v-if="!conversation_info.is_can_reply_message_tag" class="notice-status flex">
      <div class="p-r-8">
        <sh-icon :icon="['far', 'smile']" class="f-18" />
      </div>

      <div>
        Businesses cannot send a message to the unresponsive customer after 7 days.
        <a
          href="https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags"
          target="_blank"
        >See more</a>
      </div>
    </div>

    <div
      v-else-if="!conversation_info.is_can_reply_message"
      class="notice-status flex items-center"
    >
      <div class="p-r-8">
        <sh-icon :icon="['far', 'smile']" class="f-18" />
      </div>

      <div>
        According to Facebook Policy, Businesses could not respond to a user who didn't respond to their message in 24 hours.
        <a
          href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/#standard_messaging"
          target="_blank"
        >See more</a>
      </div>
    </div>

    <div :class="`reply-editor-container flex ${disabled_chat ? 'disabled-chat' : ''}`">
      <div class="is-banned" v-if="disabled_chat" />

      <div class="reply-editor">
        <fa-textarea-auto-height
          v-model="text"
          :placeholder="conversation_info.is_can_reply_message ? 'Type something...' : 'Time out to reply conversation'"
          :lineHeight="16"
          @submit="onSubmit"
          @click="handleMarkAsRead"
          :resizeSignal="resizeSignal"
          class="fa-textarea"
          id="inbox-reply"
        />

        <div class="actions center">
          <div class="m-r-12">
            <SelectProducts :limit="5" @change="onSelectProducts" />
          </div>

          <div class="m-r-12">
            <SavedReplyButton
              :conversation_info="conversation_info"
              @selected="onSelectedSavedReply"
            />
          </div>

          <div class="m-r-12">
            <UploadFile @change="onChangeFile" />
          </div>

          <vue-emoji-picker :on-select-emoji="onSelectEmoji">
            <template slot="btn-trigger">
              <a-tooltip placement="top">
                <template slot="title">Emoji</template>

                <sh-icon :icon="['far', 'smile']" class="f-18" />
              </a-tooltip>
            </template>
          </vue-emoji-picker>
        </div>
      </div>

      <div class="flex items-center">
        <a class="btn-send flex items-center" @click="onClickSubmit">
          <svg-icon2 name="send" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UploadFile from "../editor-upload-file";
import SavedReplyButton from "../saved-replies";
import SelectProducts from "@reply/components/shopify/select-products";

export default {
  components: {
    UploadFile,
    SavedReplyButton,
    SelectProducts,
  },

  data() {
    return {
      is_loading: false,

      text: "",
      resizeSignal: 0,

      is_can_chat: true,
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAll",
      conversation_info: "Conversation/getConversationInfo",

      is_sending_receipt: "Sidebar/getSendingReceiptStatus",
    }),

    account() {
      return (
        this.accounts.find(
          (item) => item.social_id == this.conversation_info.social_account_id
        ) || {}
      );
    },

    disabled_chat() {
      return (
        this.conversation_info.is_banned ||
        this.account.connect_error ||
        !this.conversation_info.is_can_reply_message ||
        !this.is_can_chat
      );
    },
  },

  methods: {
    ...mapActions({
      sendMessage: "Message/sendMessage",
      sendFile: "Message/sendFile",
      sendProducts: "Message/sendProducts",

      markAsReadConversation: "Conversation/markAsRead",
      updateAccount: "Account/update",
      uninstallAccount: "Account/uninstall",
    }),

    async onSubmit() {
      if (this.text === "") {
        return;
      }

      this.is_loading = true;

      try {
        let text = this.text;
        this.text = "";

        try {
          this.handleMarkAsRead();
        } catch (error) {}

        await this.sendMessage({
          social_conversation_id: this.conversation_info.conversation_id,
          text,
        });

        // this.text = ''
        this.scrollToBottom();
      } catch (error) {
        if (this.oGet(error, ["response", "data", "code"]) === 190) {
          return this.uninstallAccount(
            this.conversation_info.social_account_id
          );
        }

        if (this.oGet(error, ["response", "data", "code"]) == 10) {
          try {
            await this.updateConversationStatus();
            this.is_can_chat = false;
          } catch (error) {}
        }

        // this.toastError({
        //   title: 'Error !',
        //   message: error.message,
        // })
      } finally {
        this.is_loading = true;
      }
    },

    handleMarkAsRead() {
      if (this.conversation_info && this.conversation_info.unread_count > 0) {
        try {
          this.markAsReadConversation(this.conversation_info.conversation_id);

          const account = this.accounts.find(
            (item) =>
              item.social_id === this.conversation_info.social_account_id
          );

          this.updateAccount({
            social_id: this.conversation_info.social_account_id,
            unread_count:
              account.unread_count > 0 ? account.unread_count - 1 : 0,
          });
        } catch (error) {}
      }
    },

    onSelectEmoji(val) {
      this.text += " " + val;
    },

    onChangeFile(files) {
      files.forEach(async (file) => {
        this.handleSendFile(file);
        await this.sleep(1000);
      });
    },

    async handleSendFile(file) {
      try {
        let form_data = new FormData();
        form_data.append("file", file);

        try {
          this.handleMarkAsRead();
        } catch (error) {}

        await this.sendFile({
          social_conversation_id: this.conversation_info.conversation_id,
          social_account_id: this.conversation_info.social_account_id,
          form_data,
          file,
        });
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.code === 190
        ) {
          this.uninstallAccount(this.conversation_info.social_account_id);
        }
      } finally {
        this.is_loading = true;
      }
    },

    async onSelectProducts(items) {
      let variant_ids = items.map((item) => {
        return {
          product_id: item.product_id,
          variant_id: item.id,
        };
      });

      try {
        await this.sendProducts({
          social_conversation_id: this.conversation_info.conversation_id,
          products: variant_ids,
        });
      } catch (error) {}
    },

    onClickSubmit() {
      this.onSubmit();
      this.resizeSignal = new Date().getTime();
    },

    onSelectedSavedReply(message) {
      this.text = message;
      this.resizeSignal = new Date().getTime();
    },

    //
    scrollToBottom() {
      try {
        setTimeout(() => {
          const el = document.querySelector(
            "#chatbox .simplebar-content-wrapper"
          );
          el.scrollTop = el.scrollHeight;
        }, 50);
      } catch (error) {}
    },

    updateConversationStatus() {
      this.$api.CONVERSATION.updateStatus(
        this.conversation_info.conversation_id,
        {
          is_can_reply_message: false,
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.reply-editor-container {
  z-index: 0;
  position: relative;
  border-top: 1px solid $border-color;
  padding: 16px;

  &.disabled-chat {
    opacity: 0.5;
  }

  .is-banned {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .reply-editor {
    flex-grow: 1;
    position: relative;
  }

  .actions {
    position: absolute;
    bottom: 0;
    right: 0;
    display: inline-flex;
    padding-right: 16px;
    padding-bottom: 6px;

    i {
      cursor: pointer;
    }
  }
}

.btn-send {
  margin-left: 16px;
}

.fa-textarea {
  max-height: 160px;
  overflow-y: auto;
  padding-right: 95px;
}

.notice-status {
  background-color: #5b86e5;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  line-height: 17px;

  a {
    color: white;
    text-decoration: underline;
  }
}

.sending-receipt {
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-right: 12px;
  padding: 4px 16px 4px 9px;
}
</style>
