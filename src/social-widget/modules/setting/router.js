import auth from '@widget/middlewares/auth'
import register from '@widget/middlewares/register'
export default [
	{
		path: '/settings',
		component: () => import( /* webpackChunkName: "gallery" */ './views/layout.vue'),
		children : [
			{
				path: '',
				name: 'Setting',
				meta: {
					middleware : [ auth , register]
				},
				component: () => import( /* webpackChunkName: "gallery" */ './views/index.vue')
			},
		]
	},
]