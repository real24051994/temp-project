<template>
	<div class="modal-post-body">
		<div class="modal-post-body-mask" v-if="loading.is_disabled"></div>
		<div class="modal-post-aside" >
			<social-post-list-accounts :disabled="!allow_list_social" @on-click-btn="handleManageAccount"  :data="socials" v-model="form.social_ids" />
		</div>
		<div class="modal-post-content">
			<div class="modal-post-content-wrapper">
				<div class="modal-post-content-form">
					<div class="form-title">
						<template v-if="modalType == 'create'">
							{{ $t('post.modal.title.create') }}
						</template>
						<template v-else-if="modalType == 'scheduled' || modalType == 'error'">
							{{ $t('post.modal.title.update_schedule') }}
						</template>
						<template v-else-if="modalType == 'draft'">
							{{ $t('post.modal.title.update_draft') }}
						</template>
						<template v-else-if="modalType == 'duplicate'">
							{{ $t('post.modal.title.duplicate') }}
						</template>
					</div>
					<div class="form-header">
						<div class="form-header-wrap">
							<vue-simple class="form-header-scrollbar">
								<social-post-contenteditable ref="textarea" :on-paste="onPaste" v-model="form.message" />
							</vue-simple>
							<div class="form-info">
								<div class="form-info-wrap">
									<transition-group name="fade-in" mode="out-in"  tag="div" class="form-info-limit">
										<div class="social-limit" v-for="item in selectedSocials"  :key="item" >
											<span :class="`item-social social-${item}`"></span>
											<template v-if="item == 'facebook'">
												<span class="social-limi-text" :class="{ 'text-danger' : count_facebook_message < 0 }">
													{{ count_facebook_message }}
												</span>
											</template>
											<template v-else-if="item == 'twitter'">
												<span class="social-limi-text" :class="{ 'text-danger' : count_twitter_message < 0 }">
													{{ count_twitter_message }}
												</span>
											</template>
											<template v-else-if="item == 'instagram'">
												<span class="social-limi-text" :class="{ 'text-danger' : count_instagram_message < 0 }">
													{{ count_instagram_message }}
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
										<div class="item-tab" :key="tab.id" :class="{ 'is-active' : form.post_type == tab.id}" @click="handleChangeTab(tab.id)">
											<span class="tab-icon m-r-8">
												<sh-icon :icon="['fal'  , tab.icon ]" />
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
											<social-post-tab-product v-model="form.product_images" :product="form.product" :sub-type.sync="form.sub_type" @on-select="onSelectProduct" :preview.sync="meta.product_preview" @clear="onClearProduct" />
										</div>
										<div class="tab-pane" v-if="form.post_type == 'link'" key="tab-link">
											<social-post-tab-link @on-blur="handleGetPreviewLink" :loading="meta.is_loading_url_preview" :success="meta.is_loading_url_preview_success" v-model="form.url" :preview="meta.url_preview"   />
										</div>
										<div class="tab-pane" v-if="form.post_type == 'image'" key="tab-image">
											<social-post-tab-image :validate="validate.images" v-model="form.images" />
										</div>
										<div class="tab-pane" v-if="form.post_type == 'video'" key="tab-video">
											
										</div>
									</transition>
								</vue-simple>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-post-content-preview">
					<social-post-preview  :data="form" :meta="meta" :accounts="socials" :preview-socials="previewSocials" :socials="selectedSocials" :mode="modalType"  :validate="validate"/>
				</div>
			</div>
			<div class="modal-post-content-action">
				<template v-if="modalType == 'create' || modalType == 'duplicate'">
					<div class="row">
						<div class="col col-12 text-right">
							<div class="modal-post-content-action-btn">
								<a-button class="modal-post-btn-draft m-r-16" @click="createDraft()"  :loading="loading.is_loading_create_draft">
									{{ $t('post.modal.btn.draft') }}
								</a-button>
							</div>
							<div class="divider"></div>
							<social-post-datetimepicker  :invalid="datepickerInvalid" v-model="form.date" />
							<div class="modal-post-content-action-btn m-l-16 ">
								<vue-pricing-post-popover v-if="show_popover" v-model="show_popover" />
								<a-button class="btn-submit" :class="form.date  ? 'modal-post-btn-schedule' : 'modal-post-btn-publish'" type="primary"   @click="createPost()" :disabled="!modify" :loading="loading.is_loading_create_post">
									{{ form.date ? $t('post.modal.btn.schedule') : $t('post.modal.btn.publish') }}
								</a-button>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="modalType == 'draft'">
					<div class="row">
						<div class="col col-4">
							<div class="modal-post-content-action-btn">
								<a-button class="m-r-16" type="outline-danger" @click="handleDeletePost()">
									{{ $t('post.modal.btn.delete') }}
								</a-button>
							</div>
						</div>
						<div class="col col-8 text-right">
							<div class="modal-post-content-action-btn">
								<a-button class="m-r-16" @click="updateDraft()"  :loading="loading.is_loading_create_draft">
									{{ $t('post.modal.btn.draft') }}
								</a-button>
							</div>
							<div class="divider"></div>
							<social-post-datetimepicker  :invalid="datepickerInvalid" v-model="form.date" />
							<div class="modal-post-content-action-btn m-l-16 ">
								<vue-pricing-post-popover v-if="show_popover" v-model="show_popover" />
								<a-button class="btn-submit" type="primary" :class="form.date  ? 'modal-post-btn-schedule' : 'modal-post-btn-publish'"  @click="updatePost()" :disabled="!modify" :loading="loading.is_loading_create_post">
										{{ form.date ? $t('post.modal.btn.schedule') : $t('post.modal.btn.publish') }}
								</a-button>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="modalType == 'scheduled' || modalType == 'error'">
					<div class="row">
						<div class="col col-4">
							<a-button class="m-r-16" type="outline-danger"  @click="deletePost()">
								{{ $t('post.modal.btn.delete') }}
							</a-button>
						</div>
						<div class="col col-8 text-right">
							<div class="modal-post-content-action-btn">
								<a-button class="m-r-16"  @click="duplicatePost()">
									{{ $t('post.modal.btn.duplicate') }}
								</a-button>
							</div>
							<div class="divider"></div>
							<social-post-datetimepicker  :invalid="datepickerInvalid" v-model="form.date" />
							<div class="modal-post-content-action-btn m-l-16">
								<vue-pricing-post-popover v-if="show_popover" v-model="show_popover" />
								<a-button class="tn-submit" type="primary" :class="form.date  ? 'modal-post-btn-schedule' : 'modal-post-btn-publish'"  @click="updatePost()" :disabled="!modify" :loading="loading.is_loading_create_post">
										{{ form.date ? $t('post.modal.btn.schedule') : $t('post.modal.btn.publish') }}
								</a-button>
							</div>
						</div>
					</div>
					
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import SocialPostListAccounts from './vue-social-post-list-account'
import SocialPostTabImage from './vue-social-post-tab-image'
import SocialPostPreview from './vue-social-post-preview'
import SocialPostTabLink from './vue-social-post-tab-link'
import SocialPostTabProduct from './vue-social-post-tab-product'
import SocialPostDatetimepicker from './vue-social-post-datetimepicker'
import SocialPostContenteditable from './vue-social-post-contenteditable'
import VueEmojiPicker from '@publish/modules/utils/components/vue-emoji-picker'
import VueHashtag from '@publish/modules/utils/components/vue-hashtag'
import mixin from '../../mixins'
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'VueSocialPostModalBody',
	mixins: [mixin],
	components:{
		SocialPostListAccounts,
		SocialPostTabImage,
		SocialPostTabLink,
		SocialPostPreview,
		SocialPostTabProduct,
		SocialPostDatetimepicker,
		SocialPostContenteditable,
		VueEmojiPicker,
		VueHashtag,
	},
	props:{
		value : {
			type : Object
		},
		socials : {
			type : Array,
			required : true,
		},
		modalType :{
			type : String,
		},
		selectedSocials :{
			type : Array
		},
		config :{
			type : Object
		},
		validate:{
			type : Object
		},
		previewSocials :{
			type : Array
		},
		metaPreview :{
			type : Object
		},
		messageTwitter:{
			type : Number
		},
		messageFacebook:{
			type : Number
		},
		messageInstagram:{
			type : Number
		},
		modify :{
			type : Boolean
		},
		datepickerInvalid:{
			type : Boolean
		},
		loading: {
			type : Object
		},
		showPopoverPricing :{
			type : Boolean,
			default : false,
		}
	},
	data(){
		return {
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
			
		}
	},
	computed : {
		...mapGetters({
			quota : 'pricing/getPostQuota'
		}),
		form : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		meta : {
			get(){
				return this.metaPreview 
			},
			set(value){
				this.$emit('update:metaPreview' , value)
			}
		},
		is_modify : {
			get(){
				return this.modify 
			},
			set(value){
				this.$emit('update:modify' , value)
			}
		},
		allow_list_social(){
			return this.modalType == 'draft' || this.modalType == 'duplicate' || this.modalType == 'create'
		},
		show_popover : {
			get(){
				return this.showPopoverPricing 
			},
			set(value){
				this.$emit('update:showPopoverPricing' , value)
			}
		},
		show_popover_trigger(){
			return this.showPopoverPricing ?  ['click'] : []
		},
		count_facebook_message(){
			return this.config.facebook.max_character - this.messageFacebook
		},
		count_twitter_message(){
			return this.config.twitter.max_character - this.messageTwitter
		},
		count_instagram_message(){
			return this.config.instagram.max_character - this.messageInstagram
		}
	},
	methods : {
		onPaste(content){
			if( this.$helper.isUrl(content) ){
				if( this.form.post_type == 'text' ){
					this.form.post_type = 'link'
					this.form.url = content
					return false
				}else if( this.form.post_type == 'link' && this.form.url == '' ){
					this.form.url = content
					return false
				}
			}
			return true
		},
		onSelectProduct : async function(product){
			if( !product.images.length ){
				this.form.sub_type = 'link'
			}
			this.form.product = product
			this.$refs.textarea.addContentProduct(this.form.product)
			try {
				await this.handleGetPreviewProduct(product.link)
			} catch (e) {
				
			}
		},
		onClearProduct(){
			this.form.product = ''
			this.form.product_images = []
			this.$refs.textarea.removeContentProduct()
		},
		onSelectHashtag(hashtag){
			this.$refs.textarea.addHashtag(hashtag)
		},
		onSelectEmoji(emoji){
			this.$refs.textarea.addEmoji(emoji)
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
		handleChangeTab(tab){
			if( this.form.post_type == tab ){
				this.form.post_type = 'text'
			}else{
				this.form.post_type = tab
			}
		},
		handleManageAccount(){
			this.$emit('on-manage-account')
		},
		createPost(){
			this.$emit('on-create-post')
		},
		updatePost(){
			this.$emit('on-update-post')
		},
		createDraft(){
			this.$emit('on-create-draft')
		},
		updateDraft(){
			this.$emit('on-update-draft')
		},
		deletePost(){
			this.$emit('on-delete')
		},
		duplicatePost(){
			this.$emit('on-duplicate')
		}
	},
	watch  :{
		'form' : {
			handler :  function(){
				if( !this.is_modify ){
					this.is_modify = true
				}
			},
			deep : true
		},
		'form.url' : async function(value){
			if( this.$helper.isUrl(value) ){
				try {
					await this.handleGetPreviewLink(value)
				} catch (e) {
					console.log(e)
				}
			}else{
				this.is_loading_url_preview = false 
				this.is_loading_url_preview_success = false
			}
		},
	},
	async mounted(){
		if(this.form.post_type == 'link'){
			try {
				await this.handleGetPreviewLink(this.form.url)
			} catch (error) {
				console.log(error)
			}
		}else if( this.form.post_type == 'product'){
			await this.handleGetPreviewProduct(this.form.product.link)
		}
	}
}
</script>

<style>

</style>