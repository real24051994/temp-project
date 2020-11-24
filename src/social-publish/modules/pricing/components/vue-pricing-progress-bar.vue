<template>
	<div :style="{ 'background-color' : backgroundColor }" class="vue-pricing-progress">
		<div class="vue-pricing-progress-header">
			<div class="vue-pricing-progress-title">
				<template v-if="type == 'post'">Published Posts</template>
				<template v-if="type == 'autopilot'">Running Autopilots</template>
				<template v-if="type == 'account'">Connected Social Accounts</template>
			</div>
			<div class="spacer"></div>
			<div class="vue-pricing-progress-count">{{progress.current}}/{{progress.total}}</div>
		</div>
		<div class="vue-pricing-progress-body">
			<div class="vue-pricing-progress-bar">
				<div class="vue-pricing-progress-bar-inner"></div>
				<div :class="{ 'is-warning' : progress.status == 'warning' , 'is-danger' : progress.status == 'danger' }" :style="{ width : progress.percent + '%' }" class="vue-pricing-progress-bar-active"></div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
	name: "VuePricingProccessBar",
	props: {
		quota: {
			type: Object,
			default: () => {
				return {
					total: 0,
					limit: 1
				};
			}
		},
		type: {
			type: String,
			default: "post"
		},
		backgroundColor: {
			type: String,
			defualt: "#F8F8F8"
		}
	},
	computed: {
		progress() {
			let percent = 0;
			let total = this.quota.limit;
			let current = this.quota.total;
			current = current > total ? total : current;
			percent = Math.ceil((current / total) * 100);
			percent = percent < 2 ? 2 : percent;
			let status = "normal";
			if( this.type == "post" ){
				if (percent >= 90 ) {
					status = "warning";
				}
				if (percent >= 100 ) {
					status = "danger";
				}
			}
			
			return {
				percent,
				status,
				current: this.quota.total,
				total
			};
		}
	}
};
</script>
<style lang="scss">
.vue-pricing-progress {
	border-radius: 4px;
	padding: 0px 16px;
	height: 55px;
	min-width: 210px;
	&-header {
		display: flex;
		flex-wrap: nowrap;
		padding-top: 14px;
	}
	&-body {
		margin-top: 8px;
	}
	&-title {
		font-size: 14px;
		line-height: 17px;
	}
	&-count {
		font-size: 13px;
		line-height: 17px;
	}
	&-bar {
		position: relative;
		&-inner {
			background-color: #e2e2e2;
			display: block;
			width: 100%;
			height: 5px;
			border-radius: 5px;
		}
		&-active {
			background-color: $primary-color;
			position: absolute;
			top: 0;
			left: 0;
			height: 5px;
			border-radius: 5px;
			&.is-warning {
				background-color: $warning;
			}
			&.is-danger {
				background-color: $danger;
			}
		}
	}
}
</style>