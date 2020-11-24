<template>
	<transition name="fade-in" mode="out-in">
		<div class="form-source-setting" v-if="is_loading_page" key="is-loading">
			
		</div>
		<div class="form-source-setting" v-else key="is-loaded">
			<transition name="fade-in" mode="out-in">
				<div class="toolbar-navbar-fixed" v-if="is_modify">
					<template>
						<a-button class="btn-discard" @click="discard()" :disabled="is_loading">
							Discard
						</a-button>
						<a-button class="btn-save" @click="onSubmit()" :disabled="is_loading" :loading="is_loading">
							Save & Resync
						</a-button>
					</template>
				</div>
			</transition>
			<form-source-setting-account v-model="form.account" />
			<hr>
			<form-source-setting-filter v-model="form.source_filter" :account="form.account" :formstate="formstate" :validate="$v.form.source_filter" />
			<hr>
			<form-source-setting-options v-model="form.source_setting" />
			<hr>
			<form-source-setting-schedule v-model="form.schedules" :formstate="formstate" :validate="$v.form.schedules" />
			<hr>
			<form-source-setting-manual-sync :loading.sync="sync_status.is_sync_metafields" :source-id="sourceId" @set-reload-timeout="setSyncStatus" />
			<hr>
			<div class="form-source-setting-navbar">
				<a-button class="m-r-30" :disabled="!is_modify || is_loading || sync_status.is_sync_products" @click="discard()">
					Discard
				</a-button>
				<a-button v-if="sync_status.is_sync_products" type="primary"  :disabled="true" :loading="true">
					Syncing...
				</a-button>
				<a-button v-else type="primary"  :disabled="!is_modify || is_loading" :loading="is_loading" @click="onSubmit()">
					Save & Resync
				</a-button>
			</div>
		</div>
	</transition>
</template>

<script>
import FormSourceSettingAccount from '../components/setting/form-source-setting-account'
import FormSourceSettingFilter from '../components/setting/form-source-setting-filter'
import FormSourceSettingOptions from '../components/setting/form-source-setting-options'
import FormSourceSettingSchedule from '../components/setting/form-source-setting-schedule'
import FormSourceSettingManualSync from '../components/setting/form-source-setting-manual-sync'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
	name : 'SourceSettingForm',
	components:{
		FormSourceSettingAccount,
		FormSourceSettingFilter,
		FormSourceSettingOptions,
		FormSourceSettingSchedule,
		FormSourceSettingManualSync
	},
	props :{
		value :{
			type :Object
		},
		sourceId: {
			type : [String, Number],
			default: ''
		},
		loading :{
			type :Object
		}
	},
	data(){
		return {
			is_modify : false,
			is_loading_page : true,
			is_loading : false,
			formstate: false,
			form : null,
			disabled_operators: ['is_empty' ,'is_not_empty'],
			timeout : null ,
		}
	},
	computed :{
		...mapGetters({
			is_logged : 'auth/getLogged',
		}),
		sync_status :{
			get(){
				return this.loading
			},
			set(value){
				this.$emit('update:loading' , value)
			}
		}
	},
	methods :{
		...mapActions({
			'updateSourceSetting' : 'source-setting/updateSourceSetting',
			'getSourceSetting' : 'source-setting/getSourceSetting'
		}),
		onSubmit(){
			this.formstate = true
			if( this.$v.form.$invalid || this.is_loading ) return 
			var formdata = this.getFormdata()
			this.is_loading = true 
			this.updateSourceSetting({ formdata }).then((res)=>{
				let { status = false , message = 'Something went wrong !' } = res.data 
				if( status ){
					console.log('update modify');
					var clone_formdata = _.cloneDeep(this.form)
					this.$emit('input', clone_formdata)
					this.toastSuccess({
						title: 'Done !',
						message: 'Product Source Setting updated sucessfully',
					})
					this.sync_status.is_sync_products = true
					this.formstate = false
					this.is_modify = false
					this.$emit('set-reload-timeout')
				}else{
					this.toastError({
						title: 'Error !',
						message
					})
				}
				this.is_loading = false
			})
			.catch(err=>{
				this.is_loading = false
				this.toastError({
					title: 'Error !',
					message : err
				})
			})
		},
		getFormdata(){
			let { account ,  schedules , source_filter ,  source_setting } = this.form 
			let { shop_id } = account
			let { use_seo , use_seo_description  , include_variant , import_unpublished , compare_at_price } = source_setting
			let { collections ,  exclude_product_ids , exclude_product_ids_status ,  exclude_rules , exclude_rules_status , type_get_product } = source_filter
			let { schedule ,auto_refresh_at , auto_refresh_period_hourly , auto_refresh_period_weekly, timezone } = schedules

			let auto_refresh_period = ''
			if( schedule  == 'hourly' ){
				auto_refresh_period  = auto_refresh_period_hourly
			}else if(  schedule  == 'weekly' ){
				auto_refresh_period  = auto_refresh_period_weekly
			}
			var form = {
				shop_id,
				use_seo,
				use_seo_description,
				include_variant,
				import_unpublished,
				compare_at_price,
				type_get_product,
				"collection_ids":  type_get_product == "specific_collections" ? collections.map(item=>item.internal_id) : [],
				exclude_product_ids_status,
				"exclude_product_ids": exclude_product_ids_status ? exclude_product_ids : [],
				exclude_rules_status,
				"exclude_rules" : exclude_rules_status ? exclude_rules : [],
				"schedules": {
					schedule,
					auto_refresh_at,
					auto_refresh_period,
					timezone,
				}
			}
			return form 
		},
		resetFormdata(){
			this.is_loading_page = true
			this.form = _.cloneDeep(this.value)
			this.$nextTick(()=>{
				this.is_modify = false 
				this.is_loading_page = false
				this.formstate = false 
			})

		},
		discard(){
			this.$confirm({
				title: 'Discard Changes',
				content: "The changes won't be saved. Do you want to discard?",
				okText: 'Discard',
				cancelText: 'Cancel',
				okType: 'outline-danger',
				zIndex: 10002,
				onOk: () => {
					this.resetFormdata()
				},
			})
		},
		setSyncStatus(){
			this.$emit('set-reload-timeout')
		}
	},
	beforeRouteLeave(to, from, next) {
		if (this.is_modify && this.is_logged) {
			this.$confirm({
				title: 'Discard Changes',
				content: "The changes won't be saved. Do you want to leave this page?",
				okText: 'Discard',
				cancelText: 'Cancel',
				okType: 'outline-danger',
				zIndex: 10002,
				onOk: () => {
					next()
				},
			})
		} else {
			next()
		}
	},
	validations(){
		var vm  = this 
		return {
			"form" : {
				"source_filter": {
					"collections" : {
						required : requiredIf( ()=> this.form.source_filter.type_get_product == "specific_collections"),
					},
					"exclude_product_ids" : {
						required : requiredIf( ()=> this.form.source_filter.exclude_product_ids_status == true),
					},
					"exclude_rules" : {
						required : requiredIf( ()=> this.form.source_filter.exclude_rules_status == true),
						$each: {
							required : requiredIf( (nested)=> this.form.source_filter.exclude_rules_status == true),
							$each: {
								"key": {
									required : requiredIf( ()=> this.form.source_filter.exclude_rules_status == true),
								},
								"operator": {
									required : requiredIf( ()=> this.form.source_filter.exclude_rules_status == true),
								},
								"value": {
									required : requiredIf( (nested)=> this.form.source_filter.exclude_rules_status == true && this.disabled_operators.indexOf(nested.operator) == -1 ),
								}
							}
						}
					}
				},
				"schedules" : {
					"auto_refresh_at" : {
						required
					}, 
					"schedule" : {
						required
					},
					"auto_refresh_period_hourly" : {
						required :  requiredIf( (nested)=> nested.schedule == 'hourly'),
					}, 
					"auto_refresh_period_weekly": {
						required :  requiredIf( (nested)=> nested.schedule == 'weekly'),
					},
					"timezone" : {
						required
					}
				}
			}
		}	
	},
	created(){
		this.form = _.cloneDeep(this.value)
		this.is_loading_page = false
		this.$nextTick(()=>{
			this.$watch('form' , {
				handler : function(){
					console.log('watch');
					if( !this.is_loading  && !this.is_loading_page){
						console.log('watch is_modify');
						this.is_modify = true
					}
				},
				deep :true 
			})
		})
	},
	
}
</script>

<style lang="scss">
	.form-source-setting{
		width: 1100px;
		margin: 30px auto;
		hr{
			margin: 30px 0;
			border-top: 1px solid #E2E2E2;
		}
		.form-source-setting-item{
			margin-left: -15px;
			margin-right: -15px;
			display: flex;
			p{
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				color: #828282;
			}
			&-label{
				@include col;
				min-width: 0;
				padding: 0 15px;
				
				h4{
					font-weight: 600;
					font-size: 18px;
				}
			}
			&-content{
				@include flex(795px);
				padding: 0 15px;
			}
			&-card{
				background: #FFFFFF;
				border: 1px solid $border-color;
				box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.03);
				border-radius: 3px;
				overflow: hidden;
				h5{
					font-size: 14px;
					font-style: normal;
					font-weight: 600;
					margin: 0;
				}
				&-header{
					border-bottom: 1px solid $border-color;
					padding: 12px 24px;
				}
				&-body{
					padding:24px;
				}
			}
		}
		&-navbar{
			text-align: right;
			padding: 16px 0px;
			button{
				min-width: 130px;
			}
		}
		&-popover{
			max-width: 400px;
			font-size: 14px;
		}
	}
</style>