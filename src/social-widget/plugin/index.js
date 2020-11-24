import Vue from 'vue'
import '@/plugins'
import '@widget/components'
import './filter'
import './mixin'
import './icons'
import helper from './helper.js'

Vue.prototype.$WidgetHelper = helper

import { VLazyImagePlugin } from "v-lazy-image";

Vue.use(VLazyImagePlugin);

import '@widget/assets/vendor/fancybox/jquery.fancybox.css'
import '@widget/assets/vendor/fancybox/jquery.fancybox.js'

import vuePositionSticky from 'vue-position-sticky'
Vue.use(vuePositionSticky)

Array.prototype.first = function() { return _.head(this) }
Array.prototype.last = function() { return _.last(this) }

