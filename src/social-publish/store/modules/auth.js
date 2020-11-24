import cookie from 'js-cookie'
import router from '@/router'
import api from '@publish/api'
const token_name = process.env.VUE_APP_TOKEN_NAME
const forget_password_email = cookie.get('se-rspw')
const state = {
    token: cookie.get(token_name),
    is_logged: false,
    user: null,
    forget_password_email: forget_password_email,
    installed_onboarding_step: 0,
    onboarding: {
        create_post: true,
        create_post_image: true,
        create_post_link: true,
        create_post_product: true,
        create_post_video: true,
        sidebar: true,
		install_app: true,
		feedback : false,
    },
    shop_setting: {
        date_format: "YYYY-MM-DD",
        time_format: "24",
        timezone: "Europe/London",
	},
	chat_box_token : undefined,
    chat_box: null,
	plans :{
		'free' : 'Free',
		'basic' : 'Standard',
		'plus' : 'Premium',
		'pro' : 'Platinum',
		'custom' : 'Enterprise',
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
    getShops(state) {
        return state.user && state.user.shops ? state.user.shops : []
    },
    getToken(state) {
        return state.token
    },
    getForgetPasswordEmail(state) {
        return state.forget_password_email
	},
	getUserOnboarding(state) {
        return state.onboarding
    },
    getInstalled(state) {
        return state.onboarding.install_app
    },
    getSidebarOnboarding(state) {
        return state.onboarding.sidebar
    },
    getInstalledOnboardingStep(state) {
        return state.installed_onboarding_step
    },
    getTimeSetting(state) {
        return state.shop_setting
    },
    getChatBoxData(state) {
        return state.chat_box
	},
	getChatBoxToken(state){
		return state.chat_box_token
	}
};

const mutations = {
    logout(state) {
        state.token = ''
        cookie.remove(`${token_name}`)
        state.user = null
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
		let { shop = null, id = ''  , session_chat_token  = undefined } = payload
		if( shop ){
			state.chat_box_token = session_chat_token
			state.chat_box = {
				"email" : shop ? shop.email : '',
				"name" : shop ? shop.name : '',
			}
		}
    },
    removeUser(state) {
		state.user = null
		state.chat_box_token = undefined
		state.chat_box = null
    },
    setShopSetting(state, payload) {
        state.shop_setting = payload
    },
    setForgetPassword(stae, payload) {
        state.forget_password_email = payload
        cookie.set('se-rspw', payload, {
            expires: 1
        })
    },
    removeForgetPassword(stae) {
        state.forget_password_email = null
        cookie.remove('se-rspw')
    },
    setInstalledOnboarding(state, payload) {
        state.onboarding.install_app = payload
    },
    setInstalledOnboardingStep(state, payload) {
        state.installed_onboarding_step = payload
    },
    setRegister(state, payload) {
        state.onboarding.install_app = payload
    },
    setOnboardingSidebar(state, payload) {
        state.onboarding.sidebar = payload
	},
	setOnboarding(state, payload) {
        state.onboarding = Object.assign( state.onboarding , payload)
    }
};

const actions = {
    async login({ commit }, payload) {
        try {
            let res = await api.loginByAccount(payload);
            let { status, data } = res.data
            if (status) {
                commit('setToken', data)
            }
            return res
        } catch (error) {
            throw error;
        }
    },
    async register({ commit }, payload) {
        try {
            return await api.register(payload)
        } catch (error) {
            throw error;
        }
    },
    async mergeAccount({ commit }, payload) {
        try {
            let res = await api.mergeAccount(payload)
            let { status, data } = res.data
            if (status) {
                commit('setToken', data)
            }
            return res
        } catch (error) {
            throw error;
        }
    },
    async getUser({ commit }) {
        try {
            let res = await api.getUser();
            let { status, data } = res.data
            if (status) {
                commit('setUser', data)
                commit('setLogged')
                commit('pricing/setPlan', data, { root: true })
                let { shop } = data
                if (shop) {
                    let { on_boarding, plan_name } = shop
                    if (on_boarding) {
                        state.onboarding = Object.assign({
                            create_post: true,
                            create_post_image: true,
                            create_post_link: true,
                            create_post_product: true,
                            create_post_video: true,
                            sidebar: true,
							install_app: true,
							feedback : false
                        }, on_boarding)
                    }
                }
            }
            return res
        } catch (error) {
            throw error;
        }
    },
    async shopifyLogin({}, payload) {
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
    async forgetPassword({ commit }, payload) {
        try {
            let res = await api.sendMailForgetPassword(payload)
            let { status } = res.data
            if (status) {
                commit('setForgetPassword', payload.email)
            }
            return res;
        } catch (e) {
            throw e;
        }
    },
    async vertifyCode({ commit }, payload) {
        try {
            return await api.vertifyForgetPasswordCode(payload)
        } catch (e) {
            throw e;
        }
    },
    async resetPassword({ commit }, payload) {
        try {
            let res = await api.resetPassword(payload)
            let { status, data = '' } = res.data
            if (status) {
                commit('removeForgetPassword')
                commit('setToken', data)
            }
            return res
        } catch (e) {
            throw e;
        }
    },
    async updateOnboarding({ commit }, payload) {
        try {
            return await api.updateOnboarding(payload)
        } catch (e) {
            throw e;
        }
	},
	async createFeedback({commit} , payload){
		try {
            let res = await api.createFeedback(payload);
            let { status = false  } = res.data
            if (status) {
                commit('setOnboarding', { feedback : true })
            }
            return res
        } catch (e) {
            throw e;
        }
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