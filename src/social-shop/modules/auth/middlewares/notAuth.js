export default function ({ next, router , store }) {
	if (store.getters['auth/getToken']) {
		next({ name : 'FeedCenter'})
		return false
	}
	return true
}
