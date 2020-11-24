export default async function({ next, router , store , to}){
	let token = store.getters['auth/getToken']
	console.log(token);
	if( token ){
		var user = store.getters['auth/getUser']
		console.log(user);
		if( !user ){
			try {
				console.log('dispath event');
				let res = await store.dispatch('auth/getUser')
				let { status , data ='' } = res.data 
				if( status ){
					user = data
				}else{
					store.commit('auth/logout')
				}
			} catch (err) {
				console.log(err);
				store.commit('setLoadingError' , 500)
				return true
			}
		}
	}else{
		store.commit('auth/logout')
	}
	store.commit('setLoadingError' , false)
	return true
}
