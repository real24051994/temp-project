const types = {
  UPDATE_CONTEXT: 'UPDATE_CONTEXT',

  UPDATE_SENDING_RECEIPT_STATUS: 'UPDATE_SENDING_RECEIPT_STATUS',
}

const getDefaultState = () => {
  return {
    context: 'customer-info', // create-order | edit-customer | edit-shipping-address

    is_sending_receipt: false,
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_CONTEXT](state, context) {
    state.context = context
  },

  [types.UPDATE_SENDING_RECEIPT_STATUS](state, status) {
    state.is_sending_receipt = status
  },
}

const actions = {
  async updateContext({ commit }, context) {
    commit(types.UPDATE_CONTEXT, context)
  },

  async updateSendingReceiptStatus({ commit }, status) {
    commit(types.UPDATE_SENDING_RECEIPT_STATUS, status)
  },
}

const getters = {
  getCurrentContext: (state) => {
    return state.context || 'customer-info'
  },

  getSendingReceiptStatus: (state) => {
    return state.is_sending_receipt
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
