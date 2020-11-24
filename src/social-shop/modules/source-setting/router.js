import auth from '@shop/middlewares/auth'
import register from '@shop/middlewares/register'
import upgrade from '@shop/middlewares/upgrade'
import install from '@shop/middlewares/install'

export default [
	{
		path: '/sources-setting',
		component: () => import(/* webpackChunkName: "source" */ './views/index.vue'),
		children: [
			{
				path: '',
				name: 'SourceSetting',
				meta: {
					layout: 'shop',
					middleware: [auth, install, upgrade, register],
				},
				component: () => import(/* webpackChunkName: "source" */ './views/form-source-setting.vue'),
			},
			{
				path: 'mapping',
				name: 'SourceMapping',
				meta: {
					layout: 'shop',
					middleware: [auth, install, upgrade, register],
				},
				component: () => import(/* webpackChunkName: "source" */ './views/form-source-mapping.vue'),
			},
		],
	},
]
