import api  from '@publish/api'
const state = {

};

const getters = {

};

const mutations = {

};

const actions = {
	async getDashboardStatistic({} , payload){
		try {
			return  await api.getDashboardStatistic(payload);
		} catch (e) {
			throw e;
		}
	},
	async getDashboardArticle({} , payload){
		try {
			return  await api.getDashboardArticle(payload);
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