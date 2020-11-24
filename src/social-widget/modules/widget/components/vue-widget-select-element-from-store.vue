<template>
	<div  class="vue-select-element" :class="{ 'is-disabled' : disabled }">
		<div class="vue-select-element-wrap">
			<a-button @click="openNewTab" :disabled="disabled">
				Select Element
			</a-button>
		</div>
		<template v-if="page_custom_element">
			<div class="row m-t-8">
				<div class="col col-6">
					<div>
						<label>Element's Class</label>
					</div>
					<div class="m-t-8">
						<a-input v-model="page_custom_element" :disabled="disabled"></a-input>
					</div>
				</div>
				
				<div class="col col-6">
					<div>
						<label>Element Position</label>
					</div>
					<div  class="m-t-8">
						<a-select v-model="page_custom_position" placeholder="Select position" :disabled="disabled">
							<a-select-option v-for="(item,index) in positions"  :key="index" :value="item.id">
								{{ item.name }}
							</a-select-option>
						</a-select>
					</div>
				</div>
			</div>
		</template>
		<a-modal title="Select Element"  v-model="visible" :afterClose="afterClose" :destroyOnClose="true"  :footer="false" width="600px">
			<div class="vue-select-element-modal">
				<img src="@widget/assets/icons/select-element.gif" alt="">
			</div>
		</a-modal>
	</div>
</template>
<script>
import Pusher from 'pusher-js';
import { mapGetters, mapActions } from 'vuex';
export default {
	name : 'SelectElement',
	props:{
		element : {
			type : String,
			require : true,
		},
		position : {
			type : String,
			require : true,
		},
		disabled:{
			type : Boolean,
			default : false, 
		},
		url :{ 
			type : String,
			default : ''
		}
	},
	data(){
		return {
			is_loading : false,
			is_loading_preview: false,
			pusher : null ,
			popup : null,
			timeout : null,
			visible : false,
			backdrop : false,
			positions : [
				{
					id : 'before',
					name : 'Before'
				},
				{
					id : 'after',
					name : 'After'
				},
				{
					id : 'append',
					name : 'Append'
				},
				{
					id : 'prepend',
					name : 'Prepend'
				}
			]
		}
	},
	computed:{
		...mapGetters({
			token : 'auth/getToken',
			shop : 'auth/getShop',
		}),
		page_custom_element : {
			get(){
				return this.element
			},
			set(value){
				this.$emit('update:element', value)
			}
		},
		page_custom_position : {
			get(){
				return this.position
			},
			set(value){
				this.$emit('update:position', value)
			}
		}
	},
	methods:{
		openNewTab() {
			this.visible = true
			var preview_url = `${this.url}&rawDomain=${this.shop.raw_domain}&action=choose-element&token=${this.token}`
			var width = $(window).width()
			var height = $(window).height()
			this.popup = window.open ( preview_url ,"Socialwidget Select Element","menubar=1,resizable=1,width="+width+",height="+height+"");
			this.timeout = setInterval(()=>{
				if (this.popup.closed) {
					this.closeNewTab()
				}
			}, 500)
			this.initSocket()
		},
		closeNewTab(){
			if( this.timeout ){
				clearInterval(this.timeout);
			}
			if( this.popup && this.popup.closed == false){
				this.popup.close()
			}
			this.closePusher()
			this.visible = false
		},
		initSocket(){
			this.pusher = new Pusher( process.env.VUE_APP_PUSHER_KEY , {
				cluster: 'ap1',
				forceTLS: true
			});
			var channel = this.pusher.subscribe(`social_widget_${this.shop.id}`);
			channel.bind('choose-element', (payload)=>{
				console.log(payload);
				if( this.visible ){
					let { className = '' , position = ''} = payload
					this.page_custom_element = className
					this.page_custom_position = position
					this.closeNewTab()
					this.visible = false
				}
			});
		},
		closePusher(){
			if( this.pusher ){
				this.pusher.disconnect();
			}
		},
		afterClose(){
			this.closeNewTab()
		}
	},
	filters:{
		formatElement : function(value){
			if( value ){
				var temp = value.split(' ').filter(Boolean).slice(-1).pop()
				return temp ? temp : ''
			}
			return ''
		},
		formatPosition : function(value){
			if( value ){
				return value == 'before' ? 'Above' : 'Below'
			}
			return ''
		},
	},
	mounted(){

	},
	beforeDestroy(){
		if( this.timeout ){
			clearInterval(this.timeout);
		}
		if( this.popup && this.popup.closed == false){
			this.popup.close()
		}
		this.visible = false 
		this.closePusher()
	}
}
</script>
<style lang="scss">
	.vue-select-element{
		&-wrap{
			display: flex;
			.ant-btn{
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
			.ant-input{
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left: 0;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		&-modal{
			img{
				max-width: 100%;
			}
		}
	}
</style>