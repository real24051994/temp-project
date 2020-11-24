export default function ({ next, router , store }) {
	if (store.getters['auth/getToken']) {
		next({ name : 'Dashboard'})
		return false
	}
	return true
}
