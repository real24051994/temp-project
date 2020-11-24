import api  from '@publish/api'
const state = {
	show_modal_create : false,
};

const getters = {
	getModalCreate(state){
		return state.show_modal_create
	}
};

const mutations = {
	setModalCreate(state , payload){
		state.show_modal_create = payload
	},
	showModalCreate(state){
		state.show_modal_create = true
	},
	hideModalCreate(state){
		state.show_modal_create = false
	},

};

const actions = {
	
	async list({ }, payload) {
        try {
            return await api.getListPosts(payload)
        } catch (e) {
            throw e;
        }
	},
	async getStatusCount({ }, payload) {
        try {
            return await api.getPostStatusCount(payload)
        } catch (e) {
            throw e;
        }
	},
	async create({} , payload){
		try {
			return  await api.createPost(payload);
		} catch (e) {
			throw e;
		}
	},

	async update({} , payload){
		try {
			return  await api.updatePost(payload);
		} catch (e) {
			throw e;
		}
	},

	async delete({} , payload){
		try {
			return  await api.deletePost(payload);
		} catch (e) {
			throw e;
		}
	},

	async get({} , payload){
		try {
            return await api.getPostDetail(payload)
        } catch (e) {
            throw e;
        }
	},

	async getPostStatic({} , payload){
		try {
            return await api.getPostStatic(payload)
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