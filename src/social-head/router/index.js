import router from '@/router'
import auth from '@head/middlewares/auth'
const moduleRouter =  [
	{
		path: '/',
		component: () =>
        import ( /* webpackChunkName: "dashboard" */ '../modules/dashboard/views/layout.vue'),
		children: [{
				path: '',
				name: 'Dashboard',
				meta: {
					middleware: [ auth ]
				},
				component: () =>
					import ( /* webpackChunkName: "dashboard" */ '../modules/dashboard/views/index.vue')
			}
		]
	},
	{
		path: '*',
		name: '404',
		meta: {
			layout: 'error'
		},
		component: () => import( /* webpackChunkName: "error" */ '../modules/error/views/error_404.vue')
	}
]
router.addRoutes(moduleRouter)