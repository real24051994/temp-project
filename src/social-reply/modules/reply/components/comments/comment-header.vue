<template>
  <div class="inbox-header" :key="conversation_info.conversation_id">
    <div class="conversation-info flex-grow-1 d-flex">
      <social-avatar :src="conversation_info.avatar" class="border" />

      <div class="flex flex-col">
        <div class="flex h-100 username  align-items-center">
          {{ conversation_info.name }}
        </div>
      </div>
    </div>

    <div class="conversation-action">
      <!-- <div class="btn-action">
        <sh-icon :icon="['far', 'comments-alt']" /> 
      </div> -->

      <!-- <div v-if="unread_count" class="btn-action" @click="handleMarkAsRead" title="Mark as read">
        <sh-icon :icon="['far', 'envelope-open-text']" /> 
      </div> -->

      <!-- <div v-else class="btn-action" @click="handleMarkAsUnread" title="Mark as unread">
        <sh-icon :icon="['far', 'envelope']" /> 
      </div> -->

      <!-- <div class="btn-action" @click="toogleBannedUser" :class="{ active: is_banned }" :title="is_banned ? 'Remove Ban from Page?' : 'Ban from Page'">
        <sh-icon :icon="['far', 'user-slash']" /> 
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      accounts: 'Account/getAll',
      conversation_info: 'Conversation/getConversationInfo',
    }),
  },

  methods: {
    ...mapActions({
      updateConversation: 'Conversation/updateConversation',
    }),
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
