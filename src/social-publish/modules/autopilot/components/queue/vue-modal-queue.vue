<template>
	<div class="vue-modal-post" v-if="visible">
		<a-modal transitionName="none" maskTransitionName="none" class="modal-post modal-post-full" wrapClassName="modal-post-container modal-post-full" :keyboard="!is_modify"  width="100%"  :destroyOnClose="true" :header="false"  v-model="visible" :footer="false" :maskClosable="false" :closable="false">
			<button  class="modal-post-header-close" @click="handleCloseModal()">
				<sh-icon :icon="['fal','times']" />
			</button>
			<transition name="fade-in" mode="out-in">
				<div class="modal-post-wrapper" v-if="is_loading_modal" key="is-loading-modal">
					<div class="modal-post-loading">
						<a-spin>
							<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
						</a-spin>
					</div>
				</div>
				<div  class="modal-post-wrapper social-publish-modal" v-else key="is-load-modal-success">
					<template v-if="is_loading_error">
						<div class="modal-post-empty">
							<div class="text-center" v-if="is_loading_error == 404">
								<vue-error type="404"></vue-error>
							</div>
							<div class="text-center" v-if="is_loading_error == 500">
								<button  class="modal-post-header-close" @click="handleCloseModal()">
									<sh-icon :icon="['fal','times']" />
								</button>
								<vue-error type="500"></vue-error>
							</div>
						</div>
					</template>
					<template v-else>
						<template v-if="socials.length">	
							<div class="modal-post-body">
								<div class="modal-post-aside" >
									<modal-queue-accounts :disabled="true" @on-click-btn="handleManageAccount"  :data="socials" v-model="form.social_ids" />
								</div>
								<div class="modal-post-content">
									<div class="modal-post-content-wrapper">
										<div class="modal-post-content-form">
											<div class="form-title">
												{{ $t('queue.label.modal_title') }}
											</div>
											<div class="form-header">
												<div class="form-header-wrap">
													<vue-simple class="form-header-scrollbar">
														<modal-queue-contenteditable ref="textarea" v-model="form.message" />
													</vue-simple>
													<div class="form-info">
														<div class="form-info-wrap">
															<transition-group name="fade-in" mode="out-in"  tag="div" class="form-info-limit">
																<div class="social-limit" v-for="item in selected_socials"  :key="item" >
																	<span :class="`item-social social-${item}`"></span>
																	<template v-if="item == 'twitter'">
																		<span class="social-limi-text" :class="{ 'text-danger' : config[item].max_character - message_twitter < 0 }">
																			{{ config[item].max_character - message_twitter }}
																		</span>
																	</template>
																	<template v-else>
																		<span class="social-limi-text" :class="{ 'text-danger' : config[item].max_character - message_facebook < 0 }">
																			{{ config[item].max_character - message_facebook }}
																		</span>
																	</template>
																</div>
															</transition-group>
															<div class="form-info-items">
																<vue-hashtag @on-select="onSelectHashtag" class="m-r-15">
																	<template slot="btn-trigger">
																		<a class="social-items">
																			<sh-icon icon="hashtag" />
																		</a>
																	</template>
																</vue-hashtag>
																<vue-emoji-picker :on-select-emoji="onSelectEmoji">
																	<template slot="btn-trigger">
																		<a class="social-items">
																			<sh-icon :icon="['far','smile']" />
																		</a>
																	</template>
																</vue-emoji-picker>
															</div>
														</div>
													</div>
												</div>
												
											</div>
											<div class="form-body">
												<div class="form-tabs">
													<div class="tab-header">
														<div class="list-tabs" >
															<template v-for="tab in tabs">
																<div class="item-tab" :key="tab.id" :class="{ 'is-active' : form.post_type == tab.id  , 'is-disabled' : form.post_type != tab.id }" >
																	<span class="tab-icon">
																		<sh-icon :icon="tab.icon" />
																	</span>
																	<span class="tab-text">{{ $t(`post.modal.tab.${tab.id}`) }}</span>
																</div>
															</template>
														</div>
													</div>
													<div class="tab-body">
														<vue-simple class="tab-body-content">
															<transition name="fade-in" mode="out-in">
																<div class="tab-pane" v-if="form.post_type == 'product'" key="tab-product">
																	<modal-queue-tab-product  :product="form.product" :sub-type.sync="form.sub_type" />
																</div>
																<div class="tab-pane" v-if="form.post_type == 'image'" key="tab-product">
																	<modal-queue-tab-image  v-model="form.images" />
																</div>
															</transition>
														</vue-simple>
													</div>
												</div>
											</div>
										</div>
										<div class="modal-post-content-preview">
											<modal-queue-preview  :data="form" :meta="meta" :accounts="socials" :social="socials" :preview-socials="preview_socials" :socials="selected_socials" mode="create"  :validate="$v.form"/>
										</div>
									</div>
									
									<div class="modal-post-content-action d-flex">
										<div class="modal-post-content-action-btn">
											<a-button type="outline-danger" @click="onDelete()">
												{{ $t('queue.btn.delete') }}
											</a-button>
										</div>
										<div class="spacer"></div>
										<div class="modal-post-content-action-btn">
											<vue-pricing-post-popover v-if="is_show_popover_pricing" v-model="is_show_popover_pricing" />
											<a-button @click="onPublish()"  :loading="is_loading_publish">
												{{ $t('queue.btn.publish') }}
											</a-button>
										</div>
										<div class="divider m-l-16 m-r-16"></div>
										<div class="modal-post-content-action-btn">
											<a-button :disabled="true">
												{{ form.date }}
											</a-button>
										</div>
										<div class="modal-post-content-action-btn">
											<a-button class="m-l-16 btn-submit" :loading="is_loading_save" type="primary" @click="onSave()">
												{{ $t('queue.btn.save') }}
											</a-button>
										</div>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="modal-post-empty">
								<vue-empty-social-account />
							</div>
						</template>
					</template>
				</div>
			</transition>
		</a-modal>
	</div>
</template>
<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import ModalQueuePreview from './vue-modal-queue-preview'
import ModalQueueContenteditable from './vue-modal-queue-contenteditable'
import ModalQueueAccounts from './vue-modal-queue-accounts.vue'
import ModalQueueTabProduct from './vue-modal-queue-tab-product.vue'
import ModalQueueTabImage from './vue-modal-queue-tab-image'
import VueEmojiPicker from '@publish/modules/utils/components/vue-emoji-picker'
import VueHashtag from '@publish/modules/utils/components/vue-hashtag'
import { mapActions , mapGetters } from 'vuex'
import config from '../../config'
const { instagram , twitter , facebook } = config 
import { getTweetLength , extractUrls } from '@publish/assets/twitter-text'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'VueModalQueue',
	mixins : [mixin_time_format],
	components:{
		ModalQueueAccounts,
		ModalQueueTabProduct,
		ModalQueueTabImage,
		ModalQueueContenteditable,
		ModalQueuePreview,
		VueEmojiPicker,
		VueHashtag
	},
	props :{
		value :{
			type : Boolean,
			required : true
		},
		queueId :{
			type : [String , Number],
			required : true
		}
	},
	data(){
		return {
			modal_width: 980,
			is_loading_modal: true,
			is_loading_error : false,
			is_loading_save : false,
			is_loading_publish : false,
			is_modify : false,
			mode : 'update',
			config : config ,
			preview_socials: ['facebook','twitter'],
			socials_sortable: ['facebook','twitter'],
			default_tab_preview: '',
			setting : [],
			socials: [],
			tab: '',
			tabs : [
				{
					id : 'product',
					icon : 'tag'
				},
				{
					id : 'link',
					icon : 'link'
				},
				{
					id : 'image',
					icon : 'image'
				},
			],
			formstate: false,
			datepicker_invalid: false,
			datepicker_invalid_timeout: null,
			autopilot_types_value : {
				1 : 'random' ,
				2 : 'latest' ,
				3 : 'review' 
			},
			meta:{
				is_loading_product_preview : false,
				is_loading_product_preview_success : false,
				is_loading_url_preview : false,
				is_loading_url_preview_success : false,
				url_preview:{
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
				},
				product_preview:{
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
				},
			},
			form :{
				id : '',
				type : '',
				auto_post : null,
				discount_media : null,
				logo_media : null,
				date: '',
				social_ids: [],
				message : '',
				url: '',
				images : [],
				post_type : 'product',
				sub_type: '',
				product: '',
			},
			setting : null,
			post_social_id : '',
			post_link: '',
			is_show_popover_pricing : false,
		}
	},
	computed:{
		visible :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		selected_socials(){
			return _.map(_.uniqBy(this.form.social_ids, 'social_type'),  (item) => item.social_type).sort((a, b)=>{
				return this.socials_sortable.indexOf(a) - this.socials_sortable.indexOf(b);
			});
		},
		message_facebook(){
			if( this.selected_socials.indexOf('facebook') >= 0 ){
				return this.form.message.length
			}
			return 0;
		},
		message_twitter(){
			if( this.selected_socials.indexOf('twitter') >= 0 ){
				/* auto join metalink as 24 charactor if metalink is valid */
				if( this.form.post_type == 'product' && this.form.sub_type == 'link' && this.form.product.hasOwnProperty('link')){
					return getTweetLength(this.form.message) + 24
				}else if( this.form.post_type == 'link' && this.$helper.isUrl(this.form.url) ){
					return getTweetLength(this.form.message) + 24
				}
				return getTweetLength(this.form.message) 
			}
			return 0;
		},
	},
	methods :{
		...mapActions({
			'getQueue' : 'queue/get',
			'deleteQueue' : 'queue/delete',
			'updateQueue' : 'queue/update',
			'getShopSetting' : 'setting/get',
			'getMetaFromUrl' : 'utils/getMetaFromUrl',
			'dataLayer' : 'auth/dataLayer'
		}),
		loadDefault(id){
			return new Promise((resolve, reject)=>{
				this.getShopSetting().then((res)=>{
					let { status = false , data = null } = res.data 
					if( status && data ){
						this.setting = data 
						let { social_accounts = []  , bit_ly_status = false ,  is_shorten_link = false  , service_shorten_link = ''} = data
						
						var socials = social_accounts.map((item)=>{
							let { utm_tag = '' , utm_status = false } = item 
							var object =  item.account
							object['setting'] =  {
								bit_ly_status ,
								is_shorten_link ,
								service_shorten_link ,
								utm_status,
								utm_tag ,
							}
							return object
						})
						this.socials = socials.filter((item)=>item.id == id )
					}
					resolve()
				})
				.catch(()=>{
					resolve()
				})
			});
		},
		handleCloseModal(){
			if( this.is_modify ){
				this.showModalConfirm().then(()=>{
					this.onCloseModal()
				}).catch(()=>{

				})
			}else{
				this.onCloseModal()
			}
		},
		showModalConfirm(){
			return new Promise((resolve, reject)=>{
				this.$confirm({
					title: this.$t('queue.dialog.discard.title'),
					content: this.$t('queue.dialog.discard.content'),
					okText : this.$t('queue.dialog.discard.ok_text'),
					cancelText :  this.$t('queue.dialog.discard.cancel_text'),
					okType:'danger',
					zIndex : 10002,
					onOk : ()=>{
						resolve()
					},
					onCancel :()=>{
						reject()
					}
				})
			});
		},
		onCloseModal(){
			this.visible = false
		},
		handleManageAccount(){
			if( this.is_modify ){
				this.showModalConfirm().then(()=>{
					this.onCloseModal()
					if( this.$route.name != 'ManageAccount'){
						this.redirect({
							name : 'ManageAccount'
						})
					}
				}).catch(()=>{

				})
			}else{
				this.onCloseModal()
				if( this.$route.name != 'ManageAccount'){
					this.redirect({
						name : 'ManageAccount'
					})
				}
			}
		},
		handleGetQueueDetail(){
			return new Promise( (resolve, reject)=>{
				this.getQueue({ id : this.queueId}).then( async (res)=>{
					let { status  = false , data } = res.data 
					if( status ){
						try {
							await this.handleConvertQueueData(data)
							resolve()
						} catch (err) {
							reject(500)
						}
						
					}else{
						reject(404)
					}
				})
				.catch((err)=>{
					reject(500)
				})
			});
		},
		handleConvertQueueData(data){
			return new Promise( async (resolve, reject)=>{
				let { id , content ,  auto_post , is_valid , discount_media , logo_media ,  product_json = null  , publish_on , social  , review} = data 
				this.form.id = id 
				this.form.message = content 
				this.form.discount_media = discount_media
				if( this.autopilot_types_value.hasOwnProperty(auto_post.type)  ){
					this.form.type = this.autopilot_types_value[auto_post.type]
				}
				this.form.auto_post = auto_post 
				this.form.product = product_json 
				this.form.date = this.mixinFormatDateUTCtoTimezone(publish_on , 'YYYY-MM-DD HH:mm:ss' , true )
				this.form.social_ids.push({
					id : social.id,
					social_type : social.social_type
				})
				if( this.form.type == 'random' || this.form.type == 'latest'){
					this.form.logo_media = {
						is_enable_logo: auto_post.is_enable_logo,
						logo_margin: auto_post.logo_margin,
						logo_media: logo_media ? logo_media.url : '',
						logo_position: auto_post.logo_position,
						logo_size: auto_post.logo_size,
						logo_transparent: auto_post.logo_transparent,
					}
					this.form.discount_media = {
						is_create_discount: auto_post.is_create_discount,
						is_enable_discount_tag : auto_post.is_enable_discount_tag,
						discount_margin: auto_post.discount_margin,
						discount_image: discount_media ? discount_media.url : null,
						discount_position: auto_post.discount_position,
						discount_size: auto_post.discount_size,
					}
					this.form.sub_type = auto_post.product_share_type 
				}else{
					this.form.post_type = 'image'
					if(auto_post.integrate_json){
						let { review_priority = false } = auto_post.integrate_json
						var img_review_src = ''
						if( review_priority && review){
							if( review['review'] && review['review']['images']){
								if( review['review']['images'].length ){
									img_review_src = review['review']['images'].first()
								}
							}
						}
						if( img_review_src == '' && product_json && product_json['selected_images'] && product_json['selected_images'].length ){
							img_review_src = product_json['selected_images'].first()
						}
						if( img_review_src ){
							try {
								var img_info = await this.handleGetDetailImage(img_review_src)
								if( img_info ){
									this.form.images.push(img_info)
								}
							} catch (error) {
								
							}
						}
					}
				}
				
				await this.loadDefault(social.id);
				if( auto_post.product_share_type == 'link' ){
					try {
						await this.handleGetPreviewProduct(product_json.product_url)
					
					} catch (e) {
						
					} 
				}
				resolve()
			});
		},
		handleGetPreviewProduct(url){
			return new Promise((resolve, reject)=>{
				this.meta.is_loading_product_preview = true
				this.handleGetWebsiteMeta(url).then((res)=>{
					this.meta.product_preview = res
					this.meta.is_loading_product_preview_success = true
					this.meta.is_loading_product_preview = false
					resolve(res)
				}).catch((err)=>{
					this.meta.product_preview = err
					this.meta.is_loading_product_preview_success = false
					this.meta.is_loading_product_preview = false
					reject(err)
				})
			});
		},
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
		handleGetDetailImage(src){
			return new Promise((resolve,reject) => {
				var vm = this 
				var img = new Image();
				img.setAttribute('crossOrigin', 'anonymous');
				img.onload = function(event) {
					resolve({
						"id": vm.$helper.createId(),
						"src": src,
						"size":null,
						"type":"url",
						"extension":"jpg",
						"ratio": this.width / this.height ,
						"width": this.width,
						"height":this.height,
						"is_error":false,
						"is_complete":true
					});
				};
				img.onerror = function(err) {
					reject(err);
				};
				img.src = src;
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
		onSelectHashtag(hashtag){
			this.$refs.textarea.addHashtag(hashtag)
		},
		onSelectEmoji(emoji){
			this.$refs.textarea.addEmoji(emoji)
		},
		onSubmit({ status }){
			var data = {
				status ,
				content : this.form.message ,
				message_links : extractUrls(this.form.message)
			}
			this.updateQueue({
				id : this.form.id,
				data 
			})
			.then((res)=>{
				if( res.status == 402 ){
					this.is_show_popover_pricing = true
				}else{
					let { status = false , message = ''} = res.data 
					if( status ){
						this.onCloseModal()
						this.$emit('on-reload')
						if( data.status == 'update' ){
							this.toastSuccess({
								title : this.$t('queue.toast.update_queue_success.title'),
								message: this.$t('queue.toast.update_queue_success.message'),
							})
						}else{
							this.toastSuccess({
								title : this.$t('queue.toast.publish_queue_success.title'),
								message: this.$t('queue.toast.publish_queue_success.message'),
							})
						}
					}else{
						if( data.status == 'update' ){
							this.toastSuccess({
								title : this.$t('queue.toast.update_queue_success.title'),
								message: message,
							})
						}else{
							this.toastSuccess({
								title : this.$t('queue.toast.publish_queue_success.title'),
								message: message,
							})
						}
					}
				}
				
				this.is_loading_save = false
				this.is_loading_publish = false
			})
			.catch((err)=>{
				if( data.status == 'update' ){
					this.toastSuccess({
						title : this.$t('queue.toast.update_queue_error.title'),
						message: this.$t('queue.toast.update_queue_error.message'),
					})
				}else{
					this.toastSuccess({
						title : this.$t('queue.toast.publish_queue_error.title'),
						message: this.$t('queue.toast.publish_queue_error.message'),
					})
				}
				this.is_loading_save = false
				this.is_loading_publish = false
			})
		},
		onDelete(){
			this.$confirm({
				confirmLoading: true,
				title: this.$t('queue.dialog.delete_queue.title'),
				content: this.$t('queue.dialog.delete_queue.content'),
				okText : this.$t('queue.dialog.delete_queue.ok_text'),
				cancelText : this.$t('queue.dialog.delete_queue.cancel_text'),
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteQueue({  id : this.form.id }).then((res)=>{
							let { status = false } = res.data
							if( status ){
								this.onCloseModal()
								this.$emit('on-reload')
								this.toastSuccess({
									title : this.$t('queue.toast.delete_queue_success.title'),
									message : this.$t('queue.toast.delete_queue_success.message')
								})
								this.dataLayer({
									"toast" : 'Queue Deleted On Modal'
								})
							}else{
								this.toastError({
									title : this.$t('queue.toast.delete_queue_error.title'),
									message : this.$t('queue.toast.delete_queue_error.message')
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('queue.toast.delete_queue_error.title'),
								message : this.$t('queue.toast.delete_queue_error.message')
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		onPublish(){
			this.formstate = true 
			if(  !this.$v.form.$invalid ){
				this.is_loading_publish = true
				this.onSubmit({ status : 'published' })
			}
		},
		onSave(){
			this.formstate = true 
			if(  !this.$v.form.$invalid ){
				this.is_loading_save = true
				this.onSubmit({ status : 'update' })
			}
		}
	},
	validations(){
		var vm = this;
		return {
			form : {
				social_ids:{
					required,
					instagram : (value, nested) =>{
						if( this.selected_socials.indexOf('instagram') >= 0){
							if( this.isPostImage(this.form)){
								return true
							}
							if( this.isPostProduct(this.form) ){
								return this.form.sub_type == 'image'
							}
							return false;
						}
						return true;
					}
				},
				message :{
					max_length_facebook : (item)=>{
						if( this.selected_socials.indexOf("facebook")  >= 0 ){
							if( this.message_facebook > facebook.max_character ){
								return false
							}
						}
						return true
					},
					max_length_twitter : (item)=>{
						if( this.selected_socials.indexOf("twitter")  >= 0 ){
							if( this.message_twitter > twitter.max_character ){
								return false
							}
						}
						return true
					},
					valid : (value, nested) =>{
						var post_type = 'text'
						if( this.isPostImage(this.form) ){
							post_type = 'image'
						}else if( this.isPostLink(this.form , this.$v.form )){
							post_type = 'link'
						}else if( this.isPostProduct(this.form , this.$v.form ) ){
							post_type = 'product'
						}
						if( post_type == 'text'){
							return this.form.message.length > 0
						}
						return true;
					}
				},
				images: {
					$each: {
						upload : (item)=>{
							return item.is_complete
						},
						max_size_facebook : (item)=>{
							if( this.form.post_type == 'image' &&  this.selected_socials.indexOf("facebook")  >= 0  && item.size != null ){
								if( item.size > facebook.max_size * 1024 * 1024 ){
									return false
								}
							}
							return true
						},
						max_size_twitter : (item)=>{
							if( this.form.post_type == 'image' &&  this.selected_socials.indexOf("twitter")  >= 0  && item.size != null){
								if( item.size > twitter.max_size * 1024 * 1024 ){
									return false
								}
							}
							return true
						},
						min_width_twitter : (item)=>{
							if( this.form.post_type == 'image' &&  this.selected_socials.indexOf("twitter")  >= 0  && item.width != null){
								if( item.width < twitter.min_width ){
									return false
								}
							}
							return true
						},
						max_width_twitter : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("twitter")  >= 0 && item.width != null){
								if( item.width > twitter.max_width ){
									return false
								}
							}
							return true
						},
						min_height_twitter : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("twitter")  >= 0 && item.height != null){
								if( item.height < twitter.min_height ){
									return false
								}
							}
							return true
						},
						max_height_twitter : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("twitter")  >= 0 && item.height != null){
								if( item.height > twitter.max_height ){
									return false
								}
							}
							return true
						},
					}
				},
			}
		}
	},
	async mounted(){
		try {
			await this.handleGetQueueDetail()
			
		} catch (err) {
			this.is_loading_error = err
		}
		this.is_loading_modal = false
		this.$watch('form' ,  {
			handler :  function(){
				if( !this.is_modify ){
					this.is_modify = true
				}
			},
			deep : true
		})
	}
}
</script>
