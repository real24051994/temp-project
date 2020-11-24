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
							<modal-queue-preview-errors v-if="isErrors.facebook.length" :data="isErrors.facebook" social-type="facebook" />
						</transition>
						<vue-autopilot-preview-facebook :account="facebook"  :meta="meta.product_preview.facebook" :sub-type="preview_type" :images="selected" :message="data.message"  />
					</div>
					<div class="tab-pane" v-else-if="tab == 'twitter'" key="tab-twitter">
						<transition name="fade-in" mode="out-in">
							<modal-queue-preview-errors v-if="isErrors.twitter.length" :data="isErrors.twitter" social-type="twitter" />
						</transition>
						<vue-autopilot-preview-twitter :account="twitter"  :meta="meta.product_preview.twitter" :sub-type="preview_type" :images="selected" :message="data.message"  />
					</div>
					<div class="tab-pane" v-else key="tab-empty">
						<div class="empty-state">
							<h3>
								{{ $t('queue.state.empty_preview.title') }}
							</h3>
							<p>
								{{ $t('queue.state.empty_preview.content') }}
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
import ModalQueuePreviewErrors from './vue-modal-queue-preview-errors'
// import SocialPostPreviewFacebook from './vue-social-post-preview-facebook'
// import SocialPostPreviewTwitter from './vue-social-post-preview-twitter'
import VueAutopilotPreviewFacebook from '../autopilot/vue-autopilot-preview-facebook'
import VueAutopilotPreviewTwitter from '../autopilot/vue-autopilot-preview-twitter'
import MergeImage from '../../utils/merege-image'
export default {
	name : 'Preview',
	components:{
		ModalQueuePreviewErrors,
		VueAutopilotPreviewFacebook,
		VueAutopilotPreviewTwitter
		// SocialPostPreviewFacebook,
		// SocialPostPreviewTwitter
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
		image_twitter : ['max_size_twitter','min_width_twitter' , 'max_width_twitter' , 'min_height_twitter' ,'max_height_twitter'],
		image_facebook : ['max_size_facebook'],
		allowed_covert_link_status : [ 'create' , 'scheduled' , 'error' ,'draft'],
		main_image : null,
		discount_tag : ['DISCOUNT_CODE' , 'VALID_TIME' , 'DISCOUNT_PERCENTAGE'],
		timeout : null ,
		selected: [],
		preview_type : ''
	}),
	computed:{
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
		generateDiscountCode() {
			var result           = '';
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			var charactersLength = characters.length;
			for ( var i = 0; i < 6; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		},
		getProductImage(){
			return new Promise( async (resolve, reject)=>{
				if( this.main_image ){
					var object = {
						"id" : this.$helper.createId(),
						"src": this.main_image.src,
						'name': '',
						'size': 0,
						'type': 'url',
						'extension' : '',
						'width' : this.main_image.width,
						'height': this.main_image.height,
						'ratio' : this.main_image.width / this.main_image.height ,
						"is_error" : false,
						"is_loading" : false,
					}
					if(  this.data.discount_media && this.data.logo_media ){
						object['src'] = await this.mergeImageDiscount( this.main_image.src , this.data.discount_media , this.data.logo_media )
					}
					resolve([object])
				}else{
					resolve([])
				}
			})
		},
		mergeImageDiscount( src , discount , logo){
			return new Promise( (resolve, reject)=>{
				var image = new MergeImage({
					src ,
					discount ,
					logo
				})
				image.init().then((res) => {
					resolve(res)
				})
				.catch((err) => {
					
				})
			})
		},
		loadImage(src) {
			var vm = this;
			return new Promise((resolve, reject) => {
				var img = new Image();
				img.crossOrigin = "Anonymous";
				img.src = src;
				img.onload = function(event) {
					resolve(img);
				};
				img.onerror = function(err){
					reject(null)
				}
			});
		},
		loadImages(images) {
			return new Promise((resolve, reject) => {
				let promises = [];
				images.forEach(img => {
					promises.push(this.loadImage(img));
				});
				Promise.all(promises).then(results => {
					resolve(results);
				});
			});
		}
	},
	async mounted(){
		this.tab = this.defaultTab
		if( this.socials.length){
			this.tab = this.$clone(this.socials.first())
		}
		if( this.data.type == 'random' || this.data.type == 'lastest'){
			this.preview_type = this.data.sub_type
			try {
				var first_image = this.data.product.selected_images.first()
				var first_image_loaded = await this.loadImage(first_image)
				this.main_image = {
					width : first_image_loaded.width,
					height : first_image_loaded.height,
					src : first_image
				}
				this.selected = await this.getProductImage()

			} catch (e) {
				console.log(e);
				
			} 
		}else{
			this.preview_type = this.data.post_type
			this.selected =  JSON.parse(JSON.stringify(this.data.images))
		}
	}

}
</script>