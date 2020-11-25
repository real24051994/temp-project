import Vue from 'vue'
import helper from './helper'
import './mixins'
import './filter'
import './components'
import axios from '@/plugins/axios'
Vue.prototype.$helper = helper

Vue.prototype.$clone = function(source) {
    return JSON.parse(JSON.stringify(source));
}
Vue.prototype.$axios = axios

const EventBus = new Vue()
Vue.prototype.$eventBus = EventBus