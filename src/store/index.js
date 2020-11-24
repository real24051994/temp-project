import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import cookie from 'js-cookie'
var lang = cookie.get('socialhead-language')
import timezones from '@/config/timezones.json'
if (!lang) {
  lang = 'en'
  cookie.set('socialhead-language', lang, {
    expires: 30,
  })
}

var maintaince_page_allowed  = cookie.get('sh-maintaince-page-allowed')

const state = {
	is_loading : false,
	is_error : false,
	router_loading: false,
	language : lang,
	app_name : process.env.VUE_APP_NAME,
	timezones  : timezones,
	maintaince_page_allowed : maintaince_page_allowed == 'true' || maintaince_page_allowed == '1' ? true : false,
	show_user_info  : false,
}

const getters = {
    getLoading(state){
        return state.is_loading
	},
	getLoadingError(state){
		return state.is_error
	},
	getRouterLoading(state){
		return state.router_loading
	},
	getLanguage(state){
		return state.language
	},
	getAppName(state){
		return state.app_name
	},
	getMaintaincePageAllowed(state){
		return state.maintaince_page_allowed
	},
	getShowUserInfo(state){
		return state.show_user_info
	}
};

const actions = {
  setLanguage({ commit }, payload) {
    commit('setLanguage', payload)
  },
}

const mutations = {
  setLoading(state , payload ){
        state.is_loading = payload
	},
	setLoadingError(state, payload){
		state.is_error = payload
	},
	setRouterLoading(state , payload ){
        state.router_loading = payload
	},
	setLanguage(state , payload){
		state.language = payload
	},
	setShowUserInfo(state , payload){
		state.show_user_info = payload
	}
};
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
})
