<template>
	<div class="item-integrate item-integrate-alireview">
		<div class="item-integrate-logo">
			<img src="@publish/assets/icons/alireview-square.svg" alt="">
		</div>
		<div class="item-integrate-content">
			<div class="item-integrate-content-row">
				<div class="item-integrate-title">
					{{ $t('setting.integration.ar_review.name') }}
					<label v-if="form.install_status && form.integrate_status">
						{{ $t('setting.integration.intergrated')}}
					</label>
				</div>
				<div class="spacer"></div>
				<template v-if="form.install_status">
					<a-button v-if="form.integrate_status" @click="update(false)" :loading="is_integrate" class="btn-integrate btn-danger">
						{{ $t('setting.integration.unintergrate')}}
					</a-button>
					<a-button v-else @click="update(true)" :loading="is_integrate" class="btn-integrate btn-primary">
						{{ $t('setting.integration.integrate')}}
					</a-button>
				</template>
				<template v-else>
					<a-button @click="onInstallApp" :loading="is_install_app" class="btn-integrate btn-success">
						{{ $t('setting.integration.install_app')}}
					</a-button>
				</template>
			</div>
			<div class="item-integrate-content-row m-t-8">
				<div class="item-integrate-description">
					{{ $t('setting.integration.ar_review.description') }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'IntegrateAlireview',
	props:{
		value :{
			type : Object,
			required : true,
		}
	},
	data(){
		return {
			is_install_app : false,
			is_integrate : false,
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
	methods:{
		...mapActions({
			'generalAliReviewUrl' : 'intergate/generalAliReviewUrl',
			'integrationAliReview' : 'intergate/integrationAliReview'
		}),
		onInstallApp(){
			if( this.is_install_app ) return 
			this.is_install_app =  true 
			this.generalAliReviewUrl().then((res)=>{
				let { status = false , data = ''} = res.data 
				if( status ){
					this.is_install_app =  false
					window.open( data , '_blank')
				}
				this.is_install_app =  false
			})	
			.catch((err)=>{
				console.log(err);
				this.is_install_app =  false
			})
		},
		update(payload){
			if( this.is_integrate ) return 
			this.is_integrate =  true 
			this.integrationAliReview({ status : payload }).then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.form.integrate_status = payload
					if( payload ){
						this.toastSuccess({
							title : this.$t('setting.toast.integrate_alireview_success.title'),
							message : this.$t('setting.toast.integrate_alireview_success.message')
						})
					}else{
						this.toastSuccess({
							title : this.$t('setting.toast.unintegrate_alireview_success.title'),
							message : this.$t('setting.toast.unintegrate_alireview_success.message')
						})
					}
				}else{
					if( payload ){
						this.toastError({
							title : this.$t('setting.toast.integrate_alireview_error.title'),
							message : this.$t('setting.toast.integrate_alireview_error.message')
						})
					}else{
						this.toastError({
							title : this.$t('setting.toast.unintegrate_alireview_error.title'),
							message : this.$t('setting.toast.unintegrate_alireview_error.message')
						})
					}
				}
				this.is_integrate =  false
			})	
			.catch((err)=>{
				this.is_integrate =  false
				if( payload ){
					this.toastError({
						title : this.$t('setting.toast.integrate_alireview_error.title'),
						message : this.$t('setting.toast.integrate_alireview_error.message')
					})
				}else{
					this.toastError({
						title : this.$t('setting.toast.unintegrate_alireview_error.title'),
						message : this.$t('setting.toast.unintegrate_alireview_error.message')
					})
				}
			})
		},
	}
}
</script>