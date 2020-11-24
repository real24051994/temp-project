import api from '@publish/api'
const state = {
	discount_templates:  []
};

const getters = {
	getDiscountTemplates(state) {
		return state.discount_templates
	}
};
const mutations = {


};

const actions = {

	async create({ }, payload) {
		try {
			return await api.createAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},

	async update({ }, payload) {
		try {
			return await api.updateAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},

	async updateStatus({ }, payload) {
		try {
			return await api.updateStatusAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},

	async pauseListAutopilot({ }, payload) {
		try {
			return await api.pauseListAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},

	async get({ }, payload) {
		try {
			return await api.getAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},
	async delete({ }, payload) {
		try {
			return await api.deleteAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},
	async list({ }, payload) {
		try {
			return await api.getListAutopilot(payload)
		} catch (e) {
			throw e;
		}
	},

	async getAutopilotBySocialAccount({ }, payload) {
		try {
			return await api.getAutopilotBySocialAccount(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async getDiscountTemplate({ }) {
		try {
			return await api.getDiscountTemplate()
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