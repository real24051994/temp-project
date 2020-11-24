import api from '../../utils/api'

const types = {
  UPDATE_LIST: 'UPDATE_LIST',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
}

const getDefaultState = () => {
  return {
    items: [],
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_LIST](state, items) {
    state.items = JSON.parse(JSON.stringify(items))
  },

  [types.ADD](state, payload) {
    state.items.push(payload)
  },

  [types.UPDATE](state, payload) {
    const index = state.items.findIndex((item) => item.id == payload.id)
    if (index >= 0) {
      state.items[index] = Object.assign(state.items[index], payload)
      state.items = JSON.parse(JSON.stringify(state.items))
    }
  },

  [types.DELETE](state, id) {
    const index = state.items.findIndex((item) => item.id == id)
    if (index >= 0) {
      state.items.splice(index, 1)
    }
  },
}

const actions = {
  async fetch({ commit }) {
    const data = await api.SAVED_REPLIES.fetch()
    commit(types.UPDATE_LIST, data.data)
    return data
  },

  async add({ commit }, payload) {
    const data = await api.SAVED_REPLIES.add(payload)
    commit(types.ADD, data.data)
    return data.data
  },

  async update({ commit }, { id, payload }) {
    const data = await api.SAVED_REPLIES.update(id, payload)
    commit(types.UPDATE, data.data)
    return data.data
  },

  async delete({ commit }, id) {
    await api.SAVED_REPLIES.delete(id)
    commit(types.DELETE, id)
    return true
  },
}

const getters = {
  getAll: (state) => {
    const items = JSON.parse(JSON.stringify(state.items)) || []

    return items.sort(function(a, b) {
      return new Date(a.created_at) - new Date(b.created_at)
    })
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
