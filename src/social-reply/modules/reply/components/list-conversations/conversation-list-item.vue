<template>
  <router-link tag="div" :to="linkTo" :class="`conversation-item ${isUnread ? 'unread' : ''}`">
    <div class="p-r-12">
      <social-avatar :src="info.avatar" :social_type="info.conversation_type" />
    </div>

    <div class="flex flex-col flex-1 overflow-hidden">
      <div class="flex">
        <div class="conversation-name flex-1 line-clamp-1">
          {{ info.name }}
        </div>

        <div v-if="isUnread" class="conversation-status">
          <div class="conversation-unread"></div>
        </div>
      </div>

      <div class="flex items-center w-100 m-t-4">
        <div class="conversation-content flex-1 line-clamp-1" style="word-break: break-all;">
          {{ info.snippet }}
        </div>

        <div class="conversation-time">
          {{ getFormatConversationTime(info.updated_time) }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import helper from '../../../../utils/helper'

export default {
  props: {
    info: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      accounts: 'Account/getAccounts',
    }),

    linkTo() {
      const accountId = this.$route.params.accountId
      const type = this.info.conversation_type === 'inbox' ? 'inbox' : 'comment'
      return `/account/${accountId}/${type}/${this.info.conversation_id}`
    },

    isUnread() {
      return this.info.unread_count > 0
    },
  },

  methods: {
    ...mapActions({
      updateAccount: 'Account/update',
    }),

    getFormatConversationTime(time) {
      return helper.formatConversationTime(time)
    },
  },
}
</script>

<style lang="scss" scoped>
.conversation-item {
  position: relative;
  padding: 14px 16px;
  height: 64px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: rgba(24, 143, 255, 0.1);
  }

  .conversation-name {
    font-size: 14px;
    line-height: 17px;
    min-height: 18px;
    word-break: break-all;
  }

  .conversation-content {
    font-size: 12px;
    line-height: 15px;
    color: #828282;
  }

  .conversation-time {
    font-size: 12px;
    line-height: 14px;
    color: #828282;
    padding-left: 4px;
    display: flex;
    white-space: nowrap;

    &::before {
      content: '•';
      margin-right: 3px;
      color: #e2e2e2;
    }
  }

  .conversation-type-icon {
    color: #cecece;
  }

  .conversation-status {
    min-width: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .conversation-unread {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #5b86e5;
    }

    .fa-volume-slash {
      color: #cecece;
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  &.router-link-exact-active {
    background-color: rgba(24, 143, 255, 0.1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 4px;
      background-color: #5b86e5;
    }
  }

  &.unread {
    font-weight: 500;

    .conversation-content {
      color: #252627 !important;
    }

    .conversation-time {
      color: #252627 !important;
    }
  }
}
</style>
