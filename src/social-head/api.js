import axios from '@/plugins/axios'
const  endpoint = {
	social_publish : process.env.VUE_APP_PUBLISH_API,
	social_shop : process.env.VUE_APP_SHOP_API,
	social_widget : process.env.VUE_APP_WIDGET_API,
	social_reply : process.env.VUE_APP_REPLY_API,
}
export default {
	getUser(){
		console.log('get user hanlde');
		return axios({
            url: `${process.env.VUE_APP_PUBLISH_API}/social_publish/check_install_app`,
            method: 'get',
        });
	},
	generalShopifyUrl({ app = 'social_publish' , shop = '' }) {
		var url = endpoint[app] + '/shopify/generate_url'
		console.log(url);
        return axios({
            url,
            method: 'post',
            data: { shop }
        });
    },
	
}