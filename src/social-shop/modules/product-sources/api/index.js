import axios from '@/plugins/axios'

export default {
  getListProducts(payload) {
    let { current_page = 1, limit = 10, keyword } = payload

    return axios({
      url: '/social_shop/social/products',
      method: 'GET',
      params: {
        current_page,
        limit,
        keyword,
        fields: ['rest_id ', 'id', 'title', 'image_url', 'ss_source_id'],
      },
    })
  },

  getShopSettings() {
    return axios({
      url: '/social_shop/social/shop_setting',
      method: 'GET',
    })
  },

  updateShopSettings(payload) {
    const { use_seo, include_variant, import_unpublished, compare_at_price } = payload
    return axios({
      url: '/social_shop/social/shop_setting',
      method: 'PUT',
      data: {
        use_seo,
        include_variant,
        import_unpublished,
        compare_at_price,
      },
    })
  },

  /*
   *****************************************
   * FILTER
   *
   */

  getProductSourcesFilter() {
    return axios({
      url: '/social_shop/social/source_filter_setting',
      method: 'GET',
    })
  },

  updateProductSourcesFilter(payload) {
    const { type_get_product, collection_ids } = payload

    return axios({
      url: '/social_shop/social/source_filter_setting',
      method: 'PUT',
      data: {
        type_get_product,
        collection_ids,
      },
    })
  },

  /*
   *****************************************
   * MAPPING
   *
   */

  getListImportMapping(payload) {
    let { shop_id = '' } = payload
    return axios({
      url: '/social_shop/social/import_product_mapping',
      method: 'GET',
      params: {
        shop_id,
      },
    })
  },

  updateImport({ shop_id = '', import_product_mappings = [] }) {
    let data = { shop_id, import_product_mappings }
    return axios({
      url: '/social_shop/social/import_product_mapping',
      method: 'PUT',
      data,
    })
  },

  getListMetafields(payload) {
    let { limit = 10, keyword = '', page = 1, filter = [] } = payload
    return axios({
      url: '/metafields',
      method: 'GET',
      params: {
        current_page: page,
        limit,
        keyword,
        filter,
      },
    })
  },
}
