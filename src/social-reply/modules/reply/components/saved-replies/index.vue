<template>
  <div class="saved-replies center">
    <PopoverSavedReplies :conversation_info="conversation_info" @click-manage="onClickManage" @selected="onSelected" />

    <ModalManageSavedReplies :visible.sync="show_modal_manage" @close="show_modal_manage = false" />
  </div>
</template>

<script>
import ModalManageSavedReplies from './modal-manage-saved-replies'
import PopoverSavedReplies from './popover-saved-replies'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ModalManageSavedReplies,
    PopoverSavedReplies,
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

      show_modal_manage: false,
    }
  },

  computed: {
    ...mapGetters({
      replies: 'SavedReplies/getAll',
    }),
  },

  methods: {
    ...mapActions({
      fetchReplies: 'SavedReplies/fetch',
    }),

    onClickManage() {
      this.show_modal_manage = true
    },

    onSelected(message) {
      this.$emit('selected', message)
    },
  },
}
</script>
