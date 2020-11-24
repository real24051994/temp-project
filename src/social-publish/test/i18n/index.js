import router from '@/router'
router.addRoutes([
	{
		path: '/test/i18n',
		name: 'TestI18n',
		meta: {
			layout: 'none'
		},
		component: () => import( /* webpackChunkName: "Test" */ '@publish/test/i18n/index.vue')
	}
])