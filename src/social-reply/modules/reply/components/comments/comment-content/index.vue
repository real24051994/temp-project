<template>
  <div class="w-100 h-100 overflow-hidden position-relative">
    <PostPreviewNavbar v-if="!isEmpty(post)" />

    <fa-simplebar class="h-100 w-100" id="comment-box">
      <div class="inbox-content p-t-24 p-b-10 w-100" style="max-width: 100%;">
        <PostPreview v-if="!isEmpty(post)" />
        <ConversationPreview v-if="!isEmpty(conversation)" />

        <div class="flex w-100 m-t-16">
          <div style="line-height: 1; color: #cecece; font-size: 12px; font-weight: 600;">
            REPLIES
          </div>
          <div class="flex-1 m-l-8" style="border-bottom: 1px solid #e2e2e2;"></div>
        </div>

        <a class="text-primary flex items-center m-t-12" v-if="!no_more" @click="$emit('load-more')">
          <template v-if="!is_loading">
            View previous replies
          </template>

          <div v-else class="flex items-center">
            <fa-spin size="18px" />
            <div class="m-l-12 flex items-center">
              loading...
            </div>
          </div>
        </a>

        <CommentItem v-for="item in items" :key="item.comment_id" :comment="item" />
      </div>
    </fa-simplebar>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import PostPreview from './post-preview'
import ConversationPreview from './conversation-preview'
import PostPreviewNavbar from './post-preview-navbar'
import { mapGetters } from 'vuex'

export default {
  components: {
    CommentItem,
    PostPreview,
    PostPreviewNavbar,
    ConversationPreview,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },

    no_more: {
      type: Boolean,
      default: false,
      required: false,
    },

    is_loading: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  computed: {
    ...mapGetters({
      post: 'Comment/getCurrentPostInfo',
      conversation: 'Comment/getCurrentConversation',
    }),
  },

  watch: {
    items(val, oldVal) {
      if (oldVal && val && val.length > oldVal.length) {
        try {
          const el = document.querySelector('#comment-box .simplebar-content-wrapper')
          const scrollTop = el.scrollTop
          const clientHeight = el.clientHeight
          const scrollHeight = el.scrollHeight

          let distanceFromBottom = Math.abs(scrollHeight - clientHeight - scrollTop)

          if (distanceFromBottom < 10) {
            this.scrollToBottom()
          }
        } catch (error) {}
      }
    },
  },

  methods: {
    scrollToBottom() {
      try {
        setTimeout(() => {
          const el = document.querySelector('#comment-box .simplebar-content-wrapper')
          el.scrollTop = el.scrollHeight
        }, 50)
      } catch (error) {}
    },
  },
}
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
