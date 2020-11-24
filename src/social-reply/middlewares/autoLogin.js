export default async ({ store, to }) => {
	if (to.query) {
		if (to.query.hasOwnProperty('hmac') && to.query.hasOwnProperty('timestamp') && to.query.hasOwnProperty('shop')) {
			let shop = to.query.shop
			if (shop) {
				let pattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+myshopify.com$/g
				if (pattern.test(String(shop).toLowerCase())) {
					const shopname = shop.replace(/.myshopify.com/gi, '')
					try {
						let install = await store.dispatch('auth/shopifyLogin', shopname)
						if (install) {
							let { status, data } = install
							if (status) {
								window.location.href = data
								return false
							}
						}
						// eslint-disable-next-line no-empty
					} catch (e) { }
				}
			}
		}
	}
	return true
}
