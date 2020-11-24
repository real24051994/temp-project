<template>
	<div class="page-container page-pricing">
		<template v-if="is_loading">
			<div>
				loading page 
			</div>
		</template>
		<template v-else>
			<div class="page-container-header page-container-header-pricing">
				<div class="page-title">
					<template v-if="trial">
						<div>Start your free trial</div>
					</template>
					<template v-else>
						<div>Upgrade your plan</div>
						<div>Empower your business with these additional features</div>
					</template>
				</div>
				<div class="page-sub-title m-b-16" v-if="trial">
					Multiple accounts and platforms integration. Get access to all features on Socialpublish!
				</div>
				<div class="page-sub-title">
					You are using <strong>{{ plan.name }} Plan</strong>
				</div>
			</div>
			<div class="page-container-body">
				<div class="container p-b-50">
					<div class="row">
						<div class="col col-12">
							<vue-pricing-list-plan class="list-pricing-plan"/>
						</div>
						<div class="col col-12 m-t-40" v-if="plan.id != 'custom'">
							<div class="custom-pricing-plan">
								<h1>Another great plan with Unlimited functions for the greatest Customers</h1>
								<p>Join our Enterprise Plan that was built just for your business without any limitation.</p>
								<a-button type="primary"  @click="onClickSupport">
									Contact Us
								</a-button>
							</div>
						</div>
						<div class="col col-12 m-t-40">
							<vue-pricing-table />
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
	name : 'Pricing',
	metaInfo: {
		title: 'Pricing',
	},
	data(){
		return {
			is_banner_active : false,
			is_loading : true
		}
	},
	computed:{
		...mapGetters({
			plan : 'pricing/getUserPlan',
			trial : 'pricing/getTrial',
			banner: 'pricing/getShowBanner',
		})
	},
	methods :{
		...mapActions({
			charge : 'pricing/generalShopifyCharge',
			checkAllQuota : 'pricing/checkAllQuota',
			checkCustomPlan : 'pricing/checkCustomPlan'
		}),
		...mapMutations({
			setShowBanner : 'pricing/setShowBanner',
		}),
		onClickSupport(){
			// $intercom.show()
		}
	},
	async mounted(){
		try {
			await this.checkCustomPlan()
		} catch (error) {
			
		}
		if( this.banner ){
			this.is_banner_active = true 
			this.setShowBanner(false)
		}
		this.is_loading = false 
	},
	beforeDestroy(){
		if( this.is_banner_active ){
			this.setShowBanner(true)
		}
	}
}
</script>
<style lang="scss">
	.page-pricing{
		.list-pricing-plan{
			transform: translateY(-126px);
			height: 360px;
		}
	}
</style>