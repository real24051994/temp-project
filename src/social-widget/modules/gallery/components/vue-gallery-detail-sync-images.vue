<template>
	<div>
		syning gallery from instagram ...
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
const Pusher = require('pusher-js');
export default {
	name : 'GalleryDetailLoading',
	props:{
		id :{
			type : String,
			required : true,
		}
	},
	data(){
		return {
			pusher : null
		}
	},
	computed:{
		...mapGetters({
			'shop' : 'auth/getShop'
		})
	},
	created(){
		Pusher.logToConsole = true;
		this.pusher = new Pusher( process.env.VUE_APP_PUSHER_KEY , {
			cluster: 'ap1',
			forceTLS: true
		});
		var channel = this.pusher.subscribe(`${this.shop.id}`);
		channel.bind(`sw_sync_images_${this.id}`, (data)=>{
			this.$emit('on-success', data)
		});
	},
	beforeDestroy(){
		if( this.pusher ){
			this.pusher.disconnect();
		}
	}
}
</script>