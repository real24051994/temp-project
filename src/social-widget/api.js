import axios from '@/plugins/axios'
export default {
    getUser() {
        return axios({
            url: '/app/user',
            method: 'GET',
        });
    },
	updateOnboarding({ type  = ''}){
		return axios({
			url : '/social_widget/social/on_boarding',
			method: 'put',
			data : { type }
		})
	},
    generalShopifyUrl({ shop = '' }) {
        return axios({
            url: '/shopify/generate_url',
            method: 'POST',
            data: { shop }
        });
    },
    generalLinkSocial(data) {
        let { social = 'instagram_basic' } = data
        return axios({
            url: '/social/generate_url',
            method: 'POST',
            data: { social }
        });
    },
    getListGallery(payload) {
        // let { cancel_request_token = null } = payload
        return axios({
            url: '/social_widget/gallery',
            method: 'GET',
            // cancelToken: cancel_request_token
        });
    },
    getGalleryDetail(payload) {
        let { id = '' } = payload
        return axios({
            url: `/social_widget/gallery/${id}`,
            method: 'GET',
        });
	},
	deleteGallery(payload){
		let { id } = payload
        return axios({
            url: `/social_widget/gallery/${id}`,
            method: 'DELETE',
        });
	},
    getImageFromGallery(payload) {
        let { id = '', current_page = '', cancel_request_token = null } = payload
        return axios({
            url: `/social_widget/gallery/${id}/images`,
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page,
            }
        });
    },
    getListWidgets(payload) {
        let { limit = 10, keyword = '', current_page = 1, cancel_request_token = null } = payload
        return axios({
            url: '/social_widget/widgets',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page,
                limit,
                keyword
            }
        });
    },
    createWidget(payload) {
        return axios({
            url: '/social_widget/widgets',
            method: 'POST',
            data: payload
        });
    },
    getWidget(payload) {
        let { id } = payload
        return axios({
            url: `/social_widget/widgets/${id}`,
            method: 'GET',
        });
    },
    updateWidget(payload) {
        let { id, formdata } = payload
        return axios({
            url: `/social_widget/widgets/${id}`,
            method: 'PUT',
            data: formdata
        });
	},
	updateStatus(payload) {
        let { id, status } = payload
        return axios({
            url: `/social_widget/widgets/${id}/status`,
            method: 'PUT',
            data: {  status }
        });
    },
    deleteWidget(payload) {
        let { id } = payload
        return axios({
            url: `/social_widget/widgets/${id}`,
            method: 'DELETE',
        });
    },
    getListPages(payload) {
        return axios({
            url: '/social_widget/shopify/page',
            method: 'GET',
        });
    },
	getListGalleryInWidget(){
		return axios({
            url: '/social_widget/widget/gallery',
            method: 'GET',
        });
		
	},
	
}