<template>
	<a-form  class="app-auth-form" @submit.stop.prevent="onSubmit()"  novalidate>
		<a-form-item class="m-b-15" :label="$t('auth.label.code')" :validate-status="formstate && $v.form.code.$invalid  ? 'error' : ''" >
			<a-input :placeholder="$t('auth.placeholder.code')" v-model="form.code" :disabled="is_loading" />
			<transition name="fade-in" mode="out-in">
				<div  v-if="formstate && !$v.form.code.required" class="form-error">
					{{ $t('auth.form.code_require') }}
				</div>
				<div  v-if="formstate && is_invalid" class="form-error">
					{{ $t('auth.form.code_invalid') }}
				</div>
			</transition>
		</a-form-item>
		
		<a-button class="m-b-10" type="primary"  block html-type="submit" :loading="is_loading" >
			{{ $t('auth.btn.vertify') }}
		</a-button>
	
	</a-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required  } from 'vuelidate/lib/validators'
export default {
	name : 'FormVertifyCode',
	props:{
		value :{
			type : Boolean,
			required :true
		}
	},
	data :()=>({
		form : {
			code : '',
		},
		formstate : false,
		is_loading : false,
		is_invalid : false,

	}),
	computed:{
		...mapGetters({
			vertifyEmail : 'auth/getForgetPasswordEmail'
		}),
		vertify :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
	},
	methods:{
		...mapActions({
			forgetPassword : 'auth/forgetPassword',
			vertifyCode : 'auth/vertifyCode'
		}),
		onSubmit(){
			this.formstate = true 
			if(!this.is_loading && !this.$v.form.$invalid){
				this.is_invalid = false
				this.is_loading = true
				this.vertifyCode({
					code : this.form.code ,
					email : this.vertifyEmail
				}).then((res)=>{
					let { status  , message = '' } = res.data
					if( status ){
						this.$emit('update:code' , this.form.code )
						this.vertify = true 
					}else{
						this.is_invalid = true 
					}
					this.is_loading = false
				})
				.catch((err)=>{
					this.is_invalid = true 
					this.is_loading = false
				})
				
			}
		},
	},
	validations: ()=>({
		form: {
			code :{
				required
			},
		},
	}),
}
</script>