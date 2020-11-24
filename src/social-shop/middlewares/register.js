export default async function({ next, router, store, to }) {
	var  register_onboard = store.getters['auth/getRegisterOnboard']
	if( register_onboard == null  ){
		try {
			const res = await store.dispatch('auth/getAuthSetupInfo', { responseInfo: true })
			let { status, data } = res.data
			if (status && data) {
				let { pass_auth_setup = false } = data 
				register_onboard = pass_auth_setup
			}
		} catch (error) {
			console.log(error);
			store.commit('setLoadingError', 500)
			return false
		}
	}
	if( register_onboard ){
		return true
	}else{
		next({ name: 'OnboardRegister' })
		return false
	}
}
