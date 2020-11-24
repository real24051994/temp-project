<template>
  <div class="customer-note border-t">
    <div class="flex items-center" v-if="!isEmpty(customer_info)">
      <div class="flex-1">
        Customer Note
      </div>
    </div>

    <div class="m-t-8" v-if="!isEmpty(customer_info)">
      <fa-textarea v-model="text" placeholder="Add note..." @blur="onClickSave" class="cutsomter-note-textarea" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      text: '',
    }
  },

  computed: {
    ...mapGetters({
      conversation_info: 'Conversation/getConversationInfo',
      customer_info: 'Customer/getCustomerInfo',
    }),
  },

  watch: {
    customer_info(customer_info) {
      if (!this.isEmpty(customer_info)) {
        this.text = customer_info.note
      } else {
        this.text = ''
      }
    },
  },

  mounted() {
    if (!this.isEmpty(this.customer_info)) {
      this.text = this.customer_info.note
    } else {
      this.text = ''
    }
  },

  methods: {
    ...mapActions({
      updateCustomerInfo: 'Customer/updateNote',
    }),

    async onClickSave() {
      try {
        await this.updateCustomerInfo({
          social_sender_id: this.conversation_info.sender_id,
          customer_id: this.customer_info.id,
          note: this.text,
        })
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.customer-note {
  padding: 18px 24px 18px 18px;
  display: flex;
  flex-direction: column;

  .note-content {
    font-size: 14px;
    line-height: 16px;
  }
}

.cutsomter-note-textarea {
  padding: 0 !important;
  background: white;

  &:hover {
    background: #f3f3f3;
    border-radius: 0 !important;
    box-shadow: 0 0 0 5px #f3f3f3 !important;
  }

  &:focus {
    background: #f3f3f3;
    border-radius: 0 !important;
    box-shadow: 0 0 0 5px #f3f3f3 !important;
  }
}
</style>
