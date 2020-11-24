<template>
	<div class="p-t-30">
		<a-button class="btn-back" @click="back">
			<span> {{ $t('auth.btn.back') }} </span>
		</a-button>
		<div class="app-auth-title">
			<h3 v-html="$t('auth.heading.forget_password')"></h3>
		</div>
		<div>
			<form-forget-password />
		</div>
	</div>
</template>
<script>
import FormForgetPassword from '../components/form-forget-password.vue'
export default {
	name : 'ForgetPassword',
	components:{
		FormForgetPassword
	},
	metaInfo: {
		title: 'Forget Password',
	},
	methods:{
		back(){
			this.redirect({
				name : 'Login'
			})
		}
	}
}
</script>
<style lang="scss">

</style>