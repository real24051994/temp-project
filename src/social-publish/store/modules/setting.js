import api  from '@publish/api'
const state = {

};

const getters = {

};
const mutations = {

};

const actions = {
	async get({commit}){
		try {
			let res = await api.getSetting();
            let { status = false , data  = null } = res.data
            if (status && data ) {
				let {  
					date_format =  "YYYY-MM-DD",
					time_format =  "24",
					timezone =  "Europe/London"
				} = data 
                commit('auth/setShopSetting', { date_format , time_format , timezone },{ root: true })
            }
            return res
		} catch (e) {
			throw e;
		}
	},
	async update({} , payload){
		try {
			return  await api.updateSetting(payload);
		} catch (e) {
			throw e;
		}
	}
};


export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};