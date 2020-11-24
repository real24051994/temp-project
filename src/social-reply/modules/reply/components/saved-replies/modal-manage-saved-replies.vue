<template>
  <a-modal
    class="modal-manage-saved-replies"
    :maskClosable="false"
    v-model="show"
    :title="title"
    :centered="true"
    :footer="null"
    @afterClose="onClose"
    :width="800"
  >
    <div class="manage-saved-replies" v-if="!is_editing && !is_adding">
      <div class="manage--sidebar">
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

              <!-- <div class="line-clamp-1 break-word">
                {{ item.name }}
              </div> -->
            </div>
          </div>
        </fa-simplebar>

        <div class="center p-b-12 p-t-12 border-t">
          <a class="text-primary" @click="onClickAdd">
            <sh-icon :icon="['fas', 'plus']" class="m-r-8" />
            Create Message
          </a>
        </div>
      </div>

      <div class="manage--content">
        <fa-simplebar class="flex-1">
          <div class="flex-1 p-r-24 overflow-auto">
            <content-viewer :message="content" />
          </div>
        </fa-simplebar>

        <div class="p-l-8" v-if="content">
          <a-button @click="onClickEdit">
            Edit
          </a-button>
        </div>
      </div>
    </div>

    <div class="add-saved-replies p-l-24 p-r-24" v-else-if="is_adding">
      <div class="p-t-10" style="height: 50px; border-bottom: 1px solid #eaeaea;">
        <a-input v-model="submitData.name" placeholder="Message Name" style="border: none !important; padding-left: 0;" />
      </div>

      <div class="flex-1 p-t-16">
        <SavedReplyEditor key="1" v-model="submitData.message" />
      </div>

      <div class="flex p-t-16 p-b-16 content-end">
        <a-button class="m-r-8" @click="onClickCancel">
          Cancel
        </a-button>

        <a-button :disabled="disabledSave" type="primary" @click="handleAdd">
          Save
        </a-button>
      </div>
    </div>

    <div class="edit-saved-replies p-l-24 p-r-24" v-else-if="is_editing">
      <div class="p-t-10" style="height: 50px; border-bottom: 1px solid #eaeaea;">
        <a-input v-model="submitData.name" placeholder="Message Name" style="border: none !important; padding-left: 0;" />
      </div>

      <div class="flex-1 p-t-16">
        <SavedReplyEditor key="2" v-model="submitData.message" />
      </div>

      <div class="flex p-t-16 p-b-16 content-end">
        <div style="width: 200px;">
          <a-popover v-model="visible_delete" :title="false" trigger="click">
            <div slot="content" style="width: 200px;">
              <div class="flex flex-col">
                <p>All your edit will be lost. Do you want to delete?</p>

                <div class="flex content-end">
                  <a-button type="default" @click="visible_delete = false">
                    Cancel
                  </a-button>

                  <a-button :disabled="is_loading" type="danger" @click="handleDelete" class="m-l-8" style="background: #eb5757; color: white;">
                    Delete
                  </a-button>
                </div>
              </div>
            </div>

            <a-button type="danger" ghost :disabled="is_loading" style="color: #eb5757;">
              Delete
            </a-button>
          </a-popover>
        </div>

        <div class="flex-1" />

        <a-button class="m-r-8" @click="onClickCancel">
          Cancel
        </a-button>

        <a-button :disabled="disabledSave" type="primary" @click="handleUpdate">
          Save
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SavedReplyEditor from '@reply/components/editor/saved-reply-editor'
import ContentViewer from './content-viewer'

export default {
  components: {
    SavedReplyEditor,
    ContentViewer,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      search: '',
      current: -1,

      is_adding: false,
      is_editing: false,

      submitData: {
        name: '',
        message: '',
      },

      is_loading: false,

      is_show_popover_delete: false,

      visible_delete: false,
    }
  },

  computed: {
    ...mapGetters({
      replies: 'SavedReplies/getAll',
    }),

    disabledSave() {
      return this.isEmpty(this.submitData.name) || this.isEmpty(this.submitData.message) || this.submitData.message == '<p></p>'
    },

    filteredReplies() {
      return this.replies.filter((item) => {
        const str = item.name.toLowerCase()
        return str.includes(this.search.toString().toLowerCase())
      })
    },

    title() {
      if (!this.is_adding && !this.is_editing) {
        return 'Manage Reply'
      } else if (this.is_adding) {
        return 'Create Reply'
      } else if (this.is_editing) {
        return 'Edit Reply'
      }
      return ''
    },

    content() {
      return this.filteredReplies[this.current] ? this.filteredReplies[this.current].message : ''
    },

    show: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },

  watch: {
    show() {
      this.current = -1
      this.onClickCancel()
    },

    submitData() {},
  },

  methods: {
    ...mapActions({
      fetchReplies: 'SavedReplies/fetch',
      addReply: 'SavedReplies/add',
      updateReply: 'SavedReplies/update',
      deleteReply: 'SavedReplies/delete',
    }),

    onClose() {
      this.$emit('close')
    },

    onClickEdit() {
      this.is_editing = true

      this.submitData = JSON.parse(JSON.stringify(this.filteredReplies[this.current]))
    },

    onClickAdd() {
      this.is_adding = true
    },

    onClickCancel() {
      this.search = ''
      this.current = -1

      this.is_adding = false
      this.is_editing = false
      this.visible_delete = false

      this.submitData = {
        name: '',
        message: '',
      }
    },

    async handleAdd() {
      if (this.is_loading) {
        return
      }
      this.is_loading = true

      try {
        await this.addReply(this.submitData)

        this.toastSuccess({
          title: 'Done !',
          message: 'Added message success',
        })

        this.onClickCancel()
      } catch (error) {
        this.toastError({
          title: 'Error !',
          message: error.message || 'Something went wrong !',
        })
      } finally {
        this.is_loading = false
      }
    },

    async handleUpdate() {
      if (this.is_loading) {
        return
      }
      this.is_loading = true

      try {
        await this.updateReply({
          id: this.submitData.id,
          payload: this.submitData,
        })
        this.onClickCancel()
      } catch (error) {
        this.toastError({
          title: 'Error !',
          message: error.message || 'Something went wrong !',
        })
      } finally {
        this.is_loading = false
      }
    },

    async handleDelete() {
      if (this.is_loading) {
        return
      }
      this.is_loading = true

      try {
        await this.deleteReply(this.submitData.id)
        this.onClickCancel()
      } catch (error) {
        this.toastError({
          title: 'Error !',
          message: error.message || 'Something went wrong !',
        })
      } finally {
        this.is_loading = false
      }
    },

    onMouseover(index) {
      this.current = index
    },

    onSelected(message) {
      this.$emit('selected', message)
      this.visible = false
    },
  },
}
</script>

<style lang="scss">
.modal-manage-saved-replies {
  .ant-modal-header {
    height: 56px;
    padding: 0;
    display: flex;
    align-items: center;
    padding-left: 25px;

    .ant-modal-title {
      font-size: 20px;
    }
  }

  .ant-input-affix-wrapper .ant-input {
    border: none;
  }
}
</style>

<style scoped>
.srp-search >>> input {
  background: #f3f3f3;
  border-radius: 4px !important;
}
</style>

<style lang="scss" scoped>
.manage-saved-replies {
  display: flex;
  height: 500px;
  flex-direction: row;

  .manage--sidebar {
    width: 25%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eaeaea;
  }

  .manage--content {
    width: 75%;
    display: flex;
    flex-direction: row;
    padding: 16px 24px;
  }
}

.add-saved-replies {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.edit-saved-replies {
  display: flex;
  flex-direction: column;
  height: 500px;
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
