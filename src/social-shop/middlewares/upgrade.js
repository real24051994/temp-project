export default async function({ next, router, store, to }) {
  // var user = store.getters['auth/getUser']
  // if (user && user.shop.app_version !== process.env.VUE_APP_SOCIAL_SHOP_APP_VERSION) {
  //   next({ name: 'Upgrade' })
  //   return false
  // }
  return true
}
