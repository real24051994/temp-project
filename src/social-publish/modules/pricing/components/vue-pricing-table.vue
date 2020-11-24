<template>
	<div class="pricing-table" id="pricing-plans-table">
		<div class="pricing-table-header">
			<vue-position-sticky :offsetTop="48" sticky-class="pricing-table-header-sticky" >
				<div class="row row-item row-sticky">
					<div class="col col-4">
						&nbsp;
					</div>
					<div class="col col-8">
						<div class="row">
							<div class="col col-plan" v-for="item in plan_names" :key="item">
								<h3>{{ plans[item].name }}</h3>
								<template v-if="plan.id == item">
									<a-button :disabled="true">
										You are here
									</a-button>
								</template>
								<template v-else>
									<template v-if="item == 'custom'">
										<template  v-if="typeof plans.custom.cost == 'number'">
											<template v-if="plan_names.indexOf(item) > plan_names.indexOf(plan.id)">
												<a-button :disabled="is_disabled_button" class="btn-event-upgrade btn-track-event" type="primary" @click="handleUpgrade(item)" :loading="is_loading_plan == item" :data-plan="item" data-position="table-pricing" :data-status="trial ? 'start-trial' : 'upgrade'">
													<template v-if="trial">
														Start Trial
													</template>
													<template v-else>
														Upgrade Now
													</template>
												</a-button>
											</template>
											<template v-else>
												<a-button :disabled="is_disabled_button" class="btn-event-downgrade btn-track-event" @click="handleDowngrade(item)" :loading="is_loading_plan == item" :data-plan="item">
													Downgrade
												</a-button>
											</template>
										</template>
										<a-button v-else type="primary" @click="onClickSupport">
											Contact Us
										</a-button>
									</template>
									<template v-else>
										<template v-if="plan_names.indexOf(item) > plan_names.indexOf(plan.id)">
											<a-button :disabled="is_disabled_button" class="btn-event-upgrade btn-track-event" type="primary" @click="handleUpgrade(item)" :loading="is_loading_plan == item" :data-plan="item" data-position="table-pricing" :data-status="trial ? 'start-trial' : 'upgrade'">
												<template v-if="trial">
													Start Trial
												</template>
												<template v-else>
													Upgrade Now
												</template>
											</a-button>
										</template>
										<template v-else>
											<a-button :disabled="is_disabled_button" class="btn-event-downgrade btn-track-event" @click="handleDowngrade(item)" :loading="is_loading_plan == item" :data-plan="item">
												Downgrade
											</a-button>
										</template>
									</template>
								</template>
							</div>
						</div>
					</div>
				</div>
			</vue-position-sticky>
			<div class="divider m-t-20"></div>
			<div class="row row-item row-item-header row-hover">
				<div class="col col-4 col-title">
					Monthly price
				</div>
				<div class="col col-8">
					<div class="row">
						<div class="col col-plan col-cost" v-for="item in plan_names" :key="item">
							<template v-if="typeof plans[item].cost == 'number'">
								<strong>${{ plans[item].cost }}</strong><i>/mon</i>
							</template>
							<template v-else>
								<span>{{ plans[item].cost }}</span>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="pricing-table-body m-t-15">
			<template v-for="group in groups">
				<div :key="group.id">
					<div class="row row-title" >
						<div class="col col-12">
							{{ group.title }}
						</div>
						<div class="col col-12"><div class="divider"></div></div>
					</div>
					<template v-for="(item, index) in group.data">
						<vue-pricing-table-item :key="`${group.id}_item_${index}`" :collapse="item.collapse" v-model="is_active">
							<template slot="header">
								<div class="row">
									<div class="col col-4 col-title">
										{{ item.name }} <span v-if="item.collapse" class="btn-caret m-l8"> <sh-icon :icon="['far','chevron-down']" /></span>
									</div>
									<div class="col col-8">
										<div class="row">
											<div class="col col-plan col-value" v-for="(child, child_index) in plan_names" :key="`itme_child_${child_index}`">
												<strong v-if="item.type == 'string'">
													{{ getPathData( child , item.id )}}
												</strong>
												<strong v-else-if="item.type == 'boolean'">
													<template v-if="getPathData( child , item.id )">
														<sh-icon :icon="['far','check']" class="icon-check" />
													</template>
													<template v-else>
														<i class="minus">-</i>
													</template>
												</strong>
												<strong v-else-if="item.type == 'array'">
													<template v-if="getPathData( child , item.id ).indexOf(item.field) >= 0">
														<sh-icon :icon="['far','check']"  class="icon-check" />
													</template>
													<template v-else>
														<i class="minus">-</i>
													</template>
												</strong>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-if="item.collapse" slot="collapse">
								<div class="row">
									<div class="col col-12">
										{{ item.description }}
									</div>
								</div>
							</template>
						</vue-pricing-table-item>
					</template>
				</div>
			</template>
		</div>
		<div class="pricing-table-footer">
			<a @click="onClickSupport">
				Any question? Contact us for further infomation
			</a>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import charge from  '../mixins/charge'
export default {
	name : 'PricingTablet',
	mixins : [charge],
	data(){
		return {
			is_loading_plan : false,
			is_active : '',
			groups :[
				{
					id : 'social',
					title : 'Support Social Network',
					data : [
						{
							id : 'socials.limit',
							name : 'Number of social accounts',
							type : 'string',
							collapse : false,
						},
						{
							id : 'socials.facebook',
							name : 'Connect with Facebook',
							type : 'boolean',
							collapse : false,
						},
						{
							id : 'socials.twitter',
							name : 'Connect with Twitter',
							type : 'boolean',
							collapse : false,
						},
					]
				},
				{
					id : 'post',
					title : 'Number of posts',
					data : [
						{
							id : 'posts.limit',
							name : 'Number of posts in a month',
							type : 'string',
							collapse : false,
						},
					]
				},
				{
					id : 'create_post',
					title : 'Create post',
					data : [
						{
							id : 'others.hashtag',
							name : 'Hashtag manager',
							type : 'boolean',
							collapse : true,
							description : 'Manage and organize your hashtags in 1 place'
						},
						{
							id : 'posts.calendar',
							name : 'Calendar',
							type : 'boolean',
							collapse : true,
							description : 'Plan, organize and create/edit posts with a drag-and-drop calendar. Integrated with multiple platforms: Facebook, Twitters...'
						},
						{
							id : 'others.utm',
							name : 'UTM manager',
							type : 'boolean',
							collapse : true,
							description : 'Create and manage your utm tracking in social posts'
						},
						{
							id : 'others.shorten_link',
							name : 'Shorten Link ',
							type : 'boolean',
							collapse : true,
							description : 'Create shorten link for your post'
						},
					]
				},
				{
					id : 'autopilot',
					title : 'Autopilot',
					data : [
						{
							id : 'autopilots.limit',
							name : 'Number of Autopilot',
							type : 'string',
							collapse : true,
							description :'The number of running auto pilot per month, regardless of the total number of posts. For example: If you set 01 auto pilot to post your products every Thursday & Tuesday. The total number of auto pilot of that month is 01.'
						},
						{
							id : 'autopilots.type',
							name : 'Autopilot for Latest products',
							type : 'array',
							field : 'latest',
							collapse : true,
							description :'Auto-publishing your latest products on multiple accounts with a recurrent schedule (Ex: every Thur, Tue at 12:00 PM or every day at 1:00 PM...ect)'
						},
						{
							id : 'autopilots.type',
							name : 'Auto-post social proof',
							type : 'array',
							field : 'review',
							collapse : true,
							description : "Encourage product discovery and build customer's trust by sharing product reviews to your social media"
						},
						{
							id : 'autopilots.template',
							name : 'Content/Discount tag Template',
							type : 'string',
							collapse : true,
							description :'Attract more customers with post and discount tag templates that were designed to stand out and convert your customers. '
						},
						{
							id : 'autopilots.discount',
							name : 'Show discount tag on image',
							type : 'boolean',
							collapse : true,
							description :'Show discount tag on post image to increase conversion rate and attract more customers'
						},
						{
							id : 'autopilots.logo',
							name : 'Auto add logo on image',
							type : 'boolean',
							collapse : true,
							description :'Add logo on image automatically to make audience aware about your brand. '
						},
						
						
					]
				},
			]
		}
	},
	computed:{
		...mapGetters({
			plan : 'pricing/getUserPlan',
			plans : 'pricing/getPricingPlans',
			trial : 'pricing/getTrial',
			recommend : 'pricing/getRecommendPlan',
			plan_names : 'pricing/getPricingPlanNames'
		}),
	},
	methods :{
		onClickSupport(){
			// this.$intercom.show()
		},
		getPathData(plan , path , type ){
			return _.get(this.plans[plan], path, '')
		}
	},
	mounted(){
		
	},
}
</script>
<style lang="scss">
	.pricing-table{
		&-header-sticky{
			// box-shadow: 0 2px 8px #f0f1f2;
			padding: 8px 0;
			background-color: #ffffff;
		}
		.col{
			&-plan{
				text-align: center;
				flex: 0 0 20%;
				max-width: 20%;
				.ant-btn.btn-active:hover{
					border-color:#EAEAEA;
					box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
					color: $text;
					pointer-events: none;
					text-decoration: none;
				}
			}
			&-cost{
				text-transform: capitalize;
				line-height: 31px;
				strong{
					font-weight: 600;
					font-size: 22px;
					line-height: 31px;
				}
				i{
					font-weight: normal;
					font-size: 14px;
					line-height: 17px;
					text-transform: none;
					font-style: normal;
				}
				span{
					font-weight: 600;
					font-size: 16px;
					line-height: 19px;
				}
				
			}
			&-value{
				text-transform: capitalize;
			}
		}
		.row{
			&-item{
				min-height: 48px;
				align-items: center;
				margin: 0;
				&-header{
					min-height: 64px;
				}
			}
			&-title{
				font-weight: 600;
				font-size: 14px;
				line-height: 17px;
				min-height: 32px;
				align-items: center;
				text-transform: uppercase;
				margin-top: 24px;
			}
			&-hover{
				background-color: #ffffff;
				&:hover{
					background-color: #F3F3F3;
				}
			}
		}
		.icon-check{
			color: #6FCF97;
			font-size: 18px;
		}
		.minus{
			font-size: 18px;
			color: #CECECE;
		}
		.divider{
			display: block;
			height: 2px;
			background-color:#E2E2E2;
		}
		&-header{
			.vue-position-sticky{
				box-shadow:   0 4px 2px -2px  #f0f1f2;
			}
			.col-plan{
				h3{
					font-weight: 600;
					font-size: 20px;
					line-height: 24px;
					margin: 0 0 8px 0;
					text-transform: capitalize;
				}
			}
		}
		&-footer{
			padding: 32px 16px;
			text-align: center;
		}
		
	}
</style>