export default function ({ next, router , store }) {
	const email = store.getters['auth/getForgetPasswordEmail']
	if ( !email ) {
		next({ name : 'ForgetPassword'})
		return false
	}
	return true
}
