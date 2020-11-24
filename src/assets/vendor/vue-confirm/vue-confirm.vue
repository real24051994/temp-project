<template>
    <a-modal
		v-if="visible"
		v-model="visible" 
		:title="options.title" 
		:zIndex="options.zIndex"
		:closable="options.is_mask_closeable"
		:maskClosable="options.is_mask_closeable"
		:cancelButtonProps="cancelButtonProps"
		:wrapClassName="options.wrapClassName"
		@ok="handleOk" 
		@cancel="handleCancel"
	>
		<div class="vue-modal-confirm-dialog-content" v-html="options.content"></div>
		<div class="vue-modal-confirm-dialog-checkbox" :class="options.checkboxClass" v-if="options.checkbox">
			<a-checkbox v-model="options.checkboxValue"> {{ options.checkboxContent }}</a-checkbox>
		</div>
		<template slot="footer">
			<a-button @click="handleCancel" :type="options.cancelType"> {{options.cancelText}} </a-button>
			<a-button @click="handleOk" :type="options.okType" :loading="options.is_loading" :disabled="options.checkboxRequired && !options.checkboxValue"> {{options.okText}} </a-button>
		</template>
    </a-modal>
</template>
<script>
import ConfirmDialog from './index.js'
export default {
	name : 'VueConfirmDialog',
	data(){
		return {
			visible : false,
			options : {
				title : '',
				content : '',
				okText : 'Ok',
				okType : 'primary',
				cancelText : 'cancel',
				cancelType : '',
				zIndex : 10002,
				onOk : ()=>{},
				onCancel :  ()=>{},
				checkbox : false,
				checkboxValue : false,
				checkboxContent : '',
				checkboxClass :'',
				checkboxRequired : false,
				wrapClassName : 'vue-modal-confirm-dialog',
				is_loading : false, 
				is_mask_closeable : true,
			},
		}
	},
	computed:{
		cancelButtonProps(){
			return {
				props: { 
					disabled : this.options.is_loading 
				},
				on: {}
			}
		},
	},
	methods :{
		handleOk(){
			this.options.is_loading = true
			this.options.is_mask_closeable = false 
			var payload =  this.options.checkbox ?  { checkbox : this.options.checkboxValue } : {}
			Promise.resolve(this.options.onOk(payload)).then(result =>{
				this.visible  = false 
				this.onCLose()
			});
		},
		handleCancel(){
			Promise.resolve(this.options.onCancel()).then(result =>{
				this.visible = false 
				this.onCLose()
			});
		},
		showConfirm(payload){
			this.options = Object.assign(this.options , payload)
			this.visible = true
		},
		onCLose(){
			this.options = {
				title : '',
				content : '',
				okText : 'Ok',
				okType : 'primary',
				cancelText : 'cancel',
				cancelType : '',
				zIndex : 10002,
				onOk : ()=>{},
				onCancel :  ()=>{},
				checkbox : false,
				checkboxValue : false,
				checkboxContent : '',
				checkboxClass :'',
				checkboxRequired : false,
				wrapClassName : 'vue-modal-confirm-dialog',
				is_loading : false, 
				is_mask_closeable : true,
			}
		}
	},
	beforeCreate(){
		ConfirmDialog.EventBus.$on('showModalConfirmDialog', (options = {})=>{
			this.showConfirm(options)
		})
	}
}
</script>
<style lang="scss">
	.ant-modal-wrap.vue-modal-confirm-dialog{
		.ant-modal{
			.ant-modal-content{
				.ant-modal-header{
					border-bottom: 1px solid $border-color;
				}
				.ant-modal-body{
					padding:  16px;
					min-height: 80px;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
				}
				.ant-modal-footer{
					border-top: 1px solid $border-color;
					.ant-btn{
						&.ant-btn-danger{
							background-color: $danger;
							color: #fff;
						}
						&[disabled]{
							opacity: .5;
						}
					}
				}
			}
		}
		.vue-modal-confirm-dialog-content{
			font-weight: normal;
			font-size: 14px;
			line-height: 17px;
			text-align: center;
			width: 100%;
		}
		.vue-modal-confirm-dialog-checkbox{
			margin-top: 15px;
			font-weight: normal;
			font-size: 14px;
			line-height: 17px;
			text-align: center;
		}
	}
</style>