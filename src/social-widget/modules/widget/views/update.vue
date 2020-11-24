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
								<h1>Update Widget</h1>
							</div>
							<div class="d-inline-block m-l-8">
								<a-switch v-model="status" @change="onChangeStatus" />
							</div>
							<div class="d-inline-block m-l-8">
								<div  class="badge" :class="{ 'badge-info' : status , 'badge-danger' : !status }">
									{{ status ? 'Active' : 'widget' }}
								</div>
							</div>
							<div class="spacer"></div>
							<a-button @click="handleDelete(false)" type="outline-danger"   class="m-r-16 m-w-100">
								Delete
							</a-button>
							<a-button :loading="is_loading" @click="onSubmit" type="primary" class="m-w-100">
								Save
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
						<a-button @click="handleDelete(false)" type="outline-danger"   class="m-r-16 m-w-100">
							Delete
						</a-button>
						<a-button :loading="is_loading" @click="onSubmit" type="primary" class="m-w-100">
							Save
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
	name : "UpdateWidget",
	mixins : [Widget],
	components:{
		VueWidgetForm
	},
	metaInfo(){
		return {
			title: 'Edit Widget'
		}
	},
	data(){
		return {
			id : '',
			status : null,
		}
	},
	methods :{
		...mapActions({
			'getWidget' : 'widget/get',
			'updateWidget' : 'widget/update',
			'deleteWidget' : 'widget/delete',
		}),
		onSubmit(){
			if( this.is_loading ) return 
			this.formstate = true 
			if( this.$v.form.$invalid ) return
			this.is_loading = true 
			var formdata = this.getFormData()
			this.updateWidget({ id  : this.id , formdata : formdata }).then((res)=>{
				let { status = false , data  , message = ''} = res.data 
				if( status ){
					this.toastSuccess({
						title : 'Update widget success !'
					})
					this.is_modify = false 
					this.redirect({
						name : 'Widget'
					})
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
		handleDelete(){
			this.$confirm({
				confirmLoading: true,
				title: 'Delete',
				content: 'Do you want to remove this widget ?',
				okText : 'Delete',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteWidget({ id  : this.id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: "Done !",
									message: "Delete widget success",
								})
								this.redirect({
									name : 'Widget'
								})
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not delete widget",
								})
							}
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not delete widget",
							})
						})
						.finally(()=>{
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		onChangeStatus(status){
			this.updateStatus({ id : this.id  , status}).then((res)=>{
				if( res.data  && res.data.status ){
					this.status = status
					this.toastSuccess({
						title: "Done !",
						message: status ? 'Activate widget success !' : 'Pause widget success !',
					})
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
		}
	},
	mounted(){
		this.id = this.$route.params.id 
		this.getWidget( { id : this.id }).then((res)=>{
			let { status = false , data } = res.data 
			if( status ){
				this.status = data.status
				for (const key in this.form) {
					if (data.hasOwnProperty(key)) {
						this.form[key] = data[key]
					}
				}
				Promise.all([this.handleGetListPage() , this.handleGetListGallery() ]).then(res => {	})
				.finally(()=>{
					this.is_loading_page = false
				})
			}else{
				this.is_loading_error = 404
				this.is_loading_page = false 
			}
		})
		.catch((err)=>{
			this.is_loading_error = 500 
			this.is_loading_page = false 
		})
	},
	async mounted(){
		this.id = this.$route.params.id 
		try {
			let res = await this.getWidget( { id : this.id })
			let { status = false , data } = res.data 
			if( status ){
				this.status = data.status
				for (const key in this.form) {
					if (data.hasOwnProperty(key)) {
						this.form[key] = data[key]
					}
				}
				await this.loadDefaultData()
			}else{
				this.is_loading_error = 404
			}
			
		} catch (error) {
			this.is_loading_error = 500
		}
		this.is_loading_page = false 
		this.$nextTick(()=>{
			this.setModify()
		})
	}
}
</script>
<style lang="scss" scoped>
	.widget-title{
		display: flex;
		align-items: center;
		.widget-status{
			font-weight: 600;
			font-size: 14px;
			line-height: 22px;
			color: $danger;
			position: relative;
			&:before{
				content: "";
				width: 8px;
				height: 8px;
				display: inline-block;
				border-radius: 50%;
				background-color: $danger;
				margin-right: 8px;
			}
			&.is-active{
				color: $success;
				&:before{
					background-color: $success;
				}
			}
		}

	}
</style>