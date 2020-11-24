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
			return await api.getListQueue(payload)
		} catch (e) {
			throw e;
		}
	},
	
	async  get({} , payload){
		try {
			return await api.getQueueDetail(payload)
		} catch (e) {
            throw e;
        }
	},
	async  delete({} , payload){
		try {
			return await api.deleteQueue(payload)
		} catch (e) {
            throw e;
        }
	},
	async  update({} , payload){
		try {
			return await api.updateQueue(payload)
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