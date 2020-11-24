import api  from '@publish/api'
const state = {

};

const getters = {

};
const mutations = {

};

const actions = {
	async get({} , payload){
		try {
			return await api.getCalendarPost(payload)
		} catch (e) {
            throw e;
        }
	},

	async update({} , payload){
		try {
			return await api.updateCalendarPost(payload)
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