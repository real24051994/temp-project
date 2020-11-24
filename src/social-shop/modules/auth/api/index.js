import axios from '@/plugins/axios'
export default {
  generalShopifyUrl({ shop = '' }) {
    return axios({
      url: '/shopify/generate_url',
      method: 'post',
      data: { shop },
    })
  },
  getUser() {
    return axios({
      url: '/app/user',
      method: 'get',
    })
  },

  generalLinkSocial(data) {
    return axios({
      url: '/social/generate_url',
      method: 'POST',
      data,
    })
  },

  getCollection(payload) {
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

  updateAuthSetup(payload) {
    return axios({
      url: '/social_shop/social/auth_setup',
      method: 'PUT',
      data: payload,
    })
  },

  getAuthSetupInfo(payload) {
    let { responseInfo = false } = payload
    return axios({
      url: '/social_shop/social/auth_setup',
      method: 'GET',
      params: {
        responseInfo: responseInfo,
      },
    })
  },
  getGeneralSetting() {
    return axios({
      url: '/social_shop/social/general_setting',
      method: 'GET',
    })
  },
  
  accessPermission() {
    return axios({
      url: '/social_shop/social/permission',
      method: 'PUT',
    })
  },
  createFeedback(payload){
    let { app_id  = 'social_shop' , reason_type = [] , reason } = payload 
    return axios({
      url: '/app/rating',
      method: 'POST',
      data  : {
        app_id , reason_type , reason
      }
    })
  }
}
