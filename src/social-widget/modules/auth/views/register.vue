<template>
	<transition name="fade-in" mode="out-in">
		<div class="app-auth-register-page" v-if="is_loading_page" key="is-loading">
			<div class="app-auth-register-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
		</div>
		<div class="app-auth-register-page container" v-else key="loading-success">
			<transition name="fade-in" mode="out-in">
				<div v-if="step ==  0 " key="step-0">
					<register-step-connect-instagram v-model="data.gallery" :step.sync="step" />
				</div>
				<div v-else-if="step ==   1 " key="step-1">
					<register-step-create-widget v-model="data.widget" :step.sync="step" @on-update="onUpdateOnboarding" />
				</div>
				<div v-else-if="step ==  2"  key="step-2">
					<register-step-finish v-model="data.widget"  />
				</div>
			</transition>
		</div>
	</transition>
	
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import RegisterStepConnectInstagram from '../components/register-step-connect-instagram'
import RegisterStepCreateWidget from '../components/register-step-create-widget'
import RegisterStepFinish from '../components/register-step-finish'
export default {
	name : 'Register',
	components : {
		RegisterStepConnectInstagram,
		RegisterStepCreateWidget,
		RegisterStepFinish
	},
	metaInfo: {
		title: 'Register',
	},
	data(){
		return { 
			is_loading_page : true,
			steps : [ "Connect Instagram" , "Create First Widget" , "Done"],
			step : 0,
			data :{
				gallery : []
			},
		}
	},
	computed:{
		...mapGetters({
			chat_box_data : 'auth/getChatBoxData',
		})
	},
	methods :{
		...mapActions({
			getListGallery : 'gallery/getAll',
			updateOnboarding : 'auth/updateOnboarding',
		}),
		handleChangeTab(step){
			if( step > this.step){
				var check = this.checkStepValid(step)
				if( check ){
					this.step = step
				}
			}
		},
		checkStepValid(step){
			if( step == 1){
				return this.data.gallery.length
			}
			return false
		},
		onNext(){
			
		},
		onUpdateOnboarding(){
			this.updateOnboarding({
				type : 'step_on_boarding'
			})
		}
	},
	mounted(){
		// this.$intercom.init(this.intercom);
		this.getListGallery().then((res)=>{
			let { status = false , data = [] } = res.data 
			if( status ){
				this.data.gallery = data 
				if( data && data.length){
					this.step = 1
				}
			}else{
				this.data.gallery = []  
			}
		})
		.finally(()=>{
			this.is_loading_page = false
		})
	},
}
</script>
<style lang="scss">
	.app-auth-register{
		&-loading{
			height: 400px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-page{
			padding-top: 100px;
			padding-bottom: 50px;
			.page-title{
				font-weight: 600;
				font-size: 24px;
				line-height: 30px;
				text-align: center;
			}
		}
	}
</style>