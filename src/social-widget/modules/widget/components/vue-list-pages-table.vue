<template>
	<div class="vue-list-widget-table">
		<div class="item-widget item-widget-heading">
			<div class="item-row">
				<div class="item-col item-widget-info">
					Widget
				</div>
				<div class="item-col item-widget-status">
					Status
				</div>
				<div class="item-col item-widget-action"></div>
			</div>
		</div>
		<transition name="fade-in" mode="out-in">
			<div class="vue-list-widget-table-wrap" v-if="loading"  key="is-loading">
				<div class="item-widget-loading" >
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
			</div>
			<div class="vue-list-widget-table-wrap" v-else key="loading-success">
				<template v-if="data.length">
					<div v-for="(item , index) in data" :key="`index_${index}`" class="item-widget" @click="onSelect($event,item)">
						<div class="item-row" >
							<div class="item-col item-widget-info">
								<img svg-inline src="@widget/assets/icons/instagram.svg" alt="" class="m-r-8">
								{{ item.title }}
							</div>
							<div class="item-col item-widget-status">
								<span v-if="item.status" class="badge badge-info">
									Active
								</span>
								<span v-else class="badge badge-danger">
									Paused
								</span>
							</div>
							<div class="item-col item-widget-action">
								<a-dropdown :trigger="['click']" placement="bottomRight">
									<a-button class="item-widget-dropdown-btn">
										<i>
											<sh-icon :icon="['far','ellipsis-h']" />
										</i>
									</a-button>
									<a-menu slot="overlay" class="item-widget-dropdown-menu">
										<a-menu-item key="1">
											<a  href="javascript:void(0)" @click="handlePreview(item.preview_url)">
												View
											</a>
										</a-menu-item>
										<a-menu-item key="2">
											<a href="javascript:void(0)" v-if="item.status" @click="handleUpdateStatus(item.id , false)">
												Pause
											</a>
											<a href="javascript:void(0)" v-else @click="handleUpdateStatus(item.id , true)">
												Activate
											</a>
										</a-menu-item>
										<a-menu-divider />
										<a-menu-item key="3">
											<a class="text-danger" href="javascript:void(0)" @click="handleDelete(item.id)">
												Delete
											</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="item-widget-error-empty" v-if="data == null">
						<img src="@widget/assets/icons/empty.png"  />
						<h3 class="show-display-text m-t-20">You have not added any widget yet</h3>
					</div>
					<div class="item-widget-error-empty" v-else>
						<img src="@widget/assets/icons/empty.png"  />
						<h3 class="show-display-text m-t-20">No results found !</h3>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
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
		...mapGetters({
			shop : 'auth/getShop'
		})
	},
	methods:{
		...mapActions({
			deleteWidget : 'widget/delete',
			updateStatus : 'widget/updateStatus'
		}),
		onSelect($event,item){
			var target = $($event.target)
			if( !target.is('.item-widget-dropdown-btn , .item-widget-dropdown-btn *')){
				this.redirect({
					name : 'WigetDetail',
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
				content: 'Do you want to remove this widget ?',
				okText : 'Delete',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteWidget({ id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: "Done !",
									message: "Delete widget success",
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not delete widget",
								})
							}
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not delete widget",
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
		},
		handlePreview(url){
			var result = `${url}&rawDomain=${this.shop.raw_domain}`
			window.open(result, "_blank"); 
		},
		handleUpdateStatus(id , status ){
			this.$confirm({
				confirmLoading: true,
				title: status ?  'Activate widget' : 'Pause widget',
				content:  status ? 'Do you want to activate this widget ?' : 'Do you want to pause this widget ?',
				okText : status ?  'Activate' : 'Pause',
				cancelText : 'Cancel',
				okType:'primary',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id  , status}).then((res)=>{
							if( res.data  && res.data.status ){
								this.toastSuccess({
									title: "Done !",
									message: status ? 'Activate widget success !' : 'Pause widget success !',
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not update status widget",
								})
							}
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not update status widget",
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
	}
}
</script>
<style lang="scss" >
	
	.item-widget-dropdown-menu{
		.ant-dropdown-menu-item{
			a{
				min-width: 100px;
			}
		}
	}
	
</style>