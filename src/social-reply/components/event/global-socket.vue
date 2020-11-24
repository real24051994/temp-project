<template>
  <div />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import io from "socket.io-client";
// import helper from '../../utils/helper'

export default {
  data() {
    return {
      connected: false,
      registered: false,
      socketIO: null,
      socket: null,
    };
  },

  computed: {
    ...mapGetters({
      token: "auth/getToken",
      accounts: "Account/getAccounts",

      conversations: "Conversation/getAll",

      messages: "Message/getAll",
      comments: "Comment/getAll",

      conversation_info: "Conversation/getConversationInfo",
    }),

    local_messages() {
      return this.messages.filter((item) => {
        return item.message_id.toString().startsWith("srp__"); // || item.message_id.toString().startsWith('srp_file__')
      });
    },

    local_comments() {
      return this.comments.filter((item) => {
        return item.comment_id.toString().startsWith("srp__");
      });
    },
  },

  watch: {
    accounts(val, oldVal) {
      if (val.length !== oldVal.length) {
        this.registerFb();
      }
    },
  },

  mounted() {
    this.socketIO = io(process.env.VUE_APP_REPLY_APP_SOCKET, {
      transports: ["websocket"],
      secure: true,
    });

    this.socketIO.on("connect", () => {
      // eslint-disable-next-line no-console
      if (this.token) {
        this.socketIO.emit("authenticate", { token: this.token });
      }
    });

    // eslint-disable-next-line no-unused-vars
    this.socketIO.on("authenticate-result", (data) => {
      this.registerFb();
    });

    // eslint-disable-next-line no-unused-vars
    this.socketIO.on("register-fb-result", (data) => {
      // Todo
    });

    this.socketIO.on("disconnect", (reason) => {
      // eslint-disable-next-line no-console
      this.connected = false;
      this.registered = false;

      if (reason === "io server disconnect") {
        this.socketIO.connect();
      }
    });

    this.socketIO.on("fb-message", async (data) => {
      if (this.local_messages.length > 0) {
        let excuted = false;
        for (let index = 0; index < 100; index++) {
          if (this.local_messages.length > 0) {
            await this.sleep(20);
          } else {
            excuted = true;
            this.receiveMessage(data);
            break;
          }
        }

        if (!excuted) {
          this.receiveMessage(data);
        }
      } else {
        this.receiveMessage(data);
      }

      const conversation = this.conversations.find(
        (item) => item.conversation_id === data.social_conversation_id
      );

      if (conversation) {
        this.updateLastMessage(data);
      } else {
        this.addNewConversation(data);
      }

      this.updateAccount({
        social_id: data.social_account_id,
        unread_count: data.account_unread_count,
      });
    });

    this.socketIO.on("fb-comment", async (data) => {
      if (this.local_comments.length > 0) {
        let excuted = false;
        for (let index = 0; index < 100; index++) {
          if (this.local_comments.length > 0) {
            await this.sleep(20);
          } else {
            excuted = true;
            this.receiveComment(data);
            break;
          }
        }

        if (!excuted) {
          this.receiveComment(data);
        }
      } else {
        this.receiveComment(data);
      }

      const conversation = this.conversations.find(
        (item) => item.conversation_id === data.social_conversation_id
      );

      if (conversation) {
        this.updateLastComment(data);
      } else {
        this.addNewCommentConversation(data);
      }

      this.updateAccount({
        social_id: data.social_account_id,
        unread_count: data.account_unread_count,
      });
    });
  },

  methods: {
    ...mapActions({
      receiveMessage: "Message/receiveMessage",
      receiveComment: "Comment/receiveComment",
      updateConversation: "Conversation/updateConversation",
      addConversation: "Conversation/addConversation",
      updateAccount: "Account/update",

      updateConversationInfo: "Conversation/updateConversationInfo",
    }),

    registerFb() {
      if (this.accounts && this.accounts.length > 0) {
        this.socketIO.emit(
          "register-fb",
          this.accounts.map((item) => item.social_id)
        );
      }
    },

    updateLastMessage(newMessageData) {
      let data = {
        conversation_id: newMessageData.social_conversation_id,
        snippet: newMessageData.snippet,
        updated_time: new Date().getTime(),
      };

      if (newMessageData.social_account_id !== newMessageData.sender_id) {
        data = Object.assign(data, {
          unread_count: 1,
          is_can_reply_message: newMessageData.is_can_reply_message,
          is_can_reply_message_tag: newMessageData.is_can_reply_message_tag,
        });
      }

      this.updateConversation(data);

      if (
        newMessageData.social_conversation_id ===
          this.conversation_info.conversation_id &&
        newMessageData.social_account_id !== newMessageData.sender_id
      ) {
        if (
          this.conversation_info.is_can_reply_message !==
          newMessageData.is_can_reply_message
        ) {
          try {
            this.updateConversationInfo(
              Object.assign(this.conversation_info, {
                is_can_reply_message: newMessageData.is_can_reply_message,
                is_can_reply_message_tag:
                  newMessageData.is_can_reply_message_tag,
              })
            );
          } catch (error) {}
        }
      }
    },

    addNewConversation(newMessageData) {
      const newConversation = {
        avatar: newMessageData.avatar,
        conversation_id: newMessageData.social_conversation_id,
        conversation_type: "inbox",
        conversation_url: "#",
        email: "",
        is_banned: false,
        is_subscribed: true,
        message_count: newMessageData.message_count,
        name: newMessageData.name,
        sender_id: newMessageData.sender_id,
        snippet: newMessageData.snippet,
        unread_count: newMessageData.unread_count,
        updated_time: new Date().getTime(),
        social_account_id: newMessageData.social_account_id,
      };

      this.addConversation(newConversation);
    },
    // comment
    addNewCommentConversation(newMessageData) {
      const newConversation = {
        name: newMessageData.social_conversation_name,
        avatar: newMessageData.social_conversation_avatar,
        snippet: newMessageData.snippet,
        conversation_id: newMessageData.social_conversation_id,
        conversation_type: "comment",
        conversation_url: "#",
        email: "",
        is_banned: false,
        is_subscribed: false,
        message_count: newMessageData.message_count,
        sender_id: newMessageData.sender_id,
        unread_count: newMessageData.unread_count,
        updated_time: new Date().getTime(),
        social_account_id: newMessageData.social_account_id,
        post_id: newMessageData.post_id,
      };

      this.addConversation(newConversation);
    },

    updateLastComment(newComment) {
      let data = {
        conversation_id: newComment.social_conversation_id,
        snippet: newComment.snippet,
        updated_time: new Date().getTime(),
      };

      if (newComment.social_account_id !== newComment.sender_id) {
        data = Object.assign(data, {
          unread_count: 1,
        });
      }

      this.updateConversation(data);
    },
  },
};
</script>
