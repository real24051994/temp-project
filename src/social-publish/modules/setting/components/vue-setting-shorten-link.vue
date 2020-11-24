<template>
	<div class="vue-setting-shorten-link" :class="{ 'input-field-error' : validate.$invalid }">
		<vue-pricing-setting-popover :visible="disabled" z-index="900" >
			<div class="row m-0">
				<div class="col vue-setting-col vue-setting-col-label p-l-18">
					<label for="" class="vue-setting-label">
						{{ $t('setting.shorten_link.title')}}
					</label>
				</div>
				<div class="col vue-setting-col vue-setting-col-content">
					<div class="vue-setting-shorten-link-checkbox">
						<a-switch id="enable_shoten_link" v-model="formdata.is_shorten_link" :disabled="disabled" />
						<label for="enable_shoten_link" class="vue-setting-label m-l-8">{{ $t('setting.shorten_link.switch')}}</label>
						<span v-if="show_label_premium" class="label-premium m-l-16">Premium function</span>
					</div>
					<div class="vue-setting-shorten-link-description m-t-8">
						{{ $t('setting.shorten_link.description')}}
					</div>
					<transition name="fade-in" mode="out-in">
						<div v-if="formdata.is_shorten_link">
							<div class="m-t-8">
								<div class="vue-setting-shorten-link-dropdown">
									<a-select :disabled="disabled" v-model="formdata.service_shorten_link" >
										<a-select-option value="social_head">{{ $t('setting.shorten_link.option.social_head')}}</a-select-option>
										<a-select-option value="bit_ly">{{ $t('setting.shorten_link.option.bit_ly')}}</a-select-option>
									</a-select>
								</div>
							</div>
							<transition name="fade-in" mode="out-in">
								<div v-if="formdata.service_shorten_link == 'bit_ly'" key="bitly-shortent-link" class="vue-setting-shorten-link-content m-t-8">
									<transition name="fade-in" mode="out-in">
										<div v-if="formdata.bit_ly_status" key="bitly-login-success" class="vue-setting-shorten-link-dropdown">
											<div class="vue-setting-shorten-link-account" >
												<div class="vue-setting-shorten-link-account-info">
													<div class="vue-setting-shorten-link-account-icon">
														<img src="@publish/assets/icons/bitly.png" alt="">
													</div>
													<div class="vue-setting-shorten-link-account-name">
														{{ formdata.bit_ly_name }}
													</div>
												</div>
												<transition name="fade-in" mode="out-in">
													<a-spin v-if="is_logout_bitly" key="is-removing-bitly">
														<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
													</a-spin>
													<a v-else key="btn-remove-bitly" @click="handleLogoutBitly()" class="vue-setting-shorten-link-account-btn">
														{{ $t('setting.shorten_link.btn_logout_biyly')}}
													</a>
												</transition>
											</div>
										</div>
										<div v-else key="bitly-login-btn">
											<vue-integrate-bitly-auth :label="$t('setting.shorten_link.btn_login_bitly')"  @on-success="onLoginBitlySuccess" />
											<transition name="fade-in" mode="out-in">
												<div class="d-inline-block m-l-16 " v-if="validate.bit_ly_status.$invalid && formstate">
													<div class="form-error">
														<i class="m-r-8"><sh-icon :icon="['far','exclamation-circle']" /></i>
														{{ $t('setting.shorten_link.require_bitly')}}
													</div>
												</div>
											</transition>
										</div>
									</transition>
								</div>
							</transition>
						</div>
					</transition>
				</div>
			</div>
		</vue-pricing-setting-popover>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueIntegrateBitlyAuth from './vue-integrate-bitly-auth'
export default {
	name : 'ShortenLink',
	components:{
		VueIntegrateBitlyAuth
	},
	props:{
		value :{
			type : Object,
			required : true
		},
		validate:{

		},
		formstate :{
			type : Boolean
		},
		disabled : {
			type : Boolean,
			default : false,
		}
	},
	data(){
		return {
			form :{
				use: 'bitly'
			},
			bitly_authorization : {
				url : '',
				visible : false,
				name : ''
			},
			is_general_bitly_url: false,
			is_logout_bitly : false,
			disabled_switcher : false
		}
	},
	computed:{
		...mapGetters({
			'show_label_premium'  : 'pricing/getShowLabelPremium'
		}),
		formdata : {
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
			'removeBitlyAccount' : 'intergate/removeBitlyAccount'
		}),
		onLoginBitlySuccess(payload){
			let { status = true , data } = payload 
			if( status ){
				this.toastSuccess({
					title : 'Done',
					message : 'Connect Bitly success !'
				})
				this.formdata.bit_ly_status = true
				this.formdata.bit_ly_name = data.login
			}else{
				this.toastError({
					title : 'Error',
					message : 'Connect Bitly fail !'
				})
			}
		},
		handleLogoutBitly(){
			if( this.is_logout_bitly ) return 
			this.is_logout_bitly = true 
			this.removeBitlyAccount().then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.formdata.bit_ly_status = false
					this.toastSuccess({
						title : 'Done',
						message : 'Logout Bitly success !'
					})
				}
				this.is_logout_bitly = false
			})
			.catch(()=>{
				this.is_logout_bitly = false
			})
		}
	},
	mounted(){

	}
}
</script>
<style lang="scss" scoped>
	.vue-setting-shorten-link{
		padding: 18px 0;
		background: #F7F7F7;
		border-radius: 4px;
		label{
			user-select: none;
		}
		&-checkbox{
			display: flex;
			align-items: center;
		}
		&-description{
			font-size: 14px;
		}
		&-dropdown{
			width: 290px;
		}
		&-account{
			min-height: 48px;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 0 11px;
			background: #fff;
			border-radius: 4px;
			border: 1px solid $border-color;
			&-info{
				display: flex;
				align-items: center;
				@include flex(calc(100% - 60px));
			}
			&-icon{
				@include flex(40px);
			}
			&-name{
				@include flex(calc(100% - 40px));
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			&-btn{
				color: $danger;
				font-weight: 600;
				@include flex(60px);
			}
		}
	}
</style>