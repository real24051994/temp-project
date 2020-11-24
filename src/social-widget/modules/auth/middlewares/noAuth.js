export default function ({ next, router , store }) {
	if (store.getters['auth/getToken']) {
		next({ name : 'Gallery'})
		return false
	}
	return true
}