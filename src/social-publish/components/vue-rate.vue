<template>
	<div class="vue-rate">
		<a-button class="vue-rate-btn" type="primary" @click="showModal" v-if="allowed">
			<i class="m-r-6">
				<sh-icon :icon="['fal','star']" /> 
			</i>
			Rate Us
		</a-button>
		<a-modal transitionName="none" maskTransitionName="none" :title="false" v-model="visible" :maskClosable="!is_loading" :closable="!is_loading"  :footer="false" :afterClose="afterClose">
			<div class="vue-rate-modal">
				<template v-if="is_complete">
					<div class="vue-rate-modal-description" >
						<div class="m-b-16 m-t-16">
							<h4>Thank you!</h4>
						</div>
						<div class="m-b-16">
							<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.3873 20.8773C14.7139 20.1426 13.5506 20.0814 12.8159 20.7549C12.0812 21.4283 12.02 22.5916 12.6934 23.3263L21.9383 33.3671C22.3057 33.7345 22.7343 33.9794 23.2241 33.9794C23.2241 33.9794 23.2241 33.9794 23.2853 33.9794C23.7751 33.9794 24.2649 33.7957 24.571 33.4283L47.9587 10.1018C48.6934 9.36712 48.6934 8.20386 47.9587 7.53039C47.2241 6.85692 46.0608 6.79569 45.3873 7.53039L23.3465 29.51L15.3873 20.8773Z" fill="#50B861"/>
								<path d="M47.5303 23.3875C46.4895 23.3875 45.6936 24.1835 45.6936 25.2243C45.6936 36.612 36.3874 45.9182 24.9997 45.9182C13.6119 45.9182 4.30579 36.612 4.30579 25.2243C4.30579 13.8365 13.6119 4.5304 24.9997 4.5304C26.0405 4.5304 26.8364 3.73448 26.8364 2.69367C26.8364 1.65285 26.0405 0.856934 24.9997 0.856934C11.5915 0.856934 0.632324 11.8161 0.632324 25.2243C0.632324 38.6324 11.5915 49.5916 24.9997 49.5916C38.4078 49.5916 49.367 38.6324 49.367 25.2243C49.367 24.1835 48.5711 23.3875 47.5303 23.3875Z" fill="#50B861"/>
							</svg>

						</div>
						<div class="m-b-16">
							Thanks for giving us great feedback.
						</div>
						<div>
							<a-button type="primary" class="min-width-100" @click="visible = false">
								Ok
							</a-button>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="vue-rate-modal-header">
						We love your feedback!
					</div>
					<div class="vue-rate-modal-body">
						<a-rate v-model="form.star" :disabled="is_loading"  @change="onChange" />
					</div>
					<div class="vue-rate-modal-footer">
						<template  v-if="form.star == 0 ">
							<div class="vue-rate-modal-description">
								<div>
									Here at Socialpublish, Feedback is very important to us. 
								</div>
								<div>
									Your feedback will help us improve our product and provide better service. 
								</div>

							</div>
						</template>
						<template v-else>
							<div class="vue-rate-modal-description m-b-16" >
								<div class="m-b-8">
									<strong>Thanks for giving us great feedback.</strong>
								</div>
								<div>
									We'll make sure that our team take every feedback into consideration to provide you a better app everytime you visit!
								</div>
							</div>
							<div class="vue-rate-modal-reasons m-b-16" >
								<div class="item-reason" v-for="(item,index) in reasons" :key="`item_${index}`" :class="{ 'is-active' : form.reason_type.indexOf(item) >= 0}" @click="onSelect(item)">
									{{ item }}
								</div>
							</div>
							
							<div class="vue-rate-modal-message m-b-16" v-if="form.reason_type.indexOf('Others') >= 0">
								<a-textarea :disabled="is_loading" v-model="form.reason" placeholder="Your feedback..." :auto-size="{ minRows: 4, maxRows: 8 }" />
							</div>
							<a-button :loading="is_loading" :disabled="is_loading || $v.form.$invalid" type="primary" block @click="onSubmit">
								Submit
							</a-button>
						</template>
					</div>
				</template>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
	name : 'VueRate',
	data(){
		return {
			visible : false ,
			formstate : false,
			form :{
				star : 0 ,
				reason_type : [],
				reason : ''
			},
			reasons : [
				"App is not worthy",
				"Products are not synced to the app",
				"Lack of function",
				"Cannot connect social account",
				"Posts do not get published",
				"App is hard to use",
				"App is slow",
				"Bad support",
				"Others"
			],
			is_complete : false,
			is_loading : false 
		}
	},
	computed:{
		...mapGetters({
			'userOnboarding' : 'auth/getUserOnboarding'
		}),
		allowed(){
			return !this.userOnboarding.feedback
		}
	},
	methods:{
		...mapActions({
			createFeedback: 'auth/createFeedback'
		}),
		showModal(){
			this.visible = true
		},
		afterClose(){
			this.form = {
				star : 0 ,
				reason_type : [],
				reason : ''
			}
		},
		onChange(rate){
			if( rate >= 4 ){
				this.onRateUs()
			}
		},
		onRateUs(){
			window.open('https://apps.shopify.com/social-publish?reveal_new_review=true' , '_blank')
			this.is_complete = true
			this.createFeedback({ 
				"star" : this.form.star ,
				"reason_type": [],
    			"reason": "" 
			})
			.then((res)=>{

			})
			.catch((err)=>{

			})
		},
		onSelect(item){
			if( this.is_loading ) return
			var index = this.form.reason_type.indexOf(item)
			if( index >= 0){
				this.form.reason_type.splice( index , 1)
			}else{
				this.form.reason_type.push(item)
			}
		},
		onSubmit(){
			this.formstate = true 
			if( !this.is_loading  &&  !this.$v.form.$invalid ){
				this.is_loading = true
				this.createFeedback({ 
					"star" : this.form.star ,
					"reason_type": this.form.reason_type,
					"reason": this.form.reason,
				})
				.then((res)=>{
					this.is_complete = true
					this.is_loading = false
				})
				.catch((err)=>{
					this.is_loading = false
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
				},
				reason : {
					required : requiredIf( ()=>vm.form.reason_type.indexOf('Others') >= 0 )
				}
			}
		}
	},
}
</script>
<style lang="scss">
	.vue-rate{
		&-btn{
			&.ant-btn.ant-btn-primary{
				background-color: #6793F3;
				border-color:  #6793F3;
				&:hover,&:focus,&:active{
					background-color: #6793F3;
					border-color:  #6793F3;
				}
			}
		}
		&-modal{
			padding: 24px ;
			text-align: center;
			&-header{
				font-weight: 600;
				font-size: 20px;
				line-height: 24px;
				padding: 16px 0;
			}
			&-body{
				margin-bottom: 24px;
				.ant-rate{
					font-size: 35px;
				}
			}
			&-footer{
				.ant-btn-block{
					height: 40px;
					line-height: 40px;
				}
				
			}
			&-description{
				
				h4{
					font-weight: 600;
					font-size: 18px;
					line-height: 21px;
				}
			}
			&-reasons{
				.item-reason{
					background: #F7F8FA;
					border-radius: 24px;
					padding: 0px 16px;
					line-height: 32px;
					height: 32px;
					text-align: center;
					display: inline-block;
					margin: 0 4px 8px 4px;
					border: 1px solid #F7F8FA;
					cursor: pointer;
					user-select: none;
					&:hover{
						color: $primary-color;
					}
					&.is-active{
						border-color: $primary-color;
						color: $primary-color;
					}
				}
			}
		}
		
	}
</style>