<template>
	<div  class="item-gallery item-gallery-add-more"  @click="openNewTab()">
		<div class="item-gallery-image">
			<div class="item-gallery-wrap" v-if="is_loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div class="item-gallery-wrap" v-else>
				<slot name="icon">
					<i>
						<sh-icon :icon="['fal','plus']" />
					</i>
				</slot>
			</div>
		</div>
		<div class="item-gallery-content">
			<div class="item-gallery-title text-center" >
				Connect Intagram
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters , mapActions } from 'vuex'
const Pusher = require('pusher-js');
Pusher.logToConsole = false;
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
