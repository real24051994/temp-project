import Vue from 'vue'
import '@/plugins'
import '@publish/components'
import './filter'
import './icons'
import helper from './helper.js'
Vue.prototype.$PublishHelper = helper


import { VLazyImagePlugin } from "v-lazy-image";
Vue.use(VLazyImagePlugin);

import vuePositionSticky from 'vue-position-sticky'
Vue.use(vuePositionSticky)

moment.updateLocale('en', {
    week: {
        dow: 1,
    }
});

import { directive as onClickaway } from 'vue-clickaway';
Vue.directive('clickaway', onClickaway)

Array.prototype.first = function() { return _.head(this) }
Array.prototype.last = function() { return _.last(this) }



