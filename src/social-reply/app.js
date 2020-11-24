import Vue from 'vue'
import App from '@/layouts/App.vue'
import { sync } from 'vuex-router-sync'
import store from '@/store'
import router from '@/router'
import i18n from '@/i18n'
import './utils/plugin'
import '@/styles/less/style.less'
import '@/styles/scss/style.scss'

import './assets/scss/index.scss'
import './store'
import './modules'
import './router'

Vue.config.productionTip = false

sync(store, router, { moduleName: 'router' })

const app = new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

export { app, store, router, i18n }
