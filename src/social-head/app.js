import Vue from 'vue'
import App from '@/layouts/App.vue'
import { sync } from 'vuex-router-sync'
import store from '@/store'
import router from '@/router'
import i18n from '@/i18n'
import './plugin'
import '@/styles/less/style.less'
import '@/styles/scss/style.scss'
import './styles/index.scss'
import './store'
import './router'
import './modules'

Vue.config.productionTip = false

sync(store, router, { moduleName: 'router' } )

const app = new Vue({
    store,
    router,
	i18n,
    render: h => h(App)
}).$mount('#app')

export  { app , store , router , i18n  }
