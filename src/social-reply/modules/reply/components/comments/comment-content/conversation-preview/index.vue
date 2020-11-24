<template>
  <div class="conversation-comment-info p-l-16 m-t-8" style="border-left: 3px solid #f6f5fb;">
    <social-avatar :src="conversation.avatar" />

    <div class="flex-1 flex flex-col p-l-10">
      <div class="flex items-center">
        <div class="info--name">
          {{ conversation.name }}
        </div>

        <div class="info--time p-l-8">
          {{ timeAgo(conversation.created_time ? conversation.created_time : conversation.updated_time) }}
        </div>
      </div>

      <div class="info--content p-t-3 p-r-8 break-word" v-if="conversation.message">
        <div v-if="show_full" v-html="conversation.message" v-linkified></div>
        <div v-else v-html="truncate(conversation.message, 200)" v-linkified></div>
      </div>

      <div>
        <div v-if="!show_full" class="show-more d-inline-block" @click="show_full = !show_full">
          {{ show_full ? 'Show less' : 'Show more' }}
        </div>
      </div>

      <div v-if="conversation && conversation.photo" class="comment-image" @click="updateLightboxData">
        <img :src="conversation.photo" alt="" />
      </div>

      <i-video v-if="conversation.video" :src="conversation.video" />
    </div>

    <div class="action"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      show_full: true,
    }
  },

  computed: {
    ...mapGetters({
      conversation: 'Comment/getCurrentConversation',
    }),
  },

  mounted() {
    if (this.conversation && this.conversation.message && this.conversation.message.length > 199) {
      this.show_full = false
    }
  },

  methods: {
    ...mapActions({
      updateLightbox: 'Lightbox/update',
    }),

    updateLightboxData() {
      this.updateLightbox({
        items: [this.conversation.photo],
        index: 0,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.conversation-comment-info {
  padding-top: 4px;
  display: flex;

  .info--name {
    color: #5b86e5;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
  }

  .info--time {
    font-size: 13px;
    line-height: 15px;
    color: #828282;
  }

  .info--content {
    font-size: 14px;
    line-height: 20px;
  }

  .action {
    i {
      cursor: pointer;
    }
  }

  .comment-image {
    width: 100%;
    margin-top: 8px;

    img {
      width: auto;
      height: auto;
      max-width: 100px;
      max-height: 100px;
      border-radius: 4px;
    }
  }

  .show-more {
    margin-top: 5px;
    font-size: 12px;
    line-height: 14px;
    color: $primary-color;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
