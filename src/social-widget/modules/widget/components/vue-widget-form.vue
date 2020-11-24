<template>
	<div class="row vue-widget-form">
		<div class="col col-12">
			<transition name="fade-in" mode="out-in">
				<div v-if="tab == 'options'" key="is-tab-options">
					<vue-widget-form-general v-model="form" :validate="validate" :formstate="formstate" />
				</div>
				<div v-if="tab == 'desktop'" key="is-tab-desktop">
					<vue-widget-form-desktop v-model="form" :validate="validate" :formstate="formstate" />
				</div>
				<div v-if="tab == 'mobile'" key="is-tab-mobile">
					<vue-widget-form-mobile v-model="form" :validate="validate" :formstate="formstate" />
				</div>
				<div v-if="tab == 'theme'" key="is-tab-theme">
					<vue-widget-form-theme v-model="form" :validate="validate" :formstate="formstate" />
				</div>
			</transition>
		</div>
		<div class="col col-12 p-b-24 p-t-24">
			<hr>
		</div>
		
		<div class="col col-12 m-b-50">
			<vue-widget-preview v-model="is_preview_tab" :data="form" />
		</div>
	</div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import VueWidgetPreview from './vue-widget-preview'
import VueWidgetFormGeneral from './vue-widget-form-general'
import VueWidgetFormDesktop from './vue-widget-form-desktop'
import VueWidgetFormMobile from './vue-widget-form-mobile'
import VueWidgetFormTheme from './vue-widget-form-theme'
import config from '../config'
export default {
	name : 'VueWidgetForm',
	components:{
		VueWidgetPreview,
		VueWidgetFormGeneral,
		VueWidgetFormDesktop,
		VueWidgetFormMobile,
		VueWidgetFormTheme
	},
	props:{
		value :{
			required: true
		},
		tab :{
			type : String,
		},
		formstate :{
			type : Boolean
		},
		validate :{
			
		},
		tab :{
			type : String,
			default : 'options'
		},
	},
	data(){
		return {
			is_loading : true,
			is_preview_tab : 'desktop',
		}
	},
	computed:{
		form :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		},
		is_active : {
			get(){
				return this.tab
			},
			set(value){
				this.$emit('update:tab', value)
			}
		},
	},
	methods:{
		...mapActions({
			
		}),
		onChange(event){
			console.log(event)
		},
		onSelect(data){
			console.log(data)
		}

	},
	watch : {
		'tab' : function(value){
			if( (value == 'desktop' && this.is_preview_tab != 'desktop' ) || (value == 'mobile' && this.is_preview_tab != 'mobile' )){
				this.is_preview_tab = value
			}
		}
	},
	mounted(){
		
	}
}
</script>
<style lang="scss" >
	.vue-widget-form{
		.ant-select{
			display: block;
		}
		h3{
			font-size: 18px;
			font-weight: 600;
		}
		label{
			font-weight: 600;
			text-transform: capitalize;
		}
		// .item-form{
		// 	display: flex;
		// 	flex-wrap: wrap;
		// 	&-title{
		// 		@include flex(130px);
		// 		label{
		// 			font-weight: 600;
		// 			font-size: 14px;
		// 			line-height: 32px;
		// 		}
		// 	}
		// 	&-value{
		// 		@include flex(calc(100% - 130px));
		// 		.ant-select ,.ant-input{
		// 			width: 100%;
		// 		}
		// 		.radio-block{
		// 			display: block;
		// 			.ant-radio-wrapper{
		// 				display: block;
		// 				margin: 0 0 8px 0;
		// 			}
		// 		}
		// 		.ant-input-select-custom-element{
		// 			cursor: pointer;
		// 		}
		// 	}
		// }
	}
	
</style>