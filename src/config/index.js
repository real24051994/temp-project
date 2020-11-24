module.exports = {
    "publish": {
		"public_path" : "/socialpublish/",
        "provide_plugin": {
            '$': 'jquery',
            'jquery': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'global.jquery': 'jquery',
            'global.jQuery': 'jquery',
            'global.$': 'jquery',
            'moment': 'moment',
            'timezone': 'moment-timezone',
            '_': 'lodash'
		},
		"status_code" : function (status) {
			return status >= 200 && status < 500 && status != 404;
		},
    },
    "shop": {
		"public_path" : "/socialshop/",
        "provide_plugin": {
            '$': 'jquery',
            'jquery': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'global.jquery': 'jquery',
            'global.jQuery': 'jquery',
            'global.$': 'jquery',
            'moment': 'moment',
            '_': 'lodash'
		},
		"status_code" : function (status) {
			return status >= 200 && status < 500 && status != 404;
		},
    },
    "widget": {
		"public_path" : "/socialwidget/",
        "provide_plugin": {
            '$': 'jquery',
            'jquery': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'global.jquery': 'jquery',
            'global.jQuery': 'jquery',
            'global.$': 'jquery',
            'moment': 'moment',
            '_': 'lodash'
		},
		"status_code" : function (status) {
			return status >= 200 && status < 500 && status != 404;
		},
    },
    "reply": {
		"public_path" : "/socialreply/",
        "provide_plugin": {
            '$': 'jquery',
            'jquery': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'global.jquery': 'jquery',
            'global.jQuery': 'jquery',
            'global.$': 'jquery'
		},
		"status_code" : function (status) {
			return status === 200 || status === 401
		},
	},
	"head": {
		"public_path" : "/",
        "provide_plugin": {
            '$': 'jquery',
            'jquery': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'global.jquery': 'jquery',
            'global.jQuery': 'jquery',
            'global.$': 'jquery'
		},
		"status_code" : function (status) {
			return status >= 200 && status < 500 && status != 404;
		},
    }
}