import api from '@widget/api'
const state = {

};

const getters = {

};

const actions = {
    async getList({}, payload) {
        try {
            return await api.getListWidgets(payload)
        } catch (e) {
            throw e;
        }
    },
    async create({}, payload) {
        try {
            return await api.createWidget(payload)
        } catch (e) {
            throw e;
        }
    },
    async get({}, payload) {
        try {
            return await api.getWidget(payload)
        } catch (e) {
            throw e;
        }
    },
    async update({}, payload) {
        try {
            return await api.updateWidget(payload)
        } catch (e) {
            throw e;
        }
	},
	async updateStatus({} , payload){
		try {
            return await api.updateStatus(payload)
        } catch (e) {
            throw e;
        }
	},
    async delete({}, payload) {
        try {
            return await api.deleteWidget(payload)
        } catch (e) {
            throw e;
        }
    },
	
};

const mutations = {


};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};