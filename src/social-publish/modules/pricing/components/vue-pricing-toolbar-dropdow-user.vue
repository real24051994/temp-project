<template>
	<div class="vue-pricing-toolbar">
		<div @click="onClick()" class="vue-pricing-toolbar-header btn-track-event btn-event-pricing" data-position="dropdown-user">
			<div class="vue-pricing-toolbar-plan">
				<h3 @click="onClick()" class="vue-pricing-toolbar-plan-name">{{ plan.name }} Plan</h3>
				<div class="vue-pricing-toolbar-plan-cost" v-if="typeof plan.cost =='number'">
					<strong>${{plan.cost}}</strong>
					<span>/mon</span>
				</div>
			</div>
			<div class="spacer"></div>
			<a class="btn-pricing">
				<sh-icon :icon="['far','chevron-right']" />
			</a>
		</div>
		<div class="vue-pricing-toolbar-body">
			<div v-if="is_loading">
				<a-skeleton :paragraph="{ rows: 2 , width : '100%' }" :title="false" active />
				<a-skeleton :paragraph="{ rows: 2 , width : '100%' }" :title="false" active />
				<a-skeleton :paragraph="{ rows: 2 , width : '100%' }" :title="false" active />
			</div>
			<template v-else>
				<template v-if="is_loading_error">Something went wrong !</template>
				<template v-else>
					<vue-pricing-progress-bar :quota="postQuota" type="post" />
					<vue-pricing-progress-bar :quota="accountQuota" type="account" />
					<vue-pricing-progress-bar :quota="autopilotQuota" type="autopilot" />
				</template>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
	name: "PricingToolbar",
	props: {
		visible: {
			type: Boolean
		}
	},
	data() {
		return {
			is_loading: true,
			is_loading_error: false
		};
	},
	computed: {
		...mapGetters({
			plan: "pricing/getUserPlan",
			accountQuota: "pricing/getAccountQuota",
			postQuota: "pricing/getPostQuota",
			autopilotQuota: "pricing/getAutopilotQuota"
		})
	},
	methods: {
		...mapActions({
			checkAllQuota: "pricing/checkAllQuota",
			checkCustomPlan : 'pricing/checkCustomPlan'
		}),
		...mapMutations({
			setShowUserInfo: "setShowUserInfo"
		}),
		onClick() {
			this.redirect({
				name: "Pricing"
			});
			this.setShowUserInfo(false);
		}
	},
	mounted() {
		var promises = [this.checkAllQuota()]
		if( this.plan.id == 'custom'){
			promises.push(this.checkCustomPlan())
		}
		Promise.all(promises).then(() => {
			this.is_loading = false;
		})
		.catch(err => {
			this.is_loading = false;
			this.is_loading_error = true;
		});
	}
};
</script>
<style lang="scss">
.vue-pricing-toolbar {
	padding: 16px 0;
	background-color: #fff;
	&-header {
		display: flex;
		padding: 0 24px;
		cursor: pointer;
	}
	&-body {
		padding: 0 8px;
	}
	&-plan {
		&-name {
			font-weight: 600;
			font-size: 14px;
			line-height: 17px;
			margin: 0;
			text-transform: uppercase;
			color: $primary-color;
			margin-bottom: 4px;
		}
		&-cost {
			strong {
				font-weight: 600;
				font-size: 30px;
				line-height: 36px;
			}
			span {
				font-weight: normal;
				font-size: 16px;
				line-height: 19px;
			}
		}
	}
}
</style>