import api from '@widget/api'
const state = {
	page: []
};

const getters = {
	getALl(state){
		return state.page
	}
};

const actions = {
	async getAll({commit}, payload) {
		let { page_id = '' } = payload 
		return new Promise((resolve, reject)=>{
			api.getListPages(payload).then((res)=>{
				let { status = false , data = null } = res.data 
				if( status &&  data ){
					let { pages = [] , pageSelected = []} = data 
					var selected = pageSelected.map((item)=>item.page_id)
					let result  = pages.map((item)=>{
						item['status'] = (selected.indexOf(item.page_id) == -1   || item.page_id == page_id)
						return item
					}) 
					commit('setPage', result)
				}else{
					commit('setPage', [])
				}
				resolve(res)
			})
			.catch(err=>{
				commit('setPage', [])
				reject(err)
			})
		});
	},
};

const mutations = {
	setPage(state, payload){
		state.page = payload || []
	}

};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};