import api  from '@publish/api'
const state = {

};

const getters = {

};
const mutations = {

};

const actions = {
	async list({} , payload){
		try {
			return await api.getIntegration(payload)
		} catch (e) {
			throw e;
		}
	},

	async generalBitlyUrl({commit}){
		try {
			return  await api.generalBitlyUrl();
		} catch (e) {
			throw e;
		}
	},

	async removeBitlyAccount(){
		try {
			return  await api.removeBitlyAccount();
		} catch (e) {
			throw e;
		}
	},

	async generalAliReviewUrl({}){
		try {
			return await api.generalAliReviewUrl()
		} catch (e) {
			throw e;
		}
	},

	async integrationAliReview({} , payload){
		try {
			return await api.integrationAliReview(payload)
		} catch (e) {
			throw e;
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