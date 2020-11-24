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
				<div class="box-preview-link  m-t-8" v-if="subType == 'link'" key="twitter-preview-link">
					<vue-autopilot-preview-link  type="twitter" :meta="meta" /> 
				</div>
				<div class="box-preview-image  m-t-8" v-else-if="subType == 'image'" key="twitter-preview-image">
					<vue-autopilot-preview-image  key="loading-product-image" :data="images" />
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
import VueAutopilotPreviewImage from './vue-autopilot-preview-image'
import VueAutopilotPreviewLink from './vue-autopilot-preview-link'
import { autoLink , htmlEscape  , extractUrls} from '@publish/assets/twitter-text'
import { mapActions } from 'vuex'
import preview from '../../mixins/preview.js'
export default {
	name : 'AutopilotPreviewTwitter',
	mixins:[preview],
	components:{
		VueAutopilotPreviewImage,
		VueAutopilotPreviewLink
	},
	props:{
		account : {
			
		},
		message: {
			type : String,
		},
		subType :{
			type : String,
		},
		images : {

		},
		meta :{

		},
		allowCovertLink:{
			type : Boolean,
			default : true,
		},
		discount:{
			type : Object
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