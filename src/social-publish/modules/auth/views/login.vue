<template>
	<div class="auth-login-page">
		<div class="page-title m-b-16">LOGIN</div>
		<form-login-by-shopify />
	</div>
</template>
<script>
import FormLoginByShopify from '../components/form-login-by-shopify'
export default {
	name : 'Login',
	components:{
		FormLoginByShopify
	},
	metaInfo: {
		title: 'Login',
	},
}
</script>
<style lang="scss" scoped>
	.auth-login-page{
		width: 350px;
		margin: 0 auto;
		
	}
</style>