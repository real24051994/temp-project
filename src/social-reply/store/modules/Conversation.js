import api from '../../utils/api'
import helper from '../../utils/helper'

const types = {
  RESET: 'RESET',
  UPDATE_LIST_CONVERSATION: 'UPDATE_LIST_CONVERSATION',
  UPDATE_FILTER: 'UPDATE_FILTER',

  UPDATE_ITEM: 'UPDATE_ITEM',
  ADD_ITEM: 'ADD_ITEM',

  UPDATE_CURRENT_CONVERSATION: 'UPDATE_CURRENT_CONVERSATION',

  UPDATE_CONVERSATIONS_BY_SENDER_ID: 'UPDATE_CONVERSATIONS_BY_SENDER_ID',
}

const getDefaultState = () => {
  return {
    conversation_info: {},

    filter: {
      name: '',
      conversation_type: '',
      read_type: '',
    },

    conversations: [],
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_LIST_CONVERSATION](state, { items, reset = true, social_account_id }) {
    let newItems = items.map((item) => {
      return Object.assign(item, {
        social_account_id,
      })
    })

    if (reset) {
      const tempItems = state.conversations.filter((item) => item.social_account_id != social_account_id)
      state.conversations = tempItems.concat(newItems)
    } else {
      state.conversations = state.conversations.concat(newItems)
    }

    state.conversations = JSON.parse(JSON.stringify(state.conversations))
  },

  [types.RESET](state) {
    const _state = JSON.parse(JSON.stringify(getDefaultState()))
    Object.assign(state, _state)
  },

  [types.UPDATE_FILTER](state, payload) {
    const filter = Object.assign(state.filter, payload)
    state.filter = JSON.parse(JSON.stringify(filter))
  },

  [types.UPDATE_ITEM](state, payload) {
    const index = state.conversations.findIndex((item) => item.conversation_id == payload.conversation_id)
    let tempList = JSON.parse(JSON.stringify(state.conversations))
    if (index >= 0) {
      tempList[index] = Object.assign(tempList[index], payload)
    }

    state.conversations = tempList
  },

  [types.ADD_ITEM](state, payload) {
    const index = state.conversations.findIndex((item) => item.conversation_id === payload.conversation_id)
    let tempList = JSON.parse(JSON.stringify(state.conversations))
    if (index >= 0) {
      tempList[index] = Object.assign(tempList[index], payload)
    } else {
      tempList.push(payload)
    }

    state.conversations = tempList
  },

  [types.UPDATE_CURRENT_CONVERSATION](state, payload) {
    state.conversation_info = Object.assign(state.conversation_info, payload)
    state.conversation_info = JSON.parse(JSON.stringify(state.conversation_info))
  },

  [types.UPDATE_CONVERSATIONS_BY_SENDER_ID](state, { sender_id, ...payload }) {
    let items = JSON.parse(JSON.stringify(state.conversations))

    for (let i = 0; i < items.length; i++) {
      if (items[i].sender_id == sender_id) {
        items[i] = Object.assign(items[i], payload)
      }
    }

    state.conversations = JSON.parse(JSON.stringify(items))
  },
}

const actions = {
  async fetchConversations({ commit }, { social_account_id, conversation_type, read_type, limit, offset, name, reset = true }) {
    const rs = await api.CONVERSATION.fetch({
      social_account_id,
      conversation_type,
      read_type,
      limit,
      offset: reset === true ? 0 : offset,
      name,
    })
    commit(types.UPDATE_LIST_CONVERSATION, {
      social_account_id,
      items: rs.data,
      reset,
    })
    return rs
  },

  updateFilter({ commit }, payload) {
    commit(types.UPDATE_FILTER, payload)
  },

  updateConversation({ commit }, payload) {
    commit(types.UPDATE_ITEM, payload)
  },

  updateConversationBySenderId({ commit }, payload) {
    commit(types.UPDATE_CONVERSATIONS_BY_SENDER_ID, payload)
  },

  update({ commit }, payload) {
    commit(types.UPDATE_ITEM, payload)
  },

  addConversation({ commit }, payload) {
    commit(types.ADD_ITEM, payload)
  },

  async markAsRead({ commit }, conversation_id) {
    commit(types.UPDATE_ITEM, {
      conversation_id,
      unread_count: 0,
    })

    await api.CONVERSATION.markAsRead(conversation_id)
  },

  async markAsUnread({ commit }, conversation_id) {
    commit(types.UPDATE_ITEM, {
      conversation_id,
      unread_count: 1,
    })

    await api.CONVERSATION.markAsUnread(conversation_id)
  },

  updateConversationInfo({ commit }, payload) {
    commit(types.UPDATE_CURRENT_CONVERSATION, payload)
  },
}

const getters = {
  getConversations: (state) => {
    if (!state.conversations || state.conversations.length == 0) {
      return []
    }

    let arr = JSON.parse(JSON.stringify(state.conversations))

    if (state.filter.conversation_type) {
      arr = arr.filter((item) => item.conversation_type === state.filter.conversation_type)

      if (!arr || arr.length === 0) {
        return []
      }
    }

    if (state.filter.read_type) {
      if (state.filter.read_type === 'read') {
        arr = arr.filter((item) => item.unread_count === 0)
      } else if (state.filter.read_type === 'unread') {
        arr = arr.filter((item) => item.unread_count > 0)
      }
    }

    if (!arr || arr.length === 0) {
      return []
    }

    const unique = helper.uniqBy(arr, (item) => {
      return item.conversation_id
    })

    return unique.sort(function(a, b) {
      return new Date(b.updated_time) - new Date(a.updated_time)
    })
  },

  getAll: (state) => {
    return JSON.parse(JSON.stringify(state.conversations))
  },

  getFilter: (state) => {
    return JSON.parse(JSON.stringify(state.filter))
  },

  getConversationInfo: (state) => {
    return JSON.parse(JSON.stringify(state.conversation_info))
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
