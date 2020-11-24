import cookie from "js-cookie";
import { default as instance } from "axios";
import store from "@/store";
import config from '@/config/index'
const token_name = process.env.VUE_APP_TOKEN_NAME;
const app_name = process.env.VUE_APP_NAME
const app_api = {
	publish : process.env.VUE_APP_PUBLISH_API,
	shop : process.env.VUE_APP_SHOP_API,
	reply : process.env.VUE_APP_REPLY_API,
	widget : process.env.VUE_APP_WIDGET_API
}
const baseURL = app_api[app_name]
let status_code_allowed = config[app_name].status_code 
let AxiosConfig = {
	baseURL: baseURL,
	timeout: 60 * 1000,
	validateStatus: status_code_allowed || function (status) {
		return status >= 200 && status < 500;
	},
};

let axios = instance.create(AxiosConfig);
axios.CancelToken = instance.CancelToken;
axios.isCancel = instance.isCancel;
axios.interceptors.request.use(function (config) {
	let token = cookie.get(token_name);
	if (token) {
		config.headers["Authorization"] = config.headers["Authorization"] || token;
	}
	let lang = cookie.get("se_lang");
	config.headers["Language"] = lang ? lang : "en";
	return config;
});
axios.interceptors.response.use(
	function (res) {
		let { status } = res;
		if (status === 401) {
			store.dispatch("auth/logout");
			return res;
		}
		return res;
	},
	function (error) {
		return Promise.reject(error);
	}
);
// if (app_id === "social_reply") {
	
// } else {
// 	axios.interceptors.response.use(
// 		function (res) {
// 			let { status } = res;
// 			if (status == 401) {
// 				store.dispatch("auth/logout");
// 			}
// 			return res;
// 		},
// 		function (error) {
// 			return Promise.reject(error);
// 		}
// 	);
// }

export default axios;
