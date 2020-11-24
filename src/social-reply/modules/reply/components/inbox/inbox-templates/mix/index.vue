<template>
  <div class="flex flex-col" :class="{ 'is-page': is_page, 'items-end': is_page }">
    <div>
      <div class="message-item-text">
        <div class="flex flex-col">
          <div class="message-item-text--body" v-if="!isEmpty(data.message)" v-html="data.message" v-linkified>
            <!-- {{ data.message }} -->
          </div>

          <div v-else class="p-t-14"></div>

          <FileItem class="m-t-8" v-for="(item, i) in files" :key="`${data.message_id}-1-${i}`" :attachment="item" :is_page="is_page" />
        </div>
      </div>
    </div>

    <a :href="url" target="_blank" class="message-item-preview-link" v-if="previewInfo.title">
      <div class="preview-link-image" v-if="previewInfo.image">
        <img :src="previewInfo.image" alt="" />
      </div>

      <div class="preview-link-title">
        {{ previewInfo.title }}
      </div>

      <div class="preview-link-description">
        {{ previewInfo.description }}
      </div>

      <div class="preview-link-site-name">
        {{ previewInfo.site_name }}
      </div>
    </a>

    <div class="m-t-8" v-for="(item, i) in audios" :key="`${data.message_id}-2-${i}`">
      <AudioItem :attachment="item" :is_page="is_page" />
    </div>

    <div class="m-t-8" v-for="(item, i) in videos" :key="`${data.message_id}-3-${i}`">
      <VideoItem :attachment="item" :is_page="is_page" />
    </div>

    <ImageItem v-if="!isEmpty(images) && images.length === 1" class="m-t-8" :attachment="images[0]" :is_page="is_page" />

    <ImagesItem v-else-if="!isEmpty(images)" class="m-t-8" :attachments="images" :is_page="is_page" />
  </div>
</template>

<script>
import AudioItem from './mix-audio'
import VideoItem from './mix-video'
import FileItem from './mix-file'
import ImageItem from './mix-image'
import ImagesItem from './mix-images'

export default {
  components: {
    AudioItem,
    VideoItem,
    FileItem,
    ImageItem,
    ImagesItem,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },

    is_page: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      url_metas: [],
      url: '',
    }
  },

  computed: {
    previewInfo() {
      if (this.url_metas && this.url_metas.length > 0) {
        // let image = ''

        let og_image = this.url_metas.find((item) => {
          return item.name === 'og:image' || item.property === 'og:image'
        })

        let og_title = this.url_metas.find((item) => {
          return item.name === 'og:title' || item.property === 'og:title'
        })

        let og_description = this.url_metas.find((item) => {
          return item.name === 'og:description' || item.property === 'og:description'
        })

        let og_site_name = this.url_metas.find((item) => {
          return item.name === 'og:site_name' || item.property === 'og:site_name'
        })

        let obj = {
          title: og_title ? og_title.value : '',
          description: og_description ? og_description.value : '',
          image: og_image ? og_image.value : '',
          site_name: og_site_name ? og_site_name.value : '',
        }

        return obj
      }
      return false
    },

    files() {
      return this.data.attachments.filter((item) => item.type === 'file') || []
    },

    images() {
      return this.data.attachments.filter((item) => item.type === 'image') || []
    },

    videos() {
      return this.data.attachments.filter((item) => item.type === 'video') || []
    },

    audios() {
      return this.data.attachments.filter((item) => item.type === 'video') || []
    },
  },

  created() {
    let url = this.getFirstLink(this.data.message)

    if (url) {
      this.url = url
      this.fetchMetaUrl(url)
    }
  },

  methods: {
    getFirstLink(text) {
      const findUrlRegex = /(?:(?:https?:\/\/)|(?:www\.))[^\s]+/g
      const match = findUrlRegex.exec(text)

      if (match && match.length > 0) {
        return match[0]
      }

      return false
    },

    async fetchMetaUrl(url) {
      let _url = url
      if (_url.startsWith('www')) {
        _url = 'http://' + url
      }

      try {
        const data = await this.$api.UTILS.getPreviewMetaData(_url)
        this.url_metas = data.data
      } catch (error) {}
    },
  },
}
</script>

<style scoped>
.is-page .message-item-text--body >>> a {
  color: white !important;
}

.message-item-text--body >>> a:hover {
  text-decoration: underline;
}
</style>

<style lang="scss" scoped>
.message-item-text {
  background: #f3f3f3;
  padding: 8px 16px 8px 16px;
  font-size: 14px;
  border-radius: 8px 8px 8px 0;
  white-space: pre-line;
  word-break: break-word;
  display: inline-flex;
}

.message-item-preview-link {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 8px 8px 8px 0;
  width: 400px;
  overflow: hidden;

  .preview-link-image {
    width: 100%;
    height: 132px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .preview-link-title {
    font-size: 14px;
    line-height: 16px;
    padding: 16px 16px 8px 16px;
    color: #252627;
  }

  .preview-link-description {
    color: #828282;
    font-size: 12px;
    line-height: 14px;
    padding: 0 16px 0 16px;
  }

  .preview-link-site-name {
    font-size: 14px;
    line-height: 16px;
    color: #cecece;
    padding: 8px 16px;
  }
}

.is-page {
  .message-item-text {
    background: #5b86e5;
    color: white;
    border-radius: 8px 8px 0 8px;
  }

  .message-item-preview-link {
    border-radius: 8px 8px 0 8px;
  }
}

.mix-message-item-file {
  display: flex;
  flex-direction: row;
  color: white;
}
</style>
