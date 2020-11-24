export default function ({ next, router , store }) {
	if (store.getters['auth/getInstalled']) {
		next({ name : 'Gallery'})
		return false
	}
	return true
}