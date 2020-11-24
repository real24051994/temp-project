<template>
	<a-form  class="app-auth-form" @submit.stop.prevent="onSubmit()"   novalidate>
		<a-form-item class="m-b-15" :label="$t('auth.label.new_password')" :validate-status="formstate && $v.form.password.$invalid ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.password')"  type="password" v-model="form.password" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.password.required" class="form-error">
					{{ $t('auth.form.password_require') }}
				</div>
				<div  v-else-if="formstate && !$v.form.password.minLength" class="form-error">
					{{ $t('auth.form.password_min_length' , { min : $v.form.password.$params.minLength.min }) }}
				</div>
				<div  v-else-if="formstate && !$v.form.password.maxLength" class="form-error">
					{{ $t('auth.form.password_max_length' , { max : $v.form.password.$params.maxLength.max }) }}
				</div>
			</transition>
		</a-form-item>
		<a-form-item class="m-b-15" :label="$t('auth.label.repassword')" :validate-status="formstate && $v.form.repassword.$invalid ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.repassword')"  v-model="form.repassword" type="password" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && $v.form.repassword.$invalid" class="form-error">
					{{ $t('auth.form.password_match') }}
				</div>
			</transition>
		</a-form-item>
		<a-button  class="m-b-15" type="primary"  block html-type="submit" :loading="is_loading" >
			{{ $t('auth.btn.reset_password') }}
		</a-button>
	</a-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required  , minLength ,maxLength , sameAs } from 'vuelidate/lib/validators'
export default {
	name : 'FormResetPassword',
	props:{
		code : {
			type : String,
			required : true 
		}
	},
	data :()=>({
		form : {
			password : '',
			repassword : ''
		},
		formstate : false,
		is_loading : false,
	}),
	computed: {
		...mapGetters({
			vertifyEmail : 'auth/getForgetPasswordEmail'
		})
	},
	methods:{
		...mapActions({
			resetPassword : 'auth/resetPassword'
		}),
		onSubmit(){
			this.formstate = true 
			if(!this.is_loading && !this.$v.form.$invalid){
				this.is_loading = true 
				this.resetPassword({
					email : this.vertifyEmail,
					code : this.code ,
					password : this.form.password
				})
				.then((res)=>{
					let { status , errors = '' , data , code ='' } = res.data 
					if( status ){
						this.redirect({
							name : 'Dashboard'
						})
					}else{
						if( code == 422){
							this.showFormErrors(errors)
						}
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
				this.mode = 'account'
			}
		}
	},
	validations: ()=>({
		form: {
			password :{
				required,
				minLength: minLength(6),
				maxLength: maxLength(20)
			},
			repassword :{
				required,
				match: sameAs('password')
			},
		},
	}),
}
</script>