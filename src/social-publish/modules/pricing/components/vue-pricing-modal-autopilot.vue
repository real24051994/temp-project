<template>
	<a-modal transitionName="none" maskTransitionName="none" :centered="true" v-model="visible" :destroyOnClose="true" :title="false" :footer="false" width="901px" class="vue-pricing-modal" :afterClose="afterClose">
		<div class="vue-pricing-modal-wrapper">
			<div class="vue-pricing-modal-carousel">
				<carousel v-if="visible" :autoplay="true" :autoplayTimeout="3000" :loop="true" :autoplayHoverPause="true" :perPage="1" >
					<slide v-for="item in carousel_plans" :key="item.id">
						<div class="item-pricing-plan" >
							<div class="item-pricing-plan-header">
								<div class="item-pricing-plan-name">
									<span>{{ item.name }}</span>
									<strong v-if="item.id == recommend">Best Choice</strong>
								</div>
							</div>
							<div class="item-pricing-plan-body">
								<div class="item-pricing-plan-icon">
									<img v-if="item.icon" :src="item.icon" alt="">
								</div>
								<div class="item-pricing-plan-cost">
									<strong>${{ item.cost }}</strong><span>/mon</span>
								</div>
								<div class="item-pricing-plan-advance">
									<ul>
										<li v-if="item.socials.hasOwnProperty('limit')">
											<template v-if="item.socials.limit == 'unlimited'">
												Connect unlimited <strong>social accounts</strong>
											</template>
											<template v-else>
												Connect {{item.socials.limit}} <strong>social accounts</strong>
											</template>
										</li>
										<li v-if="item.posts.hasOwnProperty('limit')">
											<template v-if="item.posts.limit == 'unlimited'">
												Unlimited <strong>posts</strong> in a month
											</template>
											<template v-else>
												Limited {{item.posts.limit}} <strong>posts</strong> in a month
											</template>
										</li>
										<li v-if="item.autopilots.hasOwnProperty('limit')">
											<template v-if="item.autopilots.limit == 'unlimited'">
												Set up unlimited <strong>Autopilots</strong>
											</template>
											<template v-else>
												Set up {{item.autopilots.limit}} <strong>Autopilots</strong>
											</template>
										</li>
										<li v-if="item.autopilots.hasOwnProperty('discount')">
											<template v-if="item.autopilots.discount">
												Product Discount Generator
											</template>
											<template v-else>
												None Discount Generator
											</template>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</slide>
				</carousel>
			</div>
			<div class="vue-pricing-modal-content">
				<div class="content-inner">
					<div class="content-header">
						<div class="content-sub-title">You are using <strong>{{ plan.name }} Plan</strong></div>
						<div class="content-title">You have reach the plan’s limit number of autopilots</div>
						<div class="content-description">Please upgrade your plan to have the best service</div>
						<div class="content-upgrade">
							<a-button type="primary" @click="onClick" class="btn-track-event btn-event-pricing" data-position="modal-autopilot" data-status="start-trial">
								Upgrade your plan for free
							</a-button>
						</div>
						<div class="content-more-info">
							<a @click="onClick" >
								Learn what you will get in higher plan
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
    </a-modal>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel';
import { mapGetters } from 'vuex';
export default {
	name : 'VuePricingModalAccount',
	components:{
		Carousel, Slide
	},
	props :{
		value :{
			type : Boolean,
			required : true,
		}
	},
	computed:{
		...mapGetters({
			plan : 'pricing/getUserPlan',
			plans : 'pricing/getPricingPlans',
			recommend : 'pricing/getRecommendPlan',
			carousels : 'pricing/getPlanCarousel'
		}),
		carousel_plans(){
			return this.carousels.map((item)=>{
				return this.plans[item]
			})
		},
		visible : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		onClick(){
			this.redirect({
				name : 'Pricing'
			})
			this.visible = false
		},
		afterClose(){
			this.$emit('on-close')
		}
	},
	mounted(){
		this.$nextTick(() => window.dispatchEvent(new Event('resize')))
	}
}
</script>