<template>
	<div class="box-preview box-preview-twitter">
		<div class="box-preview-header">
			<div class="item-social-account" v-if="account">
				<div class="item-social-account-media">
					<div class="item-social-account-media-avatar">
						<img v-if="account.avatar" :src="account.avatar" alt="">
						<img v-else src="@/assets/icons/user.png" alt="">
					</div>
				</div>
				<div class="item-social-account-title" v-if="account">
					<div  v-line-clamp:20="2">{{ account.name }}</div>
				</div>
			</div>
		</div>
		<div class="box-preview-body">
			<transition name="fade-in" mode="out-in">
				<div v-if="is_loading" key="is-loading" class="box-preview-content">
					<div class="text-center p-t-50 p-b-50">
						<a-spin>
							<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
						</a-spin>
					</div>
				</div>
				<div v-else key="is-loading-success" class="box-preview-content" v-html="content"></div>
			</transition>
			
			<transition name="fade-in" mode="out-in">
				<div class="box-preview-link m-t-8" v-if="postType == 'link'" key="twitter-link-preview">
					<social-post-preview-link :loading="meta.is_loading_url_preview"  social-type="twitter" :meta="meta.url_preview.twitter" /> 
				</div>
				<div v-if="postType == 'product'" key="twitter-preview-product">
					<transition name="fade-in" mode="out-in">
						<div class="box-preview-link  m-t-8" v-if="subType == 'link'" key="twitter-preview-link">
							<social-post-preview-link :loading="meta.is_loading_product_preview" social-type="twitter" :meta="meta.product_preview.twitter" /> 
						</div>
						<div class="box-preview-image  m-t-8" v-else-if="subType == 'image'" key="twitter-preview-image">
							<social-post-preview-image  key="loading-product-image" :data="images" />
						</div>
					</transition>
				</div>
				<div class="box-preview-image m-t-8" v-else-if="postType == 'image'" key="twitter-image-preview">
					<transition name="fade-in" mode="out-in">
						<div class="box-preview-image-loading" v-if="isLoading" key="loadng-image">
							<div class="box-preview-image-loading-inner">
								<a-spin>
									<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
								</a-spin>
							</div>
							<img  src="@/assets/grid/500x333.png" alt="">
						</div>
						<social-post-preview-image v-else key="loading-image-success" :data="images" />
					</transition>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
import SocialPostPreviewImage from './vue-social-post-preview-image'
import SocialPostPreviewCarousel from './vue-social-post-preview-carousel'
import SocialPostPreviewLink from './vue-social-post-preview-link'
import { autoLink , htmlEscape  , extractUrls} from '@publish/assets/twitter-text'
import { mapActions } from 'vuex'
import preview from '../../mixins/preview.js'
export default {
	name : 'SocialPostPreviewTwitter',
	mixins: [preview],
	components:{
		SocialPostPreviewImage,
		SocialPostPreviewCarousel,
		SocialPostPreviewLink
	},
	props:{
		account : {
			
		},
		message: {
			type : String,
		},
		postType : {
			type : String,
		},
		subType :{
			type : String,
		},
		images : {

		},
		isLoading :{
			type : Boolean
		},
		meta :{

		},
		allowCovertLink : { 
			type : Boolean,
			default : false,
		}
	},
	computed:{
		content : function(){
			var message = this.covertLink(this.message)
			return autoLink(htmlEscape(message) , {
				allowedCashtag : true,
				allowedHashtag : true,
				allowedMention : true,
			})
		},
	},
}
</script>