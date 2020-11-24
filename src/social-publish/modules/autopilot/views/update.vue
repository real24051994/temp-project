<template>
	<div class="autopilot random-autopilot">
		<div class="autopilot-body" v-if="is_loading_page" key="is-loading">
			<vue-autopilot-loading />
		</div>
		<div class="autopilot-body"  v-else key="is-loading-succes" >
			<template v-if="is_loading_error">
				<div class="pd-30" v-if="is_loading_error == 404">
					<vue-error type="404"></vue-error>
				</div>
				<div class="pd-30"  v-if="is_loading_error == 500">
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
				<vue-autopilot-form  v-model="form"  :autopilot-type="autopilot_type" :modify.sync="is_modify" :status.sync="status" mode="update" :socials="socials" />
			</template>
		</div>
		<vue-autopilot-modal-intergration v-if="is_visible_modal_integrate" v-model="is_visible_modal_integrate" :status="alireview_status" @on-integrate-success="onIntgrateSuccess" />
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueAutopilotForm from '../components/autopilot/vue-autopilot-form'
import VueAutopilotLoading from '../components/autopilot/vue-autopilot-loading'
import VueAutopilotModalIntergration from '../components/autopilot/vue-autopilot-modal-intergration'
import autopilot from '../mixins/autopilot'
export default {
	name : 'UpdateAutopilot',
	mixins : [autopilot],
	components:{
		VueAutopilotForm,
		VueAutopilotLoading,
		VueAutopilotModalIntergration
	},
	metaInfo(){
		return {
			title: this.title
		}
	},
	data(){
		return{
			title : 'Update Autopilot',
			status : '',
			allowed_time: ['Mon' ,'Tue','Wed' ,'Thu' ,'Fri' ,'Sat','Sun'],
			autopilot_types_value : {
				1 : 'random' ,
				2 : 'latest' ,
				3 : 'review' 
			},
		}
	},
	methods:{
		...mapActions({
			getAutopilot : 'autopilot/get',
		}),
		loadDefaultData(){
			return new Promise(async(resolve, reject)=>{
				try {
					await this.loadShopSetting()
					await this.getTemplates()
				} catch (e) {
					reject()
				}
				resolve()
			})
		},
		handleGetAutopilot(id){
			return new Promise((resolve, reject)=>{
				this.getAutopilot({ id }).then((res)=>{
					let { status = false  , data  } = res.data 
					if( status ){
						this.convertDataUpdate(data)
						resolve(true)
					}else{
						reject(404)
					}
				})
				.catch((err)=>{
					console.log(err);
					reject(500)
				})
			});
		},
		convertDataUpdate(data){
			let { 
				id = '',
				type = 1,
				title = '', 
				select_product_options = '', 
				collections = [], 
				product_share_type = '', 
				time_of_day = [], 
				day_of_week = [], 
				status = '', 
				timezone  = '', 
				social_account_id = '' , 
				templates = [{ id : this.$helper.createId(), content : ''}],
				allow_repeat =  true,
				allow_rotate =  false,
				is_create_discount = false,
				is_enable_discount_tag = false,
				discount_percent = 5,
				discount_limit_date = 2,
				discount_position = 1,
				discount_size = 1,
				discount_margin = 1,
				discount_media = null,
				discount_media_id = null,
				discount_tag_json = '',
				is_enable_logo = false,
				logo_margin = 1,
				logo_media = null,
				logo_media_id = null,
				logo_position = 1,
				logo_size = 1,
				logo_transparent = 100,
				integrate_json = null 
			}  = data 
			this.form.id = id 
			this.form.type = this.autopilot_types_value.hasOwnProperty(type) ? this.autopilot_types_value[type] : 1 
			this.form.title = title
			this.title = title
			this.form.select_product_options = select_product_options 
			this.form.collection_ids = collections
			this.status = status 
			this.form.social_id = social_account_id
			this.form.template = templates
			this.form.timezone = timezone
			if( this.form.type == 'random' || this.form.type == 'latest' ){
				this.form.product_share_type = product_share_type 
				this.form.time_of_day = time_of_day
				this.form.day_of_week = day_of_week.filter((item)=>{
					return this.allowed_time.indexOf(item) >= 0
				})
				this.form.discount.is_create_discount = is_create_discount
				this.form.discount.is_enable_discount_tag = is_enable_discount_tag
				this.form.discount.discount_percent = discount_percent
				this.form.discount.discount_limit_date =discount_limit_date
				this.form.discount.discount_position = discount_position
				this.form.discount.discount_size = discount_size
				this.form.discount.discount_margin = discount_margin
				this.form.discount.discount_image = discount_media ? discount_media.url : ''
				this.form.discount.discount_template = discount_tag_json ? JSON.parse(discount_tag_json) : null
				this.form.logo.is_enable_logo = is_enable_logo
				this.form.logo.logo_margin = logo_margin
				this.form.logo.logo_media_id = logo_media_id
				this.form.logo.logo_position = logo_position
				this.form.logo.logo_size = logo_size
				this.form.logo.logo_transparent = logo_transparent
				this.form.logo.logo_name = logo_media ? logo_media.name : ''
				this.form.logo.logo_image = logo_media ?  logo_media.url : ''
				this.form.logo.logo_media = logo_media ?  logo_media.url : ''
				if( this.form.type == 'random' ){
					this.form.setting.allow_repeat =  allow_repeat
					this.form.setting.allow_rotate =  allow_rotate
				}else{
					this.form.setting.allow_repeat =  false
					this.form.setting.allow_rotate =  false
				}
				
			}else if( this.form.type == 'review' ){
				if( integrate_json ){
					this.form.integrate_json = integrate_json
				}
			}
		}
	},
	
	async mounted(){
		this.is_loading_page = true 
		var id = this.$route.params && this.$route.params.id ? this.$route.params.id : ''
		try {
			await this.handleGetAutopilot(id)
		} catch (err) {
			console.log(err);
			this.is_loading_error = err
		}
		if( this.is_loading_error == false){
			if( this.form.type == 'review' ){
				try {
					var checkIntegrateStatus = await this.checkIntegrateStatus()
					if( !checkIntegrateStatus ){
						this.is_visible_modal_integrate = true
						return 
					}
				} catch (error) {
					this.is_loading_error = true 
					this.is_loading_page = false
					return
				}
			}
			try {
				await this.loadDefaultData()
			} catch (e) {
				this.is_loading_error = true 
			}
		}
		this.is_loading_page = false
	}
}
</script>