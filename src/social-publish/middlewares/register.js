export default async function({ next , router , store , to}){
	if( !store.getters['auth/getInstalled'] ){
		try {
			let res = await store.dispatch('account/list')
			let { status = false  , data = [] } = res.data 
			if( status && data.length ){
				store.dispatch('auth/updateOnboarding', { type  : 'install_app'})
				store.commit('auth/setRegister' , true)
				return true
			}else{
				next({ name: 'Register' })
				return false
			}
		} catch (err) {
			next({ name: 'Register' })
			return false
		}
	}
	return true 
}
