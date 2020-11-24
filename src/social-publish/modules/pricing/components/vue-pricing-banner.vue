<template>
	<div class="app-layout-banner">
		<div class="vue-pricing-banner" v-if="progress < 80">
			<div class="vue-pricing-banner-close" @click="closeBanner( { show_on_trial : false })"><sh-icon :icon="['far','times']" /></div>
			<div class="vue-pricing-banner-content">
				<strong>Try 14-day Premium for Free!</strong> Get access to all features and unlock all doors to your success
				<a @click="onClick({ show_on_trial : false })" class="btn-track-event btn-event-pricing" data-position="banner" data-status="start-trial">
					Start free trial
				</a>
			</div>
		</div>
		<div class="vue-pricing-banner" v-else>
			<div class="vue-pricing-banner-close" @click="closeBanner({ show_on_reach_limit : false } )">
				<sh-icon :icon="['far','times']" />
			</div>
			<div class="vue-pricing-banner-content">
				You almost reach the <strong>limit post this month</strong>. Try 7 days Premium for free!
				<a @click="onClick({ show_on_reach_limit : false })" class="btn-track-event btn-event-pricing" data-position="banner" data-status="reach-limit">
					Start free trial
				</a>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
	name : 'VuePricingBanner',
	props:{
		progress :{
			type : Number,
		}
	},
	data(){
		return {}
	},
	computed:{
		...mapGetters({
			post : 'pricing/getPostQuota',
			banner: 'pricing/getShowBanner',
			banner_status : 'pricing/getShowBannerStatus'
		}),
		
	},
	methods :{
		...mapMutations({
			setShowBanner : 'pricing/setShowBanner',
		}),
		closeBanner(payload){
			this.setShowBanner(false)
		},
		onClick(payload){
			this.redirect({
				name : 'Pricing',
			})
		}
	},
	watch :{
		
	}

}
</script>
<style lang="scss">
	.vue-pricing-banner{
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: $light-blue1;
		border-radius: 4px;
		&-close{
			color: $dark-blue2;
			opacity: 0.5;
			position: absolute;
			right: 0;
			top: 0;
			height: 38px;
			width: 38px;
			font-size: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			&:hover{
				opacity: 1;
			}
		}
		&-content{
			color: $dark-blue2;
			font-size: 14px;
			line-height: 17px;
		}
		a{
			background-color: #EE9746;;
			color: $white;
			border-radius: 4px;
			height: 22px;
			padding: 0 10px;
			display: inline-flex;
			align-items: center;
			&:hover{
				color: $white;
			}
		}
	}
</style>