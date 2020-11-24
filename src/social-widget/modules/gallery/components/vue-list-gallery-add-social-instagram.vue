<template>
	<div class="item-connect-social-account" @click="openNewTab()" >
		<div class="item-connect-social-account-content" :class="{ 'is-loading' : is_loading }">
			<div class="item-connect-social-account-icon icon-instagram">
				<sh-icon :icon="['sh','instagram']" />
			</div>
			<div class="item-connect-social-account-text">Instagram</div>
			<div class="item-connect-social-account-overlay" v-if="is_loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters , mapActions } from 'vuex'
const Pusher = require('pusher-js');
Pusher.logToConsole = true;
var popup = null 
export default {
	name : 'VueListGalleryAddSocialInstagram',
	props: {
		url : {
			type : String
		}
	},
	data(){
		return {
			is_loading : false,
			is_loading_page: true,
			pusher : null ,
			timeout : null,
		}
	},
	computed:{
		...mapGetters({
			'shop' : 'auth/getShop',
		})
	},
	methods:{
		...mapActions({
			'generalLinkSocial' : 'gallery/generalLinkSocial'
		}),
		openNewTab() {
			this.is_loading = true
			popup = window.open ( '' ,"_blank","menubar=1,resizable=1,width=900,height=500");
			this.timeout = setInterval(()=>{
				if (popup.closed) {
					this.closeNewTab()
				}
			}, 500)
			this.generalLinkSocial({ social  : 'instagram_basic' }).then((res)=>{
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
			.finally(()=>{
				
			})
			
		},
		closeNewTab(){
			if( this.timeout ){
				clearInterval(this.timeout);
			}
			if( popup && popup.closed == false){
				popup.close()
			}
			this.closePusher()
			this.is_loading = false
		},
		initSocket(){
			this.pusher = new Pusher( process.env.VUE_APP_PUSHER_KEY , {
				cluster: 'ap1',
				forceTLS: true
			});
			var channel = this.pusher.subscribe(`${this.shop.id}`);
			channel.bind('auth_instagram', (data)=>{
				console.log(data);
				this.$emit('on-success', data)
				this.closeNewTab()
			});
		},
		closePusher(){
			if( this.pusher ){
				this.pusher.disconnect();
			}
		},
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
<style lang="scss" scoped>
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
			width: 27px;
			height: 27px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border-radius: 4px;
			font-size: 16px;
			color: #fff;
			background-color: $instagram;
		}
		&-text {
			color: #4f4f4f;
			font-weight: 600;
			font-size: 14px;
			line-height: 22px;
			margin-top: 8px;
		}
		&:hover {
			&:not(.is-loading) {
				border-color: $primary-color;
				background-color: rgba(24, 144, 255, 0.1);
			}
		}
	}
</style>