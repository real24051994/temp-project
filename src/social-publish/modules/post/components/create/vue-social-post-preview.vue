<template>
	<div class="social-post-preview" :class="{'social-post-preview-no-header' : !showHeader }">
		<div class="social-post-preview-header" v-if="showHeader">
			<div class="list-tabs">
				<template v-for="item in previewSocials">
					<div class="item-tab" :key="item" @click="handleChangeTab(item)" :class="{ 'is-disabled' : isDisabled(item) , 'is-active' : tab == item }">
						<div class="item-social-error" v-if="isErrors[item].length">
							<sh-icon icon="exclamation-circle" />
						</div>
						<div :class="`item-social social-${item}`"></div>
					</div>
				</template>
			</div>
		</div>
		<div  class="social-post-preview-body" >
			<vue-simple class="social-post-preview-scrollbar">
				<transition name="fade-in" mode="out-in">
					<div class="tab-pane m-t-8" v-if="tab == 'facebook'" key="tab-facebook">
						<transition name="fade-in" mode="out-in">
							<social-post-preview-errors v-if="isErrors.facebook.length" :data="isErrors.facebook" social-type="facebook" />
						</transition>
						<social-post-preview-facebook :is-loading="is_change_image" :account="facebook" :meta="meta" :post-type="post_type" :sub-type="data.sub_type" :images="images" :message="data.message" :allow-covert-link="allow_covert_link" />
					</div>
					<div class="tab-pane m-t-8" v-else-if="tab == 'twitter'" key="tab-twitter">
						<transition name="fade-in" mode="out-in">
							<social-post-preview-errors v-if="isErrors.twitter.length" :data="isErrors.twitter" social-type="twitter" />
						</transition>
						<social-post-preview-twitter :is-loading="is_change_image" :account="twitter" :meta="meta" :post-type="post_type" :sub-type="data.sub_type" :images="images" :message="data.message" :allow-covert-link="allow_covert_link" />
					</div>
					<div class="tab-pane m-t-8" v-else-if="tab == 'instagram'" key="tab-instagram">
						<transition name="fade-in" mode="out-in">
							<social-post-preview-errors v-if="isErrors.instagram.length" :data="isErrors.instagram" social-type="instagram" />
						</transition>
						<social-post-preview-instagram :is-loading="is_change_image" :account="instagram" :meta="meta" :post-type="post_type" :sub-type="data.sub_type" :images="images" :message="data.message" :allow-covert-link="allow_covert_link" />
					</div>
					<div class="tab-pane" v-else key="tab-empty">
						<div class="empty-state">
							<h3>
								{{ $t('error.empty_preview.title') }}
							</h3>
							<p>
								{{ $t('error.empty_preview.content') }}
							</p>
						</div>
					</div>
				</transition>
			</vue-simple>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex';
import SocialPostPreviewErrors from './vue-social-post-preview-errors'
import SocialPostPreviewFacebook from './vue-social-post-preview-facebook'
import SocialPostPreviewTwitter from './vue-social-post-preview-twitter'
import SocialPostPreviewInstagram from './vue-social-post-preview-instagram'
export default {
	name : 'Preview',
	components:{
		SocialPostPreviewErrors,
		SocialPostPreviewFacebook,
		SocialPostPreviewTwitter,
		SocialPostPreviewInstagram
	},
	props:{
		data :{
			type : Object,
			required : true
		},
		meta :{
			type : Object,
			required : true
		},
		validate: {
			type : Object,
			required : true,
		},
		accounts : {
			type : Array,
			default : ()=>{
				return []
			}
		},
		previewSocials:{
			type : Array,
			required : true
		},
		socials:{
			type : Array,
			default : ()=>{
				return []
			}
		},
		showHeader:{
			type : Boolean,
			default : true
		},
		defaultTab : {
			type : String,
			default : ''
		},
		mode :{
			type : String,
			default : 'create'
		}
	},
	data: ()=>({
		tab : '',
		is_change_image : false,
		is_change_image_timeout : null,
		image_facebook : ['max_size_facebook'],
		image_twitter : ['max_size_twitter','min_width_twitter' , 'max_width_twitter' , 'min_height_twitter' ,'max_height_twitter'],
		image_instagram : ['max_size_twitter','min_width_twitter' , 'max_width_twitter' , 'min_height_twitter' ,'max_height_twitter' ,'aspect_ratio'],
		allowed_covert_link_status : [ 'create' , 'scheduled' , 'error' ,'draft']
	}),
	computed:{
		images(){
			let { post_type } = this.data 
			if( post_type  == 'product' ){
				return this.data.product && this.data.product_images ?  this.data.product_images : []
			}else if( post_type == 'image' ){
				return this.data.images.filter((item)=>item.is_complete)
			}
			return []
		},
		twitter(){
			var item = _.find(this.data.social_ids , { social_type : 'twitter'})
			if( item){
				var account = _.find(this.accounts , { id : item.id })
				if( account ){
					return account
				}
			}
			return null
		},
		facebook(){
			var item = _.find(this.data.social_ids , { social_type : 'facebook'})
			if( item){
				var account = _.find(this.accounts , { id : item.id })
				if( account ){
					return account
				}
			}
			return null
		},
		instagram(){
			var item = _.find(this.data.social_ids , { social_type : 'instagram'})
			if( item){
				var account = _.find(this.accounts , { id : item.id })
				if( account ){
					return account
				}
			}
			return null
		},
		post_type : {
			get(){
				if( this.data.post_type == 'link' && this.data.url){
					return 'link'
				}
				if( this.data.post_type == 'image' && this.images.length ){
					return 'image'
				}
				if( this.data.post_type == 'product' && !_.isEmpty(this.data.product) ){
					return 'product'
				}
				return ''
			}
		},
		isErrors(){
			var images =  Object.values(this.validate.images.$each.$iter);
			var instagram_error = []
			var twitter_error = []
			var facebook_error = []
			if( this.validate.social_ids.instagram == false){
				instagram_error.push('image_or_video')
			}
			if( this.validate.images.max_image == false){
				instagram_error.push('max_image')
			}
			if( this.validate.message.$invalid ){
				if( !this.validate.message.max_length_facebook ){
					facebook_error.push('max_length')
				}
				if( !this.validate.message.max_length_twitter ){
					twitter_error.push('max_length')
				}
				if( !this.validate.message.max_length_instagram ){
					instagram_error.push('max_length')
				}
			}
			if( this.data.post_type == 'image'){
				images.forEach((item)=>{
					this.image_twitter.forEach(rule => {
						if( item[rule] == false ){
							var temp_rule = rule.replace('_twitter' , '')
							if( twitter_error.indexOf(temp_rule) == -1 ){
								twitter_error.push(temp_rule)
							}
						}
					});
					this.image_facebook.forEach(rule => {
						if( item[rule] == false ){
							var temp_rule = rule.replace('_facebook' , '')
							if( facebook_error.indexOf(temp_rule) == -1 ){
								facebook_error.push(temp_rule)
							}
						}
					});
					this.image_instagram.forEach(rule => {
						if( item[rule] == false ){
							var temp_rule = rule.replace('_instagram' , '')
							if( instagram_error.indexOf(temp_rule) == -1 ){
								instagram_error.push(temp_rule)
							}
						}
					});
				})
			}
			
			return {
				facebook : facebook_error,
				twitter : twitter_error,
				instagram : instagram_error,
			};
		},
		allow_covert_link(){
			return this.allowed_covert_link_status.indexOf(this.mode) >= 0 
		},
	},
	methods:{
		...mapActions({
			getMetaFromUrl : 'utils/getMetaFromUrl'
		}),
		isDisabled(type){
			return this.socials.indexOf(type) == -1
		},
		handleChangeTab(type){
			if( !this.isDisabled(type) ){
				this.tab = type
			}
		},
	},
	watch :{
		'data.images' : function(){
			if( this.is_change_image_timeout ){
				clearTimeout(this.is_change_image_timeout)
			}
			this.is_change_image = true 
			this.is_change_image_timeout = setTimeout( ()=>{
				this.is_change_image = false 
			},500);
		},
		socials : function(value){
			if( value.length ){
				if( value.indexOf(this.tab) == -1 ){
					this.tab = this.$clone(value[0])
				}
			}else{
				this.tab = ''
			}
		}
	},
	created(){
		this.tab = this.defaultTab
		if( this.socials.length){
			this.tab = this.$clone(this.socials.first())
		}
	}

}
</script>