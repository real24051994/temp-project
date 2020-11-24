<template>
	<div class="vue-pricing-list-plans">
		<div class="row">
			<template v-for="item in plans">
				<div :key="item.id" class="col col-4" v-if="item.show">
					<vue-pricing-plan-item :data="item" />
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import charge from "../mixins/charge";
export default {
	name: "VuePricingListPlans",
	mixins: [charge],
	data() {
		return {
			is_loading_plan: false
		};
	},
	computed: {
		...mapGetters({
			plans: "pricing/getPricingPlans"
		})
	},
	methods: {}
};
</script>