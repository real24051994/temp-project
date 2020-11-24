<template>
	<div class="p-t-30">
		<a-button class="btn-back" @click="back">
			<span>{{ $t('auth.btn.back')}}</span>
		</a-button>
		<transition name="fade-in" mode="out-in">
			<div v-if="vertify" key="is-vertify">
				<div class="app-auth-title">
					<h3 v-html="$t('auth.heading.reset_password')"></h3>
				</div>
				<form-reset-password :code="code" />
			</div>
			<div v-else key="is-not-vertify">
				<div class="app-auth-title">
					<h3 v-if="status" v-html="$t('auth.heading.send_email_success')"></h3>
					<h3 v-else v-html="$t('auth.heading.vertify_account')"></h3>
				</div>
				<form-vertify-reset-code v-model="vertify" :code.sync="code"  />
			</div>
			
		</transition>
	</div>
</template>
<script>
import FormResetPassword from '../components/form-reset-password'
import FormVertifyResetCode from '../components/form-vertify-reset-code'
export default {
	name : 'ResetPassword',
	components:{
		FormResetPassword,
		FormVertifyResetCode
	},
	props:{
		status : {
			type : Boolean,
			default : false,
		}
	},
	metaInfo: {
		title: 'Reset Password',
	},
	data : ()=>({
		vertify : false,
		code : ''
	}),
	methods:{
		back(){
			this.redirect({
				name : 'ForgetPassword'
			})
		}
	},
	created(){

	}
}
</script>
<style lang="scss">

</style>