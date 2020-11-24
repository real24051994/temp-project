<template>
	<div class="vue-social-widget">
		<transition name="fade-in" mode="out-in">
			<div class="app-box-loading" v-if="is_loading_page" key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div class="vue-social-widget-container" v-else key="is-loading-success">
				<template v-if="is_loading_error">
					<div class="vue-social-widget-error" v-if="is_loading_error == 404">
						<vue-error type="404"></vue-error>
					</div>
					<div class="vue-social-widget-error" v-else-if="is_loading_error == 500">
						<vue-error type="500"></vue-error>
					</div>
				</template>
				<template v-else>
					<div class="container p-b-50 p-t-50">
						<div class="row">
							<div class="col col-6">
								<h1 class="page-title">
									Gallery Detail
								</h1>
							</div>
						</div>
						<transition name="fade-in" mode="out-in">
							<div class="row m-t-10" v-if="is_syncing" key="sync-success">
								<div class="col col-12">
									<vue-gallery-detail-sync-images :id="id" />
								</div>
							</div>
							<div class="row m-t-10"  v-else key="sync-success">
								<div class="col col-12">
									<template v-if="data.token_expired">
										<div class="alert-warning m-t-20" role="alert">
											Access token has expired. Please connect your Instagram account again following the instructions in this <a href="https://help.socialhead.io/en/articles/4318594-how-to-get-a-new-access-token-for-instagram" target="_blank"><strong>article</strong></a> to get your gallery updated automatically every 6 hours.
										</div>
									</template>
									<template v-else >
										<div class="alert-warning m-t-20" role="alert">
											Your images and videos will be updated automatically every 6 hours
										</div>
									</template>
								</div>
								<div class="col col-12" v-if="pagination.data.length">
									<div class="list-images-from-gallery" >
										<template v-for="(item,index) in pagination.data">
											<div  v-if="item.media_type == 'IMAGE'" class="item-image-gallery"  :key="`index_${index}`">
												<div class="item-image-gallery-wrap" @click="openImage(item.media_url)">
													<v-lazy-image  :src="item.media_url" :src-placeholder="require('@widget/assets/images/default.png')" />
												</div>
											</div>
											<div  v-else-if="item.media_type == 'VIDEO'" class="item-image-gallery"  :key="`index_${index}`">
												<div class="item-image-gallery-wrap" @click="openVideo(item.media_video)">
													<video :poster="item.media_url">
														<source  :src="item.media_video" type="video/mp4">
													</video>
													<div class="item-image-gallery-wrap-icon">
														<img src="@widget/assets/icons/icon-video.png" alt="">
													</div>
												</div>
											</div>
											<div  v-else-if="item.media_type == 'CAROUSEL_ALBUM'" class="item-image-gallery"  :key="`index_${index}`">
												<div class="item-image-gallery-wrap" @click="openCarousel(item.media_carousel)">
													<v-lazy-image  :src="item.media_url" :src-placeholder="require('@widget/assets/images/default.png')" />
													<div class="item-image-gallery-wrap-icon">
														<img src="@widget/assets/icons/icon-slide.png" alt="">
													</div>
												</div>
											</div>
										</template>
										
									</div>
								</div>
								<div class="col col-12" v-else>
									<div class="text-center">
										<img src="@publish/assets/icons/no-queue.png"  />
										<h3 class="show-display-text m-t-20">No images</h3>
									</div>
								</div>
								<div class="col col-12">
									<div class="text-center p-t-16 p-b-16" v-if="this.pagination.current_page < this.pagination.total_page">
										<a-button type="primary" @click="handleLoad" :loading="is_loading_image">
											Load more
										</a-button>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import VueGalleryDetailSyncImages from '../components/vue-gallery-detail-sync-images'
export default {
	name : "GaleryDetail",
	components:{
		VueGalleryDetailSyncImages,
	},
	metaInfo(){
		return {
			title: 'Gallery Detail'
		}
	},
	data(){
		return {
			data : [] ,
			is_loading_page : true ,
			is_loading_error : false ,
			is_loading_image : false,
			is_loading_image_error : false,
			is_first_loading_success: false,
			is_syncing : false,
			pagination : {
				data : [],
				current_page : 1,
				total_page : null,
			},
			id : ''
		}
	},
	methods :{
		...mapActions({
			'getGalleryDetail' : 'gallery/get',
			'getImageFromGallery' : 'gallery/getImage'
		}),
		loadMore(){
			return new Promise((resolve, reject)=>{
				this.is_loading_image = true
				this.getImageFromGallery({
					id : this.id,
					current_page : this.pagination.current_page 
				})
				.then((res)=>{
					let { status = false, data = null , pagination} = res.data 
					if( status ){
						this.pagination.data = this.pagination.data.concat(data)
						this.pagination.current_page = pagination.current_page
						this.pagination.total_page = pagination.total_page
					}
				})
				.catch((err)=>{
					this.is_loading_image_error=  true 
				})
				.finally(()=>{
					this.is_loading_image = false
					resolve()
				})
			});
		},
		handleLoad(){
			if( this.is_loading_image ) return 
			this.is_loading_image = true 
			this.pagination.current_page += 1
			this.loadMore()
		},
		openImage (src) {
			$.fancybox.open({
				src  : src,
				opts : {}
			});
		},
		openVideo(src){
			$.fancybox.open({
				src  : src,
				opts : {}
			});
		},
		openCarousel(arr){
			var photos = arr.map((item)=>{
				return {
					src : item.media_url,
					thumb : item.media_url,
				}
			})
			// $.fancybox.open({
			// 	src  : photos,
			// 	opts : {}
			// });
			$.fancybox.open(photos,{	});
		},
		async loadDetail(){
			let id = this.$route.params.id
			this.id = id
			try {
				let detail = await this.getGalleryDetail({id})
				let { status = false , data } = detail.data
				if( status ){
					let { sync_success  = false } = data 
					this.data = data 
					if( !sync_success ){
						this.is_syncing = true
					}else{
						await this.loadMore()
						this.is_loading_page = false
					}
				}else{
					this.is_loading_error = 404
					this.is_loading_page = false
				}
			} catch (e) {
				this.is_loading_page = false
				this.is_loading_error = 500 
			}
		},
	},
	mounted(){
		this.loadDetail()
	}
}
</script>
<style lang="scss" scoped>
	.list-images-from-gallery{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin-left: -5px;
		margin-right: -5px;
	}
	.alert-warning{
		position: relative;
		padding: .75rem 1.25rem;
		margin-bottom: 1rem;
		border: 1px solid #ffeeba;
		border-radius: .25rem;
		color: #856404;
		background-color: #fff3cd;
		a{
			color: #856404;
			&:hover{
				color: $primary-color;
			}
		}
	}
</style>