<template>
	<div class="auth-register-page p-t-50 p-b-50">
		<div class="page-title m-b-16">Connect to social account</div>
		<transition name="fade-in" mode="out-in">
			<div class="auth-register-page-loading" v-if="is_loading" key="is-loading-page">
				<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
				<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
				<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
			</div>
			<div v-else key="is-loading-page-success">
				<div class="list-items-social m-b-24">
					<vue-simple class="list-items-social-scroll">
						<div class="item-row-social" v-for="(item,index) in data" :key="`index_${index}`">
							<div class="item-row-social-info">
								<div class="item-social-avatar">
									<div  class="item-social-account">
										<div  class="item-social-account-media">
											<div  class="item-social-account-media-avatar">
												<img  :src="item.avatar" alt="">
											</div>
											<div  class="item-social-account-media-social item-social" :class="`social-${item.social_type}`"></div>
										</div>
										<div class="item-social-account-title">
											<div class="item-social-account-title-name">{{ item.name }}</div>
											<div class="item-social-account-title-status status-success">
												<sh-icon :icon="['far','check']" class="m-r-5" />
												Connected
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="item-row-social-type">
								<template v-if="item.social_type =='facebook'">
									Facebook Page
								</template>
								<template v-else-if="item.social_type =='twitter'">
									Twitter
								</template>
							</div>
						</div>
					</vue-simple>
				</div>
				<div class="list-items-register" >
					<vue-add-social-account :data="data" @on-twitter-error="onTwitterError"  @on-connect="onConnect" />
				</div>
				
				<a-modal  transitionName="none" maskTransitionName="none" :title="false" :footer="false" :destroyOnClose="true" :closable="false" width="500px" v-model="visible_error_twitter" >
					<div class="modal-twitter-connect-error p-t-40 p-b-40">
						<img src="@publish/assets/login/social-connect-error.png" alt="">
						<div class="error-title m-b-24">Cannot connect with Social account</div>
						<div class="error-description m-b-40">
							<p>Account(s) already connect to another Socialpublish account.</p>
							<p>Please try another account</p>
						</div>
						<div class="error-btn">
							<a-button type="primary" @click="visible_error_twitter = false">
								I got it
							</a-button>
						</div>
					</div>
				</a-modal>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import VueAddSocialAccount from  '@publish/modules/utils/components/vue-add-social-account'
export default {
	name : 'Register',
	components:{
		VueAddSocialAccount
	},
	metaInfo: {
		title: 'Register',
	},
	data(){
		return {
			data : [],
			is_loading : true,
			is_updating : false,
			visible_error_twitter: false,
		}
	},
	computed:{
		...mapGetters({
			chat_box_data : 'auth/getChatBoxData',
		}),
	},
	methods :{
		...mapActions({
			generalLinkSocial : 'account/general',
			getListSocial : 'account/list',
			checkPageSelected: "account/checkPageSelected",
			updateOnboarding : 'auth/updateOnboarding',
			checkAccountQuota : 'pricing/checkAccountQuota'
		}),
		...mapMutations({
			setRegister : 'auth/setRegister',
			setShowModalAccount : 'pricing/setShowModalAccount'
		}),
		onTwitterError(payload){
			if( payload ){
				this.visible_error_twitter = true
			}else{
				this.visible_error_twitter = false
			}
		},
		onConnect(){
			this.updateOnboarding({ type  : 'install_app'})
			this.setRegister(true)
			this.redirect({ name : 'Dashboard'})
		},
	},
	mounted(){
		// this.$intercom.init(this.intercom)
		this.checkAccountQuota().then(()=>{
			this.is_loading = false
		})
		.catch(()=>{
			this.is_loading = false
		})
	},
}
</script>
<style lang="scss" scoped>
	.auth-register-page{
		width: 480px;
		margin: 0 auto;
		.page-title{
			font-weight: 600;
			font-size: 24px;
			line-height: 30px;
			text-align: center;
		}
		.list-items-register{
			display: flex;
			align-items: center;
			justify-content: center;
			.item-register{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 126px;
				height: 126px;
				border: 1px solid $border-color;
				border-radius: 4px;
				background-color: #fff;
				margin: 0 16px;
				padding: 16px;
				cursor: pointer;
				position: relative;
				&-content{
					text-align: center;
				}
				&-overlay{
					position: absolute;
					z-index: 10;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: rgba(255,255,255,0.8);
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-icon{
					font-size: 40px;
					line-height: 46px;
					&.icon{
						&-twitter{
							color: #1DA1F2;
						}
						&-facebook{
							color: #4080FF;
						}
					}
				}
				&-text{
					color: #4F4F4F;
					font-weight: 600;
					font-size: 14px;
					line-height: 22px;
				}
				&:hover{
					&:not(.is-loading){
						border-color: $primary-color;
						background-color: rgba(24, 144, 255, 0.1);
					}
				}
			}
		}
		.list-items-social{
			max-height: 300px;
			overflow: hidden auto;
		}
		&-loading{
			height: 126px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn-get-start{
			height: 40px;
			max-width: 350px;
			margin: 0 auto;
		}
	}
	.item-row-social{
		padding: 5px 24px;
		border-bottom: 1px solid $border-color;
		background-color: #fff;
		cursor: pointer;
		user-select: none;
		&.is-disabled{
			opacity: 0.5;
		}
		&:hover{
			&:not(.is-disabled){
				background-color: #F3F3F3;
			}
		}
		&:first-child{
			border-top: 1px solid $border-color;
		}
		&:after{
			display: table;
			content :'';
			clear: both;
		}
		&-info{
			float: left;
			width: 75%;
			&-checkbox{
				&:after{
					display: table;
					content :'';
					clear: both;
				}
				.item-social-checkbox{
					width: 34px;
					float: left;
					height: 41px;
					display: flex;
					align-items: center;
				}
				.item-social-avatar{
					width: calc(100% - 34px);
					float: left;
					
				}
			}
			.item-social-account{
				min-height: 41px;
				.item-social-account-title{
					flex-wrap: wrap;
					&-name{
						width: 100%;
					}
					&-status{
						width: 100%;
						font-size: 12px;
						&.status-success{
							color: $success;
						}
						&.status-error{
							color: $danger;
						}
					}
				}
			}
			
		}
		&-type{
			float: left;
			width: 25%;
			line-height: 41px;
			font-size: 14px;
			text-align: right;
			text-transform: capitalize;
		}
	}
	.modal-twitter-connect-error{
		text-align: center;
		img{
			max-width: 100%;
		}
		.error{
			&-title{
				font-weight: 600;
				font-size: 20px;
				line-height: 24px;
			}
			&-description{
				p{
					font-weight: normal;
					font-size: 14px;
					line-height: 17px;
					margin-bottom: 4px;
				}
			}
			&-btn{
				.ant-btn{
					width: 280px;
				}
			}
		}
	}
</style>