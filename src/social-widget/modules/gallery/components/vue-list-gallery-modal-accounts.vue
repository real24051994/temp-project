<template>
	<div>
		<a-modal title="Social Accounts" class="vue-list-gallery-modal-accounts" v-model="visible" :afterClose="afterClose" :destroyOnClose="true"  :footer="false" width="400px">
			<transition name="fade-in" mode="out-in">
				<div v-if="is_loading_page" key="loading" class="p-t-100 p-b-100 text-center">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
				<div v-else key="loaded" class="list-items-register p-t-50 p-b-50" >
					<vue-list-gallery-add-social-instagram   @on-success="onLoginSuccess" />
				</div>
			</transition>
		</a-modal>
	</div>
	
</template>
<script>
import VueListGalleryAddSocialInstagram from './vue-list-gallery-add-social-instagram'
import { mapActions, mapMutations } from "vuex";
export default {
	name : 'VueListGalleryModalAccounts',
	components:{
		VueListGalleryAddSocialInstagram
	},
	props:{
		value : {
			type : Boolean,
			required : true
		}
	},
	data(){
		return {
			is_loading : false,
			is_loading_page : false,
			is_popup : false,
			url : ''
		}
	},
	computed:{
		visible :{
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
			'generalLinkSocial' : 'gallery/generalLinkSocial'
		}),
		onLoginSuccess(payload){
			this.is_loading = false
			this.is_popup = true
			let { status  = false ,  data , message = 'Connection error , please try again later' } = payload 
			if( status ){
				this.toastSuccess({
					title : 'Connect success !',
					message : ''
				})
				this.visible = false
				this.$emit('reload')
			}else{
				this.toastError({
					title : 'Error !',
					message : message
				})
			}
		},
		afterClose(){
			this.$emit('reload')
		}
	},
}
</script>
<style lang="scss">
	.item-gallery-account{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		width: 100%;
		height: 300px;
		text-align: center;
		&:not(.is-loading){
			&:hover{
				background-color: rgba(24, 144, 255, 0.1);
			}
		}
		&-loading{
			z-index: 2;
			background-color: rgba(255,255,255,.5);
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn-add-account{
			font-size: 30px;
			border-radius: 50%;
		}
		h3{
			font-size: 16px;
		}
	}
	.list-items-register {
		display: flex;
		align-items: center;
		justify-content: center;
		
	}
	.item-row-social {
		padding: 5px 24px;
		border-bottom: 1px solid $border-color;
		background-color: #fff;
		cursor: pointer;
		user-select: none;
		&.is-disabled {
			opacity: 0.5;
		}
		&:hover {
			&:not(.is-disabled) {
				background-color: #f3f3f3;
			}
		}
		&:first-child {
			// border-top: 1px solid $border-color;
		}
		&:after {
			display: table;
			content: "";
			clear: both;
		}
		&-info {
			float: left;
			width: 75%;
			&-checkbox {
				&:after {
					display: table;
					content: "";
					clear: both;
				}
				.item-social-checkbox {
					width: 34px;
					float: left;
					height: 41px;
					display: flex;
					align-items: center;
				}
				.item-social-avatar {
					width: calc(100% - 34px);
					float: left;
				}
			}
			.item-social-account-title {
				flex-wrap: wrap;
				&-name {
					width: 100%;
				}
				&-status {
					width: 100%;
					font-size: 12px;
					&.status-success {
						color: $success;
					}
					&.status-error {
						color: $danger;
					}
				}
			}
		}
		&-type {
			float: left;
			width: 25%;
			line-height: 41px;
			font-size: 14px;
			text-align: right;
			text-transform: capitalize;
		}
	}
	
</style>
<style lang="scss" >
	.vue-list-gallery-modal-accounts{
		padding : 0;
		.ant-modal-body{
			padding: 0;
		}
	}
</style>