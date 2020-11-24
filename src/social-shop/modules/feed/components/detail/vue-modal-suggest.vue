<template>
	<a-modal :title="false" width="555px" :after-close="afterClose" v-model="visible" :footer="false" :bodyStyle="{ padding: 0}">
		<div class="modal-suggest-feed">
			<template v-if="socialType =='google'">
				<div class="modal-suggest-feed-success" :style="{ backgroundImage: 'url(' + require('@shop/assets/icons/modal-suggest-bg.png') + ')' }">
					<div class="modal-suggest-feed-success-icon">
						<img src="@shop/assets/icons/icon-checked.svg" svg-inline alt="">
					</div>
					<h3>
						Create feed successfully
					</h3>
					<p>
						<span>Connect with </span>
						<img class="m-r-4 m-l-4" src="@shop/assets/icons/icon-modal-google.svg" svg-inline alt="">
						<strong class="m-r-4">Google Merchant</strong>
						<span>Sucessfully</span> 
					</p>
					<div class="modal-suggest-feed-success-content" v-if="status.modal_suggest_facebook">
						<p>
							Now you can sync your product feed to Facebook Catalog.
						</p>
						<open-popup @on-pusher="onPusher" class="d-inline-flex" social_type="facebook" :loading_login.sync="is_loading">
							<template v-if="is_loading" slot="button">
								<a-button type="primary" class="modal-suggest-feed-success-btn">
									<a-spin size="large">
										<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
									</a-spin>
								</a-button>
							</template>
							<template v-else slot="popup">
								<a-button type="primary" class="modal-suggest-feed-success-btn">
									<div class="modal-suggest-feed-success-btn-icon">
										<sh-icon :icon="['fab','facebook-f']" />
									</div>
									<div class="modal-suggest-feed-success-btn-content">
										<span>Connect with </span>
										<strong>Facebook Catalog & Shops</strong>
									</div>
								</a-button>
							</template>
						</open-popup>
					</div>
					<a-button v-else type="primary" class="btn-close-modal m-t-10" @click="closeModal">
						Ok
					</a-button>
				</div>
			</template>
			<template v-else-if="socialType =='facebook'">
				<div class="modal-suggest-feed-success" :style="{ backgroundImage: 'url(' + require('@shop/assets/icons/modal-suggest-bg.png') + ')' }">
					<div class="modal-suggest-feed-success-icon">
						<img src="@shop/assets/icons/icon-checked.svg" svg-inline alt="">
					</div>
					<h3>
						Create feed successfully
					</h3>
					<a-button type="primary" class="btn-close-modal m-t-10" @click="closeModal">
						Ok
					</a-button>
				</div>
			</template>
			<template v-else-if="socialType =='facebook_fbe'">
				<transition name="fade-in" mode="out-in">
					<div class="modal-suggest-feed-success" v-if="enable_shop" key="is-enable_shop" >
						<div class="modal-suggest-feed-success-icon m-b-15">
							<img src="@shop/assets/icons/icon-modal-facebook-fbe.png" alt="">
						</div>
						<h3>
							Enable the Facebook Shop
						</h3>
						<div class="modal-suggest-feed-success-text">
							<span>A modal will show up after you click "Enable Shop Now", please choose </span>
							<strong>“Add”</strong>
							<span> on </span>
							<strong> “Page Shop” </strong>
							<span> section to activate.</span>
						</div>
						<div class="text-center m-t-20">
							<a-button type="primary"  @click="enableShop()">
								Enable Shop Now
							</a-button>
							<a @click="closeModalFBE" class="m-l-15">
								Do it later
							</a>
						</div>
					</div>
					<div class="modal-suggest-feed-success" v-else key="is-loaded" :style="{ backgroundImage: 'url(' + require('@shop/assets/icons/modal-suggest-bg.png') + ')' }">
						<div class="modal-suggest-feed-success-icon">
							<img src="@shop/assets/icons/icon-checked.svg" svg-inline alt="">
						</div>
						<h3>
							Create feed successfully
						</h3>
						<a-button type="primary" class="btn-close-modal m-t-10" @click="closeModal()">
							Ok
						</a-button>
					</div>
				</transition>
			</template>
		</div>
	</a-modal>
</template>

<script>
export default {
	name : 'ModalSuggest',
	props :{
		socialType : {
			type : String, 
		},
		status : {
			type : Object,
			default : ()=>({
				modal_suggest_facebook : false,
				modal_success : false,
			}),
		},
		account :{
			type : Object
		}
	},
	data(){
		return {
			visible : true,
			is_loading : false,
			enable_shop : true,
		}
	},
	methods :{
		afterClose(){

		},
		closeModal(){
			this.visible = false
		},
		closeModalFBE(){

		},
		enableShop(){
			window.open(
				`https://www.facebook.com/facebook_business_extension?app_id=${this.account.app_id}&external_business_id=${this.account.fbe_ids.external_business_id}`,
				'_blank',
				'menubar=1,resizable=1,width=900,height=500'
			)
		},
		onPusher(res) {
			let { data, status, message } = res
			if (status) {
				if (data && data.accountInfo) {
					
					this.redirect({
						name: 'CreateFeed',
						params: {
							channel : data ,
						},
					})
					this.closeModal()
				}
			} else {
				this.toastError({
					title: 'Error',
					message,
				})
				this.closeModal()
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.modal-suggest-feed{
		&-success{
			padding: 24px 42px 50px 42px;
			background-repeat: no-repeat;
			background-position: bottom center;
			text-align: center;
			&-icon{

			}
			h3{
				font-style: normal;
				font-weight: 600;
				font-size: 20px;
				color: #252627;
			}
			&-text{
				max-width: 400px;
				margin-left: auto;
				margin-right: auto;
				p{
					*{
						display: inline;
					}
				}
			}
			p{
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				*{
					display: inline-block;
					vertical-align: middle;
				}
			}
			a{
				color : $text;
				&:hover{
					color: $primary-color;
				}
			}
			.btn-close-modal{
				width: 106px;
			}
			.modal-suggest-feed-success-btn{
				height: 72px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				text-align: left;
				width: 256px;
				background: #4267B2;
				&-icon{
					@include flex(17px);
					font-size: 24px;
				}
				&-content{
					@include col;
					min-width: 0;
					padding-left: 20px;
					font-weight: normal;
					span,strong{
						display: block;
					}
					strong{
						font-weight: 600;
					}
				}
			}
			&-content{
				border-top: 1px solid $border-color;
				padding-top: 16px;
				margin-top: 16px;
			}
		}
	}
</style>