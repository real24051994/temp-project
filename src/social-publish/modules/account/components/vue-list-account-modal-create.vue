<template>
	<div class="vue-list-account-modal-create" >
		<a-modal transitionName="none" maskTransitionName="none" :footer="false"  :bodyStyle="{ padding : 0}" :destroyOnClose="true" :afterClose="afterClose" :title="$t('account.title.modal_create')" v-if="visible" v-model="visible" width="500px">
			<div v-if="is_loading"  class="modal-add-social-content">
				<div class="list-items-register p-t-24 p-b-24">
					<div class="list-items-connect-social-account">
						<div class="item-connect-social-account is-disabled">
							<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
						</div>
						<div class="item-connect-social-account is-disabled">
							<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
						</div>
						<div class="item-connect-social-account is-disabled">
							<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
						</div>
					</div>
				</div>
			</div>
			<div v-else class="modal-add-social-content">
				<div v-if="is_loading_error">
					error
				</div>
				<div v-else>
					<transition name="fade-in">
						<div class="is-error-message" v-if="is_error_message" >
							<div class="is-error-message-content" >
								<div class="is-error-message-icon">
									<sh-icon icon="exclamation-triangle" />
								</div>
								<div class="is-error-message-text" v-html="is_error_message"></div>
							</div>
						</div>
					</transition>
					<div class="list-items-social" v-if="modal.inserted.length">
						<vue-simple class="list-items-social-scroll">
							<div class="item-row-social" v-for="(item,index) in modal.inserted" :key="`index_${index}`">
								<div class="item-row-social-info">
									<div class="item-social-avatar">
										<div class="item-social-account">
											<div class="item-social-account-media">
												<div class="item-social-account-media-avatar">
													<img :src="item.avatar" alt />
												</div>
												<div class="item-social-account-media-social item-social" :class="`social-${item.social_type}`"></div>
											</div>
											<div class="item-social-account-title">
												<div class="item-social-account-title-name">{{ item.name }}</div>
												<div class="item-social-account-title-status status-success">
													<i class="m-r-5"><sh-icon :icon="['far','check']"  /></i>
													{{ $t('account.label.status') }}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="item-row-social-type">
									{{ $t(`account.social_types.${item.social_type}`) }}
								</div>
							</div>
						</vue-simple>
					</div>
					<div class="list-items-register p-t-24 p-b-24">
						<vue-add-social-account :data="data" :quota="quota"  @on-twitter-error="onTwitterError" @on-connect="onConnect" />
					</div>
					<div class="text-center  p-b-24 p-l-30 p-r-30" v-if="modal.inserted.length">
						<a-button block type="primary" @click="visible = false">{{ $t('account.btn.close_modal_create') }}</a-button>
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VueAddSocialAccount from "@publish/modules/utils/components/vue-add-social-account";
export default {
	name : 'VueModalAddSocialAccount',
	components:{
		VueAddSocialAccount
	},
	props:{
		value :{
			type : Boolean,
			required : true 
		},
		data :{
			
		}
	},
	data(){
		return {
			is_loading : true, 
			is_loading_error : false,
			is_loading_facebook: false,
			is_loading_twitter: false,
			modal: {
				visible: false,
				url: "",
				social: "",
				data: [],
				inserted: []
			},
			is_error_message : null ,
			is_error_pricing : false,
		}
	},
	computed:{
		...mapGetters({
			account_quota : 'pricing/getAccountQuota'
		}),
		visible :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		quota :{
			get(){
				return this.account_quota
			},
			set(value){
				this.setAccountQuota(value)
			}
		},
		is_available : function(){
			return this.account_quota.limit > this.account_quota.total 
		},
		current_quota  : function(){
			return this.account_quota.limit - this.account_quota.total 
		},
	},
	methods :{
		...mapActions({
			generalLinkSocial: "account/general",
			checkPageSelected: "account/checkPageSelected",
			checkAccountQuota : 'pricing/checkAccountQuota'
		}),
		...mapMutations({
			setAccountQuota : 'pricing/setAccountQuota',
			setShowModalAccount : 'pricing/setShowModalAccount'
		}),
		onConnect(data) {
			this.modal.data = this.modal.data.concat(data)
			this.modal.inserted = this.modal.inserted.concat(data)
			this.quota.total += data.length
		},
		onTwitterError( payload ){
			if( payload ){
				let { data , message}  = payload
				this.is_error_message = `
					<p>Can not connect with <strong>${data.name}</strong></p>
					<p>${message}</p>
				`
			}else{
				this.is_error_message = null 
			}
		},
		afterClose() {
			
		},
		handleRegister(social) {
			this.is_error_message = null
			if (this.is_loading_twitter || this.is_loading_facebook) return;
			this.modal.social = social;
			if (social == "facebook") {
				this.is_loading_facebook = true;
			} else if (social == "twitter") {
				this.is_loading_twitter = true;
			}
			this.generalLinkSocial({ social })
				.then(res => {
					let { status = false, data } = res.data;
					if (status) {
						this.modal.url = data;
						this.modal.visible = true;
					}
					this.is_loading_facebook = false;
					this.is_loading_twitter = false;
				})
				.catch(err => {
					this.is_loading_facebook = false;
					this.is_loading_twitter = false;
				})
		}
	},
	async mounted(){
		this.visible = true
		this.modal.data = this.$clone(this.data)
		try {
			await this.checkAccountQuota( { type : 'account' })
		} catch (e) {
			this.is_loading_error = true
		} finally {
			if( !this.is_loading_error && !this.is_available){
				this.setShowModalAccount(true)
				this.visible = false 
			}
			this.is_loading = false 
		}
	},
	beforeDestroy(){
		if (this.modal.inserted.length) { 
			this.$emit('on-reload');
		}
	}
}
</script>
<style lang="scss" scoped>
	
	.item-row-social {
		padding: 5px 24px;
		border-bottom: 1px solid $border-color;
		background-color: #fff;
		cursor: pointer;
		user-select: none;
		&.is-disabled {
			opacity: 0.5;
		}
		&:hover {
			&:not(.is-disabled) {
				background-color: #f3f3f3;
			}
		}
		&:first-child {
			// border-top: 1px solid $border-color;
		}
		&:after {
			display: table;
			content: "";
			clear: both;
		}
		&-info {
			float: left;
			width: 75%;
			&-checkbox {
				&:after {
					display: table;
					content: "";
					clear: both;
				}
				.item-social-checkbox {
					width: 34px;
					float: left;
					height: 41px;
					display: flex;
					align-items: center;
				}
				.item-social-avatar {
					width: calc(100% - 34px);
					float: left;
				}
			}
			.item-social-account-title {
				flex-wrap: wrap;
				&-name {
					width: 100%;
				}
				&-status {
					width: 100%;
					font-size: 12px;
					&.status-success {
						color: $success;
					}
					&.status-error {
						color: $danger;
					}
				}
			}
		}
		&-type {
			float: left;
			width: 25%;
			line-height: 41px;
			font-size: 14px;
			text-align: right;
			text-transform: capitalize;
		}
	}
</style>
<style lang="scss" >
	.modal-add-social-content {
		.is-error-message{
			color: $danger;
			padding: 16px 16px 0 16px;
			&-content{
				border: 1px solid $danger;
				border-radius: 4px;
				padding: 8px 16px;
				display: flex;
				align-items: center;
			}
			&-icon{
				@include flex(30px);
				display: flex;
				align-items: center;
				font-size: 17px;
			}
			&-text{
				@include flex(calc(100% - 30px));
			}
			p{
				margin-bottom: 0;
			}
		}
	}
</style>