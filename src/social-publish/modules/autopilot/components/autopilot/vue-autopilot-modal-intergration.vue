<template>
	<a-modal transitionName="none" maskTransitionName="none" :title="false" :bodyStyle="{ padding : '0px' , overflow : 'hidden'}" v-model="visible" :closable="true" :footer="false"  width="420px" :afterClose="afterClose">
		<div class="vue-autopilot-modal-intergration">
			<div class="vue-autopilot-modal-intergration-icons">
				<img src="@publish/assets/icons/socialpublish-square.svg" alt="">
				<i>
					<sh-icon :icon="['far','link']" />
				</i>
				<img src="@publish/assets/icons/alireview-square.svg" alt="">
			</div>
			<div class="vue-autopilot-modal-intergration-title m-t-24">
				Intergrate with Ali Review
			</div>
			<div class="vue-autopilot-modal-intergration-description m-t-8">
				Auto publish your product’s review to boost your sales better
			</div>
			<div class="vue-autopilot-modal-intergration-btns m-t-24">
				<template v-if="status.install_status">
					<a-button class="btn-integrate btn-primary" @click="onIntegrate" :loading="is_integrate">
						Integrate
					</a-button>
				</template>
				<template v-else>
					<a-button class="btn-integrate btn-success"  @click="onInstallApp"  :loading="is_install_app" >
						{{ $t('setting.integration.install_app')}}
					</a-button>
				</template>
				
			</div>
		</div>
	</a-modal>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'VueModalIntergration',
	props:{
		value :{
			type : Boolean,

		},
		status :{
			type : Object
		}
	},
	data(){
		return {
			is_install_app : false,
			is_integrate : false,
			visible : true
		}
	},
	methods:{
		...mapActions({
			'generalAliReviewUrl' : 'intergate/generalAliReviewUrl',
			'integrationAliReview' : 'intergate/integrationAliReview'
		}),
		afterClose(){
			this.$emit('input' , false)
			this.redirect({
				name : 'Autopilot'
			})
		},
		onIntegrate(){
			if( this.is_integrate ) return 
			this.is_integrate =  true 
			this.integrationAliReview({ status : true }).then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.toastSuccess({
						title : this.$t('setting.toast.integrate_alireview_success.title'),
						message : this.$t('setting.toast.integrate_alireview_success.message')
					})
					this.$emit('on-integrate-success')
					this.$emit('input' , false)
				}else{
					this.toastError({
						title : this.$t('setting.toast.integrate_alireview_error.title'),
						message : this.$t('setting.toast.integrate_alireview_error.message')
					})
				}
				this.is_integrate =  false
			})	
			.catch((err)=>{
				this.is_integrate =  false
				this.toastError({
					title : this.$t('setting.toast.integrate_alireview_error.title'),
					message : this.$t('setting.toast.integrate_alireview_error.message')
				})
			})
		},
		onInstallApp(){
			if( this.is_install_app ) return 
			this.is_install_app =  true 
			this.generalAliReviewUrl().then((res)=>{
				let { status = false , data = ''} = res.data 
				if( status ){
					this.is_install_app =  false
					this.redirect({
						name : 'Integrate'
					})
					window.open( data , '_blank')
				}
				this.is_install_app =  false
			})	
			.catch((err)=>{
				this.is_install_app =  false
			})
		},
		
	}
}
</script>
<style lang="scss">
	.vue-autopilot-modal-intergration{
		padding: 30px;
		text-align: center;
		&-icons{
			
			i{
				color: #CECECE;
				display: inline-block;
				vertical-align: middle;
				margin: 0 20px;
				font-size: 16px;
			}
			img{
				width: 50px;
				display: inline-block;
				vertical-align: middle;
			}
		}
		&-title{
			font-weight: 600;
			font-size: 18px;
			line-height: 21px;
		}
		&-description{
			font-size: 12px;
			line-height: 14px;
		}
		&-btns{
			button{
				min-width: 200px;
			}
		}
	}
</style>