import cookie from 'js-cookie'
import router from '@/router'
import api from './api'
import { default as country } from '@/config/country.json'
import { default as languages } from '@/config/languages.json'
const token_name = process.env.VUE_APP_TOKEN_NAME
const state = {
  token: cookie.get(token_name),
  user: null,
  register_steps: null,
  country: country,
  auth_setup_info: null,
  register_onboard : null,
  languages: languages,
  chat_box_token : undefined,
  chat_box: null,
  show_banner_rate : false, 
  is_logged: false,
  rate_routes: ['FeedCenter' ,'ProductSources' ,'ProductSourcesMapping' , 'ProductSourcesFilter' ,'ProductSourcesSettings' ,'ProductSourcesSecondarySource']
}

const getters = {
  getLogged(state) {
    return state.is_logged
  },
  getUser(state) {
    return state.user
  },
  getShop(state) {
    return state.user && state.user.shop ? state.user.shop : ''
  },
  getShops(state) {
    return state.user && state.user.shops ? state.user.shops : []
  },
  getToken(state) {
    return state.token
  },
  getInfoSteps(state) {
    return state.register_steps
  },
  getCountry(state) {
    return state.country
  },
  getAuthSetupInfo(state) {
    return state.auth_setup_info
  },
  getLanguages(state) {
    return state.languages
  },
  getChatBoxInfo(state) {
    return state.chat_box
  },
  getChatBoxData(state) {
    return state.chat_box
  },
  getChatBoxToken(state) {
    return state.chat_box_token
  },
  getBannerRate(state){
    return state.show_banner_rate
  },
  getRateRoutes(state){
    return state.rate_routes
  },
  getRegisterOnboard(state){
    return state.register_onboard
  }
}

const actions = {
  async login({ commit }, payload) {
    try {
      let res = await api.loginByAccount(payload)
      let { status, data } = res.data
      if (status) {
        commit('setToken', data)
      }
      return res
    } catch (error) {
      throw error
    }
  },
  async getUser({ commit }) {
    try {
      let res = await api.getUser()
      let { status, data } = res.data
      if (status) {
        commit('setUser', data)
        commit('setLogged')
        let { shop  , rating = { social_shop : false } } = data
        if (shop) {
          let { on_boarding, social_accounts  , id } = shop
          if (on_boarding) {
            if (!on_boarding.install_app && social_accounts != 0) {
              state.installed_onboarding_step = 3
            }
            state.onboarding = on_boarding
          }
          let pass_auth_setup = localStorage.getItem(`ssh_${id}_registed`)
          if( pass_auth_setup == '1'){
            commit('setRegisterOnboard' , true)
          }
        }
        if( rating ){
          var rate_cookie = cookie.get('ssh_hide_banner_rate')
          if( rating['social_shop'] == false && rate_cookie == undefined ){
            commit('setBannerRate' , true)
          }else{
            commit('setBannerRate' , false)
          }
        }
      }
      return res
    } catch (error) {
      throw error
    }
  },
  async shopifyLogin({}, payload) {
    try {
      return await api.generalShopifyUrl(payload)
    } catch (e) {
      throw e
    }
  },
  async logout({ commit }) {
    commit('removeToken')
    commit('removeUser')
    commit('removeLogged')
    router.push({ name: 'Login' })
  },

  async connectSocial({}, payload) {
    try {
      return await api.generalLinkSocial(payload)
    } catch (e) {
      throw e
    }
  },

  async getCollection({}, payload) {
    try {
      return await api.getCollection(payload)
    } catch (e) {
      throw e
    }
  },

  async updateAuthSetup({}, payload) {
    try {
      return await api.updateAuthSetup(payload)
    } catch (e) {
      throw e
    }
  },

  async getAuthSetupInfo({ commit }, payload) {
    try {
      let res = await api.getAuthSetupInfo(payload)
      let { status, data } = res.data
      if (status) {
        let { pass_auth_setup = false } = data 
        commit('setAuthSetupInfo', data)
        commit('setRegisterOnboard' , pass_auth_setup)
      }
      return res
    } catch (e) {
      throw e
    }
  },
  async getGeneralSetting({ commit }) {
    try {
      let res = await api.getGeneralSetting()
      let { status, data } = res.data
      if (status) {
        commit('setAuthSetupInfo', data)
      }
      return res
    } catch (e) {
      throw e
    }
  },
  changeAuthSetupInfo({ commit }, payload) {
    commit('setAuthSetupInfo', payload)
  },
  dataLayer({}, payload) {
    if (typeof window.dataLayer == 'object') {
      window.dataLayer.push(payload)
    }
  },
  async accessPermission({}, payload) {
    try {
      return await api.accessPermission(payload)
    } catch (e) {
      throw e
    }
  },
  createFeedback({commit} , payload){
    return new Promise((resolve, reject) => {
      api.createFeedback(payload).then((res)=>{
        let { status = false } = res.data 
        if( status ){
          commit('setBannerRate' , false )
        }
        resolve(res)
      })
      .catch((err)=>{
        reject(err)
      })
    });
  }
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
    let { shop = null, id = '', session_chat_token = undefined } = payload
    if (shop) {
      state.chat_box_token = session_chat_token
      state.chat_box = {
        email: shop ? shop.email : '',
        name: shop ? shop.name : '',
      }
    }
  },
  removeUser(state) {
    state.user = null
    state.chat_box_token = undefined
    state.chat_box = null
  },
  setAuthSetupInfo(state, payload = {}) {
    state.auth_setup_info = payload
  },
  setBannerRate(state , payload ){
    state.show_banner_rate = payload
  },
  setBannerRateCookie(state , payload){
    if( payload ){
      cookie.set('ssh_hide_banner_rate', 1, {
        expires: 1,
      })
    }else{
      cookie.remove('ssh_hide_banner_rate')
    }
  },
  setLogged(state) {
    state.is_logged = true
  },
  removeLogged(state) {
    state.is_logged = false
  },
  setRegisterOnboard(state , payload){
   state.register_onboard = payload
   localStorage.setItem(`ssh_${state.user.shop.id}_registed` , payload ? '1' : '0')
  }
}
export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
