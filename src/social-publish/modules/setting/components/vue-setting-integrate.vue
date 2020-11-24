<template>
	<div class="vue-setting-integrate">
		<div class="container">
			<div class="row">
				<div class="col col-6" v-if="form['bit_ly']">
					<vue-integrate-bitly  v-model="form['bit_ly']" />
				</div>
				<div class="col col-6" v-if="form['ar_review']">
					<vue-integrate-alireview v-model="form['ar_review']" />
				</div>
				<div class="col col-6">
					<div class="item-integrate item-integrate-bitly">
						<div class="item-integrate-logo">
							<img src="@publish/assets/icons/pagefly.png" alt="">
						</div>
						<div class="item-integrate-content">
							<div class="item-integrate-content-row">
								<div class="item-integrate-title">
									Shopify Page Builder
								</div>
								<div class="spacer"></div>
								<a class="ant-btn btn-integrate btn-primary" href="https://pagefly.link/urgSmtep" target="_blank">
									<span>
										Learn More
									</span>
								</a>
							</div>
							<div class="item-integrate-content-row m-t-8">
								<div class="item-integrate-description">
									Create landing page, product page, etc with drag-and-drop and customization. No coding needed
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import VueIntegrateBitly from './vue-integrate-bitly'
import VueIntegrateAlireview from './vue-integrate-alireview'
export default {
	name : 'VueSettingIntegrate',
	components:{
		VueIntegrateBitly,
		VueIntegrateAlireview
	},
	props:{
		value :{
			type : Object,
			required : true
		}
	},
	data(){
		return {

		}
	},
	computed  :{
		'form' : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		},
	}
}
</script>
<style lang="scss">
	.vue-setting-integrate{
		.item-integrate{
			background: #FFFFFF;
			box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
			border-radius: 4px;
			padding: 16px;
			overflow: hidden;
			display: flex;
			min-height: 106px;
			margin-bottom: 30px;
			&-logo{
				@include flex(66px);
				img{
					max-width: 100%;
				}
			}
			&-content{
				@include col;
				padding-left: 16px;
				&-row{
					display: flex;
					flex-wrap: wrap;
					align-items: center;
				}
			}
			&-title{
				font-weight: 600;
				font-size: 18px;
				line-height: 22px;
				label{
					background-color: #eff3fc;
					color: $primary-color;
					padding: 4px 8px;
					font-weight: 600;
					font-size: 12px;
					line-height: 22px;
					margin-left: 8px;
					border-radius: 4px;
				}
			}
			&-description{
				font-size: 14px;
				line-height: 17px;
			}
		}
	}
	
</style>