<template>
  <div class="post-info">
    <div class="post-media">
      <PostImage v-if="type === 'image'" :data="post" />
      <PostImages v-else-if="type === 'images'" :data="post" />
      <PostLink v-else-if="type === 'link'" :data="post" />
      <PostVideo v-else-if="type === 'video'" :data="post" />
    </div>

    <div class="post-info--body">
      <div class="post-text" v-if="!isEmpty(post.message)">
        <div v-if="show_full" v-html="post.message" v-linkified />
        <div v-else v-html="truncate(post.message, 200)" v-linkified />
        <!-- {{ show_full ? post.message : truncate(post.message, 200) }} -->
      </div>

      <div>
        <div v-if="!show_full" class="show-more d-inline-block" @click="show_full = !show_full">
          {{ show_full ? 'Show less' : 'Show more' }}
        </div>
      </div>

      <div class="post-time">
        <span>
          {{ dateFormat(post.created_time, 'hh:mm a') }}
        </span>

        <span class="p-l-8">
          {{ dateFormat(post.created_time, 'MMM/dd/yyyy') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import PostImage from './templates/image'
import PostImages from './templates/images'
import PostLink from './templates/link'
import PostVideo from './templates/video'

import { mapGetters } from 'vuex'

export default {
  components: {
    PostImage,
    PostImages,
    PostLink,
    PostVideo,
  },

  data() {
    return {
      component: null,
      show_full: true,
    }
  },

  computed: {
    ...mapGetters({
      post: 'Comment/getCurrentPostInfo',
    }),

    type() {
      let type = 'default'
      if (!this.isEmpty(this.post.attachments)) {
        if (this.post.attachments[0].type === 'photo' && this.post.attachments.length === 1) {
          type = 'image'
        } else if (this.post.attachments[0].type === 'photo') {
          type = 'images'
        } else if (this.post.attachments[0].type === 'link') {
          type = 'link'
        } else if (this.post.attachments[0].type === 'video') {
          type = 'video'
        }
      }
      return type
    },
  },

  mounted() {
    if (this.post.message && this.post.message.length >= 200) {
      this.show_full = false
    }
  },
}
</script>

<style lang="scss" scoped>
.post-info {
  border-radius: 4px;
  width: 530px;
  max-width: 100%;
  overflow: hidden;
  background: #f3f3f3;
  padding: 16px 16px 10px 16px;

  .post-text {
    // margin-top: -10px;
    margin-top: 8px;
    font-size: 14px;
    line-height: 20px;
    white-space: pre-line;
    // white-space: pre-wrap;
  }

  .post-time {
    font-size: 12px;
    line-height: 14px;
    margin-top: 10px;
    color: #828282;
    display: flex;
    align-items: center;
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
