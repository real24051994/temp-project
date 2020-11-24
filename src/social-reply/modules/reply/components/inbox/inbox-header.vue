<template>
  <div class="inbox-header" :key="conversation_info.conversation_id">
    <div class="conversation-info flex-grow-1 d-flex">
      <!-- <div class="user-avatar">
        <img :src="conversation_info.avatar" alt="" />
      </div> -->
      <social-avatar :src="conversation_info.avatar" />

      <div class="d-flex flex-column">
        <div class="d-flex username h-100 align-items-center">
          {{ conversation_info.name }}
          <a :href="conversation_info.conversation_url" target="_blank" rel="noopener noreferrer">
            <sh-icon :icon="['fas', 'external-link-alt']" />
          </a>
        </div>
      </div>
    </div>

    <div class="conversation-action">
      <!-- <div class="btn-action">
        <sh-icon :icon="['far', 'comments-alt']" /> 
      </div> -->

      <div v-if="unread_count" class="btn-action" @click="handleMarkAsRead" title="Mark as read">
        <sh-icon :icon="['far', 'envelope-open-text']" />
      </div>

      <div v-else class="btn-action" @click="handleMarkAsUnread" title="Mark as unread">
        <sh-icon :icon="['far', 'envelope']" />
      </div>

      <div class="btn-action" @click="toogleBannedUser" :class="{ active: is_banned }" :title="is_banned ? 'Remove Ban from Page?' : 'Ban from Page'">
        <sh-icon :icon="['far', 'user-slash']" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  // props: {
  //   conversation_info: {
  //     type: Object,
  //     default: () => {},
  //     required: true,
  //   },
  // },

  data() {
    return {
      is_submiting: false,

      is_submiting_mark_as_read: false,

      unread_count: 0,
      is_banned: false,
    }
  },

  computed: {
    ...mapGetters({
      accounts: 'Account/getAll',
      conversation_info: 'Conversation/getConversationInfo',
    }),

    account() {
      const account = this.accounts.find((item) => item.social_id == this.conversation_info.social_account_id)
      return account
    },
  },

  created() {
    this.unread_count = this.conversation_info.unread_count
    this.is_banned = this.conversation_info.is_banned
  },

  watch: {
    conversation_info(val) {
      this.unread_count = val.unread_count
      this.is_banned = val.is_banned
    },
  },

  methods: {
    ...mapActions({
      updateConversation: 'Conversation/updateConversation',
      markAsRead: 'Conversation/markAsRead',
      markAsUnread: 'Conversation/markAsUnread',
      updateAccount: 'Account/update',
    }),

    async handleMarkAsRead() {
      if (this.is_submiting_mark_as_read) {
        return
      }
      try {
        this.is_submiting_mark_as_read = true
        await this.markAsRead(this.conversation_info.conversation_id)
        this.updateAccount({
          social_id: this.account.social_id,
          unread_count: this.account.unread_count > 0 ? this.account.unread_count - 1 : 0,
        })

        this.unread_count = 0
      } catch (error) {
      } finally {
        this.is_submiting_mark_as_read = false
      }
    },

    async handleMarkAsUnread() {
      if (this.is_submiting_mark_as_read) {
        return
      }

      try {
        this.is_submiting_mark_as_read = true
        await this.markAsUnread(this.conversation_info.conversation_id)

        this.updateAccount({
          social_id: this.account.social_id,
          unread_count: this.account.unread_count + 1,
        })

        this.unread_count = 1
      } catch (error) {
      } finally {
        this.is_submiting_mark_as_read = false
      }
    },

    async toogleBannedUser() {
      if (this.is_submiting === true) {
        return
      }

      try {
        this.is_submiting = true

        if (!this.is_banned) {
          await this.$api.SOCIAL.banned(this.conversation_info.sender_id)
          this.updateConversation({
            conversation_id: this.conversation_info.conversation_id,
            is_banned: true,
          })
        } else {
          await this.$api.SOCIAL.unBanned(this.conversation_info.sender_id)
          this.updateConversation({
            conversation_id: this.conversation_info.conversation_id,
            is_banned: false,
          })
        }
        this.is_banned = !this.is_banned
      } catch (error) {
      } finally {
        this.is_submiting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.inbox-header {
  min-height: 54px;
  height: 54px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  padding: 0 16px;

  .conversation-info {
    flex-grow: 1;

    .user-avatar {
      width: 36px;
      height: 36px;
      overflow: hidden;
      background-color: white;
      border-radius: 50%;
      border: 1px solid #cecece;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .username {
      margin-left: 14px;
      font-weight: 500;

      a {
        margin-left: 8px;
        color: #cecece;
      }

      // a:not(:hover) {
      //   color: #cecece;
      // }
    }
  }

  .conversation-action {
    display: flex;
    color: #252627;

    .btn-action {
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 16px;
      }

      &:hover {
        background-color: #f3f3f3;
      }

      &.active {
        color: #5b86e5;
        background-color: rgba(24, 143, 255, 0.2);
      }
    }
  }
}
</style>
