import api  from '@publish/api'
const state = {

};

const getters = {

};

const mutations = {

};

const actions = {
	async create({} , payload){
		try {
            return await api.uploadImage(payload)
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