<template>
	<div class="vue-pricing-autopilot">
		<div class="vue-pricing-autopilot-title">This function is blocked in your plan</div>
		<div class="vue-pricing-autopilot-sub-title">Choose your plan and start boosting your store</div>
	</div>
</template>
<style lang="scss">
.vue-pricing-autopilot {
	text-align: center;
	padding-top: 80px;
	margin-bottom: 36px;
	&-title {
		font-weight: 600;
		font-size: 22px;
		line-height: 26px;
		margin-bottom: 17px;
	}
	&-sub-title {
		font-weight: normal;
		font-size: 16px;
		line-height: 19px;
	}
	@media (max-width: $app-collapse-breakpoint) {
		padding-top: 30px;
		margin-bottom: 16px;
		.vue-pricing-autopilot-title {
			margin-bottom: 12px;
		}
	}
}
</style>