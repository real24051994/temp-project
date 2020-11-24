export default [
	{
		path: '/docs',
		component: () => import( /* webpackChunkName: "docs" */ './views/layout.vue'),
		children : [
			{
				path: 'button',
				name: 'DocButton',
				meta: {
					layout: 'none',
				},
				component: () => import( /* webpackChunkName: "docs" */ './views/button.vue')
			},
			{
				path: 'icon',
				name: 'DocIcon',
				meta: {
					layout: 'none',
				},
				component: () => import( /* webpackChunkName: "docs" */ './views/icon.vue')
			},
		]
	}
]