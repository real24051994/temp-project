<template>
  <div class="post-preview-sticky" :class="{ show: show }">
    <div class="thumbnail">
      <img :src="image" alt="" />
    </div>

    <div class="flex-1 flex flex-col m-l-8 content-center">
      <div class="flex items-center">
        <div class="flex-1 post-content line-clamp-1">
          {{ post.message || post.story || '' }}
        </div>

        <div>
          <a :href="post.permalink_url" target="_blank" style="color: #cecece;">
            <sh-icon :icon="['fas', 'external-link-alt']" />
          </a>
        </div>
      </div>
      <div class="text-muted f-12">
        <span>
          {{ dateFormat(post.created_time, 'hh:mm a') }}
        </span>

        <span class="m-l-3">
          {{ dateFormat(post.created_time, 'MMM/dd/yyyy') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      el: null,
      show: false,
    }
  },

  computed: {
    ...mapGetters({
      post: 'Comment/getCurrentPostInfo',
    }),

    image() {
      if (!this.isEmpty(this.post.attachments) && this.post.attachments[0].type === 'photo') {
        return this.post.attachments[0].url
      } else if (!this.isEmpty(this.post.attachments) && this.post.attachments[0].type === 'link') {
        return require('@reply/assets/images/icons/link-img.png')
      }
      return require('@reply/assets/images/icons/default-img.png')
    },
  },

  mounted() {
    try {
      this.el = document.querySelector('#comment-box .simplebar-content-wrapper')
      setTimeout(() => {
        this.el.addEventListener('scroll', this.onScroll)
      }, 1000)
    } catch (error) {}
  },

  methods: {
    onScroll() {
      const el = document.querySelector('#comment-box .simplebar-content-wrapper')

      if (this.el.scrollTop > 50) {
        this.show = true
      } else {
        this.show = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.post-preview-sticky {
  position: absolute;
  display: flex;
  width: 100%;
  top: -56px;
  left: 0;
  height: 56px;
  background-color: white;
  z-index: 10;
  transition: top 0.3s;
  padding: 9px 16px;
  border-bottom: 1px solid #eaeaea;

  &.show {
    top: 0 !important;
  }

  .thumbnail {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    background: #efefef;
    overflow: hidden;
    min-width: 36px;

    img {
      width: 36px;
      height: 36px;
      object-fit: cover;
    }
  }

  .post-content {
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    overflow: hidden;
    word-break: break-word;
  }
}
</style>
