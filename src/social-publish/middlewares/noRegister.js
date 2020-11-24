export default async function ({ next, router , store }) {
	if (store.getters['auth/getInstalled']) {
		next({ name : 'Dashboard'})
		return false
	}
	try {
		let res = await store.dispatch('account/list')
		let { status = false  , data = [] } = res.data 
		if( status && data.length ){
			store.dispatch('auth/updateOnboarding', { type  : 'install_app'})
			store.commit('auth/setRegister' , true)
			next({ name : 'Dashboard'})
			return false
		}else{
			return true
		}
	} catch (err) {
		return true
	}
}
