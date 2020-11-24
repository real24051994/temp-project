import axios from '@/plugins/axios'

export default async function({ next, router, store, to }) {
  if (to.params.hasOwnProperty('id') && to.params['id'] && to.params['id'] == '1034') {
    try {
      var res = await axios.get('/social_shop/social/feed_info_shop')
      let { status = false, data = null } = res.data
      if (status && data) {
        next({
          name: 'MappingGoogle',
          params: {
            id: data.id,
          },
        })
        return false
      } else {
        next({ name: 'FeedCenter' })
      }
    } catch (error) {
      next({ name: 'FeedCenter' })
      return false
    }
  }
  return true
}
