<template>
	<div class="app-register-finish">
		<div class="page-title m-b-16">That's Great !</div>
		<p>
			Yout first widget was created. <br> Now you can control all your Instagram Feed & Slider on <strong>Social Widget</strong>
		</p>
		<div class="app-register-finish-btn m-t-16">
			<transition name="fade-in" mode="out-in">
				<a-button v-if="widget.status" key="is-active" type="primary" @click="goPreview">View Your Widget</a-button>
				<a-button v-else key="is-inactive" :loading="is_loading" type="primary" @click="handleUpdateStatus">Active Your Widget</a-button>
			</transition>
			
			<a-button  @click="goHome">Go to Gallery</a-button>
		</div>
	</div>
</template>
<script>
import { mapMutations  , mapGetters, mapActions} from 'vuex'
export default {
	name : 'RegisterFinish',
	props: {
		value :{

		}
	},
	data(){
		return {
			is_loading : false,
		}
	},
	computed: {
		...mapGetters({
			shop : 'auth/getShop'
		}),
		widget :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{
		...mapActions({
			'updateWidgetStatus' : 'auth/updateWidgetStatus'
		}),
		...mapMutations({
			'finishStepOnboarding' : 'auth/finishStepOnboarding',
		}),
		goHome(){
			this.finishStepOnboarding()
			this.redirect({
				name : 'Gallery'
			})
		},
		goPreview(){
			this.finishStepOnboarding()
			this.redirect({
				name : 'Gallery'
			})
			var result = `${this.widget.preview_url}&rawDomain=${this.shop.raw_domain}`
			window.open(result, "_blank"); 
		},
		handleUpdateStatus(){
			if( this.is_loading ) return 
			this.is_loading = true
			this.updateWidgetStatus({ id : this.widget.id  , status : true }).then((res)=>{
				if( res.data  && res.data.status ){
					this.toastSuccess({
						title: "Done !",
						message: 'Active widget success !',
					})
					this.widget.status = true
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
				this.is_loading = false
			})
		},
	}
}
</script>
<style lang="scss">
	.app-register-finish{
		padding: 50px 30px;
		text-align: center;
		h3{
			font-size: 24px;
			font-weight: 600;
		}
		p{
			font-size: 16px;
		}
		&-btn{
			text-align: center;
			.ant-btn{
				margin: 0 8px;
				min-height: 40px;
				min-width: 150px;
			}
		}
	}
</style>