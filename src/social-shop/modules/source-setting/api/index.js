import axios from '@/plugins/axios'
export default {
	getSourceSetting(payload) {
		let { shop_id } = payload
		return axios({
			url: '/social_shop/social/shop_setting',
			method: 'GET',
			params: {
				shop_id
			},
		})
	},
	updateSourceSetting(payload) {
		let { formdata } = payload
		return axios({
			url: '/social_shop/social/shop_setting',
			method: 'PUT',
			data: formdata
		})
	},
	reSyncMetafields(payload){
		let { shop_id } = payload
		return axios({
			url: '/social_shop/social/re_sync_metafields',
			method: 'GET',
			params: {
				shop_id
			}
		})
	},
	getCollections(payload) {
		let { limit = 8, keyword = '', page = 1 } = payload
		return axios({
			url: '/shopify/collections',
			method: 'GET',
			params: {
				current_page: page,
				limit,
				keyword,
			},
		})
	},
	getProducts(payload) {
		let { rel = '', keyword = '', pageInfoNext = '', pageInfoPrev = '', cancel_request_token } = payload
        return axios({
            url: '/app/products',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                keyword,
                rel,
                pageInfoNext,
                pageInfoPrev
            }
        });
		// let { current_page = 1, limit = 10, keyword } = payload
		// return axios({
		// 	url: '/social_shop/social/products',
		// 	method: 'GET',
		// 	params: {
		// 		current_page,
		// 		limit,
		// 		keyword,
		// 		fields: ['id', 'title', 'image_url' ,'price'],
		// 	},
		// })
	},
	
}
