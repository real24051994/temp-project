import api from '@publish/api'
const state = {
    priority: false,
    show_label_premium: true,
    show_modal_autopilot: false,
    show_modal_account: false,
    show_modal_downgrade: {
        visible: false,
        plan_name: ''
    },
    recommend: 'plus',
    last_plan: null,
    plan_name: 'free',
	is_disabled_button : false,
	is_trial: false,
	remind_trial_day : 0,
	show_banner: false,
	max_trial_day : 14,
    banner_status: {
        show_on_trial: true,
        show_on_reach_limit: true,
    },
    plans: {
        'free': {
            id: 'free',
            show: false,
            name: 'Free',
            icon: null,
            cost: 'free',
            trial: 0,
            socials: {
                limit: 1,
                facebook: true,
                twitter: true,
                pinterest: false,
                instagram: false,
            },
            posts: {
                limit: 30,
                calendar: false,
            },
            autopilots: {
                limit: 1,
                type: ['random','review'],
                template: 3,
                discount: false,
                logo: false
            },
            others: {
                hashtag: true,
                utm: false,
                shorten_link: false,
            }

        },
        'basic': {
            id: 'basic',
            show: true,
            name: 'Standard',
            icon: require('@publish/modules/pricing/assets/pricing/classic.png'),
            cost: 9.95,
            trial: 14,
            socials: {
                limit: 3,
                facebook: true,
                twitter: true,
                pinterest: false,
                instagram: false,
            },
            posts: {
                limit: 250,
                calendar: true,
            },
            autopilots: {
                limit: 5,
                type: ['random', 'latest' ,'review'],
                template: 'all',
                discount: true,
                logo: true
            },
            others: {
                hashtag: true,
                utm: true,
                shorten_link: true,
            }

        },
        'plus': {
            id: 'plus',
            show: true,
            name: 'Premium',
            icon: require('@publish/modules/pricing/assets/pricing/premium.png'),
            cost: 19.95,
            trial: 14,
            socials: {
                limit: 7,
                facebook: true,
                twitter: true,
                pinterest: false,
                instagram: false,
            },
            posts: {
                limit: 750,
                calendar: true,
            },
            autopilots: {
                limit: 10,
                type: ['random', 'latest' ,'review'],
                template: 'all',
                discount: true,
                logo: true
            },
            others: {
                hashtag: true,
                utm: true,
                shorten_link: true,
            }
        },
        'pro': {
            id: 'pro',
            show: true,
            name: 'Platinum',
            icon: require('@publish/modules/pricing/assets/pricing/platinum.png'),
            cost: 49.95,
            trial: 14,
            socials: {
                limit: 15,
                facebook: true,
                twitter: true,
                pinterest: false,
                instagram: false,
            },
            posts: {
                limit: 5000,
                calendar: true,
            },
            autopilots: {
                limit: 25,
                type: ['random', 'latest' ,'review'],
                template: 'all',
                discount: true,
                logo: true
            },
            others: {
                hashtag: true,
                utm: true,
                shorten_link: true,
            }
        },
        'custom': {
            id: 'custom',
            show: false,
			name: 'Enterprise',
			icon: require('@publish/modules/pricing/assets/pricing/custom.png'),
            cost: 'custom',
            trial: 14,
            socials: {
                limit: 'custom',
                facebook: true,
                twitter: true,
                pinterest: false,
                instagram: false,
            },
            posts: {
                limit: 'custom',
                calendar: true,
            },
            autopilots: {
                limit: 'custom',
                type: ['random', 'latest' ,'review'],
                template: 'all',
                discount: true,
                logo: true
            },
            others: {
                hashtag: true,
                utm: true,
                shorten_link: true,
            }
        }
    },
    plan_names: ['free', 'basic', 'plus', 'pro', 'custom'],
    carousels: ['basic', 'plus', 'pro'],
    sticky_plans: ['free', 'basic', 'plus'],
    account_quota: {
        total: 0,
        limit: 1
    },
    post_quota: {
        total: 0,
        limit: 30
    },
    autopilot_quota: {
        total: 0,
        limit: 30
    }
};
const getters = {
    getPricingPlans(state) {
        return state.plans
    },
    getPricingPlanNames(state) {
        return state.plan_names
    },
    getUserPlan(state) {
        return state.plans.hasOwnProperty(state.plan_name) ? state.plans[state.plan_name] : undefined
    },
    getPlanCarousel(state) {
        return state.carousels
    },
    getPlanSticky(state) {
        return state.sticky_plans
    },
    getPriorityUser(state) {
        return state.priority
    },
    getLastPlan(state) {
        return state.last_plan
    },
    getTrial(state) {
        return state.is_trial
	},
	getTrialDay(state){
		return state.remind_trial_day
	},
    getCurrentPlan(state) {
        return state.plans.hasOwnProperty(state.plan_name) ? state.plans[state.plan_name] : null
    },
    getRecommendPlan(state) {
        return state.recommend
    },
    getAllowedHashtag(state) {
        return state.plans[state.plan_name].others.hashtag || state.priority
    },
    getAllowedUTM(state) {
        return state.plans[state.plan_name].others.utm || state.priority
    },
    getAllowedShortenLink(state) {
        return state.plans[state.plan_name].others.shorten_link || state.priority
    },
    getAllowedRandomProduct(state) {
        return state.plans[state.plan_name].autopilots.type.indexOf('random') || state.priority
    },
    getAllowedLastestProduct(state) {
        return state.plans[state.plan_name].autopilots.type.indexOf('lastest') || state.priority
    },
    getAllowedAutopilotType(state) {
        return state.priority ? ['random', 'latest' , 'review'] : state.plans[state.plan_name].autopilots.type
    },
    getAllowedDiscount(state) {
        return state.plans[state.plan_name].autopilots.discount || state.priority
    },
    getAllowedLogo(state) {
        return state.plans[state.plan_name].autopilots.logo || state.priority
    },
    getAllowedSocialFacebook(state) {
        return state.plans[state.plan_name].socials.facebook || state.priority
    },
    getAllowedSocialTwitter(state) {
        return state.plans[state.plan_name].socials.twitter || state.priority
    },
    getAllowedSocialPinterest(state) {
        return state.plans[state.plan_name].socials.pinterest || state.priority
    },
    getAllowedSocialInstagram(state) {
        return state.plans[state.plan_name].socials.instagram || state.priority
    },
    getAllowedCalendar(state) {
        return state.plans[state.plan_name].posts.calendar || state.priority
    },
    getAccountQuota(state) {
        return state.account_quota
    },
    getPostQuota(state) {
        return state.post_quota
    },
    getAutopilotQuota(state) {
        return state.autopilot_quota
    },
    getShowLabelPremium(state) {
        return state.show_label_premium
    },
    getShowModalAutopilot(state) {
        return state.show_modal_autopilot
    },
    getShowModalAccount(state) {
        return state.show_modal_account
    },
    getShowBanner(state) {
        return state.show_banner
    },
    getShowBannerStatus(state) {
        return state.banner_status
    },
    getShowModalDowngrade(state) {
        return state.show_modal_downgrade
	},
	getDisabledButton(state){
		return state.is_disabled_button
	}
};

const mutations = {
    setPlan(state, { shop }) {
        let { app_plan = 'free', priority = false, trial_date = null, last_plan = null  , remind_trial_day = 0 } = shop
        state.plan_name = state.plan_names.indexOf(app_plan) >= 0 ? app_plan : 'free'
        state.priority = priority
        state.last_plan = last_plan
		state.is_trial = ( remind_trial_day < state.max_trial_day ) && trial_date == null ? true : false
		state.remind_trial_day = state.max_trial_day - remind_trial_day
        if (state.is_trial) {
            state.show_banner = true
        }
    },
    removeCharge(state) {
        state.last_plan = state.plan_name
        state.plan_name = 'free'
    },
    setWarningPricingAccount(state, payload) {
        state.account_pricing = payload
    },
    setAccountQuota(state, payload) {
        state.account_quota = Object.assign(state.account_quota, payload)
    },
    setPostQuota(state, payload) {
        state.post_quota = Object.assign(state.post_quota, payload)
    },
    setAutopilotQuota(state, payload) {
        state.autopilot_quota = Object.assign(state.autopilot_quota, payload)
    },
    setShowModalAutopilot(state, payload) {
        state.show_modal_autopilot = payload
    },
    setShowModalAccount(state, payload) {
        state.show_modal_account = payload
    },
    setShowBanner(state, payload) {
        state.show_banner = payload
    },
    setShowModalDowngrade(state, payload) {
        state.show_modal_downgrade = Object.assign(state.show_modal_downgrade, payload)
	},
	setDisabledButton(state , payload){
		state.is_disabled_button = payload
	},
	setCustomPlan(state ,payload){
		let { price  , number_social_limit , number_post_limit , number_autopilot_limit , trial_days} = payload 
		state.plans.custom.cost = price
		state.plans.custom.trial = trial_days
		state.plans.custom.socials.limit = number_social_limit
		state.plans.custom.autopilots.limit = number_autopilot_limit
		state.plans.custom.posts.limit = number_post_limit
	}
};

const actions = {
    async generalShopifyCharge({ commit }, payload) {
        try {
            return await api.generalShopifyCharge(payload)
        } catch (e) {
            throw e;
        }
    },
    removeShopifyCharge({ commit }) {
        return new Promise(function(resolve, reject) {
            api.removeShopifyCharge().then((res) => {
                    let { status = false, data = null } = res.data
                    if (status) {
                        commit('removeCharge')
                    }
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    checkAllQuota({ commit }) {
        return new Promise(function(resolve, reject) {
            api.checkQuota({ type: ['account', 'post', 'autopilot'] }).then((res) => {
                    let { status = false, data = null } = res.data
                    if (status && data) {
                        let { account, post, autopilot } = data
                        commit('setAccountQuota', account)
                        commit('setPostQuota', post)
                        commit('setAutopilotQuota', autopilot)
                    }
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        });
    },
    checkAccountQuota({ commit }) {
        return new Promise(function(resolve, reject) {
            api.checkQuota({ type: ['account'] }).then((res) => {
                    let { status = false, data = null } = res.data
                    if (status && data) {
                        let { account } = data
                        commit('setAccountQuota', account)
                    }
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        });
    },
    checkPostQuota({ commit }) {
        return new Promise(function(resolve, reject) {
            api.checkQuota({ type: ['post'] }).then((res) => {
                    let { status = false, data = null } = res.data
                    if (status && data) {
                        let { post } = data
                        commit('setPostQuota', post)
                    }
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        });
    },
    checkAutopilotQuota({ commit }) {
        return new Promise(function(resolve, reject) {
            api.checkQuota({ type: ['autopilot'] }).then((res) => {
                    let { status = false, data = '' } = res.data
                    if (status && data) {
                        let { autopilot } = data
                        commit('setAutopilotQuota', autopilot)
                    }
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        });
	},
	checkCustomPlan({ commit }){
		return new Promise(function(resolve, reject) {
            api.checkCustomPlan().then((res) => {
				let { status = false, data = null } = res.data
				if (status && data) {
					commit('setCustomPlan' , data)
				}
				resolve(res)
			})
			.catch((err) => {
				reject(err)
			})
        });
	}
};


export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};