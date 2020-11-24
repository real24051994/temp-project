import api from '../../utils/api'
import helper from '../../utils/helper'

const types = {
  RESET: 'RESET',
  UPDATE_DATA: 'UPDATE_DATA',

  ADD_OR_UPDATE_ITEM: 'ADD_OR_UPDATE_ITEM',

  REMOVE_BY_CONVERSATION: 'REMOVE_BY_CONVERSATION',
}

const getDefaultState = () => {
  return {
    items: [],
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_DATA](state, { data, reset }) {
    if (reset) {
      state.items = JSON.parse(JSON.stringify(data.rows))
    } else {
      state.items = state.items.concat(data.rows)
    }
  },

  [types.ADD_OR_UPDATE_ITEM](state, message) {
    let index = state.items.findIndex((item) => {
      if (item.message_id.toString().startsWith('srp__') && item.tem_message_id && item.tem_message_id == message.tem_message_id) {
        return true
      } else if (!item.message_id.toString().startsWith('srp__') && item.message_id == message.message_id) {
        return true
      }

      if (item.message_id.toString().startsWith('srp_file__') && item.tem_message_id && item.tem_message_id == message.tem_message_id) {
        return true
      } else if (!item.message_id.toString().startsWith('srp_file__') && item.message_id == message.message_id) {
        return true
      }
      return false
    })

    let tempList = JSON.parse(JSON.stringify(state.items))
    if (index >= 0) {
      tempList[index] = Object.assign(tempList[index], message)
    } else {
      tempList.push(message)
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
    let { data } = await api.MESSAGE.fetchByConversation({
      conversation_id,
      offset: reset ? 0 : offset,
      limit,
    })

    if (data) {
      commit(types.UPDATE_DATA, {
        data,
        reset,
      })

      if (reset) {
        dispatch(
          'Conversation/updateConversationInfo',
          {
            sender_last_time: data.sender_last_time,
            is_can_reply_message: data.is_can_reply_message,
            is_can_reply_message_tag: data.is_can_reply_message_tag,
          },
          { root: true }
        )
      }
    }
    return data
  },

  async sendMessage({ commit }, { social_conversation_id, text, social_account_id, tag }) {
    let newMessage = {
      attachments: null,
      created_time: new Date().getTime(),
      message: text,
      // message_id: -1,
      message_id: `srp__${new Date().getTime()}`,
      sender_id: social_account_id,
      social_account_id,
      social_conversation_id,
      tem_message_id: new Date().getTime(),
    }

    commit(types.ADD_OR_UPDATE_ITEM, newMessage)

    try {
      let rs = await api.MESSAGE.sendMessage(social_conversation_id, { text, tag })

      if (rs && rs.data && rs.data.message_id) {
        newMessage = Object.assign(newMessage, {
          message_id: rs.data.message_id,
        })
        commit(types.ADD_OR_UPDATE_ITEM, newMessage)
      }
      return rs
    } catch (error) {
      const send_error = error.response && error.response.data ? error.response.data.message : 'An error occurred while sending this message.'
      newMessage = Object.assign(newMessage, {
        send_error,
        message_id: new Date().getTime(),
      })
      commit(types.ADD_OR_UPDATE_ITEM, newMessage)

      throw error
    }
  },

  async sendFile({ commit }, { social_conversation_id, form_data, file, social_account_id }) {
    let attachments = [
      {
        name: file.name,
      },
    ]

    if (file.type.startsWith('image')) {
      attachments[0] = Object.assign(attachments[0], {
        type: 'image',
        url: '#',
      })
    } else if (file.type.startsWith('video')) {
      attachments[0] = Object.assign(attachments[0], {
        type: 'video',
        url: '#',
      })
    } else if (file.type.startsWith('audio')) {
      attachments[0] = Object.assign(attachments[0], {
        type: 'audio',
        url: '#',
      })
    } else if (file.type === '' || file.type.startsWith('application') || file.type.startsWith('text')) {
      attachments[0] = Object.assign(attachments[0], {
        type: 'file',
        url: '#',
      })
    }

    let newMessage = {
      attachments,
      created_time: new Date().getTime(),
      message: null,
      message_id: `srp_file__${new Date().getTime()}`,
      sender_id: social_account_id,
      social_account_id,
      social_conversation_id,
      tem_message_id: new Date().getTime(),
    }

    commit(types.ADD_OR_UPDATE_ITEM, newMessage)

    try {
      let rs = await api.MESSAGE.sendFile(social_conversation_id, form_data)

      if (rs && rs.data && rs.data.message_id) {
        newMessage = Object.assign(newMessage, {
          message_id: rs.data.message_id,
        })

        commit(types.ADD_OR_UPDATE_ITEM, newMessage)
      }
      return rs
    } catch (error) {
      let send_error = 'An error occurred while sending this message.'

      if (error.data && error.data.message) {
        send_error = error.data.message

        if (send_error === 'The file may not be greater than 25600 kilobytes.') {
          send_error = `File size must be less than 25 MB.`
        }
      }

      if (error.response && error.response.data && error.response.data.message) {
        send_error = error.response.data.message

        if (error.response.data.error && error.response.data.error.code === 100) {
          const ext = file.name ? file.name.split('.').pop() : ''
          send_error = `The ${ext} file is not supported.`
        }
      }

      // let send_error = error.response && error.response.data ? error.response.data.message : 'An error occurred while sending this message.'

      newMessage = Object.assign(newMessage, {
        send_error,
        message_id: new Date().getTime(),
      })
      commit(types.ADD_OR_UPDATE_ITEM, newMessage)

      throw error
    }
  },

  async sendProducts({ commit }, { social_conversation_id, social_account_id, products }) {
    let newMessage = {
      attachments: null,
      template: {
        payload: {
          elements: [],
          template_type: 'generic',
        },
        type: 'generic',
      },
      created_time: new Date().getTime(),
      message: null,
      message_id: `srp_product__${new Date().getTime()}`,
      sender_id: social_account_id,
      social_account_id,
      social_conversation_id,
      tem_message_id: new Date().getTime(),
    }

    commit(types.ADD_OR_UPDATE_ITEM, newMessage)

    try {
      let rs = await api.MESSAGE.sendMessage(social_conversation_id, { products })

      if (rs && rs.data && rs.data.message_id) {
        newMessage = Object.assign(newMessage, {
          message_id: rs.data.message_id,
        })

        commit(types.ADD_OR_UPDATE_ITEM, newMessage)
      }
      return rs
    } catch (error) {
      const send_error = error.response && error.response.data ? error.response.data.message : 'An error occurred while sending this message.'
      newMessage = Object.assign(newMessage, {
        send_error,
        message_id: new Date().getTime(),
      })
      commit(types.ADD_OR_UPDATE_ITEM, newMessage)
      throw error
    }
  },

  receiveMessage({ commit }, payload) {
    commit(types.ADD_OR_UPDATE_ITEM, payload)
  },
}

const getters = {
  getMessages: (state) => {
    if (!state.items || state.items.length == 0) {
      return []
    }

    const arr = JSON.parse(JSON.stringify(state.items))

    const unique = helper.uniqBy(arr, (item) => {
      return item.message_id
    })

    return unique.sort(function(a, b) {
      return new Date(a.created_time) - new Date(b.created_time)
    })
  },

  getAll: (state) => {
    return state.items
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
