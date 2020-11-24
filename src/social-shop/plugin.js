import Vue from 'vue'
import '@/plugins'
import '@shop/components'
import helper from './helper.js'
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)
Vue.prototype.$ShopHelper = helper

import { directive as onClickaway } from 'vue-clickaway'
Vue.directive('clickaway', onClickaway)
Array.prototype.first = function() {
  return _.head(this)
}
import '@/assets/vendor/tooltipster/tooltipster.bundle.js'
Vue.directive('tooltip', {
  bind: function(el, binding, vnode) {
    var defaults = {
      side: 'top',
      contentAsHTML: false,
      zIndex: 9999999,
      delay: 0,
      theme: 'default',
    }
    var options = Object.assign(defaults, binding.value)
    $(el).tooltipster(options)
  },
  update: function(el, binding, vnode) {
    var defaults = {
      side: 'top',
      contentAsHTML: false,
      zIndex: 9999999,
      delay: 0,
      theme: 'default',
    }
    var options = Object.assign(defaults, binding.value)
    $(el).tooltipster(options)
  },
  unbind: function(el, binding, vnode) {
    $(el).tooltipster('destroy')
  },
})

import { Collapse } from 'ant-design-vue'
var AntComponents = [Collapse]
AntComponents.forEach((item) => {
  Vue.use(item)
})
import userpilot from './utils/userpilot'
Vue.prototype.$userpilot = new userpilot()

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('sh-icon', FontAwesomeIcon)

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTag as farTag,
  faBox as farBox,
  faPlus as farPlus,
  faEllipsisH as farEllipsisH,
  faExclamationTriangle as farExclamationTriangle,
  faChevronLeft as farChevronLeft,
  faQuestionCircle as farQuestionCircle,
  faSignOutAlt as farSignOutAlt,
  faBookmark as farBookmark,
  faExclamationCircle as farExclamationCircle,
  faLongArrowAltRight as farLongArrowAltRight,
  faLongArrowAltLeft as farLongArrowAltLeft,
  faClipboardList as farClipboardList,
  faAngleRight as farAngleRight,
  faAngleUp as farAngleUp,
  faAngleDown as farAngleDown,
  faColumns as farColumns,
  faTshirt as farTshirt,
  faGem as farGem,
  faFirstAid as farFirstAid,
  faHomeLg as farHomeLg,
  faAtomAlt as farAtomAlt,
  faBabyCarriage as farBabyCarriage,
  faCheck as farCheck,
  faPen as farPen,
  faSyncAlt as farSyncAlt
} from '@fortawesome/pro-regular-svg-icons'
import {
  faCircle as fasCircle,
  faExclamationCircle as fasExclamationCircle,
  faBox as fasBox,
  faInfoSquare as fasInfoSquare,
  faChevronDown as fasChevronDown,
  faCheck as fasCheck,
  faThLarge as fasThLarge,
  faThList as fasThList,
  faPalletAlt as  fasPalletAlt,
  faBoxCheck as  fasBoxCheck,
  faFilter as fasFilter
} from '@fortawesome/pro-solid-svg-icons'
import {
  faFileAlt as falFileAlt,
  faStar as falStar,
  faPlus as falPlus,
  faTimes as falTimes,
  faChevronDown as falChevronDown,
  faExclamationTriangle as falExclamationTriangle,
  faExclamationCircle as falExclamationCircle,
  faBox as falBox,
  faFilter as falFilter,
  faStore as falStore,
  faClipboardList as falClipboardList,
  faCopy as falCopy,
  faTrashAlt as falTrashAlt,
  faClock as falClock
} from '@fortawesome/pro-light-svg-icons'
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
var icons = [
  farTag,
  farBox,
  farPlus,
  farEllipsisH,
  fasCircle,
  fasExclamationCircle,
  farExclamationTriangle,
  farChevronLeft,
  fasBox,
  falFileAlt,
  faFacebookF,
  faGoogle,
  farQuestionCircle,
  fasInfoSquare,
  farSignOutAlt,
  fasChevronDown,
  falStar,
  fasCheck,
  farBookmark,
  farExclamationCircle,
  falPlus,
  falTimes,
  falChevronDown,
  farLongArrowAltRight,
  farLongArrowAltLeft,
  falExclamationTriangle,
  falExclamationCircle,
  falBox,
  farClipboardList,
  falFilter,
  farAngleRight,
  falStore,
  farAngleUp,
  farAngleDown,
  farColumns,
  farTshirt,
  farGem,
  farFirstAid,
  farHomeLg,
  farAtomAlt,
  farBabyCarriage,
  falCopy,
  fasThLarge,
  farCheck,
  farPen,
  falClipboardList,
  fasThList,
  fasPalletAlt,
  fasBoxCheck,
  falTrashAlt,
  falClock,
  farSyncAlt,
  fasFilter
]
for (let index = 0; index < icons.length; index++) {
  library.add(icons[index])
}
