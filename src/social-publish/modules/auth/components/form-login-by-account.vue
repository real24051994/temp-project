<template>
	<a-form  class="app-auth-form" @submit.stop.prevent="onSubmit()"  novalidate>
		<a-form-item class="m-b-15" :label="$t('auth.label.password')" :validate-status="formstate && $v.form.email.$invalid ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.email')" v-model="form.email" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.email.required" class="form-error">
					{{ $t('auth.form.email_require') }}
				</div>
				<div  v-else-if="formstate && !$v.form.email.email" class="form-error">
					{{ $t('auth.form.email_invalid') }}
				</div>
			</transition>
		</a-form-item>
		
		<a-form-item class="m-b-5" :label="$t('auth.label.password')" :validate-status="formstate && $v.form.password.$invalid ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.password')" type="password" v-model="form.password" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.password.required" class="form-error">
					{{ $t('auth.form.password_require') }}
				</div>
			</transition>
		</a-form-item>

		<div class="text-left m-b-15">
			<router-link :to="{ name : 'ForgetPassword'}">
				{{ $t('auth.link.forget_password')}}
			</router-link>
		</div>

		<a-button class="m-b-10" type="primary"  block html-type="submit" :loading="is_loading"  >
			{{ $t('auth.btn.login_with_account')}}
		</a-button>
	
		<a-button class="btn-change-mode" block  @click="changeMode()">
			{{ $t('auth.heading.login_with') }}
			<img class="m-l-5 m-r-5" src="../assets/shopify.png" alt="">
			{{ $t('auth.link.login_with_shopify') }}
		</a-button>
	</a-form>
</template>
<script>
import { mapActions } from 'vuex'
import { required , email } from 'vuelidate/lib/validators'
export default {
	name : 'FormLoginByUser',
	props:{
		value :{
			type : String,
			required : true,
		}
	},
	data :()=>({
		form : {
			email : '',
			password : ''
		},
		formstate : false,
		is_loading : false,
	}),
	computed:{
		mode :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		...mapActions({
			login : 'auth/login'
		}),
		onSubmit(){
			this.formstate = true 
			if(!this.is_loading && !this.$v.form.$invalid){
				this.is_loading = true
				this.is_invalid = false
				this.login(this.form).then((res)=>{
					let { status } = res.data
					if( status){
						this.redirect({
							name : 'Dashboard'
						})
					}else{
						this.is_invalid = true
					}
					this.is_loading = false
				})
				.catch((err)=>{
					this.is_loading = false
				})
			}
		},
		changeMode(){
			if( !this.is_loading ){
				this.mode = 'shopify'
			}
		}
	},
	watch :{
		form : {
			handler : function(){
				if( this.is_invalid ){
					this.is_invalid = false
				}
			},
			deep : true 
		}
	},
	validations: ()=>({
		form: {
			email :{
				required, email
			},
			password :{
				required
			},
			invalid : function(){
				return !this.is_invalid
			}
		},
	}),
}
</script>