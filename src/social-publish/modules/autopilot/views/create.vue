<template>
	<div class="autopilot create-autopilot" v-if="is_allowed">
		<div class="autopilot-body" v-if="is_loading_page">
			<vue-autopilot-loading />
		</div>
		<div class="autopilot-body" v-else >
			<template v-if="is_loading_error">
				<div class="pd-30">
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
				<template v-if="socials.length">
					<vue-autopilot-form  v-model="form"  :modify.sync="is_modify" :socials="socials" />
				</template>
				<template v-else>
					<div class="p-t-30 p-b-30">
						<vue-empty-social-account  />
					</div>
				</template>
			</template>
		</div>
		<vue-pricing-modal-autopilot v-model="is_visible_modal_pricing" @on-close="onCloseModalPricing" />
		<vue-autopilot-modal-intergration v-if="is_visible_modal_integrate" v-model="is_visible_modal_integrate" :status="alireview_status" @on-integrate-success="onIntgrateSuccess" />
	</div>
	<div class="autopilot create-autopilot-pricing" v-else>
		<div class="container">
			<div class="row">
				<div class="col col-12">
					<vue-pricing-autopilot-pricing />
				</div>
				<div class="col col-12 p-b-40">
					<vue-pricing-list-plan />
				</div>
				<div class="col col-12 p-b-40">
					<div class="text-center">
						<a href="#">
							Learn what you will get in higher plan
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueAutopilotForm from '../components/autopilot/vue-autopilot-form'
import VueAutopilotLoading from '../components/autopilot/vue-autopilot-loading'
import VueAutopilotModalIntergration from '../components/autopilot/vue-autopilot-modal-intergration'
import autopilot from '../mixins/autopilot'
export default {
	name : 'CreateAutopilot',
	mixins : [autopilot],
	components:{
		VueAutopilotForm,
		VueAutopilotLoading,
		VueAutopilotModalIntergration
	},
	metaInfo(){
		return {
			title: 'Create Autopilot'
		}
	},
	data(){
		return {
			
		}
	},
	computed:{
		...mapGetters({
			'allowedAutopilotType' : 'pricing/getAllowedAutopilotType',
		})
	},
	methods: {
		...mapActions({
			checkAutopilotQuota : 'pricing/checkAutopilotQuota',
		}),
		loadDefaultData(){
			return new Promise(async(resolve, reject)=>{
				try {
					await this.loadShopSetting()
					await this.loadAutopilotTemplate()
				} catch (e) {
					reject()
				}
				this.setDefaultValue()
				resolve()
			})
		},
		setDefaultValue(){
			if( this.socials.length ){
				let first_item = _.find( this.socials , { connect_error : null })
				if( first_item ){
					this.form.social_id = first_item.id
					if( this.templates.length ){
						var autopilot_templates  = JSON.parse(JSON.stringify(this.templates)) 
						var social = _.find(this.socials , { id : this.form.social_id })
						if( social ){
							var filter_data = autopilot_templates.filter((item)=>{
								if( this.form.type == 'random' || this.form.type == 'lastest'){
									return item.type == 'default' && item.social_type == social.social_type
								}else if( this.form.type == 'review' ){
									return item.type == 'review'  && item.social_type == social.social_type
								}
								return item.social_type == social.social_type
							})
							if( filter_data.length ){
								var random = Math.floor(Math.random() * filter_data.length)
								var random_template = filter_data[random]
								this.form.template[0].content = random_template.content
							}
						}
					}
				}
			}
		},
		onCloseModalPricing(){
			this.redirect({
				name : 'Pricing'
			})
		},
	},
	async mounted(){
		let type = this.$route.query && this.$route.query.hasOwnProperty('type') ? this.$route.query['type'] : ''
		let form_type = ''
		if( this.autopilot_types.indexOf(type) >= 0 ){
			form_type = type
		}else{
			form_type = this.autopilot_types.first()
		}
		if( this.allowedAutopilotType.indexOf(form_type) >= 0 ){
			this.is_allowed = true 
		}
		if( this.is_allowed ){
			this.form.type = form_type
			if( form_type == 'review' ){
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
			}else{
				this.form.timezone = this.time_setting.timezone
			}
			try {
				await this.loadDefaultData()
			} catch (error) {
				this.is_loading_error = true 
			}
		}
		this.is_loading_page = false
	}
}
</script>