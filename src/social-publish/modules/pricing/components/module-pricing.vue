<template>
	<div class="vue-pricing-extend-layout">
		<vue-pricing-modal-autopilot v-if="modal_pricing_autopilot" v-model="modal_pricing_autopilot" />
		<vue-pricing-modal-account v-if="modal_pricing_account" v-model="modal_pricing_account" />
		<vue-pricing-modal-downgrade v-if="modal_downgrade" v-model="modal_downgrade" />
		<vue-pricing-banner :progress="progress" v-if="banner" />
		<vue-pricing-sticky v-if="show_pricing_sticky_btn" />
	</div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
	name: "PricingModules",
	computed: {
		...mapGetters({
			plan: "pricing/getUserPlan",
			getShowModalAutopilot: "pricing/getShowModalAutopilot",
			getShowModalAccount: "pricing/getShowModalAccount",
			getShowModalDowngrade: "pricing/getShowModalDowngrade",
			post: "pricing/getPostQuota",
			banner: "pricing/getShowBanner",
			sticky_plans: "pricing/getPlanSticky",
			trial: "pricing/getTrial"
		}),
		modal_downgrade: {
			get() {
				return this.getShowModalDowngrade.visible;
			},
			set(value) {
				if (value) {
					this.setShowModalDowngrade({
						visible: value
					});
				} else {
					this.setShowModalDowngrade({
						visible: value,
						app_plan: ""
					});
				}
			}
		},
		modal_pricing_autopilot: {
			get() {
				return this.getShowModalAutopilot;
			},
			set(value) {
				this.setShowModalAutopilot(value);
			}
		},
		modal_pricing_account: {
			get() {
				return this.getShowModalAccount;
			},
			set(value) {
				this.setShowModalAccount(value);
			}
		},
		progress() {
			let percent = 0;
			let total = this.post.limit;
			let current = this.post.total;
			current = current > total ? total : current;
			return Math.ceil((current / total) * 100);
		},
		show_pricing_sticky_btn() {
			return this.sticky_plans.indexOf(this.plan.id) >= 0;
		}
	},
	methods: {
		...mapActions({
			checkPostQuata: "pricing/checkPostQuota"
		}),
		...mapMutations({
			setShowModalAutopilot: "pricing/setShowModalAutopilot",
			setShowModalAccount: "pricing/setShowModalAccount",
			setShowModalDowngrade: "pricing/setShowModalDowngrade",
			setShowBanner: "pricing/setShowBanner"
		})
	},
	watch: {
		plan: function() {
			this.checkPostQuata();
		},
		progress: function(value) {
			if (value >= 80 && this.trial && !this.banner) {
				this.setShowBanner(true);
			}
		}
	}
};
</script>
<style lang="scss">
.vue-pricing-modal {
	&-wrapper {
		display: flex;
		min-height: 450px;
		border-radius: 6px;
		overflow: hidden;
	}
	&-carousel {
		@include flex(350px);
		.item-pricing-plan {
			height: 380px;
			padding: 0;
			background-color: #ffffff;
			border-radius: 6px;
			transition: all 0.3s ease;
			position: relative;
			&-header {
				padding: 32px 16px;
				text-align: center;
			}
			&-body {
			}
			&-footer {
				padding: 16px 24px;
				height: 100px;
				text-align: center;
				position: absolute;
				bottom: 0;
				right: 0;
				left: 0;
				z-index: 1;
				background-color: #ffffff;
				.btn {
					&-trial {
						display: flex;
						height: 40px;
						align-items: center;
						justify-content: center;
						background-color: $primary-color;
						color: #ffffff;
						border-radius: 4px;
						margin-bottom: 8px;
						&:hover {
							background-color: $primary-color;
							color: #ffffff;
							text-decoration: underline;
						}
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
		.VueCarousel {
			.VueCarousel-pagination {
				.VueCarousel-dot {
					margin: 0 !important;
					background-color: #f3f3f3 !important;
					&:focus {
						outline: none !important;
					}
					&.VueCarousel-dot--active {
						background-color: $primary-color !important;
					}
				}
			}
		}
	}
	&-content {
		@include flex(550px);
		background-color: #f6f6f6;
		background-image: url("../assets/account/modal.png");
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center center;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		.content-inner {
			text-align: center;
			max-width: 380px;
			.content {
				&-sub-title {
					font-size: 14px;
					line-height: 17px;
					margin-bottom: 8px;
					strong {
						font-weight: 600;
						font-size: 14px;
						line-height: 17px;
						color: $primary-color;
						text-transform: capitalize;
					}
				}
				&-title {
					font-weight: 600;
					font-size: 24px;
					line-height: 28px;
					margin-bottom: 16px;
				}
				&-description {
					font-size: 14px;
					line-height: 17px;
					margin-bottom: 16px;
				}
				&-sub-description {
					color: #828282;
					font-size: 14px;
					line-height: 17px;
					margin-bottom: 16px;
				}
				&-upgrade {
					margin-top: 16px;
					.ant-btn {
						width: 300px;
						margin-bottom: 16px;
						display: inline-block;
					}
				}
				&-more-info {
					a {
						font-size: 14px;
						line-height: 17px;
						color: #828282;
						&:hover{
							color : $primary-color;
						}
					}
				}
			}
		}
	}
}
</style>