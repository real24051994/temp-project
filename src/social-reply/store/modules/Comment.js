import api from '../../utils/api'
import helper from '../../utils/helper'

const types = {
  RESET: 'RESET',
  UPDATE_DATA: 'UPDATE_DATA',

  ADD_OR_UPDATE_ITEM: 'ADD_OR_UPDATE_ITEM',
}

const getDefaultState = () => {
  return {
    conversation: {},
    post: {},

    items: [],
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_DATA](state, { comments, conversation, post, reset }) {
    state.conversation = JSON.parse(JSON.stringify(conversation))
    state.post = JSON.parse(JSON.stringify(post))

    if (reset) {
      state.items = JSON.parse(JSON.stringify(comments))
    } else {
      state.items = state.items.concat(comments)
    }
  },

  [types.ADD_OR_UPDATE_ITEM](state, comment) {
    let index = state.items.findIndex((item) => {
      if (item.comment_id.toString().startsWith('srp__') && item.tem_comment_id && item.tem_comment_id == comment.tem_comment_id) {
        return true
      } else if (!item.comment_id.toString().startsWith('srp__') && item.comment_id == comment.comment_id) {
        return true
      }
      return false
    })

    let tempList = JSON.parse(JSON.stringify(state.items))
    if (index >= 0) {
      tempList[index] = Object.assign(tempList[index], comment)
    } else {
      tempList.push(comment)
    }

    state.items = tempList
  },

  [types.RESET](state) {
    const _state = JSON.parse(JSON.stringify(getDefaultState()))
    Object.assign(state, _state)
  },
}

const actions = {
  async fetch({ commit, dispatch }, { conversation_id, offset, limit, reset = true }) {
    if (reset) {
      commit(types.RESET)
    }

    let data = await api.COMMENT.fetch({
      conversation_id,
      offset: reset ? 0 : offset,
      limit,
    })

    const { comments, conversation, post } = data.data

    if (data) {
      commit(types.UPDATE_DATA, {
        comments,
        conversation,
        post,
        reset,
      })

      dispatch('Conversation/updateConversationInfo', conversation, { root: true })
    }
    return data.data
  },

  async send({ commit }, { social_conversation_id, sender_id, sender_name, sender_avatar, message, image, attachment_url }) {
    let info = {
      comment_id: `srp__${new Date().getTime()}`,
      social_conversation_id,
      sender_id,
      sender_name,
      sender_avatar,
      message,
      video: null,
      photo: image || attachment_url ? 'sending' : null,
      is_read: false,
      created_time: new Date().getTime(),
      updated_time: new Date().getTime(),
      tem_comment_id: new Date().getTime(),
    }

    commit(types.ADD_OR_UPDATE_ITEM, info)

    try {
      let rs = await api.COMMENT.send(social_conversation_id, { message, image, attachment_url })

      if (rs && rs.data && rs.data.comment_id) {
        const newMessage = Object.assign(info, {
          comment_id: rs.data.comment_id,
        })
        commit(types.ADD_OR_UPDATE_ITEM, newMessage)
      }
      return rs
    } catch (error) {
      const send_error = error.response && error.response.data ? error.response.data.message : 'An error occurred while sending this message.'
      const newMessage = Object.assign(info, {
        send_error,
        comment_id: new Date().getTime(),
      })
      commit(types.ADD_OR_UPDATE_ITEM, newMessage)

      throw error
    }
  },

  receiveComment({ commit }, payload) {
    commit(types.ADD_OR_UPDATE_ITEM, payload)
  },
}

const getters = {
  getAll: (state) => {
    if (!state.items || state.items.length == 0) {
      return []
    }

    const arr = JSON.parse(JSON.stringify(state.items))

    const unique = helper.uniqBy(arr, (item) => {
      return item.comment_id
    })

    return unique.sort(function(a, b) {
      return new Date(a.created_time) - new Date(b.created_time)
    })
  },

  getCurrentConversation: (state) => {
    return JSON.parse(JSON.stringify(state.conversation))
  },

  getCurrentPostInfo: (state) => {
    return JSON.parse(JSON.stringify(state.post))
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
