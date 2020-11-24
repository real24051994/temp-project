<template>
	<div class="vue-rate-on-shopify">
		<div class="vue-rate-on-shopify-wrapper">
			<p class="m-b-0">
				Hi<strong v-if="shop.shop_owner">&nbsp;{{shop.shop_owner}}</strong>, We'd love to hear your feedback. Got a minute to share your experience with us
			</p>
			<a class="vue-rate-on-shopify-btn m-l-15" @click="onRateGood()">	
				<img src="@shop/assets/rate/good.svg" class="m-r-5" alt="">
 				Good
			</a>
			<a class="vue-rate-on-shopify-btn m-l-15" @click="onRateBad()">
				<img src="@shop/assets/rate/bad.svg" class="m-r-5"  alt="">
				Bad
			</a>
			<a   @click="onClose()" class="vue-rate-on-shopify-close">
				<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.01953 5.09766L8.83594 2.30859L9.41016 1.73438C9.49219 1.65234 9.49219 1.51562 9.41016 1.40625L8.80859 0.804688C8.69922 0.722656 8.5625 0.722656 8.48047 0.804688L5.11719 4.19531L1.72656 0.804688C1.64453 0.722656 1.50781 0.722656 1.39844 0.804688L0.796875 1.40625C0.714844 1.51562 0.714844 1.65234 0.796875 1.73438L4.1875 5.09766L0.796875 8.48828C0.714844 8.57031 0.714844 8.70703 0.796875 8.81641L1.39844 9.41797C1.50781 9.5 1.64453 9.5 1.72656 9.41797L5.11719 6.02734L7.90625 8.84375L8.48047 9.41797C8.5625 9.5 8.69922 9.5 8.80859 9.41797L9.41016 8.81641C9.49219 8.70703 9.49219 8.57031 9.41016 8.48828L6.01953 5.09766Z" fill="currentColor"/>
				</svg>
			</a>
		</div>
		<a-modal  v-model="visible" width="475px" :bodyStyle="{ padding : 0 }" :title="false" :footer="false" >
			<div class="vue-rate-on-shopify-modal">
				<div class="vue-rate-on-shopify-modal-header">
					<h4>What we could have done better?</h4>
					<div class="vue-rate-on-shopify-modal-header-icon">
						<img src="@shop/assets/rate/sad_icon.svg" alt="">
					</div>
					<h5>
						Thanks<strong v-if="shop.shop_owner">&nbsp;{{shop.shop_owner}}</strong> for giving us great feedback.
					</h5>
					<p>
						We'll make sure that our team take every feedback into consideration to provide you a better app everytime you visit!
					</p>
				</div>
				<div class="vue-rate-on-shopify-modal-body">
					<vue-simple class="list-item-reasons">
						<a-checkbox-group class="list-item-reasons-group" :disabled="is_loading" v-model="form.reason_type">
							<div class="item-reason" v-for="(item,index) in reasons" :key="`item_index_${index}`">
								<a-checkbox :id="`item_checkbox_rate_${index}`" :value="item"></a-checkbox>
								<label class="m-l-8" :for="`item_checkbox_rate_${index}`">{{item}}</label>
							</div>
						</a-checkbox-group>
						<div class="custom-message">
							<transition name="fade-in" mode="out-in">
								<a-textarea ref="textarea" :disabled="is_loading" :autoSize ="{ minRows: 4, maxRows: 8 }" v-if="show_message" placeholder="Please enter your feedback..." allow-clear v-model="form.reason" />
							</transition>
						</div>
					</vue-simple>
				</div>
				<div class="vue-rate-on-shopify-modal-footer">
					<a-button type="primary" block @click="onSubmit" :loading="is_loading">
						Submit
					</a-button>
				</div>
			</div>
		</a-modal>
		<a-modal  v-model="visible_close_modal" width="666px"   :bodyStyle="{ padding : 0 }" :title="false" :footer="false" >
			<div class="vue-rate-on-shopify-dismiss">
				<div class="vue-rate-on-shopify-dismiss-content">
					<h4 class="m-b-20">
						Rate us to be better
					</h4>
					<p>
						Please let us know your feedback about us
					</p>
					<div class="m-b-10">
						<a class="vue-rate-on-shopify-btn" @click="onRateGood()">	
							<img src="@shop/assets/rate/good.svg" class="m-r-5"  alt="">
							Good
						</a>
						<a class="vue-rate-on-shopify-btn m-l-15"  @click="onRateBad()">
							<img src="@shop/assets/rate/bad.svg" class="m-r-5" alt="">
							Bad
						</a>
					</div>
					<p class="m-b-30">
						Missed click? No worry, we will get back to ask you tomorrow. The window will be disappeared forever once you review.
					</p>
					<a-button type="primary" @click="closeModalDismiss">
						OK
					</a-button>
				</div>
				<div class="vue-rate-on-shopify-dismiss-aside">
					<img src="@shop/assets/rate/close-bg.png"  alt="">
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { required  } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations } from 'vuex'
	export default {
		name : 'VueRateOnShopify',
		props : {
			position :{
				type : Object,
			}
		},
		data(){
			return {
				is_loading : false,
				visible : false,
				visible_close_modal : false,
				reasons : [
					'Do not find any product in-app',
					'Do not have enough product in-app',
					'Products have error from Google/Facebook',
					'Slow update of product information',
					'Slow update of product status',
					'Mapping does not work',
					'Others'
				],
				form : {
					reason_type : [],
					reason : ''
				},
			}
		},
		computed :{
			...mapGetters({
				shop : 'auth/getShop'
			}),
			show_message : function(){
				return this.form.reason_type.indexOf('Others') >= 0 
			}
		},
		methods :{
			...mapActions({
				createFeedback : 'auth/createFeedback'
			}),
			...mapMutations({
				setBannerRate : 'auth/setBannerRate',
				setBannerRateCookie : 'auth/setBannerRateCookie',
			}),
			onRateGood(){
				window.open('https://apps.shopify.com/socialshop?reveal_new_review=true' , '_blank')
			},
			onRateBad(){
				this.visible_close_modal = false 
				this.visible = true 
			},
			onClose(){
				this.visible_close_modal = true
			},
			closeModalDismiss(){
				this.visible_close_modal = false 
				this.setBannerRateCookie(true)
				this.setBannerRate(false)
			},
			onSubmit(){
				if( !this.is_loading  &&  !this.$v.form.$invalid ){
					this.is_loading = true
					this.createFeedback({ 
						"reason_type": this.form.reason_type,
						"reason": this.show_message  ? this.form.reason : '',
					})
					.then((res)=>{
						this.is_loading = false
					})
					.catch((err)=>{
						this.is_loading = false
					})
				}
			}
		},
		watch : {
			'show_message' : function(value){
				if( value ){
					this.$nextTick(()=>{
						this.$refs.textarea.focus()
					})
				}
			}
		},
		validations(){
			var vm = this;
			return {
				form : {
					reason_type : {
						required 
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.vue-rate-on-shopify{
		height: 85px;
		padding: 10px 24px;
		position: fixed;
		z-index: 999;
		top: $app-toolbar-height;
		left: $app-sidebar-width;
		right: 0;
		background: #FFFFFF;
		&-wrapper{
			background: #FFF0BF;
			text-align: center;
			color: #846B18;
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			border: 1px solid #F2CE54;
			border-radius: 3px;
			height: 65px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			position: relative;
			padding: 0 15px;
			strong{
				text-transform: capitalize;
			}
		}
		&-btn{
			height: 40px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: #FFFFFF;
			border: 1px solid #F2CE54;
			box-sizing: border-box;
			border-radius: 4px;
			padding: 6px 14px;
			color: #000000;
			font-weight: 500;
			overflow: hidden;
			svg{
				margin-right: 5px;
			}
		}
		&-close{
			position: absolute;
			top: 50%;
			right: 10px;
			z-index: 1;
			color: #846B18;
			opacity: 0.5;
			transform: translate(0,-50%);
			&:hover{
				opacity: 1;
			}
		}	
		&-dismiss{
			display: flex;
			flex-wrap: nowrap;
			min-height: 380px;
			border-radius: 8px;
			overflow: hidden;
			&-close{
				position: absolute;
				top: 15px;
				right: 15px;
				z-index: 1;
				color: #252627;
				opacity: 0.5;
				&:hover{
					opacity: 1;
				}
			}
			&-content{
				@include col;
				padding: 50px;
				h4{
					font-style: normal;
					font-weight: 600;
					font-size: 20px;
					color: #252627;
				}
				p{
					font-style: normal;
					font-weight: normal;
					font-size: 14px;
				}
				button{
					min-width: 110px;
				}
			}
			&-aside{
				@include flex(228px);
				position: relative;
				background: #F7FAFF;
				img{
					position: absolute;
					top: 50%;
					left: 0;
					transform: translate(-20px , -50%);
				}
			}
		}
		&-modal{
			min-height: 200px;
			&-header{
				padding: 15px 24px;
				text-align: center;
				h4{
					font-weight: 600;
					font-size: 18px;
					color: #252627;
				}
				h5{
					font-weight: 600;
					font-size: 14px;
					color: #4F4F4F;
					strong{
						color: #5B86E5;
						text-transform: capitalize;
					}
				}
				p{
					font-style: normal;
					font-weight: normal;
					font-size: 14px;
					color: #252627;
				}
			}
			&-body{
				padding: 8px 24px;
				.list-item-reasons{
					height: 220px;
					overflow: hidden auto;
					.item-reason{
						height: 43px;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						border-bottom: 1px solid #F3F3F3;
						&:first-child{ 
							border-top: 1px solid #F3F3F3;
						}
					}
					&-group{
						width: 100%;
					}
				}
			}
			&-footer{
				padding: 15px 24px;
				background: #F7FAFF;
			}
		}
	}
</style>
<style lang="scss">
	.app-socical-shop.app-social-shop-has-banner{
		.app-layout{
			.app-layout-container{
				padding:  #{$app-toolbar-height + 85} 0 0 $app-sidebar-width;
			}
		}
	}
</style>