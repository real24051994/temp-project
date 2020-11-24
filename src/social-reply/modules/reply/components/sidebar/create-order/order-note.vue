<template>
  <div class="panel-order-note border-t">
    <div class="flex items-center">
      <div class="flex-1">
        Order Note
      </div>

      <!-- <a @click="is_editing = true">
        {{ submit_info.note ? 'Edit' : 'Add' }}
      </a> -->
    </div>
    <!--  -->
    <div class="m-t-8">
      <fa-textarea class="edit-textarea" v-model="text" placeholder="Add note..." />
    </div>
    <!--  -->
    <!-- <div class="flex m-t-16" v-if="is_editing">
      <fa-button type="primary" class="m-r-8" @click="onSave">
        Save
      </fa-button>

      <fa-button @click="onCancel">
        Cancel
      </fa-button>
    </div> -->
    <!--  -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      is_editing: '',
      // text: '',
    }
  },

  computed: {
    ...mapGetters({
      submit_info: 'Order/getSubmitInfo',
    }),

    text: {
      get() {
        return this.submit_info.note
      },

      set(text) {
        this.updateNote(text)
      },
    },
  },

  mounted() {
    // this.text = this.submit_info.note || ''
  },

  methods: {
    ...mapActions({
      updateNote: 'Order/updateNote',
    }),

    onCancel() {
      this.text = this.submit_info.note || ''
      this.is_editing = false
    },

    onSave() {
      this.updateNote(this.text)
      this.is_editing = false
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-order-note {
  padding: 16px 24px 16px 16px;
  display: flex;
  flex-direction: column;
}

.edit-textarea {
  padding: 0 !important;
  background: white;
}
</style>
