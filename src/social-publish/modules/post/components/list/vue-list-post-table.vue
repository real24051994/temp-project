<template>
	<div class="vue-list-post-table list-items-table">
		<div class="item-row item-row-heading item-row-published" v-if="filters.status == 'published'">
			<div class="item-col item-post-info">{{ $t('post.title.post') }}</div>
			<div class="item-col item-post-publish-date">
				{{ $t('post.title.day_published') }}
				<router-link class="item-post-sort"  :to="setRouterLink(filters.sort)">
					<sh-icon v-if="filters.sort == 'DESC'" :icon="['far','chevron-down']" />
					<sh-icon v-else :icon="['far','chevron-up']" />
				</router-link>
			</div>
			<div class="item-col item-post-publish-by">
				{{ $t('post.title.published_by') }}
			</div>
			<div class="item-col item-post-action"></div>
		</div>
		<div class="item-row item-row-heading item-row-scheduled" v-else-if="filters.status == 'scheduled'">
			<div class="item-col item-post-info">{{ $t('post.title.post') }}</div>
			<div class="item-col item-post-schedule-date">
				{{ $t('post.title.day_scheduled') }}
				<router-link class="item-post-sort"  :to="setRouterLink(filters.sort)">
					<sh-icon v-if="filters.sort == 'DESC'" :icon="['far','chevron-down']" />
					<sh-icon v-else :icon="['far','chevron-up']" />
				</router-link>
			</div>
			<div class="item-col item-post-action"></div>
		</div>
		<div class="item-row item-row-heading item-row-draft" v-else-if="filters.status == 'draft'">
			<div class="item-col item-post-info">{{ $t('post.title.post') }}</div>
			<div class="item-col item-post-create-date">
				{{ $t('post.title.day_created') }}
				<router-link class="item-post-sort"  :to="setRouterLink(filters.sort)">
					<sh-icon v-if="filters.sort == 'DESC'" :icon="['far','chevron-down']" />
					<sh-icon v-else :icon="['far','chevron-up']" />
				</router-link>
			</div>
			<div class="item-col item-post-action"></div>
		</div>
		<div class="item-row item-row-heading item-row-error" v-else-if="filters.status == 'error'">
			<div class="item-col item-post-info">{{ $t('post.title.post') }}</div>
			<div class="item-col item-post-publish-date">
				{{ $t('post.title.day_published') }}
				<router-link class="item-post-sort"  :to="setRouterLink(filters.sort)">
					<sh-icon v-if="filters.sort == 'DESC'" :icon="['far','chevron-down']" />
					<sh-icon v-else :icon="['far','chevron-up']" />
				</router-link>
			</div>
			<div class="item-col item-post-publish-error">
				{{ $t('post.title.post_error') }}
			</div>
			<div class="item-col item-post-action"></div>
		</div>
		<div class="vue-list-post-table-wrap" v-if="loading"  key="is-loading">
			<div class="pd-5">
				<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>
		</div>
		<div class="vue-list-post-table-wrap" v-else key="loading-success">
			<template v-if="isError">
				<template v-if="isError == 'empty'">
					<div class="item-post-error-empty" v-if="filters.status == 'published'">
						<img src="@publish/assets/icons/no-publsihed-post.png" alt />
						<h3 class="show-display-text m-t-20">{{ $t('post.state.empty_published') }}</h3>
						<a-button class="m-t-20"  type="primary" @click="$POST_Modals.showModalPost()" >
							{{ $t('post.btn.create_post') }}
						</a-button>
					</div> 
					<div class="item-post-error-empty" v-if="filters.status == 'scheduled'">
						<img src="@publish/assets/icons/no-scheduled-posts.png" alt />
						<h3 class="show-display-text m-t-20">{{ $t('post.state.empty_scheduled') }}</h3>
						<a-button class="m-t-20"  type="primary" @click="$POST_Modals.showModalPost()" >
							{{ $t('post.btn.create_post') }}
						</a-button>
					</div> 
					<div class="item-post-error-empty" v-if="filters.status == 'draft'">
						<img src="@publish/assets/icons/no-draft-post.png" alt />
						<h3 class="show-display-text m-t-20">{{ $t('post.state.empty_draft') }}</h3>
						<a-button class="m-t-20"  type="primary" @click="$POST_Modals.showModalPost()" >
							{{ $t('post.btn.create_post') }}
						</a-button>
					</div> 
					<div class="item-post-error-empty" v-if="filters.status == 'error'">
						<img src="@publish/assets/icons/no-error-post.png" alt />
						<h3 class="show-display-text m-t-20">{{ $t('post.state.empty_error') }}</h3>
					</div> 
				</template>
				<template v-else-if="isError == '404' || isError == '500'">
					<div class="text-center m-t-50" >
						<img src="@publish/assets/icons/error-500.svg" alt />
						<h3 class="m-t-20" style="font-size: 22px">Can not load your list</h3>
						<p>Please reload Page</p>
					</div>
				</template>
			</template>
			<template v-else>
				<template v-if="data.length">
					<div v-for="(item , index) in data" :key="`index_${index}`" class="item-row item-post" :class="`item-row-${filters.status}`" @click="onSelect($event,item)">
						<template v-if="filters.status == 'published'">
							<div class="item-col item-post-info">
								<div class="item-post-media">
									<template v-if="item.post_type == 'image' || item.sub_type == 'image'">
										<div class="item-post-media-image">
											<img :src="getPostImage(item)" alt="">
										</div>
									</template>
									<template v-else-if="item.post_type == 'link' || item.sub_type === 'link'">
										<div class="item-post-media-link">
											<img src="@publish/assets/icons/link-img.png" alt="">
										</div>
									</template>
									<template v-else>
										<div class="item-post-media-text">			
											<img src="@publish/assets/icons/default-img.png" alt="">
										</div>
									</template>
									<img src="@publish/assets/icons/item-post-grid.png" alt="image" />
								</div>
								<div class="item-post-content">
									<div class="item-post-message">{{item.message}}</div>
									<div class="item-post-icon">
										<div class="item-post-icon-type">
											<template v-if="item.post_type == 'text'">
												<sh-icon icon="font" />
											</template>
											<template v-else-if="item.post_type == 'link'">
												<sh-icon icon="link" />
											</template>
											<template v-else-if="item.post_type == 'image'">
												<sh-icon icon="image" />
											</template>
											<template v-else-if="item.post_type == 'product'">
												<sh-icon icon="image"  v-if="item.sub_type == 'image'" />
												<sh-icon icon="link"  v-else-if="item.sub_type == 'link'" />
											</template>
										</div>
										<div v-for="(social , index) in item.social_type" :key="`index_${index}`" :class="`item-social social-${social}`" ></div>
									</div>
								</div>
								
							</div>
							<div class="item-col  item-post-publish-date" v-html="mixinFormatDateUTCtoTimezone(item.time_on , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
							<div class="item-col  item-post-publish-by">
								<template v-if="item.auto_post">
									<a-popover :title="false" placement="bottom" >
										<template slot="content">
											<div class="item-post-publish-by-popover">
												<div>Autopilot name</div>
												<div>
													<strong>{{ item.auto_post.title ? item.auto_post.title : ''}}</strong>
												</div>
											</div>
										</template>
										{{item.published_by ? item.published_by : '' }} <i class="text-primary m-l-4"><sh-icon icon="info-circle" /></i>
									</a-popover>
								</template>
								<template v-else >
									{{item.published_by ? item.published_by : '' }}
								</template>
							</div>
							<div class="item-col item-post-action">
								<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight">
									<a-button class="item-list-table-dropdown-btn">
										<sh-icon :icon="['far','ellipsis-h']" />
									</a-button>
									<a-menu slot="overlay" class="item-list-table-dropdown-menu">
										<!-- <a-menu-item key="0">
											<a :href="getViewPostLink(item)" target="_blank">{{ $t('post.btn.view_post') }}</a>
										</a-menu-item> -->
										<a-menu-item key="1">
											<a class="text-danger" href="javascript:void(0)" @click="handleDeletePost(item)">{{ $t('post.btn.delete') }}</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</template>
						<template v-else-if="filters.status == 'scheduled'">
							<div class="item-col item-post-info">
								<div class="item-post-media">
									<template v-if="item.post_type == 'image' || item.sub_type == 'image'">
										<div class="item-post-media-image">
											<img :src="getPostImage(item)" alt="">
										</div>
									</template>
									<template v-else-if="item.post_type == 'link' || item.sub_type === 'link'">
										<div class="item-post-media-link">
											<img src="@publish/assets/icons/link-img.png" alt="">
										</div>
									</template>
									<template v-else>
										<div class="item-post-media-text">
											<img src="@publish/assets/icons/default-img.png" alt="">
										</div>
									</template>
									<img src="@publish/assets/icons/item-post-grid.png" alt="image" />
								</div>
								<div class="item-post-content">
									<div class="item-post-message">{{item.message}}</div>
									<div class="item-post-icon">
										<div class="item-post-icon-type">
											<template v-if="item.post_type == 'text'">
												<sh-icon icon="font" />
											</template>
											<template v-else-if="item.post_type == 'link'">
												<sh-icon icon="link" />
											</template>
											<template v-else-if="item.post_type == 'image'">
												<sh-icon icon="image" />
											</template>
											<template v-else-if="item.post_type == 'product'">
												<sh-icon icon="image" v-if="item.sub_type == 'image'" />
												<sh-icon icon="link" v-else-if="item.sub_type == 'link'" />
											</template>
										</div>
										<div v-for="(social , index) in item.social_type" :key="`index_${index}`" :class="`item-social social-${social}`" ></div>
									</div>
								</div>
							</div>
							<div class="item-col  item-post-schedule-date" v-html="mixinFormatDateUTCtoTimezone(item.time_on , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
							<div class="item-col item-post-action">
								<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight">
									<a-button class="item-list-table-dropdown-btn">
										<sh-icon :icon="['far','ellipsis-h']" />
									</a-button>
									<a-menu slot="overlay" class="item-list-table-dropdown-menu">
										<a-menu-item key="1">
											<a class="text-danger" href="javascript:void(0)" @click="handleDeletePost(item)">{{ $t('post.btn.delete') }}</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</template>
						<template v-else-if="filters.status == 'draft'">
							
							<div class="item-col item-post-info">
								<div class="item-post-media">
									<template v-if="item.post_type == 'image' || item.sub_type == 'image'">
										<div class="item-post-media-image">
											<img :src="getPostImage(item)" alt="">
										</div>
									</template>
									<template v-else-if="item.post_type == 'link' || item.sub_type === 'link'">
										<div class="item-post-media-link">
											<img src="@publish/assets/icons/link-img.png" alt="">
										</div>
									</template>
									<template v-else>
										<div class="item-post-media-text">
											<img src="@publish/assets/icons/default-img.png" alt="">
										</div>
									</template>
									<img src="@publish/assets/icons/item-post-grid.png" alt="image" />
								</div>
								<div class="item-post-content">
									<div class="item-post-message">{{item.message}}</div>
									<div class="item-post-icon">
										<div class="item-post-icon-type">
											<template v-if="item.post_type == 'text'">
												<sh-icon icon="font" />
											</template>
											<template v-else-if="item.post_type == 'link'">
												<sh-icon icon="link" />
											</template>
											<template v-else-if="item.post_type == 'image'">
												<sh-icon icon="image" />
											</template>
											<template v-else-if="item.post_type == 'product'">
												<sh-icon icon="image" v-if="item.sub_type == 'image'" />
												<sh-icon icon="link" v-else-if="item.sub_type == 'link'" />
											</template>
										</div>
										<div v-for="(social , index) in item.social_type" :key="`index_${index}`" :class="`item-social social-${social}`" ></div>
									</div>
								</div>
							</div>
							<div class="item-col  item-post-create-date"  v-html="mixinFormatDateUTCtoTimezone(item.created_at , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
							<div class="item-col item-post-action">
								<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight">
									<a-button class="item-list-table-dropdown-btn">
										<sh-icon :icon="['far','ellipsis-h']" />
									</a-button>
									<a-menu slot="overlay" class="item-list-table-dropdown-menu">
										<a-menu-item key="1">
											<a class="text-danger" href="javascript:void(0)" @click="handleDeletePost(item)">{{ $t('post.btn.delete') }}</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</template>
						<template v-else-if="filters.status == 'error'">
							
							<div class="item-col item-post-info">
								<div class="item-post-media">
									<template v-if="item.post_type == 'image' || item.sub_type == 'image'">
										<div class="item-post-media-image">
											<img :src="getPostImage(item)" alt="">
										</div>
									</template>
									<template v-else-if="item.post_type == 'link' || item.sub_type === 'link'">
										<div class="item-post-media-link">
											<img src="@publish/assets/icons/link-img.png" alt="">
										</div>
									</template>
									<template v-else>
										<div class="item-post-media-text">
											<img src="@publish/assets/icons/default-img.png" alt="">
										</div>
									</template>
									<img src="@publish/assets/icons/item-post-grid.png" alt="image" />
								</div>
								<div class="item-post-content">
									<div class="item-post-message">{{item.message}}</div>
									<div class="item-post-icon">
										<div class="item-post-icon-type">
											<template v-if="item.post_type == 'text'">
												<sh-icon icon="font" />
											</template>
											<template v-else-if="item.post_type == 'link'">
												<sh-icon icon="link" />
											</template>
											<template v-else-if="item.post_type == 'image'">
												<sh-icon icon="image" />
											</template>
											<template v-else-if="item.post_type == 'product'">
												<sh-icon icon="image" v-if="item.sub_type == 'image'" />
												<sh-icon icon="link" v-else-if="item.sub_type == 'link'" />
											</template>
										</div>
										<div v-for="(social , index) in item.social_type" :key="`index_${index}`" :class="`item-social social-${social}`" ></div>
									</div>
								</div>
							</div>
							<div class="item-col  item-post-publish-date" v-html="mixinFormatDateUTCtoTimezone(item.time_on , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
							<div class="item-col  item-post-publish-error">
								<a-popover :title="false" placement="bottom" >
									<template slot="content">
										<div class="item-post-status-popover">
											{{item.error_message ? item.error_message.message : ''}}
										</div>
									</template>
									<span v-line-clamp:20="2" class="item-post-publish-error-message"><i class="m-r-5"><sh-icon :icon="['far','exclamation-circle']" /></i>{{item.error_message ? item.error_message.message : ''}}</span>
								</a-popover>
							</div>
							<div class="item-col item-post-action">
								<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight">
									<a-button class="item-list-table-dropdown-btn">
										<sh-icon :icon="['far','ellipsis-h']" />
									</a-button>
									<a-menu slot="overlay" class="item-list-table-dropdown-menu">
										<a-menu-item key="2">
											<a class="text-danger" href="javascript:void(0)" @click="handleDeletePost(item)">{{ $t('post.btn.delete') }}</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</template>
					</div>
					<div class="m-t-16">
						<vue-pagination v-model="current_page" :total="total" />
					</div>
				</template>
				<template v-else>
					<div class="item-post-error item-post-error-not-found" >
						<h3>{{ $t('post.state.notfound') }}</h3>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'VueListPostTable',
	mixins : [mixin_time_format],
	props:{
		data : {
			type : Array,
			required : true,
		},
		filters :{
			type : Object,
		},
		isError :{
			type : [Boolean, String, Number],
			default : false,
		},
		loading : {
			type : Boolean,
			default : false,
		},
		page :{
			type : [ String, Number]
		},
		total :{
			type : [ String, Number]
		},
		setRouterLink:{
			type : Function,
		},
	},
	computed:{
		current_page :{
			get(){
				return this.page 
			},
			set(value){
				this.$emit('update:page' , value)
			}
		},
		loading_rows(){
			return this.data && this.data.length ? this.data.length  : 5
		}
	},
	methods:{
		...mapActions({
			deletePost : 'post/delete',
			dataLayer : 'auth/dataLayer'
		}),
		sortDate(){

		},
		formatDate(date) {
			var date = moment.utc(date , 'YYYY-MM-DD HH:mm:ss' , true).local()
			return `<strong>${date.format("hh:mm A")}</strong> ${date.format("DD/MM/YYYY")}`;
		},
		getPostImage(item){
			if( item.post_type == 'product' || item.post_type == 'image' ){
				if( item.medias.length  && item.medias[0].url){
					return item.medias[0].url
				}
			}
			return '';
		},
		reload() {
			this.$emit('on-reload')
		},
		hasImage(item){
			let { post_type = '', sub_type = '' } = item
			return post_type == 'image' || ( post_type == 'product' && sub_type == 'image' )
		},
		onSelect($event , item){
			var target = $($event.target)
			if( !target.is('.item-list-table-dropdown-btn , .item-list-table-dropdown-btn *')){
				this.$POST_Modals.showModalPost({ post_id : item.id})
			}
		},
		handleDeletePost(payload){
			let { id , status } = payload 
			if( status == 'published'){
				this.$confirm({
					confirmLoading: true,
					title: this.$t('post.dialog.delete_post.title'),
					content: this.$t('post.dialog.delete_post.content'),
					okText : this.$t('post.dialog.delete_post.ok_text'),
					cancelText : this.$t('post.dialog.delete_post.cancel_text'),
					checkbox : true,
					checkboxValue : true ,
					checkboxContent : 'Delete post from social',
					okType:'danger',
					onOk : ({ checkbox })=>{
						return new Promise((resolve, reject) => {
							this.deletePost({ id  , delete_from_social : checkbox }).then((res)=>{
								let { status = false } = res.data 
								if( status ){
									this.toastSuccess({
										title : this.$t('post.toast.delete_post_success.title'),
										message: this.$t('post.toast.delete_post_success.content'),
									})
									this.reload()
									this.dataLayer({
										"toast" : "Post Deleted On Published"
									})
								}else{
									this.toastError({
										title : this.$t('post.toast.error.title'),
										message: this.$t('post.toast.error.content'),
									})
								}
								resolve()
							})
							.catch((err)=>{
								this.toastError({
									title : this.$t('post.toast.error.title'),
									message: this.$t('post.toast.error.content'),
								})
								resolve()
							})
						})
						
					},
					onCancel :()=>{

					}
				})
			}else{
				this.$confirm({
					confirmLoading: true,
					title: this.$t('post.dialog.delete_post.title'),
					content: this.$t('post.dialog.delete_post.content'),
					okText : this.$t('post.dialog.delete_post.ok_text'),
					cancelText : this.$t('post.dialog.delete_post.cancel_text'),
					okType:'danger',
					onOk : ()=>{
						return new Promise((resolve, reject) => {
							this.deletePost({ id }).then((res)=>{
								let { status = false } = res.data 
								if( status ){
									this.toastSuccess({
										title : this.$t('post.toast.delete_post_success.title'),
										message: this.$t('post.toast.delete_post_success.content'),
									})
									this.reload()
									var dataLayerMessage = ''
									if( this.filters.status == 'scheduled'){
										dataLayerMessage = "Post Deleted On Scheduled"
									}else if( this.filters.status == 'draft' ){
										dataLayerMessage = "Post Deleted On Draft"
									}else if( this.filters.status == 'draft' ){
										dataLayerMessage = "Post Deleted On Error"
									}
									this.dataLayer({
										"toast" : dataLayerMessage
									})
								}else{
									this.toastError({
										title : this.$t('post.toast.error.title'),
										message: this.$t('post.toast.error.content'),
									})
								}
								resolve()
							})
							.catch((err)=>{
								this.toastError({
									title : this.$t('post.toast.error.title'),
									message: this.$t('post.toast.error.content'),
								})
								resolve()
							})
						})
						
					},
					onCancel :()=>{

					}
				})
			}
			
		},
		getViewPostLink(item){
			let { post_social_id = '' , social = ''} = item 
			let link = ''
			if( post_social_id && social ){
				if( social.social_type == 'facebook'){
					link = 'https://www.facebook.com/' + post_social_id
				}else if( social.social_type == 'twitter'){
					link = social.social_url + '/status/' + post_social_id
				}
			}
			return link
		}
	},
}
</script>
<style lang="scss" scoped>
	.vue-list-post-table{
		.item-post{
			&-info{
				@include col;
			}	
			&-action{
				@include flex(10%);
			}
		}
		.item-row{
			&-published{
				.item-post{
					&-publish-date{
						@include flex(20%);
					}
					&-publish-by{
						@include flex(20%);
					}
				}
			}
			&-scheduled{
				.item-post{
					&-schedule-date{
						@include flex(30%);
					}
				}
			}
			&-draft{
				.item-post{
					&-create-date{
						@include flex(30%);
					}
				}
			}
			&-error{
				.item-post{
					&-publish-date{
						@include flex(20%);
					}
					&-publish-error{
						@include flex(20%);
					}
				}
			}
		}
	}
	.item-post-publish{
		&-error{
			&-message{
				word-break: break-word !important;
				color: $danger;
			}
		}
		&-by-popover{
			max-width: 250px;
			font-size: 12px;
			strong{
				font-size: 14px;
				font-weight: 600;
			}
		}
	}
</style>