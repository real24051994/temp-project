import axios from '@/plugins/axios'
import default_axios from 'axios';
export default {
    generalShopifyUrl({ shop = '' }) {
        return axios({
            url: '/shopify/generate_url',
            method: 'post',
            data: { shop }
        });
    },
    loginByAccount({ email = '', password = '' }) {
        return axios({
            url: '/app/login',
            method: 'post',
            data: { email, password }
        });
    },
    getUser() {
        return axios({
            url: '/app/user',
            method: 'get',
        });
    },
    register({ password = '' }) {
        return axios({
            url: '/app/register',
            method: 'post',
            data: { password }
        });
    },
    sendMailForgetPassword({ email = '' }) {
        return axios({
            url: '/app/forgot_password',
            method: 'post',
            data: { email }
        });
    },
    vertifyForgetPasswordCode({ email = '', code = '' }) {
        return axios({
            url: '/app/verify_forgot_password',
            method: 'post',
            data: { email, code }
        });
    },
    resetPassword({ email = '', password = '', code = '' }) {
        return axios({
            url: '/app/reset_password',
            method: 'post',
            data: { email, code, password }
        });
    },
    changePassword({ email = '', password = '', new_password = '' }) {
        return axios({
            url: '/app/change_password',
            method: 'put',
            data: { email, password, new_password }
        });
    },
    updateOnboarding({ type = '' }) {
        return axios({
            url: '/social_publish/social/on_boarding',
            method: 'put',
            data: { type }
        })
    },
    generalLinkSocial(data) {
        return axios({
            url: '/social/generate_url',
            method: 'POST',
            data
        });
    },
    generalLinkReconnectSocial(data) {
        return axios({
            url: '/social/re-auth',
            method: 'POST',
            data
        });
    },
    checkPageSelected({ social_info = [], secret = '' }) {
        const data = { social_info, secret };
        return axios({
            url: '/social/account',
            method: 'POST',
            data
        });
	},
	chooseHootsuiteInstagram(payload) {
        return axios({
            url: '/hootsuite/instagram_account_choose',
            method: 'POST',
            data : payload
        });
    },
    removeSocial({ social_id = '' }) {
        const data = { social_id };
        return axios({
            url: '/social_publish/social/remove',
            method: 'POST',
            data
        });
    },
    getSocialAccounts() {
        return axios({
            url: '/social_publish/social/list',
            method: 'GET',
        });
    },
    getAutopilotTemplates() {
        return axios({
            url: '/social_publish/auto_post/default_template',
            method: 'GET',
        });
	},
	createAutopilotTemplate(payload){
		return axios({
            url: '/social_publish/auto_post/default_template',
            method: 'POST',
            data: payload
        })
	},
	updateAutopilotTemplate(payload){
		let { id = '' , formdata } = payload
		return axios({
            url: `/social_publish/auto_post/default_template/${id}`,
            method: 'PUT',
            data: formdata
        })
	},
	deleteAutopilotTemplate(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/default_template/${id}`,
            method: 'DELETE',
        });
    },
    getCollections(payload) {
        let { limit = 10, keyword = '', current_page = 1, cancel_request_token = null } = payload
        return axios({
            url: '/shopify/collections',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page,
                limit,
                keyword
            }
        });
    },
    getCollectionById(payload) {
        return axios({
            url: '/shopify/collections/ids',
            method: 'GET',
            params: {

            }
        });
    },
    getRandomProduct(payload) {
        return axios({
            url: '/social_publish/auto_post/publish_content/random_product',
            method: 'POST',
            data: payload
        });
    },
    createAutopilot(payload) {
        return axios({
            url: '/social_publish/auto_post/publish_content',
            method: 'POST',
            data: payload
        })
    },
    updateAutopilot(payload) {
        let { id, formdata } = payload
        return axios({
            url: `/social_publish/auto_post/publish_content/${id}`,
            method: 'PUT',
            data: formdata
        })
    },
    getAutopilot(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/publish_content/${id}`,
            method: 'GET',
        });
    },
    deleteAutopilot(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/publish_content/${id}`,
            method: 'DELETE',
        });
    },
    updateStatusAutopilot(payload) {
        let { id, status } = payload
        return axios({
            url: `/social_publish/auto_post/publish_content/${id}/status`,
            method: 'PUT',
            data: {
                status
            }
        });
    },
    pauseListAutopilot(payload) {
        let { ids } = payload
        return axios({
            url: '/social_publish/auto_post/pause_auto_pilot',
            method: 'PUT',
            data: {
                ids
            }
        });
    },
    getListAutopilot(payload) {
        let { limit = 10, keyword = '', current_page = 1, social_id = '', sort_by = '', order_by = '', cancel_request_token = null } = payload
        return axios({
            url: '/social_publish/auto_post/publish_content',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page,
                limit,
                keyword,
                social_id,
                sort_by,
                order_by
            }
        });
    },
    getAutopilotBySocialAccount(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/social_account/${id}`,
            method: 'GET',
        });
    },
    getListQueue(payload) {
        let { keyword = '', current_page = 1, social_id = '', autopilot_ids = [], day = 10, sort_by = '', order_by = '', cancel_request_token = null } = payload
        return axios({
            url: '/social_publish/auto_post/publish_queue',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page,
                keyword,
                social_id,
                sort_by,
                order_by,
                day,
                sp_auto_post_ids: autopilot_ids
            }
        });
    },
    createShortenLink({ url = [], type = '', cancel_request_token }) {
        return axios({
            url: '/social_publish/social/general_short_link',
            method: 'POST',
            cancelToken: cancel_request_token,
            data: {
                url
            }
        })
    },
    getShopUTM() {
        return axios({
            url: '/social_publish/settings/shop',
            method: 'GET',
        });
    },
    getMetaFromUrl({ url = '' }) {
        let data = { url }
        return axios({
            url: '/social_publish/get_meta_social',
            method: 'POST',
            data
        });
    },
    createPost(payload) {
        let { data } = payload
        return axios({
            url: '/social_publish/social/post_social',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data
        })
    },
    updatePost(payload) {
        let { id, data } = payload
        return axios({
            url: `/social_publish/social/post_social/${id}`,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data
        })
    },
    deletePost(payload) {
        let { id, delete_from_social = false } = payload
        return axios({
            url: `/social_publish/social/post_social/${id}`,
            method: 'DELETE',
            params: {
                delete_from_social
            }
        });
    },
    getPostDetail(payload) {
        let { id = '' } = payload
        return axios({
            url: `/social_publish/social/post_detail/${id}`,
            method: 'GET',
        });
    },
    getPostStatic(payload) {
        let { id = '' } = payload
        return axios({
			url: '/social_publish/statistic_post',
            method: 'GET',
            params: {
                id
            }
        });
    },
    getListProduct(payload) {
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
    },
    getListPosts(payload) {
        let { page = 1, limit = 10, keyword = '', status = 'published', from = '', to = '', social_id = '', sort = 'DESC', cancel_request_token } = payload
        return axios({
            url: '/social_publish/social/list_post',
            method: 'GET',
            cancelToken: cancel_request_token,
            params: {
                current_page: page,
                limit,
                keyword,
                status,
                from,
                to,
                social_id,
                sort,
            }
        });
    },
    getPostStatusCount(payload) {
        return axios({
            url: '/social_publish/social/status-count',
            method: 'GET',
        });
    },
    getCalendarPost(payload) {
        let { from, to, social_ids = [], status = null, cancel_request_token = null } = payload
        let params = {
            from,
            to
        }
        if (status) {
            params['status'] = status
        }
        params['social_ids'] = social_ids
        return axios({
            url: '/social_publish/calendar/list',
            method: 'GET',
            cancelToken: cancel_request_token,
            params
        });
    },
    updateCalendarPost(payload) {
        let { id, start } = payload;
        return axios({
            url: '/social_publish/calendar/update_post',
            method: 'PUT',
            data: {
                id,
                start
            }
        })
    },
    getListHashTags(payload) {
        let { page = 1, limit = 10, keyword = '' } = payload
        return axios({
            url: '/social_publish/social/hash_tags',
            method: 'GET',
            params: {
                current_page: page,
                limit,
                keyword
            }
        });
    },
    createHashtags({ title = '', content = '' }) {
        let data = { title, content }
        return axios({
            url: '/social_publish/social/hash_tags',
            method: 'POST',
            data,
        })
    },
    updateHashtags({ title = '', content = '', id = '' }) {
        let data = { title, content }
        return axios({
            url: `/social_publish/social/hash_tags/${id}`,
            method: 'PUT',
            data,
        })
    },
    deleteHashtags({ id = '' }) {
        return axios({
            url: `/social_publish/social/hash_tags/${id}`,
            method: 'DELETE',
        })
    },
    uploadImage({ data }) {
        return axios({
            url: '/social_publish/media/upload_image',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data
        })
    },
    getSetting() {
        return axios({
            url: '/social_publish/settings/shop',
            method: 'GET',
        });
    },
    updateSetting(payload) {
        return axios({
            url: '/social_publish/settings/shop',
            method: 'POST',
            data: payload
        });
	},
	getIntegration(payload){
		let { filter = [] } = payload
		return axios({
            url: '/social_publish/integration/status',
			method: 'GET',
			params : {
				filter
			}
        });
	},
	integrationAliReview(payload) {
		let { status } = payload
        return axios({
            url: '/social_publish/integration/submission',
			method: 'POST',
			data :{
				status
			}
        });
    },
	generalAliReviewUrl() {
        return axios({
            url: '/social_publish/integration/install_url',
            method: 'POST',
        });
    },
    generalBitlyUrl() {
        return axios({
            url: '/social_publish/social/generate_bitly_url',
            method: 'POST',
        });
    },
    removeBitlyAccount() {
        return axios({
            url: '/social_publish/social/remove_bitly_account',
            method: 'DELETE',
        });
    },
    getUTM() {

    },
    getQueueDetail(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/publish_queue/${id}`,
            method: 'GET',
        });
    },
    deleteQueue(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/publish_queue/${id}`,
            method: 'DELETE',
        });
    },
    updateQueue(payload) {
        let { id, data } = payload
        return axios({
            url: `/social_publish/auto_post/publish_queue/${id}`,
            method: 'PUT',
            data
        });
    },
    getDashboardStatistic(payload) {
        let { social_id = '', last_days = 14 } = payload
        return axios({
            url: '/social_publish/dashboard/statistic',
            method: 'GET',
            params: {
                social_id,
                last_days
            }
        });
	},
	getDashboardArticle(payload){
		let { tab = 'rencent'  , category_id = ''  } = payload
		let params = {
			page : 1, 
			per_page  : 3,  
			orderby : 'post_date', 
			order : 'desc',
			category : category_id
		}
        return $.get({
            url: `${process.env.VUE_APP_PUBLISH_WEBSITE_API}/posts`,
			method: 'GET',
			data : params
        });
	},
    createDiscountTemplate(payload) {
        return axios({
            url: '/social_publish/auto_post/discount_tag_template',
            method: 'POST',
            data: payload
        });
    },
    getDiscountTemplate() {
        return axios({
            url: '/social_publish/auto_post/discount_tag_template',
            method: 'GET'
        });
    },
    updateDiscountTemplate(payload) {
        let { id = '', data } = payload
        return axios({
            url: `/social_publish/auto_post/discount_tag_template/${id}`,
            method: 'PUT',
            data
        });
    },
    removeDiscountTemplate(payload) {
        let { id } = payload
        return axios({
            url: `/social_publish/auto_post/discount_tag_template/${id}`,
            method: 'DELETE'
        });
    },
    getShopSetting() {
        return axios({
            url: '/social_publish/shop/current-setting',
            methods: 'GET'
        })
    },
    generalShopifyCharge(payload) {
        let { app_plan = '' } = payload
        return axios({
            url: '/shopify/charge',
            method: 'POST',
            data: {
                app_plan
            }
        });
    },
    removeShopifyCharge(payload) {
        return axios({
            url: '/social_publish/remove_charge',
            method: 'DELETE',
        });
    },
    checkQuota(payload) {
        let { type = [] } = payload
        return axios({
            url: '/social_publish/subscription_limitation',
            method: 'GET',
            params: {
                type
            }
        });
	},
	checkCustomPlan(){
		return axios({
            url: '/app/custom_charge',
            methods: 'GET'
        })
	},
	createFeedback(payload){
		return axios({
			url: '/social_publish/feedback/create',
            method: 'POST',
			data: payload
		})
	}
}