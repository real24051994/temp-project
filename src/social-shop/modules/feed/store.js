import api from './api'
import { default as value } from '@/config/assign-value.json'

const state = {
  assign_value: value,
  age_group: [
    {
      name: 'Newborn',
      type: 'newborn',
    },
    {
      name: 'Infant',
      type: 'infant',
    },
    {
      name: 'Toddler',
      type: 'toddler',
    },
    {
      name: 'Kids',
      type: 'kids',
    },
    {
      name: 'Adult',
      type: 'adult',
    },
  ],
  gender: [
    {
      name: 'Male',
      type: 'male',
    },
    {
      name: 'Female',
      type: 'female',
    },
    {
      name: 'Unisex',
      type: 'unisex',
    },
  ],
  shipping_weight_currency: [
    {
      name: 'lb',
    },
    {
      name: 'oz',
    },
    {
      name: 'g',
    },
    {
      name: 'kg',
    },
  ],
  detail_feed: null,
  list_feed: [],
  is_show_modal_suggest: false,
  is_temp_banner: true
}

const getters = {
  getAssignValue(state) {
    return state.assign_value
  },
  getAgeGroup(state) {
    return state.age_group
  },
  getGender(state) {
    return state.gender
  },
  getCurrencyShippingWeight(state) {
    return state.shipping_weight_currency
  },
  getDetailFeed(state) {
    return state.detail_feed
  },
  getListFeed(state) {
    return state.list_feed
  },
  getShowSuggestModal(state) {
    return state.is_show_modal_suggest
  },
  getTempBanner(state) {
    return state.is_temp_banner
  },
}

const actions = {
  async getListFeedTemplate({}) {
    try {
      return await api.getListFeedTemplate()
    } catch (e) {
      throw e
    }
  },

  async getListProductFeed({}, payload) {
    try {
      return await api.getListProductFeed(payload)
    } catch (e) {
      throw e
    }
  },
  async updateStatusColumn({}, payload) {
    try {
      return await api.updateStatusColumn(payload)
    } catch (e) {
      throw e
    }
  },
  async bulkAssign({}, payload) {
    try {
      return await api.bulkAssign(payload)
    } catch (e) {
      throw e
    }
  },

  async updateStatusFeedCenter({}, payload) {
    try {
      return await api.updateStatusFeedCenter(payload)
    } catch (e) {
      throw e
    }
  },

  async resubmitFeed({}, payload) {
    try {
      return await api.resubmitFeed(payload)
    } catch (e) {
      throw e
    }
  },

  async getFeedInfo({}, payload) {
    try {
      return await api.getFeedInfo(payload)
    } catch (e) {
      throw e
    }
  },

  async addFeedTemplate({}, payload) {
    return api.addFeedTemplate(payload)
  },

  async getValueMapping({}, payload) {
    try {
      return await api.getValueMapping(payload)
    } catch (e) {
      throw e
    }
  },

  async updateMapping({}, payload) {
    try {
      return await api.updateMapping(payload)
    } catch (e) {
      throw e
    }
  },

  async reassignMapping({}, payload) {
    try {
      return await api.reassignMapping(payload)
    } catch (e) {
      throw e
    }
  },

  async deleteFeed({}, payload) {
    try {
      return await api.deleteFeed(payload)
    } catch (e) {
      throw e
    }
  },

  async getCategories({}, payload) {
    try {
      return await api.getCategories(payload)
    } catch (e) {
      throw e
    }
  },

  async updateCategories({}, payload) {
    try {
      return await api.updateCategories(payload)
    } catch (e) {
      throw e
    }
  },

  async getStatisticsStatus({}, payload) {
    try {
      return await api.getStatisticsStatus(payload)
    } catch (e) {
      throw e
    }
  },

  async getStatisticsStatusDetails({}, payload) {
    try {
      return await api.getStatisticsStatusDetails(payload)
    } catch (e) {
      throw e
    }
  },

  async uninstallBusinessExtension({}, payload) {
    try {
      return await api.uninstallBusinessExtension(payload)
    } catch (e) {
      throw e
    }
  },
  async getProductSources({} , payload){
    try {
      return await api.getProductSources(payload)
    } catch (error) {
      throw(e)      
    }
  }
}

const mutations = {
  setIndexColumn(state, column) {
    let index = state.detail_feed.show_column.findIndex((x) => x.column === column)
    state.detail_feed.show_column[index].isShow = !state.detail_feed.show_column[index].isShow
  },
  setInfoFeedDetail(state, payload = {}) {
    state.detail_feed = payload
  },
  setListFeed(state, payload = {}) {
    state.list_feed = payload
  },
  setShowSuggestModal(state, payload = {}) {
    state.is_show_modal_suggest = payload
  },
  setTempBanner(state, payload = {}) {
    state.is_temp_banner = payload
  },
  setIndexCopy(state, item) {
    let index = state.list_feed.findIndex((x) => x.id === item.id)
    let list_feed = state.list_feed[index]
    list_feed.is_copied = true
    list_feed = Object.assign(list_feed)
    state.list_feed = [...state.list_feed]
    setTimeout(() => {
      list_feed.is_copied = false
      list_feed = Object.assign(list_feed)
      state.list_feed = [...state.list_feed]
    }, 2000);
  },
  setIndexProcessing(state, item) {
    let index = state.list_feed.findIndex((x) => x.id === item.id)
    let list_feed = state.list_feed[index]
    list_feed.status_processing = item.status
    list_feed = Object.assign(list_feed)
    state.list_feed = [...state.list_feed]
  }
}
export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
