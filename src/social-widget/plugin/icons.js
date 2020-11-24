import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faChevronLeft as fasChevronLeft,
    faChevronRight as fasChevronRight,
    faChevronDown as fasChevronDown,
    faChevronUp as fasChevronUp,
	faCaretDown as fasCaretDown,
	
} from "@fortawesome/pro-solid-svg-icons";
import {
    faSignOutAlt as farSignOutAlt,
	faChevronRight as farChevronRight,
	faChevronDown as farChevronDown,
	faEllipsisV as farEllipsisV,
	faEllipsisH as farEllipsisH,
	faDesktopAlt as farDesktopAlt,
	faMobileAndroidAlt as farMobileAndroidAlt,
	faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";

import { 
	faPlus as falPlus,
	faTrashAlt  as falTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { faInstagramSquare as fabInstagramSquare } from "@fortawesome/free-brands-svg-icons";
var iconSolid = [
	fasChevronLeft,
	fasChevronRight,
	fasChevronDown,
	fasChevronUp,
	fasCaretDown,
]
var iconRegular = [
	farSignOutAlt,
	farChevronRight,
	farChevronDown,
	farEllipsisV,
	farEllipsisH,
	farDesktopAlt,
	farMobileAndroidAlt,
	farStar
]
var iconLight = [
	falPlus,
	falTrashAlt,
]
var iconBrand = [
	fabInstagramSquare
]
var icons = [
	...iconSolid,
	...iconRegular,
	...iconLight,
	...iconLight,
]

for (let index = 0; index < icons.length; index++) {
    library.add(icons[index])
}
