<template>
  <div class="comment-item m-t-16 flex">
    <social-avatar :src="avatar" />

    <div class="p-l-8 flex flex-col">
      <div class="flex">
        <div class="f-14 text-primary font-medium">
          {{ comment.sender_name }}
        </div>

        <div class="f-13 m-l-8 text-muted">
          {{ getTimeComment(comment.created_time) }}
        </div>
      </div>

      <div class="break-word" v-if="show_full" v-html="comment.message" v-linkified></div>

      <div class="break-word" v-else v-html="truncate(comment.message, 400)" v-linkified></div>

      <div>
        <div v-if="!show_full" class="show-more d-inline-block" @click="show_full = !show_full">
          {{ show_full ? 'Show less' : 'Show more' }}
        </div>
      </div>

      <div v-if="is_sending_image" class="comment-image border rounded h-9 center w-15" style="background: #f3f3f3;">
        <fa-spin />
      </div>

      <div class="comment-image" v-else-if="comment.photo" @click="updateLightboxData">
        <img :src="comment.photo" alt="" />
      </div>

      <div class="comment-image" v-if="comment.video">
        <i-video :src="comment.video" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    comment: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      show_full: true,
    }
  },

  computed: {
    ...mapGetters({
      accounts: 'Account/getAccounts',
    }),

    accountId() {
      return this.oGet(this.$route, ['params', 'accountId'])
    },

    is_sending() {
      return this.comment.comment_id && this.comment.comment_id.startsWith('srp_')
    },

    is_sending_image() {
      return this.comment.comment_id && this.comment.comment_id.startsWith('srp_') && this.comment.photo === 'sending'
    },

    is_page() {
      return this.accountId == this.comment.sender_id
    },

    avatar() {
      if (this.is_page) {
        const account = this.accounts.find((item) => item.social_id == this.accountId)
        if (account) {
          return account.avatar
        }
      }
      return this.comment.sender_avatar
    },
  },

  created() {
    if (this.comment.message && this.comment.message.length > 399) {
      this.show_full = false
    }
  },

  methods: {
    ...mapActions({
      updateLightbox: 'Lightbox/update',
    }),

    updateLightboxData() {
      this.updateLightbox({
        items: [this.comment.photo],
        index: 0,
      })
    },

    getTimeComment(time) {
      if (this.timeAgo(time) === 'less than a minute') {
        return '1 minute'
      }
      return this.timeAgo(time)
    },
  },
}
</script>

<style lang="scss" scoped>
.comment-item {
  width: 530px;
  max-width: 100%;

  .comment-image {
    margin-top: 8px;
    max-width: 260px;
    overflow: hidden;
    cursor: pointer;

    img {
      border: 1px solid #f3f3f3;
      border-radius: 4px;
      width: auto;
      height: auto;
      max-width: 150px;
      max-height: 150px;
    }
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
</style>
