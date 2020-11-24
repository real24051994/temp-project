<template>
  <div class="conversation-filter">
    <div class="flex-grow-1">
      <div class="d-inline-block">
        <a-dropdown :trigger="['click']">
          <div class="btn-filter-type">
            {{ conversation_type_active }}
            <sh-icon :icon="['fas', 'chevron-down']" />
          </div>

          <a-menu slot="overlay" class="dropdown-content">
            <a-menu-item
              v-for="item in conversation_types"
              :key="item.value"
              @click="changeConversationType(item.value)"
              :class="{ active: item.value === filter.conversation_type }"
            >
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <div>
      <a-dropdown :trigger="['click']">
        <div class="btn-filter" :class="{ active: is_active_filter_type }">
          <sh-icon :icon="['fas', 'sliders-h']" />
        </div>

        <a-menu slot="overlay" class="dropdown-content">
          <a-menu-item
            v-for="item in read_types"
            :key="item.value"
            @click="changeReadType(item.value)"
            :class="{ 'font-medium': item.value === filter.read_type }"
          >
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      conversation_types: [
        {
          name: 'All Message',
          value: '',
        },
        {
          name: 'Comment',
          value: 'comment',
        },
        {
          name: 'Inbox',
          value: 'inbox',
        },
      ],

      read_types: [
        {
          name: 'All Message',
          value: '',
        },
        {
          name: 'Read',
          value: 'read',
        },
        {
          name: 'Unread',
          value: 'unread',
        },
      ],
    }
  },

  computed: {
    ...mapGetters({
      filter: 'Conversation/getFilter',
    }),

    conversation_type_active() {
      if (this.filter.conversation_type === 'inbox') {
        return 'Inbox'
      } else if (this.filter.conversation_type === 'comment') {
        return 'Comment'
      } else {
        return 'All Message'
      }
    },

    read_type_active() {
      if (this.filter.read_type === 'read') {
        return 'Read'
      } else if (this.filter.read_type === 'unread') {
        return 'Unread'
      } else {
        return 'All Message'
      }
    },

    is_active_filter_type() {
      return this.filter.read_type !== ''
    },
  },

  methods: {
    ...mapActions({
      updateFilter: 'Conversation/updateFilter',
    }),

    changeConversationType(type) {
      this.updateFilter({
        conversation_type: type,
      })
    },

    changeReadType(type) {
      this.updateFilter({
        read_type: type,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.conversation-filter {
  height: 54px;
  min-height: 54px;
  border-bottom: 1px solid #e2e2e2;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.btn-filter-type {
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;

  i {
    margin-left: 5px;
  }
}

.dropdown-content {
  min-width: 163px;
}

.btn-filter {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.active {
    background-color: rgba(24, 143, 255, 0.2);
    color: #5b86e5;
  }
}
</style>
