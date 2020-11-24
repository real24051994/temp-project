<template>
	<div class="page-container autopilot-form" :class="{ 'page-container-collapse' : aside_collapse }" >
		<transition name="fade-in" mode="out-in">
			<vue-autopilot-form-navbar v-if="modify">
				<template v-if="is_loading">
					<a-button class="m-r-16 ant-btn autpilot-action-btn ant-btn-transparent" :disabled="true">
						{{ $t('autopilot.btn.cancel_autopilot')}}
					</a-button>
				</template>
				<template v-else>
					<router-link id="btn-cancel-autopilot" :to="{ name : 'Autopilot'}" class="m-r-16 ant-btn autpilot-action-btn ant-btn-transparent">
						<span>{{ $t('autopilot.btn.cancel_autopilot')}}</span>
					</router-link>
				</template>
				<a-button v-if="mode == 'create'"  id="btn-submit-create-autopilot" :loading="is_loading" class="autpilot-action-btn" @click="onSubmit()">
					{{ $t('autopilot.btn.create_autopilot')}}
				</a-button>
				<a-button v-else-if="mode =='update'" id="btn-submit-update-autopilot" :loading="is_loading" class="autpilot-action-btn" @click="onSubmit()">
					{{ $t('autopilot.btn.update_autopilot')}}
				</a-button>
			</vue-autopilot-form-navbar>
		</transition>
		<div class="page-container-aside autopilot-social">
			<vue-autopilot-list-account :loading="loading" :data="socials" v-model="form.social_id" />
		</div>
		<div class="page-container-content">
			<div class="page-container-wrapper autopilot-main">
				<div class="autopilot-content">
					<vue-simple class="autopilot-scrollbar">
						<div class="autopilot-scrollbar-content">
							<div class="form-group-content form-group-content-heading">
								<template v-if="mode =='create'">
									<div class="autopilot-title">
										<h1 class="page-title" v-if="form.type == 'random'">{{ $t('autopilot.title.random_autopilot')}}</h1>
										<h1 class="page-title" v-else-if="form.type == 'latest'">{{ $t('autopilot.title.latest_autopilot')}}</h1>
										<h1 class="page-title" v-else-if="form.type == 'review'">{{ $t('autopilot.title.review_autopilot')}}</h1>
									</div>
								</template>
								<template v-else-if="mode == 'update'">
									<div class="autopilot-title">
										<h1 class="page-title">{{ $t('autopilot.title.update_autopilot')}}</h1>
										<div class="d-inline-block m-l-8" @click="onChangeStatus">
											<a-switch :checked="autopilot_status" />
										</div>
										<div class="d-inline-block m-l-8">
											<div  class="badge" :class="{ 'badge-info' : autopilot_status }">
												{{ autopilot_status ? 'Running' : 'Pause' }}
											</div>
										</div>
									</div>
									<div class="spacer"></div>
									<div class="autopilot-header-actions">
										<a-button id="btn-delete-autopilot" type="outline-danger" @click="handleDelete">
											Delete
										</a-button>
									</div>
								</template>
							</div>
							<div class="form-group-content" data-type="title" :class="{'input-field-error' : $v.form.title.$invalid }">
								<vue-autopilot-form-info 
								v-model="form.title" 
								:validate="$v.form.title" 
								:formstate="formstate" />
							</div>
							<hr class="m-t-24 m-b-24">
							<div class="form-group-content" data-type="template" :class="{'input-field-error' : $v.form.template.$invalid }">
								<vue-autopilot-form-content 
								v-model="form.template"  
								:autopilot-type="form.type"
								:is-select.sync="template_selected"
								:social-type="selected_social_type"
								:validate-template="$v.form.template" 
								:formstate="formstate" />
							</div>
							<hr class="m-t-24 m-b-24" v-if="form.type == 'random' || form.type == 'latest'">
							<div class="form-group-content" data-type="collection" v-if="form.type == 'random' || form.type == 'latest'" :class="{'input-field-error' : $v.form.collection_ids.$invalid }">
								<vue-autopilot-form-product 
								:autopilot-type="form.type"
								:validate-collection="$v.form.collection_ids" 
								:select_option.sync="form.select_product_options" 
								:collection_ids.sync="form.collection_ids" 
								:product_share_type.sync="form.product_share_type" 
								:social-type="selected_social_type"
								:formstate="formstate" />
							</div>
							<template v-if="!loading && ( form.type == 'random' || form.type == 'latest' )">
								<transition name="fade-in" mode="out-in">
									<div  v-if="form.product_share_type == 'image'">
										<div class="form-group-content pd-0"  data-type="logo" >
											<vue-autopilot-form-logo v-model="form.logo" :validate="$v.form.logo" :formstate="formstate" />
										</div>
									</div>
								</transition>
							</template>
							<hr class="m-t-24 m-b-24" v-if="form.type == 'random' || form.type == 'latest'">
							<div class="form-group-content pd-0"  data-type="discount" v-if="form.type == 'random' || form.type == 'latest'">
								<vue-autopilot-form-discount v-model="form.discount" :product-type="form.product_share_type"  :validate="$v.form.discount" :formstate="formstate" />
							</div>
							<hr class="m-t-24 m-b-24"  v-if="form.type == 'random' || form.type == 'latest'">
							<div class="form-group-content" data-type="schedule" :class="{'input-field-error' : $v.form.time_of_day.$invalid || $v.form.day_of_week}" v-if="form.type == 'random' || form.type == 'latest'">
								<vue-autopilot-form-schedule 
								:validate-time="$v.form.time_of_day" 
								:validate-date="$v.form.day_of_week" 
								:timezone.sync="form.timezone"
								:time.sync="form.time_of_day" 
								:date.sync="form.day_of_week" 
								:social-type="selected_social_type"
								:formstate="formstate" />
							</div>
							<hr class="m-t-24 m-b-24" v-if="form.type == 'random'">
							<div class="form-group-content" data-type="setting" v-if="form.type == 'random'">
								<vue-autopilot-form-setting v-model="form.setting" />
							</div>
							<hr class="m-t-24 m-b-24" v-if="form.type == 'review'">
							<template v-if="form.type == 'review'">
								<vue-autopilot-form-review v-model="form.integrate_json" />
							</template>
							<div class="autopilot-actions text-right p-l-24 p-r-24 m-b-50 m-t-20" v-if="!loading">
								<template v-if="is_loading">
									<a-button class="m-r-16 ant-btn autpilot-action-btn" :disabled="true">
										{{ $t('autopilot.btn.cancel_autopilot')}}
									</a-button>
								</template>
								<template v-else>
									<router-link id="btn-cancel-autopilot" :to="{ name : 'Autopilot'}" class="m-r-16 ant-btn autpilot-action-btn">
										<span>{{ $t('autopilot.btn.cancel_autopilot')}}</span>
									</router-link>
								</template>
								<a-button v-if="mode == 'create'"  id="btn-submit-create-autopilot" :disabled="!modify" :loading="is_loading" type="primary" class="autpilot-action-btn" @click="onSubmit()">
									{{ $t('autopilot.btn.create_autopilot')}}
								</a-button>
								<a-button v-else-if="mode =='update'" id="btn-submit-update-autopilot" :disabled="!modify" :loading="is_loading" type="primary" class="autpilot-action-btn" @click="onSubmit()">
									{{ $t('autopilot.btn.update_autopilot')}}
								</a-button>
							</div>
						</div>
					</vue-simple>
				</div>
			</div>
		</div>
		<div class="page-container-preview autopilot-preview" :style="preview_offset">
			<template v-if="selected_social">
				<vue-autopilot-preview 
				:autopilot-type="form.type"
				:social="selected_social" 
				:message="selected_message" 
				:type="product_share_type" 
				:product-type="form.select_product_options" 
				:collection="form.collection_ids" 
				:discount="form.discount"
				:logo="form.logo"
				:data="form" />
			</template>
			<template v-else>
				<div class="empty-social-preview-box p-t-50 p-b-24">
					<h3>
						{{ $t('autopilot.state.empty_preview.title')}}
					</h3>
					<p>
						{{ $t('autopilot.state.empty_preview.description')}}
					</p>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import { required, requiredIf , maxLength} from 'vuelidate/lib/validators'
import VueAutopilotListAccount from './vue-autopilot-list-account';
import VueAutopilotFormInfo from './vue-autopilot-form-info.vue'
import VueAutopilotFormContent from './vue-autopilot-form-content.vue'
import VueAutopilotFormProduct from './vue-autopilot-form-product.vue'
import VueAutopilotFormLogo from './vue-autopilot-form-logo.vue'
import VueAutopilotFormDiscount from './vue-autopilot-form-discount.vue'
import VueAutopilotFormSchedule from './vue-autopilot-form-schedule.vue'
import VueAutopilotFormSetting from './vue-autopilot-form-setting.vue'
import VueAutopilotPreview from './vue-autopilot-preview.vue'
import VueAutopilotFormReview from './vue-autopilot-form-review.vue'
import VueAutopilotFormNavbar from './vue-autopilot-form-navbar'
import { extractUrls } from '@publish/assets/twitter-text'
export default {
	name : 'VueAutopilotForm',
	components:{
		VueAutopilotListAccount,
		VueAutopilotFormInfo,
		VueAutopilotFormContent,
		VueAutopilotFormProduct,
		VueAutopilotFormLogo,
		VueAutopilotFormDiscount,
		VueAutopilotFormSchedule,
		VueAutopilotFormSetting,
		VueAutopilotPreview,
		VueAutopilotFormReview,
		VueAutopilotFormNavbar
	},
	props :{
		value :{
			type : Object,
			required : true
		}, 
		socials : {
			type : Array,
			required : true
		},
		mode : {
			type : String,
			default : 'create'
		},
		modify :{
			type : Boolean,
			default : false,
		},
		status : {
			type : Boolean,
		},
		loading :{
			type : Boolean,
			default : false,
		}
	},
	data(){
		return {
			is_loading: false,
			is_loading_preview : true,
			template_selected: 0,
			formstate: false,
			product : null,
			show_sticky : true,
			autopilot_types : {
				'random' : 1,
				'latest' : 2,
				'review' : 3
			}
		}
	},
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			banner : 'pricing/getShowBanner',
		}),
		preview_offset(){
			return this.banner ? { 'padding-top' : '38px' } : { 'padding-top' : '0px' }
		},
		autopilot_status:{
			get(){
				return this.status
			},
			set(value){
				this.$emit('update:status', value)
			}
		},
		form:{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		},
		selected_social(){
			return _.find(this.socials , { id : this.form.social_id })
		},
		selected_social_type(){
			var social = _.find(this.socials , { id : this.form.social_id })
			return social ? social.social_type : ''
		},
		// selected_template(){
		// 	return this.form.template[this.template_selected] ? this.form.template[this.template_selected] : null
		// },
		selected_message(){
			if( this.form.template[this.template_selected] ){
				return this.form.template[this.template_selected].content
			}
			return ''
		},
		product_share_type(){
			if( this.form.type == 'review' ){
				return 'image'
			}
			return this.form.product_share_type
		}
	},
	methods :{
		...mapActions({
			getCollectionById : 'utils/getCollectionById',
			createAutopilot :'autopilot/create',
			updateAutopilot : 'autopilot/update',
			deleteAutopilot : 'autopilot/delete',
			updateStatus : 'autopilot/updateStatus',
			dataLayer : 'auth/dataLayer'
		}),
		...mapMutations({
			'setShowModalAutopilot' : 'pricing/setShowModalAutopilot'
		}),
		async onChangeStatus(){
			if( this.autopilot_status ){
				await this.handlePause()
			}else{
				await this.handleResume()
			}
			return
			this.updateStatus({ id : this.id  , status}).then((res)=>{
				if( res.data  && res.data.status ){
					this.status = status
					this.toastSuccess({
						title: "Done !",
						message: status ? 'Active widget success !' : 'Pause widget success !',
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
		},
		onSubmit(){
			this.formstate = true 
			if( this.is_loading ) return;
			if(this.$v.form.$invalid){
				if( this.$v.form.social_id.$invalid ){
					this.toastError({
						title : this.$t('autopilot.toast.require_social.title'),
						message: this.$t('autopilot.toast.require_social.message'),
					})
					return
				}
				var input = document.querySelector('.input-field-error')
				if( input ){
					input.scrollIntoView({ behavior: 'smooth' });
					setTimeout( ()=>{
						var type = $(input).data('type')
						if( type == 'title'){
							var focusInput = input.querySelector('.input-field-error-focus')
							focusInput.focus()
						}else if( type == 'template'){
							var templateErrors = Object.values(this.$v.form.template.$each.$iter)
							var index = _.findIndex(templateErrors, { '$invalid' : true})
							if( this.template_selected != index){
								this.template_selected = index
								this.$nextTick(()=>{
									var focusInput = input.querySelector('.input-field-error-focus')
									focusInput.focus()
								})
							}else{
								var focusInput = input.querySelector('.input-field-error-focus')
								focusInput.focus()
							}
						}
					}, 400);
				}
			}else{
				var formdata = this.handleGetFormData()
				if( this.mode == 'create'){
					this.handleCreate(formdata)
				}else if( this.mode == 'update'){
					this.handleUpdate(formdata)
				}
			}
		},
		handleGetFormData(){
			var formdata = {
				type : this.autopilot_types.hasOwnProperty(this.form.type) ? this.autopilot_types[this.form.type] : 1 ,
				title : this.form.title ,
				social_id : this.form.social_id,
				template : this.form.template.map((item)=>{
					let { content = '' } = item 
					return {
						content : content,
						message_links : extractUrls(content)
					}
				}),
				select_product_options : this.form.select_product_options,
				collection_ids : this.form.collection_ids.map((item)=>item.internal_id),
				product_share_type : '',
			}
			if( this.form.type == 'random' || this.form.type == 'latest' ){
				formdata['time_of_day'] =  this.form.time_of_day
				formdata['day_of_week'] =  this.form.day_of_week
				formdata['product_share_type'] =  this.form.product_share_type
				formdata['timezone'] =  this.form.timezone
				formdata['allow_repeat'] = false
				formdata['allow_rotate'] = false
				if( this.form.type == 'random'){
					formdata['allow_repeat'] = this.form.setting.allow_repeat
					formdata['allow_rotate'] =  this.form.setting.allow_rotate
				}
			
				let discount_fieldable = [
					'is_create_discount',
					'is_enable_discount_tag' ,
					'discount_percent' ,
					'discount_limit_date' ,
					'discount_position',
					'discount_size',
					'discount_margin',
					'discount_image',
					'discount_template'
				]
				for (const key in this.form.discount) {
					if (this.form.discount.hasOwnProperty(key) && discount_fieldable.indexOf(key) >= 0) {
						const element = this.form.discount[key];
						if( key == 'discount_template'){
							formdata['discount_tag_json'] = JSON.stringify(element)
						}else if( key == 'discount_image'){
							if( new RegExp('(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)').test(element)){
								formdata['discount_media_data'] = element
							}else{
								formdata['discount_media_id'] = this.form.logo.discount_media_id
							}
							
						}else {
							formdata[key] = element
						}
					}
				}
				let logo_fieldable = [
					'is_enable_logo',
					'logo_image',
					'logo_size',
					'logo_margin',
					'logo_position',
					'logo_transparent',
				]
				for (const key in this.form.logo) {
					if (this.form.logo.hasOwnProperty(key) && logo_fieldable.indexOf(key) >= 0) {
						const element = this.form.logo[key];
						if( key == 'logo_image'){
							if( new RegExp('(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)').test(element) ){
								formdata['logo_media_data'] = element
							}else{
								formdata['logo_media_id'] = this.form.logo.logo_media_id
							}
						}else {
							formdata[key] = element
						}
					}
				}
			}else if( this.form.type == 'review'){
				formdata['integrate_json']  = this.form.integrate_json
				formdata['product_share_type'] =  ''
			}
			return formdata 
		},
		handleCreate(formdata){
			this.is_loading = true 
			this.createAutopilot(formdata).then((res)=>{
				if( res.status == 402  ){
					this.$emit('update:modify', false)
					this.setShowModalAutopilot(true)
				}else{
					let { status = false , data , message ='' } = res.data 
					if(status){
						this.toastSuccess({
							title : this.$t('autopilot.toast.create_autopilot_success.title'),
							message: this.$t('autopilot.toast.create_autopilot_success.message'),
						})
						this.dataLayer({
							"toast" : "Autopilot Created Scfl"
						})
						this.$emit('update:modify', false)
						this.redirect({
							name : 'Autopilot'
						})
					}else{
						this.toastError({
							title : this.$t('autopilot.toast.create_autopilot_error.title'),
							message: message,
						})
					}
				}
				this.is_loading = false
			})
			.catch(()=>{
				this.toastError({
					title : this.$t('autopilot.toast.create_autopilot_error.title'),
					message: this.$t('autopilot.toast.create_autopilot_error.message'),
				})
				this.is_loading = false
			})
		},
		handleUpdate(formdata){
			this.is_loading = true 
			this.updateAutopilot({ id  : this.form.id , formdata }).then((res)=>{
				if( res.status == 402 ){
					this.setShowModalAutopilot(true)
				}else{
					let { status = false , data , message ='' } = res.data 
					if(status){
						this.toastSuccess({
							title : this.$t('autopilot.toast.update_autopilot_success.title'),
							message: this.$t('autopilot.toast.update_autopilot_success.message'),
						})
						this.dataLayer({
							"toast" : "Autopilot Updated Scfl"
						})
						this.$emit('update:modify', false)
						this.redirect({
							name : 'Autopilot'
						})

					}else{
						this.toastError({
							title : this.$t('autopilot.toast.update_autopilot_error.title'),
							message: message,
						})
					}
				}
				this.is_loading = false
			})
			.catch(()=>{
				this.toastError({
					title : this.$t('autopilot.toast.update_autopilot_error.title'),
					message: this.$t('autopilot.toast.update_autopilot_error.message'),
				})
				this.is_loading = false
			})
		},
		handlePause(){
			this.$confirm({
				confirmLoading: true,
				title: this.$t('autopilot.confirm.pause_autopilot.title'),
				content: this.$t('autopilot.confirm.pause_autopilot.content'),
				okText : this.$t('autopilot.confirm.pause_autopilot.btn_ok'),
				cancelText : this.$t('autopilot.confirm.pause_autopilot.btn_cancel'),
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id : this.form.id  , status : false}).then((res)=>{
							if( res.status == 402 ){
								this.setShowModalAutopilot(true)
							}else{
								let { status = false } = res.data 
								if( status ){
									this.toastSuccess({
										title : this.$t('autopilot.toast.pause_autopilot_success.title'),
										message: this.$t('autopilot.toast.pause_autopilot_success.message'),
									})
									this.dataLayer({
										"toast" : "Autopilot Pause Scfl"
									})
									this.autopilot_status = false
								}else{
									this.toastError({
										title : this.$t('autopilot.toast.pause_autopilot_error.title'),
										message: this.$t('autopilot.toast.pause_autopilot_error.message'),
									})
								}
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.pause_autopilot_error.title'),
								message: this.$t('autopilot.toast.pause_autopilot_error.message'),
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
		handleResume(){
			// this.$confirm({
			// 	confirmLoading: true,
			// 	title: this.$t('autopilot.confirm.resume_autopilot.title'),
			// 	content: this.$t('autopilot.confirm.resume_autopilot.content'),
			// 	okText : this.$t('autopilot.confirm.resume_autopilot.btn_ok'),
			// 	cancelText : this.$t('autopilot.confirm.resume_autopilot.btn_cancel'),
			// 	okType:'primary',
			// 	onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id : this.form.id , status : true }).then((res)=>{
							if( res.status == 402 ){
								this.setShowModalAutopilot(true)
							}else{
								let { status = false } = res.data 
								if( status ){
									this.toastSuccess({
										title : this.$t('autopilot.toast.resume_autopilot_success.title'),
										message: this.$t('autopilot.toast.resume_autopilot_success.message'),
									})
									this.dataLayer({
										"toast" : "Autopilot Resume Scfl"
									})
									this.autopilot_status = true
								}else{
									this.toastError({
										title : this.$t('autopilot.toast.resume_autopilot_error.title'),
										message: this.$t('autopilot.toast.resume_autopilot_error.message'),
									})
								}
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.resume_autopilot_error.title'),
								message: this.$t('autopilot.toast.resume_autopilot_error.message'),
							})
							resolve()
						})
					})
					
			// 	},
			// 	onCancel :()=>{

			// 	}
			// })
		},
		handleDelete(){
			this.$confirm({
				confirmLoading: true,
				title: this.$t('autopilot.confirm.delete_autopilot.title'),
				content: this.$t('autopilot.confirm.delete_autopilot.content'),
				okText : this.$t('autopilot.confirm.delete_autopilot.btn_ok'),
				cancelText : this.$t('autopilot.confirm.delete_autopilot.btn_cancel'),
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.deleteAutopilot({ id : this.form.id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title : this.$t('autopilot.toast.delete_autopilot_success.title'),
									message: this.$t('autopilot.toast.delete_autopilot_success.message'),
								})
								this.dataLayer({
									"toast" : "Autopilot Delete Scfl"
								})
								this.$emit('update:modify', false)
								this.redirect({
									name : 'Autopilot'
								})
							}else{
								this.toastError({
									title : this.$t('autopilot.toast.delete_autopilot_error.title'),
									message: this.$t('autopilot.toast.delete_autopilot_error.message'),
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : this.$t('autopilot.toast.delete_autopilot_error.title'),
								message: this.$t('autopilot.toast.delete_autopilot_error.message'),
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
	},
	watch :{
		form : {
			handler : function(){
				if( !this.loading ){
					this.$emit('update:modify', true)
				}
			},
			deep : true
		}
	},
	validations(){
		var vm = this;
		return {
			form : {
				social_id:{
					required
				},
				title:{
					required
				},
				template :{
					required,
					maxLength : maxLength(10),
					$each: {
						content : {
							required
						}
					}
				},
				collection_ids:{
					required : requiredIf( (nested)=>nested.select_product_options == 'collection')
				},
				product_share_type: {
					required : requiredIf( ()=> vm.type == 'random' || vm.type == 'latest'  )
				},
				time_of_day :{
					required : requiredIf( ()=> vm.type == 'random' || vm.type == 'latest'  ),
					maxLength : maxLength(24)
				},
				day_of_week :{
					required : requiredIf( ()=> vm.type == 'random' || vm.type == 'latest'  )
				},
				logo :{
					logo_image :{
						required : requiredIf( (nested)=>nested.is_enable_logo)
					},
				},
				discount: {
					discount_template :{
						required : requiredIf( (nested)=>nested.is_create_discount && nested.is_enable_discount_tag)
					}
				}
			}
		}
	}
}
</script>
<style lang="scss">
	.autopilot-form{
		.page-container-content{
			padding-right: 500px;
		}
	}
</style>