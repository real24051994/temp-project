export default async function({ next, router , store , to}){
	let user = store.getters['auth/getUser']
	if( user ){
		if( user['is_install']  == true ){
			next({ name: 'FeedCenter' })
			return false 
		}
	}
	return true
}