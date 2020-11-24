export default async function({ next, router , store , to}){
	let token = store.getters['auth/getToken']
	if( token ){
		var user = store.getters['auth/getUser']
		if( !user ){
			try {
				let res = await store.dispatch('auth/fetchUserInfo')
				let { status = false , data ='' } = res 
				if( status ){
					user = data
				}else{
					user = null
				}
			} catch (err) {
				store.commit('setLoadingError' , 500)
				return true
			}
		}
		if( user ){
			return true 
		}
	}
	store.commit('setLoadingError' , false)
	next({ name: 'Login' })
	return false
}
