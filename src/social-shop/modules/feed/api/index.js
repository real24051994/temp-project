import axios from '@/plugins/axios'

export default {
  getListFeedTemplate() {
    return axios({
      url: 'social_shop/social/feeds_center',
      method: 'GET',
    })
  },

  getListProductFeed(payload) {
    let { ss_feed_id = '', limit = 10, keyword = '', page = 1, status = 'all', social_type = '' } = payload
    return axios({
      url: '/social_shop/social/product_feed/list',
      method: 'GET',
      params: {
        current_page: page,
        limit,
        keyword,
        ss_feed_id,
        status,
        social_type,
      },
    })
  },

  updateStatusFeedCenter({ ss_feed_id = '', status = true }) {
    let data = { ss_feed_id, status }
    return axios({
      url: '/social_shop/social/feeds_center/status',
      method: 'PUT',
      data,
    })
  },

  resubmitFeed({ ss_feed_id = '' }) {
    let data = { ss_feed_id }
    return axios({
      url: '/social_shop/social/feeds_center/submit',
      method: 'PUT',
      data,
    })
  },

  updateStatusColumn({ ss_feed_id = '', show_columns = [] }) {
    let data = { ss_feed_id, show_columns }
    return axios({
      url: '/social_shop/social/show_columns',
      method: 'PUT',
      data,
    })
  },

  bulkAssign({ ss_feed_id = null, feed_product_ids = [], field = '', value = '' }) {
    let data = { ss_feed_id, feed_product_ids, field, value }
    return axios({
      url: '/social_shop/social/bulk_assign',
      method: 'POST',
      data,
    })
  },

  getFeedInfo(payload) {
    let { ss_feed_id = '' } = payload
    return axios({
      url: '/social_shop/social/feed_info',
      method: 'GET',
      params: {
        ss_feed_id,
      },
    })
  },

  addFeedTemplate(payload) {
    return axios({
      url: 'social_shop/social/feeds_center',
      method: 'POST',
      data: payload
    })
  },

  getValueMapping(payload) {
    let { ss_feed_id = '' } = payload
    return axios({
      url: '/social_shop/social/feed_product_mapping',
      method: 'GET',
      params: {
        ss_feed_id,
      },
    })
  },

  updateMapping({ ss_feed_id = '', feed_product_mappings = {} }) {
    let data = { ss_feed_id, feed_product_mappings }
    return axios({
      url: '/social_shop/social/feed_product_mapping',
      method: 'PUT',
      data,
    })
  },

  reassignMapping({ ss_feed_id = '' }) {
    let data = { ss_feed_id }
    return axios({
      url: '/social_shop/social/apply_all_button',
      method: 'PUT',
      data,
    })
  },

  deleteFeed({ ss_feed_id = '', deleted_on_chanel = false }) {
    let data = { ss_feed_id, deleted_on_chanel }
    return axios({
      url: '/social_shop/social/feeds_center',
      method: 'DELETE',
      data,
    })
  },

  getCategories(payload) {
    let { ss_feed_id = '' } = payload
    return axios({
      url: '/feeds/google_product_category',
      method: 'GET',
      params: {
        ss_feed_id,
      },
    })
  },

  updateCategories({ ss_feed_id = '', collection_categories = [] }) {
    let data = { ss_feed_id, collection_categories }
    return axios({
      url: '/feeds/google_product_category',
      method: 'PUT',
      data,
    })
  },

  getStatisticsStatus(payload) {
    return axios({
      url: '/social_shop/social/feeds_center/count_status',
      method: 'GET',
    })
  },

  getStatisticsStatusDetails(payload) {
    let { ss_feed_id = '' } = payload
    return axios({
      url: '/social_shop/social/feeds_center/count_status/detail',
      method: 'GET',
      params: {
        ss_feed_id,
      },
    })
  },

  uninstallBusinessExtension({ uninstall_fbe = '', internal_id = ''}) {
    let data = { uninstall_fbe, internal_id }
    return axios({
      url: '/social_account',
      method: 'POST',
      data,
    })
  },
  getProductSources(payload){
    let { user_id } = payload
    return axios({
      url : '/social_shop/social/product_source',
      methods : 'GET',
      params : {
        user_id
      }
    })
  }
}
