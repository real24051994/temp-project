import cookie from 'js-cookie'
import router from '@/router'
import api from '@head/api'
const token_name = process.env.VUE_APP_TOKEN_NAME
const state = {
    token: cookie.get(token_name),
    is_logged: false,
    user: null,
    chat_box: {
        app_name: 'Socialhead',
        user_id: '',
        name: '',
        email: '',
        internal_id: '',
        domain: '',
        raw_domain: '',
        sp_plan: '',
        status: true
	},
	install_app :{
		social_publish: false,
		social_reply: false,
		social_shop: false,
		social_widget: false,
	}
};

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
    getToken(state) {
        return state.token
    },
    getChatBoxInfo(state) {
        return state.chat_box
	},
	getInstallApps(state){
		return state.install_app
	}
};

const mutations = {
    logout(state) {
        state.token = ''
        cookie.remove(`${token_name}`)
		state.user = null
		state.install_app = {
			social_publish: false,
			social_reply: false,
			social_shop: false,
			social_widget: false,
		}
    },
    setLogged(state) {
        state.is_logged = true
    },
    removeLogged(state) {
        state.is_logged = false
    },
    setToken(state, payload = '') {
        state.token = payload
        cookie.set(`${token_name}`, payload, {
            expires: 30
        })
    },
    removeToken(state) {
        state.token = ''
        cookie.remove(`${token_name}`)
    },
    setUser(state, payload = null) {
        state.user = payload
		let { shop = null, id = '' , install_app = {} } = payload
		if( shop ){
			state.chat_box = {
				app_name: 'Socialhead',
				user_id: shop.id,
				name: shop ? shop.name : '',
				email: shop ? shop.email : '',
				internal_id: shop ? shop.internal_id : '',
				domain: shop ? shop.domain : '',
				raw_domain: shop ? shop.raw_domain : '',
				status: true
			}
			state.install_app = Object.assign(state.install_app , install_app)
		}
    },
    removeUser(state) {
        state.user = null
        state.chat_box = {
            app_name: 'SocialPublish',
            user_id: '',
            name: '',
            email: '',
            internal_id: '',
            domain: '',
            raw_domain: '',
            status: true
		}
		state.install_app = {
			social_publish: false,
			social_reply: false,
			social_shop: false,
			social_widget: false,
		}
    },
};

const actions = {
    async getUser({ commit }) {
        try {
            let res = await api.getUser();
            let { status, data } = res.data
            if (status) {
                commit('setUser', data)
                commit('setLogged')
            }
            return res
        } catch (error) {
            throw error;
        }
    },
    async login({}, payload) {
        try {
            return await api.generalShopifyUrl(payload)
        } catch (e) {
            throw e;
        }
    },
    logout({ commit }) {
        commit('removeToken')
        commit('removeUser')
        commit('removeLogged')
        router.push({ name: 'Login' })
    },
    dataLayer({}, payload) {
        if (typeof window.dataLayer == 'object') {
            window.dataLayer.push(payload)
        }
    },

};


export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};