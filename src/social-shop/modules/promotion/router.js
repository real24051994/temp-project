
export default [
	{
		path: '/google-promotion',
		component: () => import( /* webpackChunkName: "dashboard" */ './views/layout.vue'),
		children : [
			{
				path: '',
				name: 'GooglePromotion',
				meta: {
					layout : 'shop',
				},
				component: () => import( /* webpackChunkName: "dashboard" */ './views/index.vue')
			},
		]
	}
]