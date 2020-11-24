<template>
	<a-modal transitionName="none" maskTransitionName="none" :maskClosable="is_closable" :closable="is_closable" v-model="visible" :destroyOnClose="true" title="Downgrade Subcripstion" :footer="false" width="600px" class="vue-modal-downgrade">
		<div class="vue-modal-downgrade-wrapper">
			<div class="vue-modal-downgrade-header">
				<div class="sub-title">
					You have to disable some  Autopilots to downgrade your plan
				</div>
				<div class="sub-warning" :class="{ 'is-valid' : is_valid }">
					Autopilot limit ({{running_autopilot}}/{{ limit }})
				</div>
			</div>
			<div class="vue-modal-downgrade-body">
				<div v-if="is_loading">
					<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active  :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
				</div>
				<div v-else  class="list-autopilot">
					<vue-simple class="list-autopilot-scrollbar">
						<div class="item-autopilot" v-for="item in pagination.data" :key="item.id">
							<div class="item-autopilot-info">
								<div class="item-autopilot-info-name">
									{{ item.title }}
								</div>
								<div class="item-autopilot-info-social">
									<div class="item-social item-social-circle" :class="{ 'social-facebook' : item.social.social_type == 'facebook' , 'social-twitter' : item.social.social_type == 'twitter'}"></div>
									<span class="item-autopilot-social-name m-l-8">{{ item.social.name }}</span>
								</div>
							</div>
							<div class="item-autopilot-status">
								<div class="item-label is-active" v-if="item.status">
									Running
								</div>
								<div class="item-label" v-else>
									Paused
								</div>
								<a-switch v-model="item.status" class="m-l-16" />
							</div>
						</div>
					</vue-simple>
				</div>
			</div>
			<div class="vue-modal-downgrade-footer">
				<a-button @click="handleCloseModal">
					Cancel
				</a-button>
				<a-button type="primary" :disabled="!is_valid" @click="handleDowngradePlan" :loading="is_downgrade"  class="btn-event-downgrade btn-track-event" :data-plan="modalDowngrade.app_plan">
					Downgrade
				</a-button>
			</div>
		</div>
    </a-modal>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import charge from '../mixins/charge'
export default {
	name : 'VuePricingDowngradeModal',
	mixins : [charge],
	props :{
		value :{
			type : Boolean,
			required : true,
		},
	},
	data(){
		return {
			limit : 0,
			loading_rows : 4,
			is_loading : true,
			is_closable : true,
			is_update_status : false,
			is_downgrade : false,
			pagination :{
				data : [],
				current_page : 1,
				total : 0,
				total_page : 0,
				limit : 100
			},
		}
	},
	computed:{
		...mapGetters({
			plan : 'pricing/getUserPlan',
			plans : 'pricing/getPricingPlans',
			recommend : 'pricing/getRecommendPlan',
			modalDowngrade : 'pricing/getShowModalDowngrade'
		}),
		running_autopilot(){
			return this.pagination.data.filter((item)=>item.status).length 
		},
		is_valid(){
			return this.running_autopilot <= this.limit
		},
		visible : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		...mapActions({
			'getListAutopilot' : 'autopilot/list',
			'updateAutopilotStatus' : 'autopilot/updateStatus',
			'pauseListAutopilot' : 'autopilot/pauseListAutopilot'
		}),
		getAutopilot(){
			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()
			this.getListAutopilot({
				current_page  : this.pagination.current_page,
				limit :  this.pagination.limit,
				cancel_request_token : this.cancel_request.token
			}).then((res)=>{
				let { status = false , data = []  , pagination } = res.data 
				if( status && data ){
					this.pagination.data = data.filter((item)=>item.status)
					this.pagination.current_page = pagination.current_page 
					this.pagination.total_page = pagination.total_page 
					this.pagination.total = pagination.total 
				}
				this.is_loading = false
			})
			.catch(()=>{
				this.is_loading = false
			})
		},
		handleCloseModal(){
			if( this.is_closable ){
				this.visible = false 
			}
		},
		handleDowngradePlan(){
			if( this.is_downgrade ) return 

			if( this.is_valid ){
				this.is_downgrade = true
				this.is_closable = false 
				this.handleUpdateStatus()
			}
		},
		handleUpdateStatus(){
			var ids = []
			this.pagination.data.forEach((item,index) => {
				if( item.status == false ){
					ids.push(item.id)
				}
			});
			if( ids.length ){
				this.is_update_status = true 
				this.handleUpdateAutopilotStatus(ids).then(()=>{
					this.handleDowngradeWidthoutConfirm(this.modalDowngrade.app_plan).then(()=>{
						this.is_downgrade = false
						this.is_closable = true 
						this.visible = false
					})
					.catch(()=>{
						this.is_downgrade = false
						this.is_closable = true
						this.visible = false
					})
				})
				.catch(()=>{
					this.is_downgrade = false
					this.is_closable = true
					this.visible = false
					this.toastError({
						title :'Error !',
						message: 'Downgrade failed. Please try againt !',
					})
				})
			}else{
				this.handleDowngradeWidthoutConfirm(this.modalDowngrade.app_plan).then(()=>{
					this.is_downgrade = false
					this.is_closable = true
					this.visible = false
				})
				.catch(()=>{
					this.is_downgrade = false
					this.is_closable = true
					this.visible = false
				})
			}
		},
		handleUpdateAutopilotStatus(ids){
			return new Promise( async (resolve, reject)=>{
				this.pauseListAutopilot( { ids }).then((res)=>{
					let { status = false } = res.data 
					if( status ){
						resolve()
					}else{
						reject()
					}
				})
				.catch((err)=>{
					reject()
				})
			});
		}
	},
	mounted(){
		if( this.modalDowngrade.app_plan ){
			this.limit = this.plans[this.modalDowngrade.app_plan].autopilots.limit 
			this.getAutopilot()
		}
		
	}
}
</script>
<style lang="scss">
	.vue-modal-downgrade{
		.ant-modal .ant-modal-content .ant-modal-header{
			border: none;
			padding-bottom: 8px;
		}
		.vue-modal-downgrade{
			&-wrapper{
				
				.sub-title{
					margin-bottom: 8px;
				}
				.sub-warning{
					font-weight: 600;
					color: $danger;
					margin-bottom: 8px;
					&.is-valid {
						color: $primary-color;
					}
				}
			}
			&-header{
				padding: 0px 16px;
				border-bottom: 1px solid $border-color;
			}
			&-body{
				// padding: 0px 16px;
				
				.list-autopilot-scrollbar{
					height: 250px;
					overflow: hidden auto;
					position: relative;
					
				}
				.item-autopilot{
					height: 64px;
					width: 100%;
					display: flex;
					align-items: center;
					border-bottom: 1px solid $border-color;
					&:last-child{
						border-bottom-width: 0px;
					}
					&-info{
						@include flex(50%);
						padding: 0 16px;
						&-name{
							width: 100%;
							font-weight: 600;
							font-size: 14px;
							line-height: 22px;
						}
						.item-autopilot-social{
							&-name{
								font-size: 13px;
							}
						}
					}
					&-status{
						@include flex(50%);
						text-align: right;
						padding: 0 16px;
						.item-label{
							background: #F7F8FA;
							border-radius: 4px;
							color: #828282;
							min-width: 70px;
							font-weight: 600;
							font-size: 12px;
							line-height: 14px;
							height: 22px;
							display: inline-flex;
							align-items: center;
							justify-content: center;
							&.is-active{
								background: #D1E9FF;
								color: $primary-color;
							}
						}
					}
				}
			}
			&-footer{
				padding: 0px 16px;
				height: 64px;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				border-top: 1px solid $border-color;
				button + button{
					margin-left: 16px;
				}
			}
		}
	}
</style>