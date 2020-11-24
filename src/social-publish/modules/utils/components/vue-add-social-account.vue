<template>
	<div v-if="is_loading" class="list-items-connect-social-account">
		<div class="item-connect-social-account is-loading">
			<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
		</div>
		<div class="item-connect-social-account is-loading">
			<a-skeleton active :title="false" :paragraph="{ rows: 3  , width : '100%' }" />
		</div>
		<div class="item-connect-social-account is-loading">
			<a-skeleton active :title="false" :paragraph="{ rows: 3  , width : '100%' }" />
		</div>
	</div>
	<div v-else class="list-items-connect-social-account">
		<div class="item-connect-social-account" :class="{ 'is-disabled' : !allowedFacebook || !is_available}" @click="onClick('facebook')">
			<div class="item-connect-social-account-content" :class="{ 'is-loading' : is_loading_social['facebook']}">
				<div class="item-connect-social-account-icon icon-facebook">
					<img src="@publish/assets/social/facebook-square.svg" alt="">
				</div>
				<div class="item-connect-social-account-text">
					Facebook
				</div>
				<div class="item-connect-social-account-overlay" v-if="is_loading_social['facebook']">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
			</div>
		</div>
		<div class="item-connect-social-account" :class="{ 'is-disabled' : !allowedFacebook || !is_available}" @click="onClick('twitter')">
			<div class="item-connect-social-account-content" :class="{ 'is-loading' : is_loading_social['twitter']}">
				<div class="item-connect-social-account-icon icon-twitter">
					<img src="@publish/assets/social/twitter-square.svg" alt="">
				</div>
				<div class="item-connect-social-account-text">
					Twitter
				</div>
				<div class="item-connect-social-account-overlay" v-if="is_loading_social['twitter']">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
			</div>
		</div>
		<!-- <div class="item-connect-social-account" :class="{ 'is-disabled' : !allowedInstagram || !is_available}" @click="showModalInstagram">
			<div class="item-connect-social-account-content" :class="{ 'is-loading' : is_loading_social['hootsuite']}">
				<div class="item-connect-social-account-icon icon-instagram">
					<img src="@publish/assets/social/instagram-square.svg" alt="">
				</div>
				<div class="item-connect-social-account-text">
					Instagram
				</div>
				<div class="item-connect-social-account-overlay" v-if="is_loading_social['hootsuite']">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
			</div>
		</div> -->
		<a-modal transitionName="none" maskTransitionName="none" :bodyStyle="{ padding : 0}" :title="false" :footer="false" :destroyOnClose="true"  width="520px" v-model="modal_intro_instagram" >
			<div class="modal-connect-social-instagram-wrap">
				<div  class="modal-connect-social-instagram-intro">
					<div class="modal-connect-social-instagram-intro-icon">
						<img src="@publish/assets/social/large-instagram-square.svg" alt="">
					</div>
					<div class="modal-connect-social-instagram-intro-title m-t-16">
						Connecting Instagram required log in to Hootsuite account
					</div>
					<div class="modal-connect-social-instagram-intro-description m-t-16">
						We’ll be using third vendor call Hootsuite to post to Instagram, as they have an official access to Instagram. This would make you account SAFE!
					</div>
					<div class="modal-connect-social-instagram-intro-link m-t-16">
						<a href="#">
							Why i need to connect to Hootsuite
						</a>
					</div>
					<div class="modal-connect-social-instagram-intro-btn m-t-16">
						<a-button type="primary" @click="onClick('hootsuite')">
							I already have Hootsuite account
						</a-button>
					</div>
					<div class="modal-connect-social-instagram-intro-link m-t-16">
						<a href="#">
							Don’t have Hootsuite Account
						</a>
					</div>
				</div>
			</div>
		</a-modal>
		<template v-if="modal.visible">
			<select-facebook-page  v-model="modal.visible" :data="modal.data" :secret="modal.secret" :info="modal.personal_info" @on-close="onCloseSelectFacebook" @on-connected="onConnected" />
		</template>
		<!-- <template v-if="modal_hootsuite.visible">
			<select-hootsuite-instagram  v-model="modal_hootsuite.visible" :data="modal_hootsuite.data" @on-close="onCloseSelectHootsuite" @on-connected="onConnected" />
		</template> -->
	</div>
</template>
<script>
import { mapActions , mapGetters, mapMutations} from 'vuex'
import SelectFacebookPage from './vue-select-facebook-page'
import SelectHootsuiteInstagram from './vue-select-hootsuite-instagram'
const Pusher = require('pusher-js');
Pusher.logToConsole = true;
let popup = null 
export default {
	name : 'UtilAddSocialAccount',
	components:{
		SelectFacebookPage,
		SelectHootsuiteInstagram
	},
	props:{
		data :{
			
		},
	},
	data(){
		return {
			is_loading : false,
			is_loading_social :{
				facebook : false ,
				twitter : false, 
				hootsuite  : false, 
			},
			is_connecting : false,
			pusher : null ,
			popup : null,
			timeout : null,
			social_type : '',
			modal :{
				visible : false,
				secret : '',
				personal_info  : null ,
				data : []
			},
			modal_intro_instagram : false,
			modal_hootsuite :{
				visible : false,
				data : []
			}
		}
	},
	computed:{
		...mapGetters({
			'shop' : 'auth/getShop',
			'allowedFacebook' : 'pricing/getAllowedSocialFacebook',
			'allowedTwitter' : 'pricing/getAllowedSocialTwitter',
			'quota' : 'pricing/getAccountQuota'
		}),
		is_available : function(){
			return this.quota.limit > this.quota.total
		},
		current_quota  : function(){
			return this.quota.limit - this.quota.total
		},
		allowedInstagram(){
			return true
		}
	},
	methods:{
		...mapActions({
			generalLinkSocial : 'account/general',
			getListSocial : 'account/list',
		}),
		...mapMutations({
			setShowModalAccount : 'pricing/setShowModalAccount'
		}),
		
		onClick(social_type){
			if( this.modal_intro_instagram ) {
				this.modal_intro_instagram = false
			}
			this.$emit('on-twitter-error'  , null )
			if( !this.is_available ){
				this.$emit('on-warning-pricing')
				return 
			}
			for (const key in this.is_loading_social) {
				if ( this.is_loading_social[key] ) {
					return;
				}
			}
			this.is_loading_social[social_type] = true
			this.social_type = social_type
			popup = window.open ( '' ,"_blank","menubar=1,resizable=1,width=900,height=700");
			this.timeout = setInterval(()=>{
				if (popup.closed) {
					this.closeNewTab()
				}
			}, 500)
			this.generalLinkSocial({ social  : social_type }).then((res)=>{
				if( res.status == 402 ){
					this.setShowModalAccount(true)
					this.closeNewTab()
					return 
				}
				let { status = false, data  = ''} = res.data
				if( status ){
					popup.location = data 
					this.initSocket()
				}else{
					this.closeNewTab()
				}
			})
			.catch((err)=>{
				this.closeNewTab()
			})
		},
		closeNewTab(){
			if( this.timeout ){
				clearInterval(this.timeout);
			}
			if( popup && popup.closed == false){
				popup.close()
			}
			for (const key in this.is_loading_social) {
				this.is_loading_social[key] = false 
			}
			this.social_type = ''
			this.closePusher()
		},
		initSocket(){
			this.pusher = new Pusher( process.env.VUE_APP_PUSHER_KEY , {
				cluster: 'ap1',
				forceTLS: true
			});
			var channel = this.pusher.subscribe(`${this.shop.id}`);
			channel.bind('auth_social', (payload)=>{
				console.log(payload);
				let { status = false , message = '' , data = null , personal_info = null  , social_type =null , secret = null } = payload
				if( status ){
					if( this.social_type == 'facebook'){
						this.modal.data = data.map((item)=>{
							var temp = _.find(this.data , { social_id : item.social_id })
							item['connected'] = temp ? true : false 
							return item
						})
						this.modal.visible = true
						this.modal.personal_info = personal_info
						this.modal.secret = secret
					}else if( this.social_type == 'twitter' ){
						this.$emit('on-connect' , data)
						this.toastSuccess({
							title : this.$t('account.toast.connect_twitter_success.title'),
							message : this.$t('account.toast.connect_twitter_success.message'),
						})
					}else if( this.social_type == 'hootsuite' ){
						this.modal_hootsuite.data = data.map((item)=>{
							var temp = _.find(this.data , { social_id : item.social_id })
							item['connected'] = temp ? true : false 
							return item
						})
						this.modal_hootsuite.visible = true
					}
				}else{
					if( this.social_type == 'twitter'){
						this.$emit('on-twitter-error' , { data , message })
					}
				}
				this.closeNewTab()
				this.closePusher()
			});
		},
		closePusher(){
			if( this.pusher ){
				this.pusher.disconnect();
			}
		},
		onCloseSelectFacebook(){
			this.modal.secret = '' 
			this.modal.personal_info = null
			this.modal.data = [] 
		},
		onConnected(payload){
			this.$emit('on-connect' , payload)
		},
		showModalInstagram(){
			this.modal_intro_instagram = true
		},
		afterCloseModalInstagram(){
			this.is_loading_instagram = false
		},
		handleConnectHootsuite(){
			this.modal_intro_instagram = false
			this.is_loading_instagram = true
		},
		onCloseSelectHootsuite(){
			this.modal_hootsuite.data = [] 
		}
	},
	beforeDestroy(){
		if( this.timeout ){
			clearInterval(this.timeout);
		}
		if( popup && popup.closed == false){
			popup.close()
		}
		this.closePusher()
	}
}
</script>
<style lang="scss">
.list-items-connect-social-account {
	display: flex;
	align-items: center;
	justify-content: center;
	&-loading{
		display: block;
		width: 100%;
		height: 126px;
	}
}
.item-connect-social-account {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 126px;
	height: 126px;
	border: 1px solid $border-color;
	border-radius: 4px;
	background-color: #fff;
	margin: 0 16px;
	padding: 16px;
	cursor: pointer;
	position: relative;
	&.is-disabled{
		opacity: 0.8;
	}
	&-content {
		text-align: center;
	}
	&-overlay {
		position: absolute;
		z-index: 10;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&-icon {
		font-size: 40px;

	}
	&-text {
		color: #4f4f4f;
		font-weight: 600;
		font-size: 14px;
		line-height: 22px;
	}
	&:hover {
		&:not(.is-loading , .is-disabled) {
			border-color: $primary-color;
			background-color: rgba(24, 144, 255, 0.1);
		}
	}
}
.item-row-social{
	padding: 5px 24px;
	border-bottom: 1px solid $border-color;
	background-color: #fff;
	cursor: pointer;
	user-select: none;
	&.is-disabled{
		opacity: 0.5;
	}
	&:hover{
		&:not(.is-disabled){
			background-color: #F3F3F3;
		}
	}
	&:first-child{
		border-top: 1px solid $border-color;
	}
	&:after{
		display: table;
		content :'';
		clear: both;
	}
	&-info{
		float: left;
		width: 70%;
		&-checkbox{
			&:after{
				display: table;
				content :'';
				clear: both;
			}
			.item-social-checkbox{
				width: 34px;
				float: left;
				height: 41px;
				display: flex;
				align-items: center;
			}
			.item-social-avatar{
				width: calc(100% - 34px);
				float: left;
			}
		}
		.item-social-account-title{
			flex-wrap: wrap;
			&-name{
				width: 100%;
			}
			&-status{
				width: 100%;
				font-size: 12px;
				&.status-success{
					color: $success;
				}
				&.status-error{
					color: $danger;
				}
			}
		}
	}
	&-type{
		float: left;
		width: 30%;
		line-height: 41px;
		font-size: 14px;
		text-align: right;
		text-transform: capitalize;
	}
}
.modal-connect-social-facebook , .modal-connect-hootsuite {
	&-header{
		padding: 24px 24px 0 24px;
	}
	&-body{
		.list-row-socials{
			max-height: 250px;
			overflow: hidden auto;
		}
		&-empty{
			padding: 80px 0;
			text-align: center;
			border-top: 1px solid $border-color;
			border-bottom: 1px solid $border-color;
			h3{
				font-weight: 600;
				font-size: 16px;
				line-height: 22px;
				margin: 0;
			}
		}
	}
	&-footer{
		padding: 24px;
		.ant-btn{
			height: 41px;
		}
	}
	.item-modal{
		&-title{
			font-weight: 600;
			font-size: 16px;
			line-height: 19px;
		}
		&-description{
			font-weight: normal;
			font-size: 14px;
			line-height: 17px;
		}
	}
}
.modal-connect-social-instagram{
	
	&-header{

	}
	&-wrap{
		min-height: 370px;
	}
	&-loading{
		height: 370px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&-intro{
		padding: 30px;
		text-align: center;
		&-icon{
			text-align: center;
		}
		&-title{
			font-weight: 600;
			font-size: 18px;
			line-height: 22px;
			max-width: 320px;
			margin-left: auto;
			margin-right: auto;
		}
		&-description{
			font-size: 14px;
			line-height: 17px;
			max-width: 380px;
			margin-left: auto;
			margin-right: auto;
			color: #4F4F4F;
		}
		&-link{
			font-size: 14px;
			line-height: 17px;
			a{
				color: $primary-color;
			}
		}
		&-btn{

		}
	}
}
</style>