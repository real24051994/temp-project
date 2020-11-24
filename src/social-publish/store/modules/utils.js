import api  from '@publish/api'
const state = {
	aside_collapse : false,
};

const getters = {
	getAsideCollapse(state){
		return state.aside_collapse
	},
};

const mutations = {
	toggleAsideCollapse(state ){
        state.aside_collapse = !state.aside_collapse
	},
	setAsideCollapse(state, payload){
		state.aside_collapse = payload
	},
};

const actions = {
	
	async createDiscountTemplate({}, payload) {
        try {
            return await api.createDiscountTemplate(payload)
        } catch (e) {
            throw e;
        }
	},
	async  getDiscountTemplate({}){
		try {
			return await api.getDiscountTemplate()
		} catch (e) {
            throw e;
        }
	},
	async  removeDiscountTemplate({} , payload){
		try {
			return await api.removeDiscountTemplate(payload)
		} catch (e) {
            throw e;
        }
	},
	async updateDiscountTemplate({} , payload){
		try {
			return await api.updateDiscountTemplate(payload)
		} catch (e) {
            throw e;
        }
	},
	async  createShortenLink({} , payload){
		try {
			return await api.createShortenLink(payload)
		} catch (e) {
            throw e;
        }
	},
	async getMetaFromUrl({} , payload){
		try {
			return  await api.getMetaFromUrl(payload);
		} catch (e) {
			throw e;
		}
	},
	async getListProduct({ }, payload) {
        try {
            return await api.getListProduct(payload)
        } catch (e) {
            throw e;
        }
	},
	async getCollections({} , payload){
		try {
			return await api.getCollections(payload)
		} catch (e) {
            throw e;
		}
	},

	async getCollectionById({} , payload){
		try {
			return await api.getCollectionById(payload)
		} catch (e) {
            throw e;
		}
	},

	async getRandomProduct({} , payload){
		try {
			return await api.getRandomProduct(payload)
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