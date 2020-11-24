<template>
	<div class="vue-setting-utm">
		<vue-pricing-setting-popover :visible="disabled" z-index="900" >
			<h3 class="vue-setting-title">
				{{ $t('setting.utm.title') }} <span v-if="show_label_premium" class="label-premium m-l-16">Premium function</span>
			</h3>
			<template v-if="formdata.facebook.length || formdata.twitter.length">
				<div class="row m-l-0 m-r-0 m-t-24" v-if="formdata.facebook.length">
					<div class="col vue-setting-col vue-setting-col-label">
						<div class="vue-setting-utm-social">
							<div class="item-social item-social-square social-facebook"></div>
							<div class="vue-setting-utm-social-label">Facebook</div>
						</div>
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<div class="vue-setting-utm-list">
							<vue-setting-utm-item v-for="(item,index) in formdata.facebook" :disabled="disabled" @on-click-item="handleShowModal" :data.sync="item" :key="`index_${index}`" />
						</div>
					</div>
				</div>
				<div class="row m-l-0 m-r-0 m-t-24" v-if="formdata.twitter.length">
					<div class="col vue-setting-col vue-setting-col-label">
						<div class="vue-setting-utm-social">
							<div class="item-social item-social-square social-twitter"></div>
							<div class="vue-setting-utm-social-label">Twitter</div>
						</div>
						
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<div class="vue-setting-utm-list">
							<vue-setting-utm-item v-for="(item,index) in formdata.twitter" :disabled="disabled" @on-click-item="handleShowModal" :data.sync="item" :key="`index_${index}`" />
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="row m-t-16">
					<div class="col col-12">
						<div class="vue-setting-utm-empty-social">
							{{$t('setting.utm.empty')}}
						</div>
					</div>
				</div>
			</template>
		</vue-pricing-setting-popover>
		<a-modal transitionName="none" maskTransitionName="none" v-if="!disabled"  :title="$t('setting.utm.modal.title')" wrapClassName="modal-update-utm" v-model="visible" @ok="handleOk" width="600px" :okText="$t('setting.utm.modal.btn_save')">
			<div class="item-preview">
				<label>{{ $t('setting.utm.modal.preview_url') }}</label>
				<div class="box-preview">
					{{ shop.domain }}?{{ form | utm }}
				</div>
			</div>
			<div class="item-input m-t-16">
				<span class="ant-input-group-wrapper">
					<span class="ant-input-wrapper ant-input-group">
						<span class="ant-input-group-addon">{{$t('setting.utm.modal.utm_source.name')}}<strong class="text-danger">*</strong></span>
						<input type="text" class="ant-input" v-model="form.utm_source" :placeholder="$t('setting.utm.modal.utm_source.placeholder')">
					</span>
				</span>
			</div>
			<div class="item-input m-t-16">
				<span class="ant-input-group-wrapper">
					<span class="ant-input-wrapper ant-input-group">
						<span class="ant-input-group-addon">{{$t('setting.utm.modal.utm_medium.name')}}<strong class="text-danger">*</strong></span>
						<input type="text" class="ant-input" v-model="form.utm_medium" :placeholder="$t('setting.utm.modal.utm_medium.placeholder')">
					</span>
				</span>
			</div>
			<div class="item-input m-t-16">
				<span class="ant-input-group-wrapper">
					<span class="ant-input-wrapper ant-input-group">
						<span class="ant-input-group-addon">{{$t('setting.utm.modal.utm_campaign.name')}}<strong class="text-danger">*</strong></span>
						<input type="text" class="ant-input" v-model="form.utm_campaign" :placeholder="$t('setting.utm.modal.utm_campaign.placeholder')">
					</span>
				</span>
			</div>
			<div class="item-input m-t-16">
				<span class="ant-input-group-wrapper">
					<span class="ant-input-wrapper ant-input-group">
						<span class="ant-input-group-addon">{{$t('setting.utm.modal.utm_term.name')}}</span>
						<input type="text" class="ant-input" v-model="form.utm_term" :placeholder="$t('setting.utm.modal.utm_term.placeholder')">
					</span>
				</span>
			</div>
			<div class="item-input m-t-16">
				<span class="ant-input-group-wrapper">
					<span class="ant-input-wrapper ant-input-group">
						<span class="ant-input-group-addon">{{$t('setting.utm.modal.utm_content.name')}}</span>
						<input type="text" class="ant-input" v-model="form.utm_content" :placeholder="$t('setting.utm.modal.utm_content.placeholder')">
					</span>
				</span>
			</div>
			<div class="item-input m-t-16">
				<div class="text-danger">(*) {{$t('setting.utm.modal.required')}}</div>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required, requiredIf , maxLength} from 'vuelidate/lib/validators'
import VueSettingUtmItem from './vue-setting-utm-item'
import PublishHelper from '@publish/plugin/helper'
export default {
	name : 'SettingUTM',
	components:{
		VueSettingUtmItem
	},
	props:{
		value :{
			type : Object,
			required : true
		},
		disabled : {
			type : Boolean,
			default : false,
		}
	},
	data(){
		return  {
			visible : false,
			form : {
				social_account_id : '',
				social_type : '',
				utm_source : '',
				utm_medium : '',
				utm_campaign : '',
				utm_term : '',
				utm_content : ''
			},
			formstate : false,
		}
	},
	computed:{
		...mapGetters({
			'shop' : 'auth/getShop',
			'show_label_premium'  : 'pricing/getShowLabelPremium'
		}),
		formdata : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		handleShowModal({social_account_id , social_type}){
			if( this.disabled ) return 
			var item = null 
			if( social_type == 'facebook'){
				item = _.find(this.formdata.facebook , { social_account_id })
			}else if( social_type == 'twitter'){
				item = _.find(this.formdata.twitter , { social_account_id })
			}
			if( item ){
				this.form.social_account_id = social_account_id
				this.form.social_type = social_type
				if(item.utm_tag_obj.hasOwnProperty('utm_source')){
					this.form.utm_source = item.utm_tag_obj.utm_source
				}
				if(item.utm_tag_obj.hasOwnProperty('utm_campaign')){
					this.form.utm_campaign = item.utm_tag_obj.utm_campaign
				}
				if(item.utm_tag_obj.hasOwnProperty('utm_medium')){
					this.form.utm_medium = item.utm_tag_obj.utm_medium
				}
				if(item.utm_tag_obj.hasOwnProperty('utm_term')){
					this.form.utm_term = item.utm_tag_obj.utm_term
				}
				if(item.utm_tag_obj.hasOwnProperty('utm_content')){
					this.form.utm_content = item.utm_tag_obj.utm_content
				}
				this.form.utm_tag = item.utm_tag
				this.visible = true
			}
		},
		handleOk(){
			var utm_tag_obj = {
				utm_source : this.form.utm_source,
				utm_medium : this.form.utm_medium,
				utm_campaign : this.form.utm_campaign,
				utm_term : this.form.utm_term,
				utm_content : this.form.utm_content
			}
			var utm_tag = this.$PublishHelper.convertUtmToUrl(utm_tag_obj)
			if( this.form.social_type == 'facebook'){
				let index = _.findIndex(this.formdata.facebook , { social_account_id : this.form.social_account_id })
				if( index >= 0 ){
					this.formdata.facebook[index].utm_tag_obj = utm_tag_obj
					this.formdata.facebook[index].utm_tag = utm_tag
				}
			}else if( this.form.social_type == 'twitter'){
				let index = _.findIndex(this.formdata.twitter , { social_account_id : this.form.social_account_id })
				if( index >= 0 ){
					this.formdata.twitter[index].utm_tag_obj = utm_tag_obj
					this.formdata.twitter[index].utm_tag = utm_tag
				}
			}
			this.visible = false 
			this.resetForm()
		},
		resetForm(){
			this.form =  {
				social_account_id : '',
				social_type : '',
				utm_source : '',
				utm_medium : '',
				utm_campaign : '',
				utm_term : '',
				utm_content : ''
			}
		},
		
	},
	filters :{
		utm : function(value){
			return  PublishHelper.convertUtmToUrl(value)
		}
	}
}
</script>
<style lang="scss" scoped>
	.vue-setting-utm{
		&-empty-social{
			padding: 50px 0;
			font-size: 14px;
			color: #CECECE;
			text-align: center;
		}
		&-social{
			display: flex;
			align-items: center;
			&-label{
				font-weight: 600;
				font-size: 14px;
				margin-left: 8px;
				line-height: 20px;
			}
		}
		&-list{
			
		}
	}
	.ant-input[disabled]{
		background-color: #F3F3F3;
		&:hover{
			border-color: #d9d9d9;
		}
	}
	.box-preview{
		min-height: 32px;
		background-color: #F3F3F3;
		border: 1px solid #d9d9d9;
		padding: 4px 11px;
		border-radius:4px;
		word-break: break-all;
	}
	.ant-input-group-wrapper{
		.ant-input-group{
			.ant-input-group-addon{
				min-width: 160px;
				text-align: left;
				background: transparent;
				font-weight: 600;
			}
		}
	}
</style>
<style lang="scss">
	.modal-update-utm{
		.ant-modal-body{
			
			.item-input{
				padding: 0 16px;
			}
			.item-preview{
				padding: 0 16px 16px 16px;
				border-bottom: 1px solid $border-color;
				label{
					font-weight: 600;
				}
			}
		}
	}
</style>