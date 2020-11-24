<template>
	<a-button  class="btn-integrate btn-primary" @click="onClick()" :loading="is_loading">
		{{ label }}
	</a-button>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
const Pusher = require('pusher-js');
Pusher.logToConsole = false
let popup = null 
export default {
	name : 'BitlyAuthorization',
	props:{
		label :{
			type : String,
		}
	},
	data(){
		return {
			is_loading : false,
			pusher : null ,
			popup : null,
			timeout : null,
		}
	},
	computed:{
		...mapGetters({
			'shop' : 'auth/getShop'
		})
	},
	methods:{
		...mapActions({
			'generalBitlyUrl' : 'intergate/generalBitlyUrl',
		}),
		onClick(){
			if( this.is_loading ) return ;
			this.is_loading = true 
			popup = window.open ( '' ,"Socialpublish","menubar=1,resizable=1,width=900,height=500");
			this.timeout = setInterval(()=>{
				if (popup.closed) {
					clearInterval(this.timeout);
					popup = null 
					this.closeNewTab()
				}
			}, 500);
			
			this.generalBitlyUrl().then((res)=>{
				let { status = false , data = ''} = res.data 
				if( status ){
					popup.location = data
					this.initSocket()
				}else{
					this.closeNewTab()
				}
			})
			.catch(()=>{
				this.closeNewTab()
			})
		},
		closeNewTab(){
			if( this.timeout ){
				clearInterval(this.timeout);
			}
			if( popup && popup.closed == false){
				popup.close();
			}
			this.is_loading = false
		},
		initSocket(){
			this.pusher = new Pusher( process.env.VUE_APP_PUSHER_KEY , {
				cluster: 'ap1',
				forceTLS: true
			});
			var channel = this.pusher.subscribe(`${this.shop.id}`);
			channel.bind('auth_bitly', (data)=>{
				this.$emit('on-success', data)
				this.closeNewTab()
				this.closePusher()
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
			popup.close();
		}
		this.closePusher()
	}
}
</script>