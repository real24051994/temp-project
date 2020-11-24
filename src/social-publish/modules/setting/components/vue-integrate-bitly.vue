<template>
	<div class="item-integrate item-integrate-bitly">
		<div class="item-integrate-logo">
			<img src="@publish/assets/icons/bitly-square.svg" alt="">
		</div>
		<div class="item-integrate-content">
			<div class="item-integrate-content-row">
				<div class="item-integrate-title">
					{{ $t('setting.integration.bit_ly.name') }}
					<label v-if="form.status">
						{{ $t('setting.integration.intergrated')}}
					</label>
				</div>
				<div class="spacer"></div>
				<template v-if="form.status">
					<a-button class="btn-integrate btn-danger" @click="logout" :loading="is_logout_bitly">
						{{ $t('setting.integration.logout_bitly')}}
					</a-button>
				</template>
				<template v-else>
					<vue-integrate-bitly-auth :label="$t('setting.integration.login_bitly')"  @on-success="onLoginSuccess" />
				</template>
			</div>
			<div class="item-integrate-content-row m-t-8">
				<div class="item-integrate-description">
					{{ $t('setting.integration.bit_ly.description') }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import VueIntegrateBitlyAuth from './vue-integrate-bitly-auth'
import { mapActions } from 'vuex'
export default {
	name : 'IntegrateBitly',
	components:{
		VueIntegrateBitlyAuth
	},
	props:{
		value :{
			type : Object,
			required : true,
		}
	},
	data(){
		return {
			is_logout_bitly : false,
		}
	},
	computed :{
		form :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input' , value)
			}
		}
	},
	methods :{
		...mapActions({
			'removeBitlyAccount' : 'intergate/removeBitlyAccount'
		}),
		onLoginSuccess(payload){
			let { status = true , data } = payload 
			if( status ){
				this.toastSuccess({
					title : this.$t('setting.toast.connect_bitly_success.title'),
					message : this.$t('setting.toast.connect_bitly_success.message')
				})
				this.form.status = true
				this.form.name = data.login
			}else{
				this.toastError({
					title : this.$t('setting.toast.connect_bitly_error.title'),
					message : this.$t('setting.toast.connect_bitly_error.message')
				})
			}
		},
		logout(){
			if( this.is_logout_bitly ) return 
			this.is_logout_bitly = true 
			this.removeBitlyAccount().then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.toastSuccess({
						title : this.$t('setting.toast.logout_bitly_success.title'),
						message : this.$t('setting.toast.logout_bitly_success.message')
					})
					this.form.status = false
					this.form.name = ''
				}
				this.is_logout_bitly = false
			})
			.catch(()=>{
				this.toastSuccess({
					title : this.$t('setting.toast.logout_bitly_error.title'),
					message : this.$t('setting.toast.logout_bitly_error.message')
				})
				this.is_logout_bitly = false
			})
		}
	}
}
</script>