export default async function({ next, router , store , to}){
	if( store.getters['auth/getInstalled'] ){
		return true
	}else{
		next({ name: 'Register' })
		return false
	}
	
}