import api from '../../utils/api'

const types = {
  UPDATE_CUSTOMER_INFO: 'UPDATE_CUSTOMER_INFO',
}

const getDefaultState = () => {
  return {
    info: {},
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_CUSTOMER_INFO](state, payload) {
    state.info = JSON.parse(JSON.stringify(payload))
  },
}

const actions = {
  async fetchInfo({ commit }, { customer_id }) {
    let rs = await api.SHOPIFY.CUSTOMERS.get(customer_id)
    commit(types.UPDATE_CUSTOMER_INFO, rs.data)
    return rs.data
  },

  async update(context, { customer_id, data }) {
    let rs = await api.SHOPIFY.CUSTOMERS.update(customer_id, data)
    return rs.data
  },

  async updateNote(context, { social_sender_id, customer_id, note }) {
    let rs = await api.SOCIAL.mappingUserWithCustomer(social_sender_id, {
      customer_id,
      note,
    })
    return rs.data
  },

  async removeInfo({ commit }) {
    commit(types.UPDATE_CUSTOMER_INFO, {})
  },
}

const getters = {
  getCustomerInfo: (state) => {
    return JSON.parse(JSON.stringify(state.info)) || {}
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
