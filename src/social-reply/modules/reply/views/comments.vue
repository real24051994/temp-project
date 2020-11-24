<template>
  <ReconnectAccount :account_info="account_info" v-if="account_info && account_info.connect_error" />

  <div class="layout-inbox w-100 h-100" v-else-if="conversationId">
    <div class="layout-chatbox" v-if="is_loading && items.length === 0">
      <div :class="`center ${items.length === 0 ? 'flex-1' : ''}`">
        <fa-spin />
      </div>
    </div>

    <template v-else-if="!is_load_failed">
      <CommentHeader />

      <div class="layout-chatbox">
        <div class="chatbox flex flex-col position-relative" style="width: calc(2 / 3 * 100%);">
          <CommentContent :items="items" :no_more="no_more" :is_loading="is_loading" @load-more="handleLoadMore()" />

          <CommentEditor />
        </div>

        <div style="width: calc(1 / 3 * 100%); min-width: 250px;">
          <ReplySidebar />
        </div>
      </div>
    </template>

    <div v-else class="layout-chatbox center flex-col">
      <div>
        <svg-icon name="common/error-500" />
      </div>

      <div class="m-t-16 font-bold" style="font-size: 38px;">
        Oops!
      </div>

      <div class="f-18 text-secondary">
        Something went wrong
      </div>
    </div>
  </div>
</template>

<script>
import CommentEditor from '../components/comments/comment-editor/index.vue'
import CommentContent from '../components/comments/comment-content'
import CommentHeader from '../components/comments/comment-header'
import ReconnectAccount from '../components/reconnect-account'
import ReplySidebar from '../components/sidebar'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    CommentHeader,
    CommentEditor,
    CommentContent,
    ReplySidebar,
    ReconnectAccount,
  },

  data() {
    return {
      show_sidebar: false,

      is_loading: true,
      is_load_failed: false,
      no_more: false,

      limit: 5,

      conversation_info: {},

      last_selector: '',
    }
  },

  computed: {
    ...mapGetters({
      accounts: 'Account/getAccounts',
      conversations: 'Conversation/getAll',

      comments: 'Comment/getAll',

      conversation: 'Comment/getCurrentConversation',
    }),

    items() {
      return this.comments.filter((item) => item.social_conversation_id == this.conversationId)
    },

    accountId() {
      if (this.$route.params && this.$route.params.accountId) {
        return this.$route.params.accountId
      }
      return false
    },

    account_info() {
      if (this.accountId) {
        let info = this.accounts.find((item) => item.social_id == this.accountId)

        if (info) {
          return info
        }
      }
      return undefined
    },

    conversationId() {
      if (this.$route.params && this.$route.params.conversationId) {
        return this.$route.params.conversationId
      }
      return null
    },
  },

  watch: {
    conversationId(val) {
      if (val) {
        this.handleFetchComments(true)
      }
    },

    conversations(val) {
      if (val && val.length > 0) {
        const accountConversations = val.filter((item) => item.social_account_id == this.accountId)

        if (!accountConversations || accountConversations.length == 0) {
          return
        }

        const conversation = accountConversations.find((item) => item.conversation_id === this.conversationId)

        if (!conversation) {
          this.$router.push('/account/' + this.accountId)
        }
      }
    },
  },

  created() {
    this.removeCustomerInfo()
    this.handleFetchComments(true)
  },

  mounted() {
    $('body,html').css('overflow-y', 'hidden')
  },

  beforeDestroy() {
    $('body,html').css('overflow-y', 'auto')
    this.removeCustomerInfo()
  },

  methods: {
    ...mapActions({
      fetchComments: 'Comment/fetch',

      markConversationAsRead: 'Conversation/markAsRead',
      updateAccount: 'Account/update',
      uninstallAccount: 'Account/uninstall',

      removeCustomerInfo: 'Customer/removeInfo',
    }),

    async handleFetchComments(reset) {
      this.is_load_failed = false
      if (reset) {
        this.no_more = false
      }

      this.is_loading = true

      try {
        const offset = this.items.length || 0

        let data = await this.fetchComments({
          offset,
          limit: this.limit,
          conversation_id: this.conversationId,
          reset,
        })
        if (offset === 0) {
          this.handleMarkAsRead()
        }
        if (data.comments.length < this.limit) {
          this.no_more = true
        }
      } catch (error) {
        this.is_load_failed = true
      } finally {
        this.is_loading = false
      }
    },

    handleLoadMore() {
      this.handleFetchComments(false)
    },

    async handleMarkAsRead() {
      try {
        if (this.conversation && this.conversation.unread_count > 0) {
          await this.markConversationAsRead(this.conversation.conversation_id || this.conversationId)

          const account = this.accounts.find((item) => item.social_id === this.conversation.social_account_id)

          this.updateAccount({
            social_id: this.conversation.social_account_id,
            unread_count: account.unread_count > 0 ? account.unread_count - 1 : 0,
          })
        }
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.layout-inbox {
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
