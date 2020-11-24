export default async function({ next, router , store , to}){
	/* check token from store */
	let token = store.getters['auth/getToken']
	if( token ){
		/* get user from store */
		var user = store.getters['auth/getUser']
		if( !user ){
			/* if user not found => fetch data for user info */
			try {
				let res = await store.dispatch('auth/getUser')
				let { status , data ='' } = res.data 
				if( status ){
					user = data
				}else{
					store.commit('auth/logout')
					next({ name: 'Login' })
					return false
				}
			} catch (err) {
				store.commit('setLoadingError' , 500)
				return false
			}
			
		}
		if( user ){
			return true
		}
	}
	/* finally if return login page for all false conditions */
	store.commit('setLoadingError' , false)
	next({ name: 'Login' })
	return false
}
