<template>
	<div class="vue-list-account-table list-items-table">
		<div class="item-row item-row-heading item-account ">
			<div class="item-col item-account-info">{{ $t('account.table.account_name') }}</div>
			<div class="item-col item-account-type">{{ $t('account.table.account_type') }}</div>
			<div class="item-col item-account-action"></div>
		</div>
		<div class="vue-list-account-table-wrap p-t-15" v-if="loading"  key="is-loading">
			<div class="p-t-5 p-b-5">
				<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>
		</div>
		<div class="vue-list-account-table-wrap" v-else key="loading-success">
			<template v-if="accounts.length">
				<div v-for="(item , index) in accounts" :key="`index_${index}`" class="item-row item-account">
					<div class="item-col item-account-info">
						<div  class="item-social-account">
							<div  class="item-social-account-media">
								<div  class="item-social-account-media-avatar">
									<img  :src="item.avatar" alt="">
								</div>
								<div  class="item-social-account-media-social item-social" :class="`social-${item.social_type}`"></div>
							</div>
							<div class="item-social-account-title">
								<div class="item-social-account-title-name">
									{{ item.name }}
									<template v-if="item.connect_error">
										<a-popover :title="false" placement="bottom">
											<template slot="content">
												<div class="vue-manage-account-popover ">
													<p class="m-0 text-danger">{{item.connect_error.message}}</p>
												</div>
											</template>
											<i  class="text-danger m-l-8">
												<sh-icon icon="exclamation-circle" />
											</i>
										</a-popover>
									</template>
								</div>
							</div>
						</div>
					</div>
					<div class="item-col item-account-type">
						{{ $t(`account.social_types.${item.social_type}`) }}
					</div>
					<div class="item-col item-account-action">
						<a-button class="m-r-8" v-if="item.connect_error" @click="reConnectSocial(item)"  :loading="is_reconnecting.indexOf(item.social_id) >= 0">
							{{ $t('account.btn.reconnect') }}
						</a-button>
						<a-button  @click="removeAccount(item.social_id)" class="btn-remove-account">
							<i class="text-danger">
								<sh-icon :icon="['far','trash-alt']" />
							</i>
						</a-button>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="item-account-error item-account-error-not-found" >
					<div class="text-center m-t-50" >
						<img src="@publish/assets/icons/empty-account.png" alt />
						<h3 class="m-t-20 "><strong>{{ $t('account.state.empty.title') }}</strong></h3>
						<p>{{ $t('account.state.empty.content') }}</p>
					</div>
				</div>
			</template>
		</div>
		<vue-reconnect-social v-if="reconnect.visible" v-model="reconnect.visible" :social="reconnect.social" @on-pusher="onPusher" :url="reconnect.url" />
		<vue-reconnect-social-error  v-if="reconnect.error" v-model="reconnect.error" :social="reconnect.social"  />
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueReconnectSocial from '@publish/modules/utils/components/vue-reconnect-social'
import VueReconnectSocialError from '@publish/modules/utils/components/vue-reconnect-social-error'
export default {
	name : 'VueListPostTable',
	components:{
		VueReconnectSocial,
		VueReconnectSocialError
	},
	props:{
		loading :{
			type : Boolean
		}
	},
	data(){
		return {
			is_reconnecting : [],
			is_removing : false,
			reconnect : {
				visible : false,
				url : '',
				social : '',
				error : false,
			},
		}
	},
	computed:{
		...mapGetters({
			accounts : 'account/getAccounts'
		}),
		loading_rows(){
			return this.accounts && this.accounts.length ? this.accounts.length : 5
		}
	},
	methods:{
		...mapActions({
			removeSocial : "account/delete",
			reconnectSocial: "account/reconnect",
			dataLayer : 'auth/dataLayer'
		}),
		reload() {
			this.$emit('on-reload')
		},
		reConnectSocial(item){
			if( this.is_reconnecting.indexOf(item.social_id) >= 0 ) return 
			this.is_reconnecting.push( item.social_id )
			this.reconnectSocial({ socialType : item.social_type, socialId  : item.social_id })
			.then(res => {
				let { status = false  , data} = res.data;
				if (status) {
					this.reconnect.social =  item
					this.reconnect.url = data 
					this.reconnect.visible = true 
					
				} else {
					this.toastError({
						title: "Error",
						message: "Cannot reconnect social"
					})
					
				}
				this.is_reconnecting.splice(this.is_reconnecting.indexOf(item.social_id) , 1)
			})
			.catch(res => {
				this.is_reconnecting.splice(this.is_reconnecting.indexOf(item.social_id) , 1)
			})
		},
		onPusher(payload){
			let { status = false } = payload 
			if( status ){
				var id = this.reconnect.social.social_id 
				this.is_reconnecting.splice(this.is_reconnecting.indexOf(id) , 1)
				this.reconnect.visible = false
				this.reconnect.social = null
				this.reconnect.url = ''
				this.reconnect.error = false
				this.reload()
				this.toastSuccess({
					title: "Done !",
					message: "Reconnect social success"
				})
			}else{
				this.reconnect.visible = false
				this.reconnect.error = true
			}
		},
		removeAccount(social_id){
			var vm = this;
			this.$confirm({
				title :  this.$t('account.dialog.delete_account.title'),
				content : this.$t('account.dialog.delete_account.content'),
				okText :  this.$t('account.dialog.delete_account.ok_text'),
				okType : 'danger',
				cancelText :  this.$t('account.dialog.delete_account.cancel_text'),
				checkbox : true,
				checkboxValue : false,
				checkboxClass : 'text-left',
				checkboxRequired :true,
				checkboxContent :  this.$t('account.dialog.delete_account.checkbox_content'),
				wrapClassName : 'vue-modal-confirm-dialog',
				cancelType : '',
				zIndex : 10002,
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.removeSocial({ social_id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: this.$t('account.toast.delete_account_success.title'),
									message: this.$t('account.toast.delete_account_success.message'),
								})
								this.dataLayer({
									"toast" : "Delete Social Account"
								})
								this.$emit('on-reload')
							}else{
								this.toastError({
									title: this.$t('account.toast.delete_account_error.title'),
									message: this.$t('account.toast.delete_account_error.message'),
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title: this.$t('account.toast.delete_account_error.title'),
								message: this.$t('account.toast.delete_account_error.message'),
							})
							resolve()
						})
					})
				},
				onCancel :  ()=>{},
				
			})
		},
		onRemoveAccount(index){
			
		},
	},
}
</script>
<style lang="scss">

	.vue-list-account-table{
		&-wrap{
			border-radius: 4px;
			border: 1px solid $light-gray3;
			overflow: hidden;
		}
		.item-row.item-row-heading{
			border-bottom: none;
		}
		.item-account{
			background: #fff;
			padding: 10px 0px;
			position: relative;
			&:last-child{
				border-bottom: none;
			}
			&-error{
				&-empty{
					padding: 50px 0;
					text-align: center;
					h3{
						font-size: 16px;
						line-height: 19px;
						margin-top: 20px;
						font-weight: normal;
					}
				}
				&-not-found{
					padding: 50px 0;
					text-align: center;
					h3{
						font-weight: 600;
						font-size: 18px;
						line-height: 21px;
						color: #4F4F4F;
						font-weight: normal;
					}
				}
			}
			&-loading{
				height: 400px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&-info{
				@include flex(60%);
				display: flex;
				align-items: center;
				.item-social-account{
					width: 100%;
					.item-social-account-title{
						flex-wrap: wrap;
						&-name{
							width: 100%;
						}
						&-status{
							width: 100%;
							font-size: 12px;
						}
					}
				}
			}
			&-type{
				@include flex(20%);
				display: flex;
				align-items: center;
			}
			&-action{
				@include flex(20%);
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.btn-remove-account{
					width: 32px;
					padding: 0;
				}
			}
		}
	}
	.vue-manage-account-popover {
		max-width: 200px;
		.ant-popover-content {
			.ant-popover-inner-content {
				min-height: 45px;
				height: auto;
			}
		}
	}
</style>