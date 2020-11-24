import auth from '@shop/middlewares/auth'
import register from '@shop/middlewares/register'
import upgrade from '@shop/middlewares/upgrade'
import install from '@shop/middlewares/install'

export default [
  {
    path: '/product-sources',
    component: () => import(/* webpackChunkName: "import" */ './views/layout.vue'),
    children: [
      {
        path: '',
        name: 'ProductSources',
        meta: {
          layout: 'shop',
          middleware: [auth, install, upgrade, register],
        },
        component: () => import(/* webpackChunkName: "import" */ './views/index.vue'),
      },
    ],
  },
]
