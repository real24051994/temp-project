import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import doc from '@/document/router.js'
const emptyFn = () => { }
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onComplete = emptyFn, onAbort = emptyFn) {
	return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)
const router = new Router({
	mode: 'history',
	base: process.env.NODE_ENV === 'production' ? `social${process.env.VUE_APP_NAME}` : '/'
})
if (process.env.NODE_ENV == 'development') {
	router.addRoutes(doc)
}

router.beforeEach(async (to, from, next) => {
	store.commit('setRouterLoading', true)
	if (to.meta.middleware) {
		const middleware = to.meta.middleware
		const context = { next, from, to, router, store }
		var preventNext = false
		for (let i = 0; i < middleware.length; i++) {
			const result = await middleware[i](context)
			if (!result) {
				preventNext = true
				break
			}
		}
	}
	return next(store.commit('setRouterLoading', false))
})

export default router