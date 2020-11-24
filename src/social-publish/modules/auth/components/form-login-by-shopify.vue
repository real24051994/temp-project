<template>
	<form  class="app-auth-form" @submit.stop.prevent="onSubmit()"   novalidate>
		<label>{{ $t('auth.label.shop') }}</label>
		<div class="ant-form-item-control m-b-16 m-t-8" :class="{ 'has-error' : formstate && $v.form.shop.$invalid }">
			<div class="ant-form-item-wrap">
				<input class="ant-input" name="shopname" autocomplete="on" placeholder="Your store name" v-model="form.shop" :disabled="is_loading" type="text">
				<span class="ant-form-item-wrap-subfix">.myshopify.com</span>
			</div>
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.shop.required" class="form-error">
					{{ $t('auth.form.shop_require') }}
				</div>
				<div  v-else-if="formstate && !$v.form.shop.valid" class="form-error">
					{{ $t('auth.form.shop_invalid') }}
				</div>
			</transition>
		</div>
		<a-button class="m-b-16" type="primary"  block html-type="submit" :loading="is_loading" >
			{{ $t('auth.btn.login_with_shopify')}}
		</a-button>
		<div class="app-auth-form-afiliate">
			<span>Don't have</span>
			<i class="m-l-4 m-r-4">
				<sh-icon :icon="['sh','shopify']" />
			</i>
			<strong class="m-r-4">Shopify account?</strong>
			<a  href="https://www.shopify.com/signup" target="_blank" rel="noopener noreferrer">Create Account</a>
		</div>
	</form>
</template>
<script>
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
	name : 'FormLoginByShopify',
	data :()=>({
		form : {
			shop : '',
		},
		formstate : false,
		is_loading : false,
	}),
	methods:{
		...mapActions({
			getUrl : 'auth/shopifyLogin'
		}),
		onSubmit(){
			this.formstate = true 
			if(!this.is_loading && !this.$v.form.$invalid){
				this.is_loading = true
				var shop = this.form.shop.replace(/.myshopify.com/gi, "");
				this.getUrl({shop}).then((res)=>{
					let { status , data } = res.data
					if( status && data){
						window.location.href = data
					}
					this.is_loading = false
				})
				.catch((err)=>{
					this.is_loading = false
				})
			}
		},
	},
	validations: ()=>({
		form: {
			shop :{
				required,
				valid : function(value){
					var temp = value.replace(/.myshopify.com/gi, "");
					const regex = /[!@#$%^&*(),.?":{}|<>`']/gi;
					return !regex.test(temp)
				}
			}
		},
	}),
}
</script>
<style lang="scss" scoped>
	.app-auth-form{
		display: block;
		width: 100%;
		label{
			font-weight: 600;
			margin-bottom: 8px;
		}
		.ant-form-item-wrap{
			position: relative;
			display: block;
			font-size: 14px;
			.ant-input{
				padding: 6px 110px 6px 11px;
				height: 40px;
			}
			&-subfix{
				position: absolute;
				right: 0;
				top: 0;
				bottom: 0;
				opacity: 0.5;
				user-select: none;
				pointer-events: none;
				padding-right: 11px;
			}
		}
		.ant-btn{
			height: 40px;
			line-height: 40px;
		}
		.app-auth-form-afiliate{
			i{
				font-size: 17px;
				color: $shopify;
			}
		}
	}
	p{
		margin: 0;
		line-height: 18px;
		img{
			vertical-align: middle;
			margin: 0 3px;
		}
		a{
			margin-left: 8px;
		}
	}
</style>