import auth from '@shop/middlewares/auth'
import notAuth from './middlewares/notAuth'
import upgrade from '@shop/middlewares/upgrade'
import notRegister from './middlewares/notRegister'
import install from '@shop/middlewares/install'

export default [
  {
    path: '/auth',
    name: 'Auth',
    meta: {
      layout: 'none',
    },
    component: () => import(/* webpackChunkName: "auth" */ './views/index.vue'),
  },
  {
    path: '/auth/upgrade',
    name: 'Upgrade',
    meta: {
      layout: 'upgrade',
      middleware: [auth],
    },
    component: () => import(/* webpackChunkName: "upgrade" */ './views/notification-upgrade.vue'),
  },
  {
    path: '/auth',
    component: () => import(/* webpackChunkName: "auth" */ './views/layout.vue'),
    meta: {},
    children: [
      {
        path: 'login',
        name: 'Login',
        meta: {
          layout: 'auth',
          middleware: [notAuth],
        },
        component: () => import(/* webpackChunkName: "auth" */ './views/login.vue'),
      },

      {
        path: 'setup',
        name: 'OnboardRegister',
        meta: {
          layout: 'onboard',
          middleware: [auth, install, upgrade, notRegister],
        },
        component: () => import(/* webpackChunkName: "auth" */ './views/onboarding.vue'),
      },
    ],
  },
]
