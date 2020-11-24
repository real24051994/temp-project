<template>
	<transition name="fade-in" mode="out-in">
		<div class="page-container page-container-center page-widget"  v-if="is_loading_page" key="is-loading">
			<div class="page-container-body p-t-50">
				<a-skeleton active :avatar="false" :title="false" :paragraph="{ rows: 10 , width : '100%' }"></a-skeleton>
			</div>
		</div>
		<div class="page-container  page-widget" v-else key="is-loading-success">
			<template v-if="is_loading_error">
				<div class="vue-social-widget-error" v-if="is_loading_error == 404">
					<vue-error type="404"></vue-error>
				</div>
				<div class="vue-social-widget-error" v-else-if="is_loading_error == 500">
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
				<div class="page-container-header">
					<div class="page-container-center">
						<div class="page-container-header-title">
							<div class="d-inline-block">
								<h1>Create Widget</h1>
							</div>
							<div class="spacer"></div>
							<a-button :loading="is_loading" @click="onSubmit" type="primary" class="m-w-100">
								Submit
							</a-button>
						</div>
						<div  class="vue-list-tabs">
							<a class="item-tab" @click="changeTab('options')" :class="{ 'is-actived' : is_active == 'options'}">
								Widget Setting
							</a>
							<a  class="item-tab" @click="changeTab('desktop')"  :class="{ 'is-actived' : is_active == 'desktop'}">
								Desktop
							</a>
							<a  class="item-tab" @click="changeTab('mobile')"  :class="{ 'is-actived' : is_active == 'mobile'}">
								Mobile
							</a>
							<a  class="item-tab" @click="changeTab('theme')"  :class="{ 'is-actived' : is_active == 'theme'}">
								Theme Setting
							</a>
						</div>
					</div>
				</div>
				<vue-position-sticky :offsetTop="48" sticky-class="page-widget-sticky" >
					<div class=" page-container-center d-flex">
						<div  class="vue-list-tabs">
							<a class="item-tab" @click="changeTab('options')" :class="{ 'is-actived' : is_active == 'options'}">
								Widget Setting
							</a>
							<a  class="item-tab" @click="changeTab('desktop')"  :class="{ 'is-actived' : is_active == 'desktop'}">
								Desktop
							</a>
							<a  class="item-tab" @click="changeTab('mobile')"  :class="{ 'is-actived' : is_active == 'mobile'}">
								Mobile
							</a>
							<a  class="item-tab" @click="changeTab('theme')"  :class="{ 'is-actived' : is_active == 'theme'}">
								Theme Setting
							</a>
						</div>
						<div class="spacer"></div>
						<a-button :loading="is_loading" @click="onSubmit" type="primary" class="m-w-100">
							Submit
						</a-button>
					</div>
				</vue-position-sticky>
				<div class="page-container-body page-container-center">
					<div class="m-t-30">
						<vue-widget-form  v-model="form" :tab.sync="is_active" :formstate="formstate" :validate="$v.form" />
					</div>
				</div>
			</template>
		</div>
	</transition>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import VueWidgetForm from '../components/vue-widget-form.vue'
import { required, requiredIf } from 'vuelidate/lib/validators'
import Widget from '../mixins/widget'
export default {
	name : "CreateWidget",
	mixins : [Widget],
	components:{
		VueWidgetForm
	},
	metaInfo(){
		return {
			title: 'Create Widget'
		}
	},
	data(){
		return {

		}
	},
	methods :{
		...mapActions({
			'createWidget' : 'widget/create',
			'updateStatus' : 'widget/updateStatus'
		}),
		onSubmit(){
			if( this.is_loading ) return 
			this.formstate = true 
			if( this.$v.form.$invalid ) {
				if( this.tab != 'options'){
					this.tab = 'options'
				}
				return
			}
			this.is_loading = true 
			var formdata = this.getFormData()
			this.createWidget(formdata).then((res)=>{
				let { status = false , data  , message = ''} = res.data 
				if( status ){
					this.handleUpdateStatus(data.id , true)
				}else{
					this.toastError({
						title : 'Error !',
						message : message
					})
				}
			})
			.finally(()=>{
				this.is_loading = false
			})
		},
	},
	async mounted(){
		try {
			await this.loadDefaultData()
		} catch (error) {
			this.is_loading_error = true 
		}
		this.is_loading_page = false 
		this.$nextTick(()=>{
			this.setModify()
		})
	}
}
</script>
