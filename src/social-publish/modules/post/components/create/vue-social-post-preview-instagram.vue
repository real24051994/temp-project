<template>
	<div class="box-preview box-preview-instagram">
		<div class="box-preview-header">
			<div class="item-social-account" v-if="account">
				<div class="item-social-account-media">
					<div class="item-social-account-media-avatar">
						<img v-if="account.avatar" :src="account.avatar" alt="">
						<img v-else src="@/assets/icons/user.png" alt="">
					</div>
				</div>
				<div class="item-social-account-title">
					<div  v-line-clamp:20="2">{{ account.name }}</div>
				</div>
			</div>
		</div>
		<transition name="fade-in" mode="out-in">
			<div v-if="is_loading" key="is-loading" class="box-preview-body">
				<div class="text-center p-t-50 p-b-50">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
			</div>
			<div v-else key="loading-success" class="box-preview-body">
				<div  class="box-preview-image m-t-8"  key="instagram-preview-image">
					<transition name="fade-in" mode="out-in">
						<div class="box-preview-image-loading" v-if="isLoading" key="loadng-image">
							<div class="box-preview-image-loading-inner">
								<a-spin>
									<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
								</a-spin>
							</div>
							<img  src="@/assets/grid/500x333.png" alt="">
						</div>
						<social-post-preview-image v-else key="loading-image-success" :data="instagram_images" />
					</transition>
				</div>
				<div class="box-preview-sharing">
					<div class="box-preview-sharing-icon">
						<img src="@publish/assets/icons/ig-like-heart.svg">
					</div>
					<div class="box-preview-sharing-icon">
						<img src="@publish/assets/icons/ig-comment.svg">
					</div>
					<div class="box-preview-sharing-icon">
						<img src="@publish/assets/icons/ig-share.svg">
					</div>
					<div class="spacer"></div>
					<div class="box-preview-sharing-icon">
						<img src="@publish/assets/icons/ig-bookmark.svg">
					</div>
				</div>
				<div class="box-preview-content" v-html="content"></div>
			</div>
		</transition>
	</div>
</template>
<script>
import SocialPostPreviewImage from './vue-social-post-preview-image'
import SocialPostPreviewLink from './vue-social-post-preview-link'
import { autoLink , htmlEscape  , extractUrls} from '@publish/assets/twitter-text'
import { mapActions } from 'vuex'
import preview from '../../mixins/preview.js'
export default {
	name : 'SocialPostPreviewInstagram',
	mixins:[preview],
	components:{
		SocialPostPreviewImage,
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
		instagram_images : function(){
			return [this.images.first()]
		},
		content : function(){
			var message = this.covertLink(this.message)
			return autoLink(htmlEscape(message) , {
				allowedCashtag : false,
				allowedHashtag : false,
				allowedMention : false,
				htmlEscapeNonEntities : false,
			})
		},
	},
}
</script>