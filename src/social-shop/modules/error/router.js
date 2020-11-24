export default [
	{
		path: '*',
		name: '404',
		meta: {
			layout: 'error'
		},
		component: () => import( /* webpackChunkName: "error" */ './views/error_404.vue')
	}
]