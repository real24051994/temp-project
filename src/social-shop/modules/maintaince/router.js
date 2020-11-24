export default [
  {
    path: '/maintaince',
    name: 'Maintaince',
    meta: {
      layout: 'light',
    },
    component: () => import(/* webpackChunkName: "error" */ './views/index.vue'),
  },
]
