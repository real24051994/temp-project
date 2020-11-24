import router from '@/router'
import auth from '@publish/middlewares/auth'
import autoLogin from '@publish/middlewares/autoLogin'
import noAuth from '@publish/middlewares/noAuth'
import install from '@publish/middlewares/install'
import noInstall from '@publish/middlewares/noInstall'
import register from '@publish/middlewares/register'
import noRegister from '@publish/middlewares/noRegister'

const moduleRouter = [
	{
		path: '/',
		component: () => import( /* webpackChunkName: "dashboard" */ '@publish/modules/dashboard/views/layout.vue'),
		children : [
			{
				path: '',
				name: 'Dashboard',
				meta: {
					middleware : [autoLogin , auth , install , register]
				},
				component: () => import( /* webpackChunkName: "dashboard" */ '@publish/modules/dashboard/views/index.vue')
			},
		]
	},
	{
		path: '/install',
		name: 'Install',
		meta: {
			layout : 'no-sidebar',
			middleware : [ auth , noInstall]
		},
		component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/install.vue')
	},
	{
		path: '/register',
		name: 'Register',
		meta: {
			layout : 'no-sidebar',
			middleware : [ auth , install , noRegister ]
		},
		component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/register.vue')
	},
	{
		path: '/auth',
		name: 'Auth',
		meta: {
			layout : 'none',
		},
		component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/index.vue'),
	},
	{
		path: '/auth',
		component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/layout.vue'),
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
				component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/login.vue')
			},
			{
				path: 'success',
				name: 'Autoclose',
				meta: {
					layout : 'none',
					middleware : [  ]
				},
				component: () => import( /* webpackChunkName: "auth" */ '@publish/modules/auth/views/success.vue')
			},
		]
	},
	{
		path: '/post-center',
		component: () => import( /* webpackChunkName: "post" */ '@publish/modules/post/views/layout.vue'),
		children : [
			{
				path: '',
				name: 'ManagePost',
				meta: {
					middleware : [auth , install, register ]
				},
				component: () => import( /* webpackChunkName: "post" */ '@publish/modules/post/views/index.vue')
			},
		],
	},
	{
		path: '/calendar',
		name: 'Calendar',
		meta: {
			middleware : [auth , install , register ]
		},
		component: () => import( /* webpackChunkName: "post" */ '@publish/modules/post/views/calendar.vue')
	},
	{
		path: '/manage-account',
		component: () => import( /* webpackChunkName: "account" */ '@publish/modules/account/views/layout.vue'),
		meta : {
	
		},
		children : [
			{
				path: '',
				name: 'ManageAccount',
				meta: {
					middleware : [ auth ,install , register]
				},
				component: () => import( /* webpackChunkName: "account" */ '@publish/modules/account/views/index.vue')
			},
		]
	},
	{
		path: '/autopilot',
		component: () => import( /* webpackChunkName: "autopilot" */ '@publish/modules/autopilot/views/layout.vue'),
		children : [
			{
				path: '',
				name: 'Autopilot',
				meta: {
					middleware : [auth, install ,register]
				},
				component: () => import( /* webpackChunkName: "autopilot" */ '@publish/modules/autopilot/views/index.vue')
			},
			{
				path: 'create',
				name: 'CreateAutopilot',
				meta: {
					middleware : [auth, install ,register]
				},
				component: () => import( /* webpackChunkName: "autopilot" */ '@publish/modules/autopilot/views/create.vue')
			},
			{
				path: ':id',
				name: 'UpdateAutopilot',
				meta: {
					middleware :[auth, install ,register]
				},
				component: () => import( /* webpackChunkName: "autopilot" */ '@publish/modules/autopilot/views/update.vue')
			},
		]
	},
	{
		path: '/settings',
		component: () => import( /* webpackChunkName: "setting" */ '@publish/modules/setting/views/layout.vue'),
		children : [
			{
				path: '',
				name: 'Setting',
				meta: {
					middleware : [auth , install, register]
				},
				component: () => import( /* webpackChunkName: "setting" */ '@publish/modules/setting/views/index.vue')
			},
			{
				path: 'integrate',
				name: 'Integrate',
				meta: {
					middleware : [auth ,install, register]
				},
				component: () => import( /* webpackChunkName: "setting" */ '@publish/modules/setting/views/integrate.vue')
			},
		]
	},
	{
		path: '/pricing',
		name : 'Pricing',
		component: () => import( /* webpackChunkName: "pricing" */ '@publish/modules/pricing/views/index.vue'),
		meta :{
			middleware : [auth , install]
		}
	},
	{
		path: '/charge-success',
		name : 'ChargeSuccess',
		component: () => import( /* webpackChunkName: "pricing" */ '@publish/modules/pricing/views/charge-success.vue'),
		meta :{
			middleware : [auth , install]
		}
	},
	{
		path: '/maintenance',
		name: 'Maintaince',
		meta: {
			layout: 'none'
		},
		component: () => import( /* webpackChunkName: "maintaince" */ '@publish/modules/maintaince/views/index.vue')
	},
	{
		path: '/utils',
		component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/layout.vue'),
		children : [
			{
				path: 'discount-templates',
				meta: {
					middleware : [auth , register]
				},
				component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/layout.vue'),
				children :[
					{
						path: '',
						name: 'DiscountTemplate',
						meta: {
							middleware : [auth , register]
						},
						component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/discount/index.vue')
					},
					{
						path: 'create',
						name: 'CreateDiscountTemplate',
						meta: {
							middleware : [auth , register]
						},
						component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/discount/create.vue')
					},
				]
			},
			{
				path: 'autopilot-templates',
				meta: {
					middleware : [auth , register]
				},
				component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/layout.vue'),
				children :[
					{
						path: '',
						name: 'Autopilottemplate',
						meta: {
							middleware : [auth , register]
						},
						component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/autopilot/index.vue')
					},
					{
						path: 'create',
						name: 'CreateAutopilotTemplate',
						meta: {
							middleware : [auth , register]
						},
						component: () => import( /* webpackChunkName: "utils" */ '@publish/modules/utils/views/autopilot/create.vue')
					},
				]
			},
		]
	},
	{
		path: '*',
		name: '404',
		meta: {
			layout: 'error'
		},
		component: () => import( /* webpackChunkName: "error" */ '@publish/modules/error/views/error_404.vue')
	}
]
router.addRoutes(moduleRouter)