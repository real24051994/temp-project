import { mapActions } from 'vuex'
import { extractUrls } from '@publish/assets/twitter-text'
export default {
	data(){
		return {
			is_loading : true, 
			cancel_request: null,
			covert_links : [],
			urls : []
		}
	},
	computed:{
		allowed_shorten_link(){
			let { 
				bit_ly_status = false,
				is_shorten_link = false,
				service_shorten_link = "",
			} = this.account.setting
			return is_shorten_link && ( (bit_ly_status && service_shorten_link =='bit_ly') || service_shorten_link =='social_head'  )
		},
		allowed_utm_link(){
			let {
				utm_status = false,
				utm_tag = ''
			} = this.account.setting
			return utm_status && utm_tag != ''
		},
	},
	methods:{
		...mapActions({
			createShortenLink : 'utils/createShortenLink'
		}),
		generalShortenLink(urls){
			return new Promise((resolve, reject)=>{
				if( this.allowCovertLink ){
					var content = this.message
					if (this.cancel_request) {
						this.cancel_request.cancel('Start new request, stop active request');
					}
					this.cancel_request = this.createAxiosCancelRequestToken()
					if( urls ){
						let origin_links = this.$clone(urls)
						let { utm_tag = ''} = this.account.setting 
						if( this.allowed_shorten_link  ){
							this.createShortenLink({ 
								url : origin_links,
								cancel_request_token : this.cancel_request.token
							})
							.then((res)=>{
								let { status =  false, data = []} = res.data 
								if( status && data.length ){
									let results = []
									data.forEach( (item, index) => {
										results.push({
											status : item.status,
											origin_link : origin_links[index],
											target_link : item.status == true  && item.data ? item.data : ''
										})
									})
									this.covert_links = results
								}
								resolve()
							})
							.catch((err)=>{
								resolve()
							})
						}else{
							this.covert_links = []
							resolve()
						}
					}else{
						this.covert_links = []
						resolve()
					}
				}else{
					resolve()
				}
				
			});
		},
		covertLink(message){
			this.covert_links.forEach((item)=>{
				if( item.status ){
					message = message.replace( item.origin_link , item.target_link)
				}
			})
			return message 
		}
	},
	watch :{
		message: _.debounce(function(value) {
			var urls = extractUrls(value)
			if( _.isEqual(this.urls, urls) == false ){
				this.urls = urls
				this.generalShortenLink(urls)
			}
		},1000)
		
	},
	async mounted(){
		this.urls =  extractUrls(this.message)
		if( this.urls.length ){
			try {
				this.generalShortenLink(this.urls)
			} catch (e) {
				console.log(e)
			}
		}
		this.is_loading = false
	}
}