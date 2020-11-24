import cookie from 'js-cookie'
import router  from '@/router'
import api from '@widget/api'
const token_name = process.env.VUE_APP_TOKEN_NAME
var token = cookie.get(token_name) ;
const state = {
	token : token ,
	user: null,
	is_logged: false,
	onboarding : {
		step_on_boarding : true,
		sidebar: true
	},
	chat_box_token : undefined,
    chat_box: null 
};
var timeout = null 
const setWatchToken = function(){
	token = cookie.get(token_name)
	if( timeout ){
		clearInterval(timeout)
	}
	if( token ){
		timeout = setInterval(() => {
			if( token != cookie.get(token_name)){
				location.reload()
			}
		}, 1000);
	}
}
const stopWatchToken = function(){
	if( timeout ){
		clearInterval(timeout)
	}
	timeout = null 
}
const getters = {
	getLogged(state) {
        return state.is_logged
    },
    getUser(state){
		return state.user
	},
	getShop(state){
		return state.user && state.user.shop ? state.user.shop : ''
	},
	getShops(state){
		return state.user && state.user.shops ? state.user.shops : []
	},
	getToken(state){
		return state.token
	},
	getInstalled(state){
		return state.onboarding.step_on_boarding
	},
	getSidebarOnboarding(state){
		return state.onboarding.sidebar
	},
	getChatBoxData(state) {
        return state.chat_box
	},
	getChatBoxToken(state){
		return state.chat_box_token
	}
};

const actions = {
	async login({commit} , payload){
		try {
			let res =  await api.loginByAccount(payload);
			let { status , data} = res.data
			if( status){
				commit('setToken' , data )
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async getUser({commit}){
		try {
			let res =  await api.getUser();
			let { status , data } = res.data 
			if( status ){
				commit('setUser', data )
				commit('setLogged')
				let { shop } = data 
				if( shop ){
					let { on_boarding  } = shop 
					if( on_boarding ) {
						state.onboarding = Object.assign({
							step_on_boarding : false,
							sidebar: false,
						} , on_boarding )
					}
				}
				setWatchToken()
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async shopifyLogin({} , payload){
		try {
			return await api.generalShopifyUrl(payload)
		} catch (e) {
			throw e;
		}
	},
	async logout({commit}){
		commit('removeToken')
		commit('removeUser')
		commit('removeLogged')
		router.push({name : 'Login'})
		stopWatchToken()
	},
	async updateOnboarding({} , payload){
		try {
			return api.updateOnboarding(payload)
		} catch (error) {
			throw error;
		}
	},
	async updateWidgetStatus({} , payload){
		try {
            return await api.updateStatus(payload)
        } catch (e) {
            throw e;
        }
	},
};

const mutations = {
	setLogged(state) {
        state.is_logged = true
    },
    removeLogged(state) {
        state.is_logged = false
    },
	logout(state){
		state.token = ''
		cookie.remove(`${token_name}`)
		state.user = null
	},
    setToken(state, payload = ''){
		state.token = payload 
		cookie.set(`${token_name}` , payload , { 
			expires: 360
		})
	},
	removeToken(state){
		state.token = ''
		cookie.remove(`${token_name}`)
	},
	setUser(state , payload = null ){
		state.user = payload
		let { shop = null, id = '' , session_chat_token  = undefined } = payload
		if( shop ){
			state.chat_box_token = session_chat_token
			state.chat_box = {
				"email" : shop ? shop.email : '',
				"name" : shop ? shop.name : '',
			}
		}
	},
	removeUser(state , payload = null ){
		state.user = null
		state.chat_box_token = undefined
		state.chat_box = null
	},
	finishStepOnboarding(state){
		state.onboarding.step_on_boarding = true
	},
	setOnboardingSidebar(state, payload){
		state.onboarding.sidebar = payload
	}
};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};