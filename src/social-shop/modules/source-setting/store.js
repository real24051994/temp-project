import api from './api'
const state = {

}
const getters = {

}

const mutations = {

}

const actions = {
	async getSourceSetting({ }, payload) {
		try {
			return await api.getSourceSetting(payload)
		} catch (err) {
			throw err
		}
	},
	async updateSourceSetting({ }, payload) {
		try {
			return await api.updateSourceSetting(payload)
		} catch (err) {
			throw err
		}
	},
	async reSyncMetafields({ }, payload) {
		try {
			return await api.reSyncMetafields(payload)
		} catch (err) {
			throw err
		}
	},
	async getCollections({}, payload) {
		try {
		  return await api.getCollections(payload)
		} catch (e) {
		  throw e
		}
	},
	async getProducts({}, payload) {
		try {
			return await api.getProducts(payload)
		} catch (err) {
			throw err
		}
	},

}



export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
}
