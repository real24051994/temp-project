<template>
	<a-modal transitionName="none" maskTransitionName="none" :keyboard="!is_modify" :wrapClassName="modalWrapClassName" width="100%"  :destroyOnClose="true" :header="false"  v-model="visible" :footer="false" :maskClosable="false" :closable="false" :afterClose="onAfterCloseModal">
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
			<div  class="modal-post-wrapper" :data-type="modal_type" v-else key="is-load-modal-success">
				<template v-if="is_loading_error">
					<div class="modal-post-empty">
						<div class="text-center">
							<button  class="modal-post-header-close" @click="handleCloseModal()">
								<sh-icon :icon="['fal','times']" />
							</button>
							<vue-error type="500"></vue-error>
						</div>
					</div>
				</template>
				<template v-else>
					<template v-if="modal_type == 'published'">
						<social-post-view-publish-post  
							v-model="form"
							:post-id="post_social_id"
							:post-link="post_link"
							:default-tab-view="default_tab_preview"
							:preview-social="preview_socials"
							:selectedSocial="selected_socials"
							:socials="socials"
							:validate="$v.form"
							:meta="meta"
							:loading="form_loading"
							@on-delete="handleDeletePost"
							@on-duplicate="handleDuplicatePostWithoutConfirm"
						/>
					</template>
					<template v-else>
						<template v-if="socials.length">	
							<social-post-modal-body v-model="form" 
								:socials="socials" 
								:modal-type="modal_type" 
								:selected-socials="selected_socials"
								:config="config"
								:previewSocials="preview_socials"
								:metaPreview.sync="meta"
								:modify.sync="is_modify"
								:message-twitter="message_twitter"
								:message-facebook="message_facebook"
								:message-instagram="message_instagram"
								:datepicker-invalid="datepicker_invalid"
								:loading="form_loading"
								:validate="$v.form"
								:showPopoverPricing.sync="is_show_popover_pricing"
								@on-manage-account="handleManageAccount"
								@on-create-post="handleCreatePost"
								@on-update-post="handleUpdatePost"
								@on-create-draft="handleCreateDraft"
								@on-update-draft="handleUpdateDraft"
								@on-delete="handleDeletePost"
								@on-duplicate="handleDuplicatePost"
							/>
						</template>
						<template v-else>
							<div class="modal-post-empty">
								<vue-empty-social-account />
							</div>
						</template>
					</template>
				</template>
			</div>
		</transition>
	</a-modal>
</template>
<script>
import { required, requiredIf , maxLength } from 'vuelidate/lib/validators'
import SocialPostViewPublishPost from './vue-social-post-view-publish-post'
import SocialPostModalBody from './vue-social-post-modal-body'
import mixin from '../../mixins'
import { mapActions , mapGetters, mapMutations } from 'vuex'
import config from '../../config'
const { instagram , twitter , facebook } = config 
import { getTweetLength , extractUrls } from '@publish/assets/twitter-text'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'ModalCreatePost',
	mixins: [mixin , mixin_time_format],
	components:{
		SocialPostViewPublishPost,
		SocialPostModalBody,
	},
	props:{
		value:{
			type : Boolean,
			require :true
		},
		postId:{
			type : [String , Number ],
			default : ''
		},
		socialIds : {
			type : Array,
			default : ()=>[] 
		},
		date :{
			type : [String , Number ],
			default : ''
		}
	},
	data(){
		return {
			dropdownHashTag: false,
			is_loading_modal: true,
			is_loading_error: false,
			is_loading_preview_link : false,
			is_initialize : false,
			is_show_hashtag: false,
			is_modify: false,
			config : config ,
			preview_socials: ['facebook','twitter' ],
			socials_sortable: ['facebook','twitter'],
			default_tab_preview: '',
			socials: [],
			current_url_images : [],
			formstate: false,
			datepicker_invalid: false,
			datepicker_invalid_timeout: null,
			form_loading : {
				is_loading_create_post: false,
				is_loading_create_draft: false,
				is_loading_publish_draft : false,
				is_loading_duplicate : false,
				is_disabled : false,
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
			modal_type : '',
			form :{
				id : '',
				date: '',
				social_ids: [],
				message : '',
				url: '',
				images : [],
				post_type : 'text',
				sub_type: 'image',
				product: '',
				product_images: [],
				time_on : ''
			},
			setting : null,
			post_social_id : '',
			post_link: '',
			modal_width: 980,
			is_show_popover_pricing : false,
		}
	},
	computed:{
		...mapGetters({
			time_setting : 'auth/getTimeSetting',
			quota : 'pricing/getPostQuota'
		}),
		visible : {
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		},
		modalWrapClassName(){
			var className = 'modal-post-container '
			if( this.modal_type  ){
				className += this.modal_type == 'published' ? 'modal-post-publish' : 'modal-post-full'
			}
			return className
		},
		show_modal_header(){
			return this.modal_type != 'published'
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
		message_instagram(){
			if( this.selected_socials.indexOf('instagram') >= 0 ){
				return this.form.message.length
			}
			return 0;
		},
	},
	methods:{
		...mapActions({
			getMetaFromUrl : 'utils/getMetaFromUrl',
			createPost : 'post/create',
			updatePost : 'post/update',
			deletePost : 'post/delete',
			getPost : 'post/get',
			getShopSetting : 'setting/get',
			createShortenLink : 'utils/createShortenLink',
			dataLayer : 'auth/dataLayer',
			checkPostQuota : 'pricing/checkPostQuota'
		}),
		...mapMutations({
			setPostQuota : 'pricing/setPostQuota'
		}),
		handleGetPostDetail(id = ''){
			return new Promise((resolve, reject)=>{
				this.getPost({ id }).then( async (res)=>{
					let { status = false , data = [] } = res.data 
					if( status ){
						this.modal_type = data.status 
						let { id , post_type , sub_type ,  message , post_social_id = '' , meta_link , product_id , product_json , time_on , social , social_ids , medias , media_index   } = data
						this.post_social_id = post_social_id
						this.form.id = id 
						this.form.post_type = post_type 
						this.form.message = message
						if( time_on ){
							this.form.date = this.mixinParseTimeUTCtoTimezone(time_on  , 'YYYY-MM-DD HH:mm:ss' ,'YYYY-MM-DD HH:mm' )
							this.form.time_on = time_on
						}
						if( post_type == 'link'){
							this.form.url = meta_link 
							try {
								await this.handleGetPreviewLink(meta_link)
							} catch (error) {
								console.log(error)
							}
						}else if( post_type == 'product'){
							this.form.sub_type = sub_type
							if( sub_type == 'image' ){
								this.form.product_images = medias.map((item)=>{
									var url = item.url
									if( item.origin_url && data.status != 'published' ){
										url = item.origin_url.replace('_1200x.jpg' , '.jpg')
										this.current_url_images.push({
											id : item.id ,
											src : url
										})
									}
									return {
										"id": item.id,
										"origin_url" : item.origin_url ? item.origin_url.replace('_1200x.jpg' , '.jpg') : '',
										"src": url,
										"name": "",
										"size": item.size,
										"extension": item.extension,
										"width": item.width,
										"height":item.height,
										"ratio": item.ratio,
										"type" : "url",
										"is_error" : false,
										"is_loading" : false,
									}
								})
							}
							try {
								await this.handleGetPreviewProduct(meta_link)
							} catch (error) {
								console.log(error)
							}
							let { handle = '' , id = '' , product_id = '' , title = '' , link = '' , images = [] , main_image = '' , } = product_json
							this.form.product = {
								handle , id  , product_id , title , link , images , main_image , link : meta_link
							}
						}else if( post_type == 'image'){
							this.form.images = medias.map((item)=>{
								return {
									"id": item.id,
									"src": item.url,
									"name": "",
									"size": item.size,
									"extension": item.extension,
									"width": item.width,
									"height":item.height,
									"ratio": item.ratio,
									"type" : "id",
									"is_error" : false,
									"is_loading" : false,
									"is_complete" : true,
								}
							}).sort((a,b)=>{
								return media_index.indexOf(a.id) - media_index.indexOf(b.id);
							})
						}
						if( data.status == 'scheduled' || data.status == 'published' || data.status == 'error'){
							
							this.preview_socials = [ social.social_type ]
							this.default_tab_preview = social.social_type
							if( data.status == 'published' ){
								if(  post_social_id &&  social ){
									if( social.social_type == 'facebook'){
										this.post_link = 'https://www.facebook.com/' + post_social_id
									}else if( social.social_type == 'twitter'){
										this.post_link = social.social_url + '/status/' + post_social_id
									}
								}
							}
							this.form.social_ids.push({
								id : social.id , 
								social_type : social.social_type
							})
						}else{
							this.form.social_ids = social_ids
						}
					}else{
						this.is_loading_error  = 404
					}
					resolve()
				})
				.catch((err)=>{
					this.is_loading_error  = 500
					resolve()
				})
			});
		},
		loadDefault(){
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
						this.socials = socials.sort((a,b)=>a.id-b.id) 
						if( this.form.social_ids.length ){
							this.form.social_ids = this.form.social_ids.map((item)=>{
								if( typeof item == 'string' || typeof item == 'number'){
									var social = _.find(socials , (o)=>o.id == item)
									if( social ){
										return {
											id : social.id ,
											social_type : social.social_type 
										}
									}else{
										return null
									}
								}
								return item
							}).filter(Boolean)
						}
					}
					resolve()
				})
				.catch(()=>{
					resolve()
				})
			});
		},
		handleCheckQuote(){
			return new Promise( (resolve, reject)=>{
				this.checkPostQuota().then((res)=>{
					let { status = false, data = null } = res.data 
					if( status && data ){
						if ( data.total > data.current ){
							resolve()
						}
					}
					reject()
				})
				.catch(()=>{
					reject()
				})
			});
		},
		handleCreatePost(){
			if( this.form_loading.is_disabled ) return 
			this.form_loading.is_loading_create_post = true
			this.form_loading.is_disabled = true
			this.handleShowMessageValidate().then(()=>{
				var data = this.handleGetFormData( { draft : false })
				this.createPost({ data }).then((res)=>{
					if( res.status == 402  ){
						this.is_show_popover_pricing = true
					}else{
						let { status = false , message = ''} = res.data 
						if( status ){
							this.onCloseModal()
							this.toastSuccess({
								className : "create-post-success-toast",
								title : this.$t('post.toast.create_post_success.title'),
								message: this.$t('post.toast.create_post_success.content'),
							})
							
							var dataLayerMessage = this.form.date ? 'Post Scheduled Scfl' : 'Post Published Scfl'
							this.dataLayer({
								"toast" : dataLayerMessage
							})
							if( !this.form.date ){
								this.increaseQuota()
							}
							this.$eventBus.$emit('reload-list-post')
						}else{
							this.toastError({
								className : "create-post-error-toast",
								title : this.$t('post.toast.error.title'),
								message: message,
							})
						}
					}
					this.form_loading.is_loading_create_post = false
					this.form_loading.is_disabled = false
				})
				.catch((err)=>{
					this.toastError({
						title : this.$t('post.toast.error.title'),
						message: this.$t('post.toast.error.content'),
					})
					this.form_loading.is_loading_create_post = false
					this.form_loading.is_disabled = false
				})
			})
			.catch((err)=>{
				this.form_loading.is_disabled = false
				this.form_loading.is_loading_create_post = false
			})
		},
		handleUpdatePost(){
			if( this.form_loading.is_disabled ) return 
			this.form_loading.is_loading_create_post = true
			this.form_loading.is_disabled = true
			this.handleShowMessageValidate().then(()=>{
				let id = this.form.id
				let data = this.handleGetFormData({ draft : false })
				this.updatePost({ id , data }).then((res)=>{
					if( res.status == 402  ){
						this.is_show_popover_pricing = true
					}else{
						let { status = false , message = ''} = res.data 
						if( status ){
							this.onCloseModal()
							this.dataLayer({
								"toast" : 'Post Updated Scfl'
							})
							if( !this.form.date ){
								this.increaseQuota()
							}
							this.$eventBus.$emit('reload-list-post')
							this.toastSuccess({
								title : this.$t('post.toast.update_post_success.title'),
								message: this.$t('post.toast.update_post_success.content'),
							})
							
						}else{
							this.toastError({
								title : this.$t('post.toast.error.title'),
								message: message,
							})
						}
					}
					this.form_loading.is_loading_create_post = false
					this.form_loading.is_disabled = false
				})
				.catch((err)=>{
					this.toastError({
						title : this.$t('post.toast.error.title'),
						message: this.$t('post.toast.error.content'),
					})
					this.form_loading.is_loading_create_post = false
					this.form_loading.is_disabled = false
				})
			})
			.catch(()=>{
				this.form_loading.is_loading_create_post = false
				this.form_loading.is_disabled = false
			})
		},
		handleCreateDraft(){
			if( this.form_loading.is_disabled ) return 
			this.form_loading.is_loading_create_draft  = true 
			this.form_loading.is_disabled = true
			var data = this.handleGetFormData( { draft : true })
			this.createPost({ data }).then((res)=>{
				let { status = false , message = ''} = res.data 
				if( status ){
					this.onCloseModal()
					this.toastSuccess({
						className : "create-post-success-toast",
						title : this.$t('post.toast.create_post_success.title'),
						message: this.$t('post.toast.create_post_success.content'),
					})
					var dataLayerMessage = 'Post Draft Scfl'
					this.dataLayer({
						"toast" : dataLayerMessage
					})
					this.$eventBus.$emit('reload-list-post')
				}else{
					this.toastError({
						className : "create-post-error-toast",
						title : this.$t('post.toast.error.title'),
						message: message,
					})
				}
				this.form_loading.is_loading_create_draft  = false 
				this.form_loading.is_disabled = false
			})
			.catch((err)=>{
				this.toastError({
					title : this.$t('post.toast.error.title'),
					message: this.$t('post.toast.error.content'),
				})
				this.form_loading.is_loading_create_draft  = false 
				this.form_loading.is_disabled = false
			})
		},
		handleUpdateDraft(){
			if( this.form_loading.is_disabled ) return 
			this.form_loading.is_loading_create_draft  = true 
			this.form_loading.is_disabled = true
			var id = this.form.id
			var data = this.handleGetFormData( { draft : true })
			this.updatePost({ id , data }).then((res)=>{
				let { status = false ,message} = res.data 
				if( status ){
					this.onCloseModal()
					this.$eventBus.$emit('reload-list-post')
					this.dataLayer({
						"toast" : 'Draft Post Updated Scfl'
					})
					this.toastSuccess({
						title : this.$t('post.toast.update_draft_post_success.title'),
						message: this.$t('post.toast.update_draft_post_success.content'),
					})
				}else{
					this.toastError({
						title : this.$t('post.toast.error.title'),
						message: message,
					})
				}
				this.form_loading.is_loading_create_draft  = false 
				this.form_loading.is_disabled = false
			})
			.catch((err)=>{
				this.toastError({
					title : this.$t('post.toast.error.title'),
					message: this.$t('post.toast.error.content'),
				})
				this.form_loading.is_loading_create_draft  = false 
				this.form_loading.is_disabled = false
			})
		},
		handleDeletePost(){
			if( this.form.id ){
				if( this.modal_type == "published"){
					this.$confirm({
						confirmLoading: true,
						title: this.$t('post.dialog.delete_post.title'),
						content: this.$t('post.dialog.delete_post.content'),
						okText : this.$t('post.dialog.delete_post.ok_text'),
						cancelText : this.$t('post.dialog.delete_post.cancel_text'),
						checkbox : true,
						checkboxValue : true ,
						checkboxContent : 'Delete post from social',
						okType:'danger',
						onOk : ({ checkbox })=>{
							return new Promise((resolve, reject) => {
								this.deletePost({ id  : this.form.id , delete_from_social : checkbox }).then((res)=>{
									let { status = false } = res.data
									if( status ){
										this.onCloseModal()
										this.$eventBus.$emit('reload-list-post')
										this.toastSuccess({
											title : this.$t('post.toast.delete_post_success.title'),
											message: this.$t('post.toast.delete_post_success.content'),
										})
										this.dataLayer({
											"toast" : 'Post Deleted On Modal'
										})
									}else{
										this.toastError({
											title : this.$t('post.toast.error.title'),
											message: this.$t('post.toast.error.content'),
										})
									}
									resolve()
								})
								.catch((err)=>{
									this.toastError({
										title : this.$t('post.toast.error.title'),
										message: this.$t('post.toast.error.content'),
									})
									resolve()
								})
							})
							
						},
						onCancel :()=>{

						}
					})
				}else{
					this.$confirm({
						confirmLoading: true,
						title: this.$t('post.dialog.delete_post.title'),
						content: this.$t('post.dialog.delete_post.content'),
						okText : this.$t('post.dialog.delete_post.ok_text'),
						cancelText :  this.$t('post.dialog.delete_post.cancel_text'),
						okType:'danger',
						zIndex : 10002,
						onOk : ()=>{
							return new Promise((resolve, reject) => {
								this.deletePost({ id : this.form.id}).then((res)=>{
									let { status = false } = res.data
									if( status ){
										this.onCloseModal()
										this.$eventBus.$emit('reload-list-post')
										this.toastSuccess({
											title : this.$t('post.toast.delete_post_success.title'),
											message: this.$t('post.toast.delete_post_success.content'),
										})
										this.dataLayer({
											"toast" : 'Post Deleted On Modal'
										})
									}else{
										this.toastError({
											title : this.$t('post.toast.error.title'),
											message: this.$t('post.toast.error.content'),
										})
									}
									resolve()
								})
								.catch((err)=>{
									this.toastError({
										title : this.$t('post.toast.error.title'),
										message: this.$t('post.toast.error.content'),
									})
									resolve()
								})
							})
							
						},
						onCancel :()=>{

						}
					})
				}
			}
		},
		handleDuplicatePost(){
			this.$confirm({
				confirmLoading: true,
				title: this.$t('post.dialog.duplicate.title'),
				content: this.$t('post.dialog.duplicate.content'),
				okText : this.$t('post.dialog.duplicate.ok_text'),
				cancelText :  this.$t('post.dialog.duplicate.cancel_text'),
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					return new Promise(async (resolve, reject)=>{
						try {
							await this.loadDefault()
						} catch (e) {

						}
						this.modal_type = 'duplicate'
						delete this.form.id 
						resolve()
					});
				},
				onCancel :()=>{

				}
			})
		},
		handleDuplicatePostWithoutConfirm(){
			if( this.form_loading.is_loading_duplicate || this.form_loading.is_disabled  ) return;
			this.form_loading.is_loading_duplicate = true 
			this.form_loading.is_disabled = true
			this.loadDefault().then(()=>{
				this.modal_type = 'duplicate'
				this.form.product_images = this.form.product_images.map((item)=>{
					if( item.origin_url ){
						item['src'] = item.origin_url
					}
					return item
				})
				delete this.form.id 
				this.form_loading.is_loading_duplicate = false 
				this.form_loading.is_disabled = false
			})
			.catch(()=>{
				this.form_loading.is_loading_duplicate = false 
				this.form_loading.is_disabled = false
			})
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
		handleGetPreviewLink(url){
			return new Promise((resolve, reject)=>{
				this.meta.is_loading_url_preview = true
				this.handleGetWebsiteMeta(url).then((res)=>{
					this.meta.url_preview = res
					this.meta.is_loading_url_preview_success = true
					this.meta.is_loading_url_preview = false
					resolve(res)
				}).catch((err)=>{
					this.meta.url_preview = err
					this.meta.is_loading_url_preview_success = false
					this.meta.is_loading_url_preview = false
					reject(err)
				})
			});
		},
		handleGetFormData( payload ){
			let { draft = false } = payload
			let formdata = new FormData;
			let post_type = 'text'

			this.form.social_ids.forEach((item)=>{
				formdata.append('social_ids[]' , item.id)
			})
			this.selected_socials.forEach((item)=>{
				formdata.append('social_type[]' , item)
			})
			if( this.form.post_type == 'image'){
				let images = this.form.images.filter((item)=>item.is_error == false )
				images.forEach((img)=>{
					let { id  } = img 
					formdata.append(`media_ids[${id}]` , id )
					formdata.append('media_indexs[]' , id)
				})
				if( images.length  ){
					post_type = 'image'
				}
			}else if(this.form.post_type == 'link' && this.form.url ){
				formdata.append('meta_link' ,  this.form.url )
				post_type = 'link'
			}else if( this.form.post_type == 'product'){
				if( typeof this.form.product == 'object' && this.form.product.hasOwnProperty('id') ){
					post_type = 'product'
					formdata.append('sub_type' , this.form.sub_type)
					formdata.append('product_id' , this.form.product.id)
					formdata.append('meta_link' , this.form.product.link)
					formdata.append('product_json' , JSON.stringify(this.form.product))
					if(this.form.sub_type == 'image' && this.form.product && this.form.product_images.length ){
						this.form.product_images.forEach((item)=>{
							var find = _.find(this.current_url_images , { src  : item.src })
							if( find ){
								formdata.append(`media_ids[${find.id}]` , find.id )
								formdata.append('media_indexs[]' , find.id)
							}else{
								let id = item.hasOwnProperty('id') ? item.id : this.$helper.createId()
								if( item.type == 'url' ){
									formdata.append(`media_urls[${id}]` , item.src )
								}else if( item.type == 'id'){
									formdata.append(`media_ids[${id}]` , id )
								}
								formdata.append('media_indexs[]' , id)
							}
						})
					}
				}
			}
			

			let post_status = 'published'
			if( this.form.date  ){
				post_status = 'scheduled'
				var date = timezone.tz(this.form.date, "YYYY-MM-DD HH:mm", true, this.time_setting.timezone).utc().format('YYYY-MM-DD HH:mm')
				formdata.append('time_on' , date )
			}
			if( draft ){
				post_status = 'draft'
			}
			formdata.append('status' , post_status )
			formdata.append('post_type' , post_type)
			const message = this.form.message
			formdata.append('message' , message )
			let links = extractUrls(message)
			links.forEach((item)=>{
				formdata.append('message_links[]', item)
			})
			return formdata 
		},
		handleShowMessageValidate(){
			return new Promise( async(resolve, reject)=>{
				if( this.$v.form.$invalid ){
					if( this.$v.form.social_ids.$invalid ){
						if( !this.$v.form.social_ids.required ){
							this.toastError({
								title : this.$t('post.toast.require_social.title'),
								message: this.$t('post.toast.require_social.content'),
							})
						}
						reject({ error : 'social_ids'})
					}
					if( this.$v.form.message.$invalid){
						if( this.$v.form.message.valid == false ){
							this.toastError({
								title : this.$t('post.toast.require_message.title'),
								message: this.$t('post.toast.require_message.content'),
							})
						}else{
							
							this.toastError({
								title : this.$t('post.toast.message_invalid.title'),
								message: this.$t('post.toast.message_invalid.content'),
							})
						}
						
						reject({ error : 'message'})
					}
					
					if( this.$v.form.product_images.$invalid ){
						this.toastError({
							title : 'Error',
							message: 'In order to publish a post as an image, you need to add at least 1 image (max 4 images)',
						})
						reject({ error : 'product_images'})
					}
				}
				if( this.datepicker_invalid_timeout ){
					clearTimeout(this.datepicker_invalid_timeout)
				} 
				if( this.form.date ){
					var now = moment().utc()
					var date = timezone.tz( this.form.date , "YYYY-MM-DD HH:mm", true, this.time_setting.timezone).utc()
					if( date <= now ){
						this.datepicker_invalid = true
						this.datepicker_invalid_timeout = setTimeout( ()=>{
							this.datepicker_invalid = false
						}, 5000);
						this.toastError({
							title : this.$t('post.toast.date_invalid.title'),
							message: this.$t('post.toast.date_invalid.content'),
						})
						reject({ error : 'date'})
					}else{
						this.datepicker_invalid = false
					}
				}else{
					// reject({ error : 'quota'})
					// try {
					// 	await this.handleCheckQuote()
					// } catch (e) {
					// 	setTimeout( ()=>{
					// 		this.is_show_popover_pricing = true
					// 	}, 200);
					// 	reject({ error : 'quota'})
					// }
				}
				resolve()
			});
		},
		handleCloseModal(){
			if( this.form_loading.is_disabled ) return 
			if( this.is_modify ){
				this.showModalConfirm().then(()=>{
					this.onCloseModal()
				}).catch(()=>{

				})
			}else{
				this.onCloseModal()
			}
		},
		handleManageAccount(){
			if( this.form_loading.is_disabled ) return 
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
		showModalConfirm(){
			return new Promise((resolve, reject)=>{
				this.$confirm({
					title: this.$t('post.dialog.discard.title'),
					content: this.$t('post.dialog.discard.content'),
					okText : this.$t('post.dialog.discard.ok_text'),
					cancelText :  this.$t('post.dialog.discard.cancel_text'),
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
		onAfterCloseModal(){
			// this.$emit('input', false)
		},
		increaseQuota(){
			// var total = this.quota.total + 1
			// this.setPostQuota( { total })
			this.checkPostQuota()
		}
	},
	watch :{
		'modal_type' : function(value){
			if( value  != 'published'){
				this.modal_width = 1300
			}else{
				this.modal_width = 980
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
					max_length_instagram : (item)=>{
						if( this.selected_socials.indexOf("instagram")  >= 0 ){
							if( this.message_instagram > instagram.max_character ){
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
						max_size_instagram : (item)=>{
							if( this.form.post_type == 'image' &&  this.selected_socials.indexOf("instagram")  >= 0  && item.size != null){
								if( item.size > instagram.max_size * 1024 * 1024 ){
									return false
								}
							}
							return true
						},
						min_width_instagram : (item)=>{
							if( this.form.post_type == 'image' &&  this.selected_socials.indexOf("instagram")  >= 0  && item.width != null){
								if( item.width < instagram.min_width ){
									return false
								}
							}
							return true
						},
						max_width_instagram : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("instagram")  >= 0 && item.width != null){
								if( item.width > instagram.max_width ){
									return false
								}
							}
							return true
						},
						min_height_instagram : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("instagram")  >= 0 && item.height != null){
								if( item.height < instagram.min_height ){
									return false
								}
							}
							return true
						},
						max_height_instagram : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("instagram")  >= 0 && item.height != null){
								if( item.height > instagram.max_height ){
									return false
								}
							}
							return true
						},
						aspect_ratio : (item)=>{
							if( this.form.post_type == 'image' && this.selected_socials.indexOf("instagram")  >= 0 && item.height != null && item.width != null){
								var aspect_ratio = item.width / item.height 
								if( aspect_ratio < instagram.min_aspect_ratio || aspect_ratio > instagram.max_aspect_ratio ){
									return false
								}
							}
							return true
						},
					},
					max_image : ()=>{
						if( this.selected_socials.indexOf('instagram') >= 0){
							if( this.form.post_type == 'image'){
								return this.form.images.length <= this.config.instagram.max_image
							}
							
							if( this.form.post_type == 'product' && this.form.sub_type == 'image'){
								return this.form.product_images.length <= this.config.instagram.max_image
							}
						}
						return true;
					}
				},
				product_images :{
					required :  requiredIf( (nested)=>vm.form.product  && vm.form.post_type == 'product' && vm.form.sub_type == 'image')
				}
			}
		}
	},
	async mounted(){
		if( this.postId  ){
			try {
				await this.handleGetPostDetail(this.postId)
			} catch (e) {
				console.log(e)
			}
		}else{
			this.modal_type = 'create'
			if( this.date ){
				var date = moment(this.date ,'YYYY-MM-DD HH:mm')
				var now = moment()
				if( date <= now ){
					this.form.date = now.add('15','minute').format('YYYY-MM-DD HH:mm')
				}else{
					this.form.date = date.format('YYYY-MM-DD HH:mm')
				}
			}
			if( this.socialIds.length ){
				this.form.social_ids = this.$clone(this.socialIds)
			}
		}
		try {
			await this.loadDefault()
		} catch (e) {
			console.log(e)
		}
		this.is_initialize = true
		this.is_loading_modal = false 
	}
}
</script>