<template>
  <div class="reply-editor-container d-flex align-items-end">
    <div class="is-banned" v-if="conversation_info.is_banned || account.connect_error" />

    <div class="reply-editor">
      <div v-if="!isEmpty(attachment_url) || selected_image" class="p-b-8">
        <div v-if="!isEmpty(attachment_url) || selected_image.type.startsWith('image')" class="position-relative h-100 d-inline-block">
          <div
            @click="onRemoveImage"
            class="position-absolute center pointer"
            style="border-radius: 50%; background: rgba(0, 0, 0, 0.2); right: 5px; top: 5px; width: 20px; height: 20px;"
          >
            <sh-icon :icon="['fas', 'times']" class="f-12" />
          </div>

          <img :src="preview_image" alt="" width="100px" height="100px" class="rounded border" style="object-fit: cover;" />
        </div>

        <div v-else class="d-inline-flex p-l-8 rounded items-center" style="background: rgba(0, 0, 0, 0.1);">
          {{ selected_image.name }}
          <div @click="onRemoveImage" class="center pointer m-l-8" style="width: 26px; height: 26px; background: rgba(0, 0, 0, 0.2);">
            <sh-icon :icon="['fas', 'times']" class="f-12" />
          </div>
        </div>
      </div>

      <fa-textarea-auto-height
        v-model="text"
        placeholder="Type something..."
        :lineHeight="16"
        @submit="onSubmit"
        @click="handleMarkAsRead"
        :resizeSignal="resizeSignal"
        class="fa-textarea"
      />

      <div class="actions center">
        <div class="m-r-12">
          <SelectProducts :limit="1" @change="onSelectProducts" />
        </div>

        <div class="m-r-12">
          <SavedReplyButton :conversation_info="conversation_info" @selected="onSelectedSavedReply" />
        </div>

        <div class="m-r-12">
          <SelectImage @input="onChangeFile" />
        </div>

        <vue-emoji-picker :on-select-emoji="onSelectEmoji">
          <template slot="btn-trigger">
            <sh-icon :icon="['far', 'smile']" class="f-18" />

            <a-tooltip placement="top">
              <template slot="title">Emoji</template>

              <sh-icon :icon="['far', 'smile']" class="f-18" />
            </a-tooltip>
          </template>
        </vue-emoji-picker>
      </div>
    </div>

    <div class="p-b-6 p-l-16">
      <a class="btn-send" @click="onClickSubmit">
        <svg-icon2 name="send" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SavedReplyButton from '../../saved-replies'
import SelectImage from './select-image'
import SelectProducts from '@reply/components/shopify/select-products'

export default {
  components: {
    SavedReplyButton,
    SelectImage,
    SelectProducts,
  },

  data() {
    return {
      is_loading: false,

      text: '',
      resizeSignal: 0,

      preview_image: '',
      selected_image: '',

      attachment_url: '',
    }
  },

  computed: {
    ...mapGetters({
      accounts: 'Account/getAll',
      conversation_info: 'Comment/getCurrentConversation',
    }),

    account() {
      return this.accounts.find((item) => item.social_id == this.conversation_info.social_account_id) || {}
    },
  },

  methods: {
    ...mapActions({
      sendText: 'Comment/send',
      sendFile: 'Message/sendFile',
      markAsReadConversation: 'Conversation/markAsRead',
      updateAccount: 'Account/update',
      uninstallAccount: 'Account/uninstall',
    }),

    async onSubmit() {
      if (this.text === '' && this.isEmpty(this.selected_image) && this.isEmpty(this.attachment_url)) {
        return
      }

      this.is_loading = true

      try {
        let message = this.text
        let image = this.selected_image || null
        let attachment_url = this.attachment_url || null
        this.text = ''
        this.onRemoveImage()

        try {
          this.handleMarkAsRead()
        } catch (error) {}

        setTimeout(() => {
          this.scrollToBottom()
        }, 100)

        await this.sendText({
          social_conversation_id: this.conversation_info.conversation_id,
          message,
          image,
          attachment_url,
          sender_id: this.account.social_id,
          sender_name: this.account.name,
          sender_avatar: this.account.avatar,
        })
      } catch (error) {
        if (error && error.response && error.response.data && error.response.data.code === 190) {
          this.uninstallAccount(this.conversation_info.social_account_id)
          return
        }

        this.toastError({
          title: 'Error !',
          message: error.message,
        })
      } finally {
        this.is_loading = true
      }
    },

    handleMarkAsRead() {
      if (this.conversation_info && this.conversation_info.unread_count > 0) {
        try {
          this.markAsReadConversation(this.conversation_info.conversation_id)

          const account = this.accounts.find((item) => item.social_id === this.conversation_info.social_account_id)

          this.updateAccount({
            social_id: this.conversation_info.social_account_id,
            unread_count: account.unread_count > 0 ? account.unread_count - 1 : 0,
          })
        } catch (error) {}
      }
    },

    onSelectEmoji(val) {
      this.text += ' ' + val
    },

    onChangeFile(file) {
      this.selected_image = file

      if (!file.type.startsWith('video')) {
        let reader = new FileReader()
        let _this = this
        reader.onloadend = function() {
          _this.preview_image = reader.result
        }
        reader.readAsDataURL(file)
      }
    },

    onRemoveImage() {
      this.selected_image = null
      this.preview_image = null
      this.attachment_url = null
    },

    onClickSubmit() {
      this.onSubmit()
      this.resizeSignal = new Date().getTime()
    },

    onSelectedSavedReply(message) {
      this.text = message
      this.resizeSignal = new Date().getTime()
    },

    //
    scrollToBottom() {
      try {
        setTimeout(() => {
          const el = document.querySelector('#comment-box .simplebar-content-wrapper')
          el.scrollTop = el.scrollHeight
        }, 50)
      } catch (error) {}
    },

    async onSelectProducts(items) {
      const { image, product_title, title, price, url } = items[0]

      this.preview_image = image
      this.attachment_url = image

      this.text = `${product_title} ${title == 'Default Title' ? '' : '-' + title} -  ${this.formatMoney(price)}\n${url ? url : ''}`
      this.resizeSignal = new Date().getTime()
    },
  },
}
</script>

<style lang="scss" scoped>
.reply-editor-container {
  position: relative;
  border-top: 1px solid $border-color;
  padding: 16px;

  .is-banned {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.06);
  }

  .reply-editor {
    flex-grow: 1;
    position: relative;
  }

  .actions {
    position: absolute;
    bottom: 0;
    right: 0;
    display: inline-flex;
    padding-right: 16px;
    padding-bottom: 6px;

    i {
      cursor: pointer;
    }
  }
}

.btn-send {
  margin-left: 18px;
  margin-bottom: 12px;
}

.fa-textarea {
  max-height: 160px;
  overflow-y: auto;
  padding-right: 75px;
}
</style>
