import { mapActions } from 'vuex'
export default {
	methods: {
		...mapActions({
			getMetaFromUrl : 'utils/getMetaFromUrl',
		}),
		handleGetWebsiteMeta(url){
			return new Promise((resolve, reject)=>{
				var result = {
					facebook :{
						hostname : '',
						title : '',
						url : '',
						image : '',
						description : ''
					},
					twitter : {
						hostname: '',
						title : '',
						url : '',
						image : '',
						description : ''
					}
				}
				this.getMetaFromUrl({ url : url  }).then((res)=>{
					let { status = false , data = [] } = res.data 
					if( status && data.length ){
						var facebook = data.filter((item)=>{
							return item.property.indexOf('og:') >= 0
						})
						if( facebook.length ){
							let url = _.find(facebook , {  property : 'og:url'})
							if( url ){
								result.facebook.url = url.value
							}
							let title = _.find(facebook , {  property : 'og:title'})
							if( title ){
								result.facebook.title = title.value
							}
							let description = _.find(facebook , {  property : 'og:description'})
							if( description ){
								result.facebook.description = description.value
							}
							let images_facebook = facebook.filter((item)=>item.property == 'og:image').map(item=>item.value)
							result.facebook.image = images_facebook
						}
						var twitter = data.filter((item)=>{
							return item.name.indexOf('twitter:') >= 0
						})
						if( twitter.length ){
							let url = _.find(twitter , {  name : 'twitter:url'})
							if( url ){
								result.twitter.url = url.value
							}
							let title = _.find(twitter , {  name : 'twitter:title'})
							if( title ){
								result.twitter.title = title.value
							}
							let description = _.find(twitter , {  name : 'twitter:description'})
							if( description ){
								result.twitter.description = description.value
							}
							let  image = _.find(twitter , {  name : 'twitter:image'})
							if( image ){
								result.twitter.image = image.value
							}
						}else if( facebook.length ){
							result.twitter.url = result.facebook.url
							result.twitter.title = result.facebook.title
							result.twitter.description = result.facebook.description
							result.twitter.image = result.facebook.image.length ? result.facebook.image[0] : ''
						}
						var hostname = this.$PublishHelper.extractHostname(url)
						result.facebook.hostname = hostname
						result.twitter.hostname = hostname
						resolve(result)
					}else{
						reject(result)
					}
				}).catch((err)=>{
					reject(result)
				})
			});
		},
			
		isPostProduct(form){
			return form.post_type == 'product' && typeof form.product == 'object' && form.product.hasOwnProperty('id')
		},
		isPostLink(form , validate){
			return form.post_type == 'link' && form.url.trim() != ''
		},
		isPostImage(form){
			return form.post_type == 'image' && form.images.length
		},
	},
}