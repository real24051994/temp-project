<template>
  <div class="w-100 h-100 overflow-hidden">
    <fa-simplebar class="h-100" id="chatbox">
      <div class="inbox-content p-t-8 p-b-10">
        <MessageItem
          v-for="(item, i) in items"
          :key="item.message_id"
          :data="item"
          :conversation_info="conversation_info"
          :next="getNext(i)"
        />
        <social-avatar
          v-if="hideLastSenderAvt"
          :src="conversation_info.avatar"
          style="position: absolute"
          size="24"
        />
      </div>
    </fa-simplebar>
  </div>
</template>

<script>
import MessageItem from "./message-item";
import { mapGetters } from "vuex";

export default {
  components: {
    MessageItem,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      conversation_info: "Conversation/getConversationInfo",
    }),
    hideLastSenderAvt() {
      if (this.items.length > 0) {
        let lastMessage = this.items[this.items.length - 1];
        return !(lastMessage.social_account_id === lastMessage.sender_id);
      }

      return true;
    },
  },

  watch: {
    items() {
      try {
        let el = document.querySelector("#chatbox .simplebar-content-wrapper");
        const scrollTop = el.scrollTop;
        const clientHeight = el.clientHeight;
        const scrollHeight = el.scrollHeight;
        const distanceFromBottom = Math.abs(
          scrollHeight - clientHeight - scrollTop
        );
        if (distanceFromBottom < 40) {
          this.scrollToBottom();
        }
      } catch (error) {}
    },
  },

  mounted() {
    this.scrollToBottom();
  },

  methods: {
    getNext(index) {
      if (this.items && this.items.length > index + 1) {
        return this.items[index + 1];
      }
      return null;
    },

    async scrollToBottom() {
      let count = 0;
      for (let i = 0; i < 20; i++) {
        try {
          const el = document.querySelector(
            "#chatbox .simplebar-content-wrapper"
          );
          if (!el) {
            await this.sleep(50);
            continue;
          }

          el.scrollTop = el.scrollHeight - el.clientHeight;
          await this.sleep(50);

          const scrollTop = el.scrollTop;
          const clientHeight = el.clientHeight;
          const scrollHeight = el.scrollHeight;

          const distanceFromBottom = Math.abs(
            scrollHeight - clientHeight - scrollTop
          );

          if (distanceFromBottom === 0) {
            count++;

            if (count > 5) {
              break;
            }
          }
        } catch (error) {}
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#chatbox {
  min-height: 0;
  scroll-behavior: smooth;
}

.inbox-content {
  padding: 0 12px 14px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 1;
  min-height: min-content;
}
</style>
