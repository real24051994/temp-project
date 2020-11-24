/* eslint-disable no-empty-pattern */
import cookie from 'js-cookie'
import router from '@/router'
import api from '../../utils/api'
const token_name = process.env.VUE_APP_TOKEN_NAME

const state = {
  token: cookie.get(token_name),
  user: null,
  chat_box_token : undefined,
  chat_box: {
		"app_name": "Socialreply",
		"status": true,
    "shopify_domain": "",
		"custom_domain": "",
		"shopify_plan": "",
		"email" : "",
		"name" : ""
	},
}

const mutations = {
  logout(state) {
    state.token = ''
    cookie.remove(`${token_name}`)
    state.user = null
  },

  setToken(state, payload = '') {
    state.token = payload
    cookie.set(`${token_name}`, payload, {
      expires: 30,
    })
  },

  removeToken(state) {
    state.token = ''
    cookie.remove(`${token_name}`)
  },

  setUser(state, payload = null) {
		state.user = payload
		let { shop = null, id = ''  , session_chat_token  = undefined } = payload
		if( shop ){
			state.chat_box_token = session_chat_token
			state.chat_box = {
				"app_name": "Socialreply",
				"status": true,
				"shopify_domain": shop ? shop.domain : '',
				"custom_domain": shop ? shop.domain : '',
				"shopify_plan": shop ? shop.app_plan : '',
				"email" : shop ? shop.email : '',
				"name" : shop ? shop.name : '',
			}
		}
  },

  removeUser(state) {
		state.user = null
		state.chat_box_token = undefined
		state.chat_box = {
			"app_name": "Socialreply",
			"status": true,
			"shopify_domain": '',
			"custom_domain": '',
			"shopify_plan": '',
			"email" : '',
			"name" : '',
		}
  },
}

const actions = {
  async getUser({ commit }) {
    try {
      let res = await api.getUser()
      let { status, data } = res
      if (status) {
        commit('setUser', data)
      }
      return res
    } catch (error) {
      throw error
    }
  },

  async fetchUserInfo({ commit }) {
    let res = await api.getUser()
    let { status, data } = res

    if (status) {
      commit('setUser', data)
    }
    return res
  },

  async shopifyLogin({}, shop_name) {
    return api.generalShopifyUrl(shop_name)
  },

  async logout({ commit }) {
    commit('removeToken')
    commit('removeUser')
    router.push({ name: 'Login' })
    if (typeof window.Intercom == 'function') {
      window.Intercom('shutdown')
    }
  },

  async clear({ commit }) {
    commit('removeToken')
    commit('removeUser')
  },

  dataLayer({}, payload) {
    if (typeof window.dataLayer == 'object') {
      window.dataLayer.push(payload)
    }
  },
}

const getters = {
  isAuthenticated(state) {
    if (state.token) {
      return true
    }
    return false
  },

  getUser(state) {
    return state.user
  },

  getShop(state) {
    return state.user && state.user.shop ? state.user.shop : ''
  },

  getToken(state) {
    return state.token
	},

	getChatBoxData(state) {
			return state.chat_box
	},

	getChatBoxToken(state){
		return state.chat_box_token
	}
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
