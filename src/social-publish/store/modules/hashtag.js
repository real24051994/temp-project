import api  from '@publish/api'
const state = {

};

const getters = {

};

const mutations = {

};

const actions = {
	async list({ }, payload) {
		try {
			return await api.getListHashTags(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async create({ }, payload) {
		try {
			return await api.createHashtags(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async update({ }, payload) {
		try {
			return await api.updateHashtags(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async delete({ }, payload) {
		try {
			return await api.deleteHashtags(payload)
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