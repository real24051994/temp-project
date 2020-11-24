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
const startProgress = function() {
	if( typeof NProgress  == 'object' ){
		if( NProgress.status == null  ){
			NProgress.start()
		}
	}
}
const doneProgress = function() {
	if( typeof NProgress  == 'object' ){
		if( NProgress.status != null  ){
			NProgress.done()
		}
	}
}
router.beforeEach(async (to, from, next) => {
	startProgress()
	if (process.env.VUE_APP_MAINTAINCE == 1 && !store.getters.getMaintaincePageAllowed) {
		if (to.name == 'Maintaince') {
			doneProgress()
			return next(store.commit('setRouterLoading', false))
		} else {
			return next({ name: 'Maintaince' })
		}
	} else {
		if (to.name == 'Maintaince') {
			return next('/')
		}
	}

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
		if (preventNext) {
			doneProgress()
			return
		}
	}
	doneProgress()
	return next(store.commit('setRouterLoading', false))
})

export default router