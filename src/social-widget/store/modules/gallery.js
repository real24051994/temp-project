import api from '@widget/api'
const state = {
	gallery : [],
	page: []
};

const getters = {
	getAll(state){
		return state.gallery
	},
};

const actions = {
	async generalLinkSocial({commit} , payload){
		try {
			return await api.generalLinkSocial(payload)
		} catch (e) {
			throw e;
		}
	},
	async getList({commit} , payload){
		return new Promise((resolve, reject)=>{
			api.getListGallery(payload).then((res)=>{
				let { status = false , data = null } = res.data 
				if( status &&  data && data.length ){
					res.data.data = data.map((item)=>{
						var sw_images = item['sw_images'] ? item['sw_images'] : []
						var count_down =  4 - sw_images.length 
						for (let i = 0; i < count_down; i++) {
							sw_images.push({
								media_url : null
							})
						}
						item['sw_images']=  sw_images
						return item
					})
				}
				resolve(res)
			})
			.catch(err=>{
				reject(err)
			})
		});
	},
	async get({commit} , payload){
		try {
			return await api.getGalleryDetail(payload)
		} catch (e) {
			throw e;
		}
	},
	async getImage({commit} , payload){
		try {
			return await api.getImageFromGallery(payload)
		} catch (e) {
			throw e;
		}
	},
	async delete({commit} , payload){
		try {
			return await api.deleteGallery(payload)
		} catch (e) {
			throw e;
		}
	},
	async getAll({commit} , payload) {
		return new Promise((resolve, reject)=>{
			api.getListGalleryInWidget(payload).then((res)=>{
				let { status = false , data = null } = res.data 
				if( status &&  data && data.length ){
					commit('setGallery' , data)
				}else{
					commit('setGallery' , [])
				}
				resolve(res)
			})
			.catch(err=>{
				commit('setGallery' , [])
				reject(err)
			})
		});
	},
};

const mutations = {
	setGallery(state, payload){
		state.gallery = payload || []
	}

};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};