<template>
  <a-popover overlayClassName="popover-saved-replies" v-model="visible" trigger="click" placement="topRight" :arrowPointAtCenter="true">
    <div slot="title" class="popover-title">
      <div class="flex-1">
        Saved Replies
      </div>

      <div>
        <a-button @click="onClickManage"> Manage</a-button>
      </div>
    </div>

    <template slot="content">
      <div class="popover-content flex">
        <div class="flex flex-col popover-left border-r">
          <fa-simplebar class="flex-1">
            <div class="flex flex-col">
              <div class="p-l-8 p-r-8 p-t-8 p-b-8">
                <a-input v-model="search" ref="search" @keyup="current = 0" placeholder="Search" type="text" class="w-100 srp-search">
                  <a-icon slot="prefix" type="search" />
                </a-input>
              </div>

              <div
                class="reply-item pointer"
                :class="{ selected: i === current }"
                v-for="(item, i) in filteredReplies"
                :key="item.id"
                @click="onSelected(item.message)"
                @mouseover="onMouseover(i, item.message)"
              >
                <a-tooltip overlayClassName="f-12" placement="right" :mouseEnterDelay="0" :mouseLeaveDelay="0">
                  <template slot="title">
                    {{ item.name }}
                  </template>

                  <div class="line-clamp-1 break-word">
                    {{ item.name }}
                  </div>
                </a-tooltip>
              </div>
            </div>
          </fa-simplebar>
        </div>

        <fa-simplebar class="flex-1">
          <div class="p-l-24 p-r-24 p-t-16 p-b-16 break-word">
            <ContentViewer :message="content" />
          </div>
        </fa-simplebar>
      </div>
    </template>

    <div class="position-relative d-inline-block" style="width: 20px;">
      <a-tooltip placement="top">
        <template slot="title">Saved Replies</template>
        <sh-icon :icon="['far', 'comment-alt-lines']" class="f-18 pointer" />
      </a-tooltip>
    </div>
  </a-popover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentViewer from './content-viewer'

export default {
  components: {
    ContentViewer,
  },

  props: {
    conversation_info: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      search: '',

      visible: false,

      current: -1,

      message: '',
    }
  },

  computed: {
    ...mapGetters({
      replies: 'SavedReplies/getAll',

      accounts: 'Account/getAll',
    }),

    filteredReplies() {
      return this.replies.filter((item) => {
        const str = item.name.toLowerCase()
        return str.includes(this.search.toString().toLowerCase())
      })
    },

    content() {
      return this.filteredReplies[this.current] ? this.filteredReplies[this.current].message : ''
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.current = -1
        setTimeout(() => {
          this.fetchReplies()
        }, 500)
      }
    },
  },

  methods: {
    ...mapActions({
      fetchReplies: 'SavedReplies/fetch',
    }),

    onClickManage() {
      this.visible = false
      this.$emit('click-manage')
    },

    hide() {
      this.visible = false
    },

    onMouseover(index, message) {
      this.current = index
      this.message = message
    },

    onSelected(message) {
      let account = this.accounts.find((item) => item.social_id === this.$route.params.accountId)
      let content = message

      content = content.replace(/<srpshortcode shortcode="SHOP_NAME">SHOP_NAME<\/srpshortcode>/g, account.name)
      content = content.replace(/<srpshortcode shortcode="NAME">NAME<\/srpshortcode>/g, this.conversation_info.name)

      content = content.replace(/<\/p><p>/g, '\n')
      content = content.replace(/&amp;/g, '&')

      content = content.replace('<p>', '')
      content = content.replace('</p>', '')

      this.$emit('selected', content)
      this.visible = false
    },
  },
}
</script>

<style lang="scss">
.popover-saved-replies {
  .ant-popover-inner-content {
    padding: 0 !important;
  }

  .ant-input-affix-wrapper .ant-input {
    border: none;
  }
}

// .srp-search > input {
//   background: #f3f3f3;
//   border-radius: 4px !important;
// }
</style>

<style scoped>
.srp-search >>> input {
  background: #f3f3f3;
  border-radius: 4px !important;
}
</style>

<style lang="scss" scoped>
.button-saved-replies {
  cursor: pointer;
}

.popover-saved-replies {
  .popover-title {
    height: 56px;
    display: flex;
    align-items: center;
  }

  .popover-content {
    height: 300px;
    min-height: 300px;
    width: 560px;
    min-width: 560px;
    max-width: 560px;

    .popover-left {
      width: 30%;
      min-width: 30%;
    }
  }
}

.reply-item {
  display: flex;
  align-items: center;
  height: 32px;
  font-size: 14px;
  line-height: 17px;
  padding-left: 24px;
  padding-right: 24px;

  &:hover {
    background: #f3f3f3;
  }

  &.selected {
    background: rgba(24, 143, 255, 0.1);
  }
}
</style>
