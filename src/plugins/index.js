import Vue from 'vue'
import helper from './helper'
import './mixins'
import './filter'
import './directives'
import './components'
import axios from '@/plugins/axios'
import Intercom from './intercom'
import Userpilot from './userpilot'
import Crisp from './crisp'
Vue.prototype.$helper = helper

Vue.prototype.$clone = function(source) {
    return JSON.parse(JSON.stringify(source));
}
Vue.prototype.$axios = axios

const EventBus = new Vue()
Vue.prototype.$eventBus = EventBus

Vue.prototype.$intercom = new Intercom({
    app_id: 'nfna3d4g',
})

Vue.prototype.$userpilot = new Userpilot()

Vue.prototype.$crisp = new Crisp()