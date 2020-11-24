import auth from '@shop/middlewares/auth'
import register from '@shop/middlewares/register'
import autoLogin from '@shop/middlewares/autoLogin'
import upgrade from '@shop/middlewares/upgrade'
import checkMapping from '@shop/middlewares/checkMapping'
import install from '@shop/middlewares/install'
import noInstall from '@shop/middlewares/noInstall'

export default [
    {
        path: '/',
        meta: {
            layout: 'shop',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ './views/layout.vue'),
        children: [
            {
                path: '',
                name: 'FeedCenter',
                meta: {
                    layout: 'shop',
                    middleware: [autoLogin, auth, install, upgrade, register],
                },
                component: () => import(/* webpackChunkName: "dashboard" */ './views/index.vue'),
            },
            {
                path: 'create-feed',
                name: 'CreateFeed',
                props: true,
                meta: {
                    layout: 'shop',
                    middleware: [auth, install, upgrade, register],
                },
                component: () => import(/* webpackChunkName: "dashboard" */ './views/create.vue'),
            },
            {
                path: 'feed/:id',
                props: true,
                component: () => import(/* webpackChunkName: "dashboard" */ './views/detail.vue'),
                children: [
                    {
                        path: '',
                        name: 'FeedDetail',
                        meta: {
                            middleware: [auth, install, upgrade, register],
                            layout: 'shop',
                        },
                        component: () => import(/* webpackChunkName: "dashboard" */ './views/detail-feed-product.vue'),
                    },
                    {
                        path: 'mapping',
                        name: 'FeedDetailMapping',
                        meta: {
                            middleware: [auth, install, upgrade, register],
                            layout: 'shop',
                        },
                        component: () => import(/* webpackChunkName: "dashboard" */ './views/detail-feed-mapping.vue'),
                    },
                    {
                        path: 'category',
                        name: 'FeedDetailCategory',
                        meta: {
                            middleware: [auth, install, upgrade, register],
                            layout: 'shop',
                        },
                        component: () => import(/* webpackChunkName: "dashboard" */ './views/detail-feed-category.vue'),
                    }
                ],
            },
            {
                path: 'install',
                name: 'InstallApps',
                meta: {
                    layout: 'no-sidebar',
                    middleware: [auth , noInstall],
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../auth/views/install.vue'),
            },
            {
                path: 'feed/google/welcome',
                name: 'CheckMapping',
                meta: {
                    layout: 'light',
                    middleware: [auth, install, upgrade, register],
                },
                component: () => import(/* webpackChunkName: "dashboard" */ './views/check-mapping.vue'),
            }
        ],
    },
]
