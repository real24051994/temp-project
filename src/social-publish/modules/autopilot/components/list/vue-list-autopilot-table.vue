<template>
	<div class="vue-autopilot-table list-items-table">
		<div class="item-row item-row-heading item-autopilot">
			<div class="item-col item-autopilot-info">{{ $t('autopilot.table.autopilot_campaign') }}</div>
			<div class="item-col item-autopilot-status">
				<router-link :to="setRouterLink('status')" >
					<span>{{ $t('autopilot.table.autopilot_status') }}</span>
					<span class="item-autopilot-sort m-l-8" :class="{'is-active' : isActive('status')}">
						<sh-icon v-if="isActive('status') && order == 'desc'" :icon="['far','chevron-down']" />
						<sh-icon v-else :icon="['far','chevron-up']" />
					</span>
				</router-link>
			</div>
			<div class="item-col item-autopilot-type">
				<router-link :to="setRouterLink('type')">
					<span>{{ $t('autopilot.table.autopilot_type') }}</span>
					<span class="item-autopilot-sort m-l-8"  :class="{'is-active' : isActive('type') }">
						<sh-icon v-if="isActive('type') && order == 'desc'" :icon="['far','chevron-down']" />
						<sh-icon v-else :icon="['far','chevron-up']" />
					</span>
				</router-link>
			</div>
			<div class="item-col item-autopilot-action">&nbsp;</div>
		</div>
		
		<div v-if="loading" class="p-t-5 p-b-5">
			<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
		</div>
		<div v-else key="is-loading-success">
			<template v-if="data">
				<template v-if="data.length">
					<div class="item-row item-autopilot" v-for="item in data" :key="item.id" @click="onSelect($event, item.id)">
						<div class="item-col item-autopilot-info">
							<div class="item-autopilot-title">
								{{ item.title }}
							</div>
							<div class="item-autopilot-social" v-if="item.social">
								<div :class="`item-social item-social-circle social-${item.social.social_type}`"></div>
								<span class="item-autopilot-social-name">{{ item.social.name }}</span>
							</div>
						</div>
						<div class="item-col item-autopilot-status">
							<div class="item-autopilot-status-content">
								<div class="badge" :class="{ 'badge-info' : item.status }">
									{{ item.status ? 'Running' : 'Pause'}}
								</div>
								<template v-if="!item.status && item.notifies && item.notifies.length">
									<a-popover :title="false" placement="bottom">
										<template slot="content">
											<div class="item-autopilot-warning-popover">
												{{ item.notifies.first()}}
											</div>
										</template>
										<i class="text-warning">
											<sh-icon :icon="['fas','exclamation-triangle']" />
										</i>
									</a-popover>
								</template>
							</div>
						</div>
						<div class="item-col item-autopilot-type">
							<template v-if="item.type == 1">
								Random Product
							</template>
							<template v-else-if="item.type == 2">
								Latest Product
							</template>
							<template v-else-if="item.type == 3">
								Publish Product Review
							</template>
						</div>
						<div class="item-col item-autopilot-action">
							<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomRight">
								<a-button class="item-list-table-dropdown-btn">
									<sh-icon :icon="['far','ellipsis-h']" />
								</a-button>
								<a-menu slot="overlay" class="item-list-table-dropdown-menu">
									<a-menu-item key="1">
										<a href="javascript:void(0)" v-if="item.status" @click="handlePause(item.id)">
											{{ $t('autopilot.btn.pause_autopilot') }}
										</a>
										<a href="javascript:void(0)" v-else @click="handleResume(item.id)">
											{{ $t('autopilot.btn.resume_autopilot') }}
										</a>
									</a-menu-item>
									<a-menu-divider />
									<a-menu-item key="2">
										<a class="text-danger" href="javascript:void(0)" @click="handleDelete(item.id)">
											{{ $t('autopilot.btn.delete_autopilot') }}
										</a>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="autopilot-error-not-found">
						{{ $t('autopilot.state.not_found') }}
					</div>
				</template>
			</template>
			<template v-else>
				<div class="autopilot-error-empty">
					<div class="text-center">
						<img src="@publish/assets/icons/no-autopilot.png" alt="">
						<div class="m-t-20">{{ $t('autopilot.state.empty') }}</div>
						<a-button class="m-t-20"  type="primary" @click="$emit('on-click-empty')" >
							{{ $t('autopilot.btn.create_autopilot') }}
						</a-button>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions , mapMutations } from 'vuex'
export default {
	name : 'ListAutopilotTable',
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
			updateStatus : 'autopilot/updateStatus'
		}),
		...mapMutations({
			'setShowModalAutopilot' : 'pricing/setShowModalAutopilot'
		}),
		isActive(payload){
			return this.sort == payload
		},
		onSelect($event , id){
			var target = $($event.target)
			if( !target.is('.item-list-table-dropdown-btn , .item-list-table-dropdown-btn *')){
				this.redirect({
					name : 'UpdateAutopilot',
					params:{
						id 
					}
				})
			}
		},
		handlePause(id){
			this.$confirm({
				confirmLoading: true,
				title: this.$t('autopilot.confirm.pause_autopilot.title'),
				content: this.$t('autopilot.confirm.pause_autopilot.content'),
				okText : this.$t('autopilot.confirm.pause_autopilot.btn_ok'),
				cancelText : this.$t('autopilot.confirm.pause_autopilot.btn_cancel'),
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id  , status : false}).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title : this.$t('autopilot.toast.pause_autopilot_success.title'),
									message: this.$t('autopilot.toast.pause_autopilot_success.message'),
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : this.$t('autopilot.toast.pause_autopilot_error.title'),
									message: this.$t('autopilot.toast.pause_autopilot_error.message'),
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.pause_autopilot_error.title'),
								message: this.$t('autopilot.toast.pause_autopilot_error.message'),
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
				title: this.$t('autopilot.confirm.resume_autopilot.title'),
				content: this.$t('autopilot.confirm.resume_autopilot.content'),
				okText : this.$t('autopilot.confirm.resume_autopilot.btn_ok'),
				cancelText : this.$t('autopilot.confirm.resume_autopilot.btn_cancel'),
				okType:'primary',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id , status : true }).then((res)=>{
							if( res.status == 402  ){
								this.$emit('update:modify', false)
								this.setShowModalAutopilot(true)
							}else{
								let { status = false } = res.data 
								if( status ){
									this.toastSuccess({
										title : this.$t('autopilot.toast.resume_autopilot_success.title'),
										message: this.$t('autopilot.toast.resume_autopilot_success.message'),
									})
									this.$emit('reload')
								}else{
									this.toastError({
										title : this.$t('autopilot.toast.resume_autopilot_error.title'),
										message: this.$t('autopilot.toast.resume_autopilot_error.message'),
									})
								}
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.resume_autopilot_error.title'),
								message: this.$t('autopilot.toast.resume_autopilot_error.message'),
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
				title: this.$t('autopilot.confirm.delete_autopilot.title'),
				content: this.$t('autopilot.confirm.delete_autopilot.content'),
				okText : this.$t('autopilot.confirm.delete_autopilot.btn_ok'),
				cancelText : this.$t('autopilot.confirm.delete_autopilot.btn_cancel'),
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteAutopilot({ id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title : this.$t('autopilot.toast.delete_autopilot_success.title'),
									message: this.$t('autopilot.toast.delete_autopilot_success.message'),
								})
								this.$emit('reload')
							}else{
								this.toastError({
									title : this.$t('autopilot.toast.delete_autopilot_error.title'),
									message: this.$t('autopilot.toast.delete_autopilot_error.message'),
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.delete_autopilot_error.title'),
								message: this.$t('autopilot.toast.delete_autopilot_error.message'),
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
	}
}
</script>
<style lang="scss" >
.vue-autopilot-table{
	.autopilot-error{
		&-not-found{
			height: 400px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
		}
		&-empty{
			height: 400px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
		}
	}
	.item-autopilot{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		height: 64px;
		border-bottom: 1px solid $border-color;
		background: #fff;
		transition: all 0.2s ease;
		&-info{
			@include col;
			overflow: hidden;
		}
		&-status{
			@include flex(20%);
			&-content{
				// color: $text;
				// font-weight: 600;
				// &:before{
				// 	content : '';
				// 	width: 8px;
				// 	height: 8px;
				// 	background: #BFBFBF;
				// 	display: inline-block;
				// 	border-radius: 50%;
				// 	margin-right: 4px;
				// }
				// &.is-active{
				// 	color: $primary-color;
				// 	&:before{
				// 		background: $primary-color;
				// 	}
				// }
			}
			a{
				color: $text;
				text-decoration: none;
			}
		}
		&-type{
			@include flex(20%);
			a{
				color: $text;
				text-decoration: none;
			}
		}
		&-action{
			text-align: right;
			@include flex(10%);
		}
		&-title{
			font-size: 14px;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-weight: 600;
		}
		&-social{
			margin-top: 2px;
			&-name{
				font-size: 12px;
				line-height: 20px;
				margin-left: 6px;
			}
		}
		&-sort{
			opacity: 0.5;
			cursor: pointer;
			&:hover,&.is-active{
				opacity: 1;
			}
		}
		&-dropdown{
			
			&-btn{
				width: 32px;
				height: 32px;
				padding: 0;
				background: #F3F3F3;
				font-size: 18px;
				border: 1px solid transparent;
				color: $text;
				box-shadow: none;
				overflow: hidden;
				&:hover,&:focus{
					background: #E2E2E2;
					border: 1px solid transparent;
					color: $text;
				}
				&.ant-dropdown-open{
					color: $text;
					background-color: #E2E2E2;
					border: 1px solid transparent;
				}
			}
			&-menu{
				width: 100px;
			}
		}
	}
}
.item-autopilot-warning-popover{
	width: 300px;
}
</style>