import api from './api'

const types = {
  UPDATE_PRODUCTS: 'UPDATE_PRODUCTS',
  UPDATE_PAGINATION: 'UPDATE_PAGINATION',
  UPDATE_SEARCH_KEYWORD: 'UPDATE_SEARCH_KEYWORD',

  SET_SETTINGS: 'SET_SETTINGS',
  SET_FILTER_SETTINGS: 'SET_FILTER_SETTINGS',
}

const state = {
  keyword: '',
  pagination: {
    current_page: 1,
    per_page: 20,
    total_page: 1,
    total: 0,
  },
  products: [],

  settings: {},
  filter_settings: {},
  view: 'grid'
}

const mutations = {
  [types.UPDATE_PRODUCTS](state, items) {
    state.products = JSON.parse(JSON.stringify(items))
  },

  [types.UPDATE_PAGINATION](state, payload) {
    state.pagination = Object.assign(state.pagination, payload)
  },

  [types.UPDATE_SEARCH_KEYWORD](state, keyword) {
    state.keyword = keyword
  },

  [types.SET_SETTINGS](state, payload) {
    state.settings = Object.assign(state.settings, payload)
    state.settings = JSON.parse(JSON.stringify(state.settings))
  },

  [types.SET_FILTER_SETTINGS](state, payload) {
    state.filter_settings = JSON.parse(JSON.stringify(payload))
  },

  setView(state, payload = {}) {
    state.view = payload
  },
}

const actions = {
  async fetchProducts({ commit }, { current_page = 1, limit = 20, keyword }) {
    commit(types.UPDATE_PAGINATION, { current_page })

    let rs = await api.getListProducts({
      current_page,
      limit,
      keyword,
    })
    commit(types.UPDATE_PRODUCTS, rs.data.data)
    commit(types.UPDATE_PAGINATION, rs.data.pagination)
    return rs
  },

  updateSearch({ commit }, keyword) {
    commit(types.UPDATE_SEARCH_KEYWORD, keyword)
  },

  setSettings({ commit }, payload) {
    commit(types.SET_SETTINGS, payload)
  },

  setFilterSettings({ commit }, payload) {
    commit(types.SET_FILTER_SETTINGS, payload)
  },

  async getListImportMapping({}, payload) {
    try {
      return await api.getListImportMapping(payload)
    } catch (e) {
      console.log(e)

      throw e
    }
  },

  async updateImport({}, payload) {
    try {
      return await api.updateImport(payload)
    } catch (e) {
      throw e
    }
  },

  async getListMetafields({}, payload) {
    try {
      return await api.getListMetafields(payload)
    } catch (e) {
      console.log(e)
      throw e
    }
  },
}

const getters = {
  getProducts: (state) => {
    return state.products || []
  },

  getPagination: (state) => {
    return state.pagination || {}
  },

  getSearchKeyword: (state) => {
    return state.keyword || ''
  },

  getSettings: (state) => {
    return state.settings || {}
  },

  getFilterSettings: (state) => {
    return state.filter_settings || {}
  },

  getView: (state) => {
    return state.view || ''
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
