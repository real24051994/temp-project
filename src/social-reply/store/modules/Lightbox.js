const types = {
  UPDATE_DATA: 'UPDATE_DATA',
}

const getDefaultState = () => {
  return {
    items: [],
    index: null,
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_DATA](state, { items, index }) {
    state.items = JSON.parse(JSON.stringify(items))
    state.index = index
  },
}

const actions = {
  async update({ commit }, { items, index }) {
    commit(types.UPDATE_DATA, {
      items,
      index,
    })
  },
}

const getters = {
  getAll: (state) => {
    return JSON.parse(JSON.stringify(state.items)) || []
  },

  getIndex: (state) => {
    return state.index
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
