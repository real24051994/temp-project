<template>
	<div class="vue-pricing-autopilot-popover" :class="{ 'is-active' : visible}" @mouseover="onMouseover" @mouseleave="onMouseleave">	
		<div class="vue-pricing-autopilot-popover-popup" :style="styles" v-if="visible && showed">
			<div class="vue-pricing-autopilot-popover-popup-content">
				<div v-if="trial" class="vue-pricing-autopilot-popover-popup-title">
					<h3>Try a Premium plan for free</h3>
					<p>
						Get access to all features and unlock all doors to your success.
					</p>
				</div>
				<div v-else class="vue-pricing-autopilot-popover-popup-title">
					<p>
						Upgrade plan to use this function
					</p>
				</div>
				<div class="vue-pricing-autopilot-popover-popup-btn">
					<a-button v-if="trial" type="primary" block @click="onClick" class="btn-track-event btn-event-pricing" data-position="autopilot-popover" data-status="start-trial">
						Start Free Trial
					</a-button>
					<a-button v-else type="primary" block @click="onClick" class="btn-track-event btn-event-pricing" data-position="autopilot-popover" data-status="upgrade">
						Upgrade Plan
					</a-button>
				</div>
				<div class="vue-pricing-autopilot-popover-popup-more">
					<a @click="onClick">
						View other premium functions
					</a>
				</div>
			</div>
		</div>
		<slot></slot>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'VuePricingPopover',
	props:{
		visible  :{
			type : Boolean,
			default : false
		},
		zIndex :{
			type : [ Number , String],
			default : 1000
		},
		customStyle :{
			type : Object,
			required : false,
			default : ()=>{}
		}
	},
	data(){
		return {
			showed : false, 
		}
	},
	computed:{
		...mapGetters({
			trial: "pricing/getTrial"
		}),
		styles(){
			return Object.assign({} , {'z-index' : this.zIndex } , this.customStyle)
		}	
	},
	methods :{
		onMouseover(){
			if( this.visible ){
				this.showed = true 
			}
			
		},
		onMouseleave(){
			if( this.visible ){
				this.showed = false
			}
		},
		onClick(){
			this.redirect({
				name : 'Pricing'
			})
		},
	}
}
</script>
<style lang="scss">
	.vue-pricing-autopilot-popover{
		position: relative;
		&-popup{
			position: absolute;
			top: 50%;
			left :50%;
			z-index: 111;
			width: 300px;
			transform: translate(-50%,-50%);
			&-arrow{
				position: absolute;
				display: block;
				width: 10px;
				height: 10px;
				background: 0 0;
				border-style: solid;
				border-width: 5px;
				top: -3px;
				border-top-color: #fff;
				border-right-color: transparent;
				border-bottom-color: transparent;
				border-left-color: #fff;
				box-shadow: -2px -2px 5px rgba(0,0,0,.06);
				transform: translateX(-50%) rotate(45deg);
				left: 50%;
			}
			&-content{
				padding: 16px 24px;
				position: relative;
				box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05);
				box-shadow: 0 0 8px rgba(0,0,0,.15);
				background: #FFFFFF;
				border-radius: 4px;
				text-align: center;
			}
			&-title{
				font-weight: normal;
				font-size: 14px;
				line-height: 22px;
				margin-bottom: 8px;
			}
			&-btn{
				margin-bottom: 8px;
			}
			&-more{
				a{
					font-weight: normal;
					font-size: 14px;
					line-height: 17px;
					color: #828282;
					&:hover{
						color: $primary-color;
					}
				}
			}
		}
	}
</style>