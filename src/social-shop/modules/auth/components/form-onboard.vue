<template>
	<div class="form-onboard">
		<div class="form-onboard-header">
			<h3>For the first time, please complete the configuration information below</h3>
			<div class="form-onboard-header-tabs">
				<template v-for="(item,index) in tabs">
					<div class="item-tab" :key="`item_index_${index}`" :class="setTabClass(index)" @click="onChangeTab(index)">
						<strong>{{ index + 1}}</strong>
						<span>{{ item.text }}</span>
					</div>
				</template>
			</div>
		</div>
		<div class="form-onboard-body">
			<transition name="fade-in" mode="out-in" >
				<div class="form-onboard-item" v-if="is_active == 0" key="step-0">
					<div class="form-onboard-item-row m-b-30">
						<h3>Platform account</h3>
						<div class="form-onboard-item-card">
							<form-source-setting-account  v-model="form.account" :show-label="false" />
						</div>
					</div>
					<div class="form-onboard-item-row">
						<h3>Product source filter</h3>
						<div class="form-onboard-item-card">
							<form-source-setting-filter v-model="form.source_filter" :account="form.account" :formstate="formstate.source_filter" :validate="$v.form.source_filter" :show-label="false" />
						</div>
					</div>
				</div>
				<div class="form-onboard-item" v-else-if="is_active == 1" key="step-1">
					<div class="form-onboard-item-row m-b-30">
						<h3>Source  setting</h3>
						<div class="form-onboard-item-card">
							<form-source-setting-options v-model="form.source_setting" :show-label="false" />
						</div>
					</div>
					
				</div>
				<div class="form-onboard-item" v-else-if="is_active == 2" key="step-2">
					<div class="form-onboard-item-row m-b-30">
						<h3>Schedule Sync Product</h3>
						<div class="form-onboard-item-card">
							<form-source-setting-schedule v-model="form.schedules" :formstate="formstate.schedules" :validate="$v.form.schedules" :show-label="false" />
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div class="form-onboard-footer">
			<a-button :disabled="is_active == 0" @click="prev()">
				Back
			</a-button>
			<div class="spacer"></div>
			<a-button v-if="is_active == 2" type="primary" @click="onSubmit()" :loading="is_loading">
				Finish
			</a-button>
			<a-button v-else type="primary" @click="next()">
				Next Step
			</a-button>
		</div>
	</div>
</template>

<script>
import FormSourceSettingAccount from '@shop/modules/source-setting/components/setting/form-source-setting-account'
import FormSourceSettingFilter from '@shop/modules/source-setting/components/setting/form-source-setting-filter'
import FormSourceSettingOptions from '@shop/modules/source-setting/components/setting/form-source-setting-options'
import FormSourceSettingSchedule from '@shop/modules/source-setting/components/setting/form-source-setting-schedule'
import FormSourceSettingManualSync from '@shop/modules/source-setting/components/setting/form-source-setting-manual-sync'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
	name : 'FormOnboard',
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
	},
	data(){
		return {
			tabs : [
				{
					id : 'source_filter',
					text : 'Source filter'
				},
				{
					id : 'source_setting',
					text : 'Source setting'
				},
				{
					id : 'schedules',
					text : 'Schedule Sync'
				}
			],
			is_active : 0,
			is_modify : false,
			is_loading_page : true,
			is_loading : false,
			formstate: {
				'source_filter': false,
				'source_setting' : false,
				'schedules' : false,
			},
			form : null,
			disabled_operators: ['is_empty' ,'is_not_empty'],
			timeout : null ,
		}
	},
	methods:{
		...mapMutations({
			setRegisterOnboard : 'auth/setRegisterOnboard'
		}),
		...mapActions({
			'updateSourceSetting' : 'source-setting/updateSourceSetting',
			'getSourceSetting' : 'source-setting/getSourceSetting'
		}),
		next(){
			if( this.is_active <= 1){
				var valid = this.checkStep(this.is_active)
				if( valid ){
					this.is_active += 1
				}
			}
		},
		prev(){
			if( this.is_active >= 1){
				this.is_active -= 1
			}
		},
		checkStep(index){
			var key = this.tabs[index].id 
			this.formstate[key] = true 
			var invalid = this.$v.form[key].$invalid 
			return !invalid
		},
		setTabClass(index){
			if( this.is_active >= index ){
				return 'is-active'
			}
			return ''
		},
		onChangeTab(index){
			if( index == 0 ) {
				this.is_active = index 
			}else if(index == 1) {
				var valid = this.checkStep(0)
				if( valid ){
					this.is_active = index
				}
			}else{
				var validStep0 = this.checkStep(0)
				var validStep1 = this.checkStep(1)
				if( validStep0 && validStep1 ){
					this.is_active = index
				}
			}
		},
		onSubmit(){
			this.formstate['schedules'] = true
			if( this.$v.form.$invalid || this.is_loading ) return 
			var formdata = this.getFormdata()
			this.is_loading = true 
			this.updateSourceSetting({ formdata }).then((res)=>{
				let { status = false , message = 'Something went wrong !' } = res.data 
				if( status ){
					this.setRegisterOnboard(true)
					this.redirect({
						name : 'FeedCenter'
					})
					this.toastSuccess({
						title: 'Done !',
						message: 'Product Source Setting updated sucessfully',
					})
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
			let pass_auth_setup = true 
			var form = {
				shop_id,
				pass_auth_setup,
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
				"source_setting" : {

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
					if( !this.is_loading ){
						this.is_modify = true
					}
				},
				deep :true 
			})
		})
	},
}
</script>