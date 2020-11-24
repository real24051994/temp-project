import router from '@/router'
import auth from '@widget/middlewares/auth'
import install from '@widget/middlewares/install'
import noInstall from '@widget/middlewares/noInstall'
import autoLogin from '@widget/middlewares/autoLogin'
import register from '@widget/middlewares/register'
import noAuth from '@widget/middlewares/noAuth'
import noRegister from '@widget/middlewares/noRegister'
const moduleRouter =  [
	{
		path: '/',
		component: () =>
        import ( /* webpackChunkName: "gallery" */ '@widget/modules/gallery/views/layout.vue'),
		children: [{
				path: '',
				name: 'Gallery',
				meta: {
					middleware: [ autoLogin , auth , install , register]
				},
				component: () =>
					import ( /* webpackChunkName: "gallery" */ '@widget/modules/gallery/views/index.vue')
			},
			{
				path: 'gallery/:id',
				name: 'GalleryDetail',
				meta: {
					middleware: [auth , install , register]
				},
				component: () =>
					import ( /* webpackChunkName: "gallery" */ '@widget/modules/gallery/views/gallery-detail.vue')
			},
		]
	},
	{
		path: '/widget',
		component: () =>import( /* webpackChunkName: "widget" */ '@widget/modules/widget/views/layout.vue'),
		children: [
			{
				path: '',
				name: 'Widget',
				meta: {
					middleware: [auth , install , register]
				},
				component: () => import( /* webpackChunkName: "widget" */ '@widget/modules/widget/views/index.vue')
			},
			{
				path: 'create',
				name: 'CreateWidget',
				meta: {
					middleware: [auth , install , register]
				},
				component: () => import( /* webpackChunkName: "widget" */ '@widget/modules/widget/views/create.vue')
			},
			{
				path: ':id',
				name: 'WigetDetail',
				meta: {
					middleware: [auth , install , register]
				},
				component: () => import( /* webpackChunkName: "widget" */ '@widget/modules/widget/views/update.vue')
			},
		]
	},
	{
		path: '/install',
		name: 'Install',
		meta: {
			layout : 'no-sidebar',
			middleware : [ auth , noInstall ]
		},
		component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/install.vue')
	},
	{
		path: '/auth',
		name: 'Auth',
		meta: {
			layout : 'none',
		},
		component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/index.vue'),
	},
	{
		path:'/auth/success',
		name: 'AuthSuccess',
		meta: {
			layout : 'none',
			middleware : [  ]
		},
		component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/success.vue')
	},
	{
		path: '/auth',
		component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/layout.vue'),
		meta : {
			
		},
		children : [
			{
				path: 'login',
				name: 'Login',
				meta: {
					layout : 'auth',
					middleware : [ noAuth ]
				},
				component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/login.vue')
			},
			{
				path: 'register',
				name: 'Register',
				meta: {
					layout : 'no-sidebar',
					middleware : [ auth , install , noRegister ]
				},
				component: () => import( /* webpackChunkName: "auth" */ '@widget/modules/auth/views/register.vue')
			},
		]
	},
	{
		path: '/maintenance',
		name: 'Maintaince',
		meta: {
			layout: 'none'
		},
		component: () => import( /* webpackChunkName: "maintaince" */ '@widget/modules/maintaince/views/index.vue')
	},
	{
		path: '*',
		name: '404',
		meta: {
			layout: 'error'
		},
		component: () => import( /* webpackChunkName: "error" */ '@widget/modules/error/views/error_404.vue')
	}
]
router.addRoutes(moduleRouter)