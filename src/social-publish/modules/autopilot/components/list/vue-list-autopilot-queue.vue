<template>
	<div class="vue-list-post-table list-items-table">
		<div class="item-row item-row-heading  item-post">
			<div class="item-col item-post-info">{{ $t('queue.table.queue_post') }}</div>
			<div class="item-col item-post-publish-date">{{ $t('queue.table.queue_published') }}</div>
			<div class="item-col item-post-autopilot-by">{{ $t('queue.table.queue_autopilot') }}</div>
			<div class="item-col item-post-action"></div>
		</div>
		<div v-if="loading" class="p-t-15 p-b-15">
			<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
		</div>
		<div class="vue-list-post-table-wrap" v-else>
			<template v-if="data.length">
				<div v-for="(item , index) in data" :key="`index_${index}`" class="item-row item-post" @click="onSelect($event,item)">
					<div class="item-col item-post-info">
						<div class="item-post-status">
							<template v-if="item.is_valid == false">
								<a-popover :title="false" placement="bottom" >
									<template slot="content">
										<div class="item-post-status-popover" v-if="item.error_message">
											<template v-if="typeof item.error_message == 'string'">
												{{item.error_message}}
											</template>
											<template v-else>
												{{ item.error_message.length ? item.error_message.first() : '' }}
											</template>
										</div>
									</template>
									<i class="text-danger"><sh-icon icon="exclamation-circle"  /></i>
								</a-popover>
							</template>
							<template v-else-if="item.is_available == true">
								<i class="text-gray"><sh-icon :icon="['far','check-circle']" /></i>
							</template>
							<template v-else>
								<i class="text-success"><sh-icon :icon="['far','check-circle']" /></i>
							</template>
						</div>
						<div class="item-post-media">
							<template v-if="item.preview_image">
								<div class="item-post-media-image" >
									<img :src="item.preview_image" alt="">
									<!-- <img :src="item.product_json.selected_images.first()" alt=""> -->
								</div>
							</template>
							<template v-else>
								<div class="item-post-media-link">
									<img src="@publish/assets/icons/link-img.png" alt="">
								</div>
							</template>
						</div>
						<div class="item-post-content">
							<div class="item-post-message">{{ item.content }}</div>
							<div class="item-post-icon">
								<div class="item-post-icon-type">
									<template v-if="item.product_share_type == 'link'">
										<sh-icon icon="link" />
									</template>
									<template v-else-if="item.product_share_type == 'image'">
										<sh-icon icon="image" />
									</template>
								</div>
								<div :class="`item-social social-${item.social_type}`" ></div>
							</div>
						</div>
					</div>
					<div class="item-col  item-post-publish-date" v-html="mixinFormatDateUTCtoTimezone(item.publish_on , 'YYYY-MM-DD HH:mm:ss' , true )"></div>
					<div class="item-col  item-post-autopilot-by">
						<span :title="item.title">{{ item.title }}</span>
					</div>
					<div class="item-col item-post-action">
						&nbsp;
						<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight" >
							<a-button class="item-list-table-dropdown-btn">
								<sh-icon :icon="['far','ellipsis-h']" />
							</a-button>
							<a-menu slot="overlay" class="item-list-table-dropdown-menu">
								<a-menu-item key="1">
									<a class="text-danger" @click="handleDelete(item.id)">{{ $t('post.btn.delete') }}</a>
								</a-menu-item>
							</a-menu>
						</a-dropdown>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="item-post-error-empty" >
					<img src="@publish/assets/icons/no-queue.png"  />
					<h3 class="show-display-text m-t-20">{{ $t('queue.state.empty') }}</h3>
				</div>
			</template>
		</div>
		<vue-modal-queue v-if="visible" v-model="visible" :queue-id="queue_id"  @on-reload="handleReload"/>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import VueModalQueue from '../queue/vue-modal-queue'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'ListAutopilotTable',
	mixins : [mixin_time_format],
	components:{
		VueModalQueue
	},
	props:{
		data :{
			required: true,
		},
		loading :{
			type : Boolean,
			default : false
		},
		setRouterLink:{
			type : Function,
		}
	},
	data(){
		return{
			visible : false,
			queue_id : ''
		}
	},
	computed:{
		sort(){
			return this.$route.query && this.$route.query.sort_by ? this.$route.query.sort_by : ''
		},
		order(){
			return this.$route.query && this.$route.query.order_by ? this.$route.query.order_by : ''
		},
		loading_rows(){
			return this.data && this.data.length ? this.data.length  : 5
		}
	},
	methods:{
		...mapActions({
			deleteAutopilot : 'autopilot/delete',
			updateStatus : 'autopilot/updateStatus',
			getQueueDetail : 'queue/getQueueDetail',
			deleteQueue : 'queue/delete',
			'dataLayer' : 'auth/dataLayer'
		}),
		isActive(payload){
			return this.sort == payload
		},
		onSelect($event , item){
			var target = $($event.target)
			if( !target.is('.item-list-table-dropdown-btn , .item-list-table-dropdown-btn *')){
				this.visible = true 
				this.queue_id = item.id 
			}
		},
		handlePause(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Pause Autopilot',
				content: 'Are you sure you want to pause this Autopilot?',
				okText : 'Pause',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id  , status : false}).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: "Done !",
                    				message: "Pause Autopilot success",
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not pause this Autopilot",
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not pause this Autopilot",
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		handleResume(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Resume Autopilot',
				content: 'Are you sure you want to resume this Autopilot?',
				okText : 'Resume',
				cancelText : 'Cancel',
				okType:'primary',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id , status : true }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: "Done !",
                    				message: "Resume Autopilot success",
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not resume this Autopilot",
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not resume this Autopilot",
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		handleDelete(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Delete Queue',
				content: 'Are you sure to delete this queue?',
				okText : 'Delete',
				cancelText :  'Cancel',
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteQueue({ id }).then((res)=>{
							let { status = false } = res.data
							if( status ){
								this.$emit('reload')
								this.toastSuccess({
									title : "Done !",
									message : "The queue's deleted successfully."
								})
							}else{
								this.toastError({
									title : 'Error !',
									message: 'Something went wrong!',
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error !',
								message: 'Something went wrong!',
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		handleReload(){
			this.$emit('reload')
		},

	}
}
</script>
<style lang="scss" scoped>
	.vue-list-post-table{
		.item-post{
			&-info{
				@include col;
			}
			&-status{
				@include flex(35px);
			}
			&-content{
				@include flex(calc(100% - 135px));
			}
			&-action{
				@include flex(10%);
			}
			&-publish-date{
				@include flex(20%);
			}
			&-autopilot-by{
				@include flex(20%);
			}
		}
	}
</style>