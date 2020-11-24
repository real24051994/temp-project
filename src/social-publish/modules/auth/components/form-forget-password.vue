<template>
	<a-form  class="app-auth-form" @submit.stop.prevent="onSubmit()"  novalidate>
		<a-form-item class="m-b-15" :label="$t('auth.label.email')" :validate-status="formstate && $v.form.email.$invalid ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.email')" v-model="form.email" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.email.required" class="form-error">
					{{ $t('auth.form.email_require') }}
				</div>
				<div  v-else-if="formstate && !$v.form.email.email" class="form-error">
					{{ $t('auth.form.email_invalid') }}
				</div>
				<div  v-else-if="formstate && !$v.form.email.invalid" class="form-error">
					{{ $t('auth.form.email_not_found') }}
				</div>
			</transition>
		</a-form-item>
		
		<a-button class="m-b-10" type="primary"  block html-type="submit" :loading="is_loading" >
			{{ $t('auth.btn.forget_password') }}
		</a-button>
	
	</a-form>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { required , email } from 'vuelidate/lib/validators'
export default {
	name : 'FormForgetPassword',
	data :()=>({
		form : {
			email : '',
		},
		formstate : false,
		is_loading : false,
		is_invalid : false,
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
			forgetPassword : 'auth/forgetPassword'
		}),
		...mapMutations({
			removeForgetPassword : 'auth/removeForgetPassword'
		}),
		onSubmit(){
			this.formstate = true 
			if(!this.is_loading && !this.$v.form.$invalid){
				this.is_loading = true
				this.forgetPassword(this.form).then((res)=>{
					let { status } = res.data
					if( status ){
						this.redirect({
							name : 'ResetPassword',
							params:{
								status : true
							}
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
	created(){
		this.removeForgetPassword()
	},
	validations : ()=>({
		form: {
			email :{
				required, email ,
				invalid : function(){
					return !this.is_invalid
				}
			},
		},
	}),
}
</script>