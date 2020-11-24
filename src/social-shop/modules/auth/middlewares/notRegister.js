export default async function ({ next, router, store }) {
	try {
		let res = await store.dispatch('auth/getAuthSetupInfo', { responseInfo: true })
		console.log(res)
		let { status, data } = res.data
		if (status && data['pass_auth_setup']) {
			next({ name: 'FeedCenter' })
			return false
		} else {
			return true
		}
	} catch (err) {
		console.log(err)
		store.commit('setLoadingError', 500)
		return true
	}
}