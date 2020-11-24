<template>
	<div class="vue-list-gallery-grid">
		<transition name="fade-in" mode="out-in">
			<div class="app-box-loading" v-if="loading"  key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div class="vue-list-gallery-grid-wrap" v-else key="loading-success">
				<template v-if="data && data.length">
					<div class="list-grid-gallery">
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
								<div class="item-gallery-action">
									<a-button   @click="handleDelete(item.id)" type="outline-danger">
										<sh-icon :icon="['fal','trash-alt']" />
									</a-button>
								</div>
							</div>
							<div class="item-gallery-content">
								<div class="item-gallery-title" >
									<img svg-inline src="@widget/assets/icons/instagram.svg" alt=""> {{ item.name | galleryName }}
								</div>
							</div>
						</div>
						<div  class="item-gallery item-gallery-add-more"  @click="$emit('on-add-gallery')">
							<div class="item-gallery-image">
								<div class="item-gallery-wrap">
									<i>
										<sh-icon :icon="['fal','plus']" />
									</i>
								</div>
							</div>
							<div class="item-gallery-content">
								<div class="item-gallery-title text-center" >
									Add new gallery 
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="item-error-empty" v-if="data == null ">
						<img src="@widget/assets/icons/empty.png"  />
						<h3 class="show-display-text m-t-20">No Gallery </h3>
						<a-button type="primary" @click="$emit('on-add-gallery')">
							Add new gallery
						</a-button>
					</div>
					<div class="item-error-empty" v-else>
						<img src="@widget/assets/icons/empty.png"  />
						<h3 class="show-display-text m-t-20">No result found ! </h3>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'VueListGalleryTable',
	props:{
		data :{
			required: true,
		},
		loading :{
			type : Boolean,
			default : false
		},
	},
	data(){
		return{

		}
	},
	computed:{

	},
	methods:{
		...mapActions({
			deleteGallery : 'gallery/delete'
		}),
		onSelect($event,item){
			var target = $($event.target)
			if( !target.is('.item-gallery-action , .item-gallery-action *')){
				this.redirect({
					name : 'GalleryDetail',
					params :{
						id : item.id
					}
				})
			}
		},
		handleDelete(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Delete',
				content: 'Do you want to remove this gallery ?',
				okText : 'Delete',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteGallery({ id }).then((res)=>{
							let { status = false  , data = null } = res.data 
							if( status ){
								if( data ){
									this.toastError({
										title : 'Error',
										message: "This gallery is being used by another widget, Please delete widget first !",
									})
								}else{
									this.toastSuccess({
										title: "Done !",
										message: "Delete gallery success",
									})
									this.$emit('reload')
								}
								
							}else{
								this.toastError({
									title : 'Error',
									message: "Error when delete this gallery, Please try again later !",
								})
							}
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message:  "Error when delete this gallery, Please try again later !",
							})
						})
						.finally(()=>{
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		}
	},
	filters : {
		galleryName : function(value){
			if( typeof value == 'string'){
				return value.replace(/Gallery instagram/, '').trim()
			}
			return value 
		}
	}
}
</script>
<style lang="scss" >
	
	.vue-list-gallery-grid{
		.item-error-empty{
			padding: 30px 0;
			text-align: center;
		}
		img{
			max-width: 100%;
		}
		
	}
	.item-gallery-dropdown-menu{
		.ant-dropdown-menu-item{
			a{
				min-width: 100px;
			}
		}
	}
</style>