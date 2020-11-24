import Vue from 'vue'
import '@/plugins'
import '@head/components'
import './filter'
import './mixin'
import helper from './helper.js'

Vue.prototype.$SocialheadHelper = helper


Array.prototype.first = function() { return _.head(this) }
Array.prototype.last = function() { return _.last(this) }

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faSignOutAlt as farSignOutAlt,
	faLongArrowAltRight  as farLongArrowAltRight,
	faCheck  as farCheck,
} from "@fortawesome/pro-regular-svg-icons";

var icons = [
	farSignOutAlt,
	farLongArrowAltRight,
	farCheck,
]

for (let index = 0; index < icons.length; index++) {
    library.add(icons[index])
}

