import { mapActions , mapMutations , mapGetters } from 'vuex'
export default {
	data(){
		return {
			is_loading_plan : false, 
		}
	},
	computed:{
		...mapGetters({
			plan : 'pricing/getUserPlan',
			plans : 'pricing/getPricingPlans',
			disabled_button : 'pricing/getDisabledButton'
		}),
		is_disabled_button :{
			get(){
				return this.disabled_button
			},
			set(value){
				this.setDisabledButton(value)
			}
		}
	},
	methods :{
		...mapActions({
			charge : 'pricing/generalShopifyCharge',
			removeCharege : 'pricing/removeShopifyCharge',
			checkAutopilotQuota : 'pricing/checkAutopilotQuota'
		}),
		...mapMutations({
			setShowModalDowngrade  : 'pricing/setShowModalDowngrade',
			setDisabledButton : 'pricing/setDisabledButton'
		}),
		generalCharge(app_plan){
			return new Promise((resolve, reject)=>{
				this.is_loading_plan = app_plan
				this.is_disabled_button = true
				this.charge({ app_plan }).then((res)=>{
					let { status = false , data = null  } = res.data
					if( status && data){
						window.location.href = data.confirmation_url
					}else{
						this.is_disabled_button = false
					}
					this.is_loading_plan = false
					resolve()
				})
				.catch((err)=>{
					this.is_loading_plan = false
					this.is_disabled_button = false
					reject()
				})
			});
		},
		handleRemoveCharge(app_plan){
			return new Promise((resolve, reject)=>{
				if( this.is_loading_plan ) {
					resolve()
				} 
				this.is_loading_plan = app_plan
				this.removeCharege().then((res)=>{
					this.is_loading_plan = false
					resolve()
				})
				.catch(()=>{
					this.is_loading_plan = false
					resolve()
				})
			})
		},
		handleUpgrade( app_plan ){
			if( this.is_loading_plan ) return 
			if( this.plans.hasOwnProperty(app_plan)){
				this.generalCharge(app_plan)
			}
		},
		handleDowngrade( app_plan ){
			return new Promise((resolve, reject)=>{
				if( this.is_loading_plan ) {
					resolve()
				} 
				if( this.plans.hasOwnProperty(app_plan)){
					this.is_loading_plan = app_plan
					var target_plan = this.plans[app_plan]
					this.checkAutopilotQuota().then((res)=>{
						let { status = false , data = null } = res.data 
						if( status && data ){
							let { autopilot } = data 
							if( autopilot.total <= target_plan.autopilots.limit ){
								this.handleConfirmDowngrade(app_plan)
							}else{
								this.setShowModalDowngrade({
									visible : true ,
									app_plan : app_plan
								})
							}
						}
						this.is_loading_plan = false
						resolve()
					})
					.catch(()=>{
						this.is_loading_plan = false
						resolve()
					})
				}else{
					resolve()
				}
			});
		},
		handleDowngradeWidthoutConfirm(app_plan){
			return new Promise((resolve, reject) => {
				if( app_plan == 'free'){
					this.handleRemoveCharge(app_plan).then(()=>{
						this.redirect({
							name : 'ChargeSuccess'
						})
						resolve()
					})
					.catch(()=>{
						resolve()
					})
				}else{
					this.generalCharge(app_plan).then(()=>{
						resolve()
					})
					.catch(()=>{
						resolve()
					})
				}
			})
		},
		handleConfirmDowngrade(app_plan){
			this.$confirm({
				confirmLoading: true,
				title: 'Downgrade',
				content: 'Are you sure you want to downgrade to '+ app_plan +' plan ?',
				okText : 'Downgrade',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						if( app_plan == 'free'){
							this.handleRemoveCharge(app_plan).then(()=>{
								this.redirect({
									name : 'ChargeSuccess',
								})
								resolve()
							})
							.catch(()=>{
								resolve()
							})
						}else{
							this.generalCharge(app_plan).then(()=>{
								resolve()
							})
							.catch(()=>{
								resolve()
							})
						}
					})
					
				},
				onCancel :()=>{

				}
			})
		}
	}
}