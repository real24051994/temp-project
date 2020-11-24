<template>
	<div class="page-container page-pricing">
		<template v-if="is_loading">
			<div class="page-container-body p-t-50">
				<div class="current-user-plan ">
					<div class="item-pricing-plan p-l-15 p-t-15 p-r-15 p-b-15">
						<a-skeleton  active :avatar="false" :title="false" :paragraph="{ rows: 10 , width : '100%' }"></a-skeleton>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<template v-if="is_loading_error">
				<vue-error type="500"></vue-error>
			</template>
			<template v-else>
				<template v-if="is_charge">
					<div class="page-container-header p-t-50">
						<div class="page-title">Upgrade Plan Success</div>
						<div class="page-sub-title">
							You are using
							<strong>{{ plan.name }} Plan</strong>
						</div>
					</div>
					<div class="page-container-body">
						<div class="container p-b-50">
							<div class="row">
								<div class="col col-12" v-if="plan.id != 'free'">
									<div class="current-user-plan">
										<vue-pricing-plan-item :data="plan" :hover="false" :show-footer="false" />
									</div>
								</div>
								<div class="col col-12">
									<div class="text-center m-t-40">
										<router-link :to="{ name: 'Dashboard' }" class="ant-btn ant-btn-primary btn-on-charge-success">Start building your business</router-link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="page-container-header p-t-50">
						<div class="page-title">Downgrade Plan Success</div>
						<div class="page-sub-title">
							You are using
							<strong>{{ plan.name }} Plan</strong>
						</div>
					</div>
					<div class="page-container-body pd-0">
						<div class="container">
							<div class="row">
								<div class="col col-12">
									<div class="text-center">
										<router-link :to="{ name: 'Dashboard' }" class="ant-btn ant-btn-primary btn-on-charge-success">Finish</router-link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</template>
		</template>
	</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
	name: "ChargeSuccess",
	metaInfo: {
		title: "Charge Success"
	},
	data() {
		return {
			is_loading: true,
			is_loading_error : false 
		};
	},
	computed: {
		...mapGetters({
			plan: "pricing/getUserPlan",
			trial: "pricing/getTrial",
			plan_names: "pricing/getPricingPlanNames",
			last_name: "pricing/getLastPlan"
		}),
		is_charge() {
			return (
				this.plan_names.indexOf(this.plan.id) >=
				this.plan_names.indexOf(this.last_name)
			);
		}
	},
	methods: {
		...mapActions({
			charge: "pricing/generalShopifyCharge",
			checkAllQuota: "pricing/checkAllQuota",
			checkCustomPlan : 'pricing/checkCustomPlan'
		})
	},
	mounted() {
		if( this.plan.id == 'custom'){
			this.checkCustomPlan().then(()=>{
				this.is_loading = false 
			})
			.catch(()=>{
				this.is_loading = false 
				this.is_loading_error = true 
			})
		}else{
			this.is_loading = false 
		}
	}
};
</script>
<style lang="scss">
	.btn-on-charge-success {
		min-width: 250px;
	}
</style>
