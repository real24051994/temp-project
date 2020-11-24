import auth from '@widget/middlewares/auth'
import autoLogin from '@widget/middlewares/autoLogin'
export default [{
	path: '/',
	component: () =>import( /* webpackChunkName: "dashboard" */ './views/layout.vue'),
	children: [
		{
			path: '',
			name: 'Dashboard',
			meta: {
				middleware: [autoLogin, auth]
			},
			component: () =>
				import( /* webpackChunkName: "dashboard" */ './views/index.vue')
		},
	]
},]