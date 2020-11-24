import "@/plugins";
import "@reply/components";
import "@reply/components/theme";
import "./mixins";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

import {
  faAngleLeft,
  faAngleRight,
  faArrowToBottom,
  faChevronDown,
  faChevronLeft,
  faCommentAltDots,
  faExclamationTriangle,
  faExternalLinkAlt,
  faEyeSlash,
  faImage,
  faInbox,
  faInfoSquare,
  faPlus,
  faSlidersH,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faBox,
  faBrowser,
  faCheck,
  faCheckCircle,
  faCircle,
  faCommentAlt,
  faCommentAltLines,
  faEnvelope,
  faEnvelopeOpenText,
  faExclamationCircle,
  faFilter,
  faHome,
  faKey,
  faLifeRing,
  faMapMarkerAlt,
  faPallet,
  faPhone,
  faPlusCircle,
  faPuzzlePiece,
  faSearch,
  faShoppingCart,
  faSignOutAlt,
  faSmile,
  faTag,
  faTrashAlt,
  faUser,
  faUserPlus,
  faUserSlash,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faFacebookF,
  faFacebookSquare,
  faIntercom,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";

import CoolLightBox from "vue-cool-lightbox";
//
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue from "vue";
import api from "./api";
import helper from "./helper";
import { library } from "@fortawesome/fontawesome-svg-core";
import linkify from "vue-linkify";
import userpilot from "./userpilot";

Vue.prototype.$helper = helper;
Vue.prototype.$api = api;

Vue.use(CoolLightBox);

Vue.directive("linkified", linkify);

Vue.prototype.$userpilot = new userpilot();

// Pro Solid
library.add(faExclamationTriangle);
library.add(faTimes);
library.add(faImage);
library.add(faExternalLinkAlt);
library.add(faArrowToBottom);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faChevronDown);
library.add(faSlidersH);
library.add(faPlus);
library.add(faInfoSquare);
library.add(faChevronLeft);
library.add(faInbox);
library.add(faEyeSlash);
library.add(faCommentAltDots);
library.add(faFilter);

// Pro Regular
library.add(faExclamationCircle);
library.add(faCommentAltLines);
library.add(faPuzzlePiece);
library.add(faUser);
library.add(faKey);
library.add(faLifeRing);
library.add(faSignOutAlt);
library.add(faCheck);
library.add(faSmile);
library.add(faTag);
library.add(faBrowser);
library.add(faHome);
library.add(faPallet);
library.add(faBox);
library.add(faShoppingCart);
library.add(faSearch);
library.add(faCommentAlt);
library.add(faEnvelopeOpenText);
library.add(faEnvelope);
library.add(faUserSlash);
library.add(faMapMarkerAlt);
library.add(faPhone);
library.add(faCheckCircle);
library.add(faCircle);
library.add(faPlusCircle);
library.add(faTrashAlt);
library.add(faUserPlus);

// Free Brands
library.add(faIntercom);
library.add(faFacebookSquare);
library.add(faTwitterSquare);
library.add(faFacebookF);

Vue.component("sh-icon", FontAwesomeIcon);
