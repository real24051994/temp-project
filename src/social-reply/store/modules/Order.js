import api from '../../utils/api'

const types = {
  UPDATE_CALCULATED_INFO: 'UPDATE_CALCULATED_INFO',
  UPDATE_SUBMIT_INFO: 'UPDATE_SUBMIT_INFO',
  RESET: 'RESET',

  UDPATE_LINE_ITEM: 'UDPATE_LINE_ITEM',
  REMOVE_LINE_ITEM: 'REMOVE_LINE_ITEM',
}

const getDefaultState = () => {
  return {
    calculated_info: {
      line_items: [],
    },

    submit_info: {
      text: '',

      // shipping_address: {
      //   first_name: '',
      //   last_name: '',
      //   company: '',
      //   address1: '',
      //   address2: '',
      //   city: '',
      //   country_code: '',
      //   phone: '',
      //   province: '',
      //   zip: '',
      // },

      line_items: [
        // {
        //   variant_id: '33483293163564',
        //   quantity: 2,
        //   applied_discount: {
        //     value_type: 'FIXED_AMOUNT',
        //     value: 5,
        //   },
        // },
      ],
    },
  }
}

export const state = getDefaultState

const mutations = {
  [types.UPDATE_CALCULATED_INFO](state, payload) {
    state.calculated_info = JSON.parse(JSON.stringify(payload))
  },

  [types.UPDATE_SUBMIT_INFO](state, payload) {
    state.submit_info = Object.assign(state.submit_info, payload)
    state.submit_info = JSON.parse(JSON.stringify(state.submit_info))
  },

  [types.UDPATE_LINE_ITEM](state, payload) {
    let index = state.submit_info.line_items.findIndex((item) => item.variant_id == payload.variant_id)

    if (index >= 0) {
      state.submit_info.line_items.splice(index, 1, payload)
    }

    state.submit_info = JSON.parse(JSON.stringify(state.submit_info))
  },

  [types.REMOVE_LINE_ITEM](state, variant_id) {
    let index = state.submit_info.line_items.findIndex((item) => item.variant_id == variant_id)

    if (index >= 0) {
      state.submit_info.line_items.splice(index, 1)
    }

    state.submit_info = JSON.parse(JSON.stringify(state.submit_info))
  },

  [types.RESET](state) {
    const _state = JSON.parse(JSON.stringify(getDefaultState()))
    Object.assign(state, _state)
  },
}

const actions = {
  async calculate({ commit, state }) {
    const data = await api.SHOPIFY.ORDERS.calculate(state.submit_info)
    commit(types.UPDATE_CALCULATED_INFO, data.data)

    if (data && data.data && data.data.customer_id) {
      commit(types.UPDATE_SUBMIT_INFO, {
        customer_id: data.data.customer_id,
      })
    }

    return data.data
  },

  async updateSubmitInfo({ commit, dispatch, state }, payload) {
    commit(types.UPDATE_SUBMIT_INFO, payload)

    if (Object.keys(payload).length == 1 && Object.keys(payload)[0] === 'customer_id') {
      return
    }

    if (state.submit_info.line_items.length > 0) {
      await dispatch('calculate')
    }
  },

  async updateLineItem({ commit, dispatch }, payload) {
    commit(types.UDPATE_LINE_ITEM, payload)
    return await dispatch('calculate')
  },

  async removeLineItem({ commit, dispatch, state }, variant_id) {
    commit(types.REMOVE_LINE_ITEM, variant_id)

    if (state.submit_info.line_items.length > 0) {
      await dispatch('calculate')
    } else {
      commit(types.UPDATE_CALCULATED_INFO, {
        line_items: [],
      })
    }
  },

  updateNote({ commit }, note) {
    commit(types.UPDATE_SUBMIT_INFO, {
      note,
    })
  },

  async reset({ commit }) {
    commit(types.RESET)
  },
}

const getters = {
  getCalculatedInfo: (state) => {
    return JSON.parse(JSON.stringify(state.calculated_info))
  },

  getSubmitInfo: (state) => {
    return JSON.parse(JSON.stringify(state.submit_info))
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
