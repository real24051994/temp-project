<template>
	<div class="pd-30 app-register-connect-instagram">
		<div class="page-title m-b-16">Connect to social account</div>
		<transition name="fade-in" mode="out-in">
			<div class="p-t-30 p-b-30" v-if="is_loading_page" key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div v-else  key="is-loading-success">
				<div class="list-grid-gallery p-t-30">
					<div v-for="(item , index) in data" :key="`index_${index}`" class="item-gallery" @click="onSelect($event,item)">
						<div class="item-gallery-image">
							<div class="item-gallery-wrap">
								<div class="list-items-thumb">
									<div class="item-thumb" v-for="(thumb,thumb_index) in item.sw_images" :key="`item_thumb_${thumb_index}`">
										<div class="item-thumb-wrap">
											<v-lazy-image  v-if="thumb.media_url" :src="thumb.media_url" :src-placeholder="require('@widget/assets/images/default.png')" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="item-gallery-content">
							<div class="item-gallery-title" >
								{{ item.name }}
							</div>
						</div>
					</div>
					<connect-instagram-pusher @on-success="onLoginSuccess">
						<template slot="icon">
							<i class="item-gallery-icon">
								<sh-icon :icon="['sh','instagram']" />
							</i>
						</template>
					</connect-instagram-pusher>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import ConnectInstagramPusher from './register-step-connect-instagram-pusher'
import { mapActions } from "vuex";
export default {
	name : 'RegisterConnectInstagram',
	components :{
		ConnectInstagramPusher
	},
	props :{
		value :{

		}
	},
	data(){
		return {
			is_loading_page : false,
			is_loading : false,
			is_popup : false,
			url : ''
		}
	},
	computed: {
		data  : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		}
	},
	methods:{
		...mapActions({
			'getListGallery' : 'gallery/getAll'
		}),
		onLoginSuccess(payload){
			let { status = false , message = 'Connection error , please try again later' } = payload 
			if( status ){
				this.is_loading_page = false
				this.getListGallery().then((res)=>{
					let { status = false , data = [] } = res.data 
					if( status ){
						this.$emit('input' , data )
						if( data && data.length ){
							this.$emit('update:step' , 1)
						}
					}else{
						this.$emit('input' , data )
					}
				})
				.finally(()=>{
					this.is_loading_page = false
				})
			}else{
				this.toastWarning({
					title : 'Error !',
					message : message
				})
			}
		},
	}
}
</script>
<style lang="scss">

	.app-register-connect-instagram{
		.list-grid-gallery{
			justify-content: center;
			.item-gallery{
				&-icon{
					background: $instagram;
					border-radius: 3px;
					width: 35px;
					height: 35px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
				}
				&.item-gallery-add-more{
					width: 160px;
					.item-gallery-wrap{
						border-radius: 4px;
					}
				}
			}
		}
	}
	
</style>