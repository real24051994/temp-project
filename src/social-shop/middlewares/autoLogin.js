export default async ({ next, router , store , to})=> {
	if(to.query){
		if( to.query.hasOwnProperty('hmac')  && to.query.hasOwnProperty('timestamp') && to.query.hasOwnProperty('shop')){
			var shop = to.query.shop 
			if( shop ){ 
				let pattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+myshopify.com$/g
				if( pattern.test(String(shop).toLowerCase())){
					var shopname = shop.replace(/.myshopify.com/gi, "")
					try {
						let install =  await store.dispatch('auth/shopifyLogin' ,{ shop : shopname})
						if( install ){
							// console.log(install)
							let { status , data } = install.data
							if( status ){
								window.location.href = data 
								return false
							}
						}
					} catch (e) {
						
					}
				}
			}
		}
	}
	return true
}