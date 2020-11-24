<template>
	<div class="container m-t-20">
		<div class="row">
			<div class="col col-12" v-if="is_loading_error">
				<div class="list-setting-error" >
					<vue-error type="500"></vue-error>
				</div>
			</div>
			<div class="col col-12" v-else>
				<div class="list-setting-content-table">
					<div v-if="is_loading_page" class="vue-setting-form">
						<div>
							<a-skeleton active :title="false" :paragraph="{ rows: 2 , width : '100%' }" />
						</div>
						<div class="m-t-40">
							<a-skeleton active :title="false" :paragraph="{ rows: 2 , width : '100%' }" />
						</div>
						<div class="m-t-40">
							<a-skeleton active :title="false" :paragraph="{ rows: 2 , width : '100%' }" />
						</div>
					</div>
					<div v-else class="vue-setting-form">
						<div>
							<vue-setting-shorten-link v-model="form.shorten_link" :disabled="!allowedShortenLink" :formstate="formstate" :validate="$v.form.shorten_link" /> 
						</div>
						<div class="m-t-40">
							<vue-setting-time v-model="form.time" /> 
						</div>
						<hr class="m-b-40 m-t-40">
						<div class="m-t-40">
							<vue-setting-currency v-model="form.currency_display_type" /> 
						</div>
						<hr class="m-b-40 m-t-40">
						<div>
							<vue-setting-utm v-model="form.utm"  :disabled="!allowedUTM"/>
						</div>
						<hr class="m-b-40 m-t-40">
						<div class="text-right m-b-40">
							<a-button  @click="discard" :disabled="!is_modify" class="m-l-16 m-w-160">
								{{ $t('setting.btn.discard') }}
							</a-button>
							<a-button type="primary" @click="onSubmit('bottom')" :disabled="!is_modify" class="m-l-16 m-w-160" :loading="is_updating_bottom">
								{{ $t('setting.btn.save') }}
							</a-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions , mapGetters, mapMutations } from 'vuex'
import VueSettingTime from '../components/vue-setting-time'
import VueSettingUtm from '../components/vue-setting-utm'
import VueSettingShortenLink from '../components/vue-setting-shorten-link'
import VueSettingCurrency from '../components/vue-setting-currency'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
	name : 'Setting',
	components:{
		VueSettingTime,
		VueSettingUtm,
		VueSettingShortenLink,
		VueSettingCurrency
	},
	data(){
		return {
			is_loading_page: true,
			is_loading_error : false,
			is_updating_navbar: false,
			is_updating_bottom: false,
			is_modify: false,
			form : {
				"shorten_link" : {
					"is_shorten_link": false,
					"service_shorten_link": "social_head",
					"shorten_link_bit_ly_info" : "",
					"bit_ly_name" : "",
					"bit_ly_status" : false,
				},
				"time" : {
					"timezone": null,
					"time_format": "12",
					"date_format": "YYYY-MM-DD",
				},
				"utm" :{
					"facebook" : [],
					"twitter" : []
				},
				"currency_display_type" : 0
			},
			reset_form : null,
			formstate : false,
		}
	},
	computed:{
		...mapGetters({
			'is_logged' : 'auth/getLogged',
			'allowedUTM' : 'pricing/getAllowedUTM',
			'allowedShortenLink' : 'pricing/getAllowedShortenLink'
		})
	},
	methods:{
		...mapActions({
			getSetting: 'setting/get',
			update:'setting/update',
			getUser : 'auth/getUser'
		}),
		...mapMutations({
			setShopSetting : 'auth/setShopSetting'
		}),
		loadSetting(){
			return new Promise((resolve, reject)=>{
				this.getSetting().then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						this.convertData(data)
					} 
					resolve()
				})
				.catch((e)=>{
					reject()
				})
			});
		},
		convertData(data){
			let {
				is_shorten_link = false, 
				service_shorten_link = "social_head",
				bit_ly_status = false,
				timezone,
				time_format,
				date_format,
				bit_ly_name = '',
				currency_display_type = 1,
				social_accounts = []
			} =  data 
			this.form.shorten_link = Object.assign(this.form.shorten_link , {
				is_shorten_link , 
				service_shorten_link,
				bit_ly_status,
				bit_ly_name
			})
			this.form.time = Object.assign(this.form.time , {
				timezone , 
				time_format,
				date_format
			})
			this.form.currency_display_type =  currency_display_type
			let filter_social_accounts = social_accounts.map((item)=>{
				for (const key in item.utm_tag_obj) {
					if (item.utm_tag_obj.hasOwnProperty(key)) {
						if( item.utm_tag_obj[key] == null ){
							item.utm_tag_obj[key] = ''
						}
					}
				}
				return item
			})
			let facebook = filter_social_accounts.filter((item)=>{
				return item.account.social_type == "facebook"
			})
			let twitter = filter_social_accounts.filter((item)=>{
				return item.account.social_type == "twitter"
			})
			this.form.utm = Object.assign(this.form.utm , {
				facebook,
				twitter
			})

			this.reset_form = JSON.parse(JSON.stringify(this.form))

		},
		onSubmit(payload){
			this.formstate = true 
			if( this.is_updating_navbar || this.is_updating_bottom  ) return ;
			if( this.$v.form.$invalid ){
				var input = document.querySelector('.input-field-error')
				if( input ){
					input.scrollIntoView({ behavior: 'smooth'});
				}
				if( this.$v.form.shorten_link.$invalid ){
					this.toastError({
						title : this.$t('setting.toast.require_bitly.title'),
						message : this.$t('setting.toast.require_bitly.message')
					})
				}
				return 
			}
			
			let formdata = {
				"is_shorten_link": this.form.shorten_link.is_shorten_link,
				"service_shorten_link": this.form.shorten_link.service_shorten_link,
				"timezone": this.form.time.timezone,
				"time_format": this.form.time.time_format,
				"date_format": this.form.time.date_format,
				"currency_display_type" : this.form.currency_display_type
			}
			let social_accounts = []
			for (const key in this.form.utm) {
				if (this.form.utm.hasOwnProperty(key)) {
					if( this.form.utm[key].length ){
						this.form.utm[key].forEach((item)=>{
							social_accounts.push({
								"utm_status": item.utm_status,
								"social_account_id": item.social_account_id,
								"utm_tag":  item.utm_tag,
								"utm_tag_obj":  item.utm_tag_obj
							})
						})
					}
				}
			}
			formdata['social_accounts'] = social_accounts
			
			if( payload == 'navbar' ){
				this.is_updating_navbar = true 
			}else {
				this.is_updating_bottom = true 
			}
			this.update(formdata).then((res)=>{
				let { status = false , data = '' , message = ''} = res.data
				if( status ){
					this.toastSuccess({
						title : this.$t('setting.toast.update_success.title'),
						message : this.$t('setting.toast.update_success.message')
					})
					this.setShopSetting({
						"timezone": this.form.time.timezone,
						"time_format": this.form.time.time_format,
						"date_format": this.form.time.date_format,
					})
					this.is_modify = false
					this.formstate = false
					this.reset_form = JSON.parse(JSON.stringify(this.form))
				}
				this.is_updating_navbar = false 
				this.is_updating_bottom = false
			})
			.catch((res)=>{
				this.toastError({
					title : this.$t('setting.toast.update_error.title'),
					message : this.$t('setting.toast.update_error.message')
				})
				this.is_updating_navbar = false 
				this.is_updating_bottom = false
			})
		},
		discard(){
			this.$confirm({
				title:  this.$t('setting.dialog.discard.title'),
				content: this.$t('setting.dialog.discard.content'),
				okText : this.$t('setting.dialog.discard.ok_text'),
				cancelText : this.$t('setting.dialog.discard.cancel_text'),
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					var reset_form = JSON.parse(JSON.stringify(this.reset_form))
					var shorten_link= Object.assign(reset_form.shorten_link , {
						bit_ly_status : this.form.shorten_link.bit_ly_status,
						bit_ly_name: this.form.shorten_link.bit_ly_name,
					})
					this.form = Object.assign( reset_form , { shorten_link })
					this.$nextTick(()=>{
						this.is_modify = false
					})
				},
				onCancel :()=>{
					
				}
			})
		},
	},
	async mounted(){
		try {
			await this.loadSetting()
		} catch (error) {
			console.log(error);
			this.is_loading_error = true
		}
		this.is_loading_page = false
		this.$nextTick(()=>{
			this.is_modify = false
			this.$watch('form' , {
				handler : function(){
					this.is_modify = true
				},
				deep : true
			})
		})
	},
	validations(){
		var vm = this;
		return {
			form : {
				"shorten_link" : {
					"bit_ly_status" : {
						valid : ()=>{
							return !vm.form.shorten_link.is_shorten_link || vm.form.shorten_link.service_shorten_link == 'social_head' ||
							( vm.form.shorten_link.is_shorten_link && vm.form.shorten_link.bit_ly_status)
						}
					},
				},
			}
		}
	},
	beforeRouteLeave (to, from, next) {
		if( this.is_modify && this.is_logged ){
			this.$confirm({
				title:  this.$t('setting.dialog.discard.title'),
				content: this.$t('setting.dialog.discard.content'),
				okText : this.$t('setting.dialog.discard.ok_text'),
				cancelText : this.$t('setting.dialog.discard.cancel_text'),
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					next()
				},
				onCancel :()=>{
					
				}
			})
		}else{
			next()
		}
	},
}
</script>
<style lang="scss">
	.app-layout-collapsed.app-layout{
		.vue-list-setting-page-navbar{
			left: $app-sidebar-width;
		}
	}
	.vue-list-setting-page{
		position: relative;
		
		&-navbar{
			position: fixed;
			top: 0;
			right: 0;
			left: $app-sidebar-width;
			height: $app-toolbar-height;
			background: #fff;
			border-bottom: 1px solid $border-color;
			z-index:  502;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 24px;
		}
		.list-setting{
			&-loading ,&-error{
				height: 400px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&-content{
				&-header{
					background: #FAFAFA;
					padding-top: 24px;
					.vue-list-tabs{
						border: none;
					}
				}
				&-title{
					@include flex(50%);
				}
				&-actions{
					@include flex(50%);
					text-align: right;
				}
				&-body{
					h3{
						font-weight: 600;
						font-size: 18px;
						line-height: 22px;
					}
				}
			}
		}
	}
</style>