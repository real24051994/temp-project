import api  from '@publish/api'
const state = {
	templates : []
};

const getters = {
	getTemplates(state){
		return	state.templates
	}
};

const mutations = {
	setTemplates(state ,payload){
		state.templates = payload 
	}
};

const actions = {
	async list({commit}) {
		try {
			let res =  await api.getAutopilotTemplates()
			let { status = false , data = [] } = res.data 
			if( status && data ){
				commit('setTemplates' , data)
			}else{
				commit('setTemplates' , [])
			}
			return res
		} catch (e) {
			throw e;
		}
	},
	
	async create({ }, payload) {
		try {
			return await api.createAutopilotTemplate(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async update({ }, payload) {
		try {
			return await api.updateAutopilotTemplate(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async delete({ }, payload) {
		try {
			return await api.deleteAutopilotTemplate(payload)
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