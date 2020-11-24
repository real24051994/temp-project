import api  from '@publish/api'
const state = {
	accounts : []
};

const getters = {
    getAccounts(state){
		return  state.accounts
	}
};

const actions = {
	async list({commit}) {
        try {
			let res =  await api.getSocialAccounts();
			let { status = false , data = []} = res.data 
			if( status ){
				commit('setAccounts' , data)
			}else{
				commit('setAccounts' , [])
			}
            return res
        } catch (e) {
            throw e;
        }
    },

	async general({}, payload) {
        try {
            return await api.generalLinkSocial(payload)
        } catch (e) {
            throw e;
        }
    },

    async reconnect({}, payload) {
        try {
            return await api.generalLinkReconnectSocial(payload)
        } catch (e) {
            throw e;
        }
	},
	
    async delete({},payload) {
        try {
            return await api.removeSocial(payload)
        } catch (e) {
            throw e;
        }
	},

	async checkPageSelected({commit}, payload) {
        try {
            return await api.checkPageSelected(payload)
        } catch (e) {
            throw e;
        }
	},
	
	async chooseHootsuiteInstagram({ commit } , payload){
		try {
            return await api.chooseHootsuiteInstagram(payload)
        } catch (e) {
            throw e;
        }
	}
};

const mutations = {
    setAccounts(state ,payload){
		state.accounts = payload 
	}
};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};