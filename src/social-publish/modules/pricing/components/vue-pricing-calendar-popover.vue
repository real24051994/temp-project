<template>
	<div class="vue-pricing-calendar">
		<div class="vue-pricing-calendar-title">This function is blocked in your plan</div>
		<div class="vue-pricing-calendar-sub-title">Choose your plan and start boosting your store</div>
	</div>
</template>
<style lang="scss">
.vue-pricing-calendar {
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
		.vue-pricing-calendar-title {
			margin-bottom: 12px;
		}
	}
}
</style>