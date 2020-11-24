import { mapActions, mapGetters } from 'vuex'
export default {
	data(){
		return {
			is_loading_page : true,
			is_loading_error : false,
			socials: [],
			autopilot_types : ['random' , 'latest' ,'review'],
			autopilot_type : '',
			form :{
				type : '',
				title : '',
				social_id : '' ,
				template : [{
					id :  this.$helper.createId(),
					content : '',
				}] ,
				select_product_options : 'all_product',
				collection_ids : [] ,
				time_of_day : [],
				day_of_week:[] ,
				product_share_type : 'image',
				timezone: '',
				setting :{
					allow_repeat : true,
					allow_rotate : false,
				},
				logo :{
					is_enable_logo : false,
					logo_name : '',
					logo_media : '',
					logo_media_id : '',
					logo_image : '',
					logo_size : 1,
					logo_margin : 1,
					logo_position : 3,
					logo_transparent : 80,
				},
				discount : {
					is_create_discount : false,
					is_enable_discount_tag : false,
					discount_percent : 5,
					discount_limit_date : 2,
					discount_position : 1,
					discount_size : 1,
					discount_margin : 1,
					discount_image : '',
					discount_template : null,
					discount_media_id : ''
				},
				integrate_json : {
					rating_option : 5,
					update_enable : true,
					review_priority : true,
					time_interval : 30
				}
			},
			is_allowed : false,
			is_modify : false,
			is_visible_modal_pricing : false,
			is_visible_modal_integrate  : false,
			alireview_status : {
				install_status:true,
				integrate_status:false,
			}
		}
	},
	computed :{
		...mapGetters({
			'is_logged' : 'auth/getLogged',
			'time_setting' : 'auth/getTimeSetting',
			'templates' : 'autopilot-template/getTemplates',
		})
	},
	methods: {
		...mapActions({
			getTemplates : 'autopilot-template/list',
			getShopSetting : 'setting/get',
			getIntegration: 'intergate/list',
		}),
		loadShopSetting(){
			return new Promise((resolve, reject)=>{
				this.getShopSetting().then((res)=>{
					let { status = false , data = null } = res.data 
					if( status && data ){
						this.setting = data 
						let { social_accounts = []  , bit_ly_status = false ,  is_shorten_link = false  , service_shorten_link = ''} = data
						var socials = social_accounts.map((item)=>{
							let { utm_tag = '' , utm_status = false } = item 
							var object =  item.account
							object['setting'] =  {
								bit_ly_status ,
								is_shorten_link ,
								service_shorten_link ,
								utm_status,
								utm_tag ,
							}
							return object
						})
						this.socials = socials 
					}
					resolve()
				})
				.catch(()=>{
					resolve()
				})
			});
		},
		loadAutopilotTemplate(){
			return new Promise((resolve, reject)=>{
				if( this.templates.length ){
					resolve()
				}else{
					this.getTemplates().then(()=>{
						resolve()
					})
					.catch(()=>{
						resolve()
					})
				}
			})
		},
		checkIntegrateStatus(){
			return new Promise( (resolve, reject)=>{
				this.getIntegration({ filter : ['ar_review']}).then((res)=>{
					let { status = false , data = null } = res.data
					if( status && data ){
						if( data.hasOwnProperty('ar_review') && data['ar_review'].hasOwnProperty('integrate_status')){
							let { install_status = false , integrate_status = false  } = data['ar_review']
							this.alireview_status = {
								install_status,
								integrate_status,
							}
							if( install_status && integrate_status ){
								resolve(true)
							}
						}
					}
					resolve(false)
				})
				.catch(()=>{
					reject()
				})
			})
		},
		async onIntgrateSuccess(){
			try {
				await this.loadDefaultData()
			} catch (error) {
				this.is_loading_error = true 
			}
			this.is_loading_page = false
		}
	},
	beforeRouteLeave (to, from, next) {
		if( this.is_modify  && this.is_logged  ){
			this.$confirm({
				title: this.$t('autopilot.confirm.discard.title'),
				content: this.$t('autopilot.confirm.discard.content'),
				okText : this.$t('autopilot.confirm.discard.btn_ok'),
				cancelText : this.$t('autopilot.confirm.discard.btn_cancel'),
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
	}
}