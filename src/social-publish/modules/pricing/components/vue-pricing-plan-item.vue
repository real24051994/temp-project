<template>
	<div :class="{ 'item-pricing-plan-hover' : hover }" class="item-pricing-plan">
		<div class="item-pricing-plan-header">
			<div class="item-pricing-plan-name">
				<span>{{ data.name }}</span>
				<strong v-if="data.id == recommend">Best Choice</strong>
			</div>
		</div>
		<div class="item-pricing-plan-body">
			<div class="item-pricing-plan-icon">
				<img :src="data.icon" alt v-if="data.icon" />
			</div>
			<div class="item-pricing-plan-cost">
				<strong>${{ data.cost }}</strong>
				<span>/mon</span>
			</div>
			<div class="item-pricing-plan-advance">
				<ul>
					<li v-if="data.socials.hasOwnProperty('limit')">
						<template v-if="data.socials.limit == 'unlimited'">
							Connect unlimited
							<strong>social accounts</strong>
						</template>
						<template v-else>
							Connect {{data.socials.limit}}
							<strong>social accounts</strong>
						</template>
					</li>
					<li v-if="data.posts.hasOwnProperty('limit')">
						<template v-if="data.posts.limit == 'unlimited'">
							Unlimited
							<strong>posts</strong> in a month
						</template>
						<template v-else>
							Up to {{data.posts.limit}}
							<strong>posts</strong> in a month
						</template>
					</li>
					<li v-if="data.autopilots.hasOwnProperty('limit')">
						<template v-if="data.autopilots.limit == 'unlimited'">
							Set up unlimited
							<strong>Autopilots</strong>
						</template>
						<template v-else>
							Set up {{data.autopilots.limit}}
							<strong>Autopilots</strong>
						</template>
					</li>
					<li v-if="data.autopilots.hasOwnProperty('discount')">
						<template v-if="data.autopilots.discount">Product Discount Generator</template>
						<template v-else>None Discount Generator</template>
					</li>
				</ul>
			</div>
		</div>
		<div class="item-pricing-plan-footer" v-if="showFooter">
			<a-button :disabled="true" block class="btn-trial" v-if="plan.id == data.id">You are here</a-button>
			<template v-else>
				<a-button :disabled="is_disabled_button" :data-plan="data.id" :loading="is_loading_plan == data.id " @click="handleUpgrade(data.id)" block class="btn-trial btn-event-upgrade btn-track-event" data-position="list-plan" data-status="start-trial" type="primary" v-if="trial">
					{{ trial_day }}-days free trial
				</a-button>
				<a-button :disabled="is_disabled_button" :data-plan="data.id" :loading="is_loading_plan == data.id " @click="handleUpgrade(data.id)" block class="btn-subcripstion btn-event-upgrade btn-track-event" data-position="list-plan" data-status="upgrade" type="primary" v-else-if="plan_names.indexOf(data.id) > plan_names.indexOf(plan.id)">
					Upgrade Now
				</a-button>
				<a-button :disabled="is_disabled_button" :data-plan="data.id" :loading="is_loading_plan == data.id " @click="handleDowngrade(data.id)" block class="btn-subcripstion btn-event-downgrade btn-track-event" data-position="list-plan" v-else>
					Downgrade
				</a-button>
			</template>
			<a @click="onClickViewFunction" class="btn-more">View other functions</a>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import charge from "../mixins/charge";
export default {
	name: "VuePricingPlanItem",
	mixins: [charge],
	props: {
		data: {
			type: Object,
			required: true
		},
		showFooter: {
			type: Boolean,
			default: true
		},
		hover: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters({
			recommend: "pricing/getRecommendPlan",
			trial: "pricing/getTrial",
			plan: "pricing/getUserPlan",
			plan_names: "pricing/getPricingPlanNames",
			trial_day : "pricing/getTrialDay"
		})
	},
	methods: {
		onClickViewFunction() {
			if (this.$route.name == "Pricing") {
				$("html, body").animate(
					{
						scrollTop:
							$("#pricing-plans-table").offset().top -
							$(".app-toolbar").height()
					},
					300
				);
			} else {
				this.redirect({
					name: "Pricing"
				});
			}
		}
	}
};
</script>
<style lang="scss">
.item-pricing-plan {
	padding: 0;
	background-color: #ffffff;
	box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.08);
	border-radius: 6px;
	transition: all 0.3s ease;
	position: relative;
	&-hover {
		&:hover {
			transform: translateY(-10px);
		}
	}
	&-header {
		padding: 24px 16px 16px 16px;
		text-align: center;
	}
	&-body {
		min-height: 310px;
	}
	&-footer {
		padding: 0 24px 16px 24px;
		text-align: center;
		background-color: #ffffff;
		.btn {
			&-trial {
				height: 40px;
				margin-bottom: 8px;
			}
			&-subcripstion {
				height: 40px;
				margin-bottom: 8px;
			}
			&-more {
				text-align: center;
				display: inline-block;
				color: $primary-color;
				&:hover {
					color: $primary-color;
					text-decoration: underline;
				}
			}
		}
	}
	&-name {
		span {
			font-weight: 600;
			font-size: 20px;
			line-height: 24px;
			display: inline-block;
			color: #4f4f4f;
		}
		strong {
			font-weight: 600;
			font-size: 14px;
			line-height: 24px;
			display: inline-block;
			padding: 0 8px;
			margin-left: 16px;
			background-color: $primary-color;
			color: #ffffff;
			border-radius: 4px;
		}
	}
	&-icon {
		height: 118px;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			max-width: 100%;
			max-height: 100%;
		}
	}
	&-cost {
		text-align: center;
		margin-bottom: 16px;
		strong {
			font-weight: 600;
			font-size: 45px;
			line-height: 53px;
		}
		span {
			font-weight: normal;
			font-size: 22px;
			line-height: 26px;
		}
	}
	&-advance {
		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;
			li {
				display: block;
				text-align: center;
				margin-bottom: 4px;
				color: $primary-color;
			}
		}
	}
}
</style>