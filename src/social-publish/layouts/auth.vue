<template>
	<div class="app-auth-layout">
		<div class="app-auth-layout-sidebar">
			<div class="app-auth-layout-sidebar-bg bg-top-left">
				<img src="@publish/assets/login/top-left.png" alt="">
			</div>
			<div class="app-auth-layout-sidebar-bg bg-top-right">
				<img src="@publish/assets/login/top-right.png" alt="">
			</div>
			<div class="app-auth-layout-sidebar-bg bg-bottom-left">
				<img src="@publish/assets/login/bottom-left.png" alt="">
			</div>
			<div class="app-auth-layout-sidebar-content">
				<div class="app-auth-layout-sidebar-logo">
					<img src="@publish/assets/login/logo.svg" svg-inline alt="">
				</div>
				<div class="app-auth-layout-sidebar-slider">
					<carousel :autoplay="true" :autoplayTimeout="3000" :loop="true" :autoplayHoverPause="true" :perPage="1" >
					    <slide>
					        <div class="item-slide">
								<div class="item-slide-img">
									<img src="@publish/assets/login/slide/1.png" alt="">
								</div>
								<div class="item-slide-title">
									Save your time first
								</div>
								<div class="item-slide-description">
									Don't waste your time to manually publish a post on multi social media accounts. Take your rest and we will take care of your scheduled post
								</div>
							</div>
					    </slide>
					    <slide>
					        <div class="item-slide">
								<div class="item-slide-img">
									<img src="@publish/assets/login/slide/2.png" alt="">
								</div>
								<div class="item-slide-title">
									Fully under your control
								</div>
								<div class="item-slide-description">
									How is your post's performance? Preview our post detail with amazing statistics.
								</div>
							</div>
					    </slide>
						<slide>
					        <div class="item-slide">
								<div class="item-slide-img">
									<img src="@publish/assets/login/slide/3.png" alt="">
								</div>
								<div class="item-slide-title">
									More reaches with Autopilot
								</div>
								<div class="item-slide-description">
									You can improve your social media presence by using Autopilot to showcase more products and contents to your followers on a daily basis.

								</div>
							</div>
					    </slide>
					</carousel>
				</div>
			</div>
		</div>
		<div class="app-auth-layout-content">
			<div class="app-auth-layout-content-body">
				<transition name="fade-in" mode="out-in">
					<router-view />
				</transition>
			</div>
			<div class="app-auth-layout-content-footer">
				<a target="_blank" href="https://socialhead.io/term-of-use/">{{ $t('auth.link.term') }}</a>
				<a target="_blank" href="https://socialhead.io/privacy-policy/">{{ $t('auth.link.policy') }}</a>
			</div>
		</div>
		<vue-pricing-modal-account v-model="modal_pricing_account"  />
	</div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
import { mapGetters , mapActions, mapMutations} from 'vuex';
export default {
	name: 'auth',
	components:{
		Carousel, Slide
	},
    metaInfo: {
        titleTemplate: '%s - Socialpublish',
    },
	computed:{
		...mapGetters({
			'user' : 'auth/getShop',
			getShowModalAccount : 'pricing/getShowModalAccount'
		}),
		modal_pricing_account:{
			get(){
				return this.getShowModalAccount
			},
			set(value){
				this.setShowModalAccount(value)
			}
		}
	},
	methods : {
		...mapActions({
			'logout' : 'auth/logout'
		}),
		...mapMutations({
			setShowModalAccount : 'pricing/setShowModalAccount'
		}),
		handleLogout(){
			this.logout()
		}
	},
	mounted(){
		this.$crisp.init({})
	}
}
</script>

<style lang="scss" >
	.app-auth-layout{
		width: 100%;
		background-color: #fff;
		&-sidebar{
			position: fixed;
			left : 0;
			top: 0;
			bottom: 0;
			width: 33.33%;
			background: $primary-color;
			overflow: hidden;
			z-index: 999;
			&-bg{
				position: absolute;
				z-index: 1;
				user-select: none;
				pointer-events: none;
				img{
					width: 100%;
					height: auto;
				}
				&.bg{
					&-top-left{
						width: 40%;
						top: 0;
						left: 0;
					}
					&-top-right{
						width: 40%;
						top: 0;
						right: 0;
					}
					&-bottom-left{
						width: 70%;
						bottom: 0;
						left: 0;
					}
				}
			}
			&-content{
				position: relative;
				z-index: 2;
				height: 100%;
				width: 100%;
				padding: 72px;
				overflow: hidden auto;
			}
			&-logo{
				text-align: center;
			}
			&-slider{
				margin-top: 100px;
				.item-slide{
					color: #fff;
					text-align: center;
					&-img{
						margin-bottom: 22px;
						img{
							max-width: 100%;
							height: auto;
						}
					}
					&-title{
						font-weight: 600;
						font-size: 24px;
						margin-bottom: 22px;
					}
					&-description{
						font-weight: normal;
						font-size: 14px;
						line-height: 17px;
					}
				}
				.VueCarousel-pagination{
					.VueCarousel-dot-container{
						.VueCarousel-dot{
							opacity: 0.3;
							border: none;
							width: 8px !important;
							height: 8px !important;
							padding: 0 !important;
							background: #fff !important;
							box-sizing: border-box;
							margin: 20px 10px 0 10px;
							&:focus{
								outline: none;
							}
							&.VueCarousel-dot--active{
								background: #fff !important;
								opacity: 1;
							}
						}
					}
				}
			}
		}
		&-content{
			padding-left: 33.33%;
			padding-bottom: 60px;
			min-height: 100vh;
			display: flex;
			align-items: center;
			&-user{
				position: fixed;
				top: 0px;
				right: 0px;
				z-index: 999;
				display: inline-block;
				background: #fff;
				color: #252627;
				font-size: 14px;
				&-menu{
					li{
						font-size: 14px;
						display: flex;
						align-items: center;
						min-height: 36px;
						* {
							pointer-events: none;
						}
						i{
							font-size: 16px;
						}
						span{
							margin-left: 10px;
						}
					}
				}
				.btn{
					&-trigger{
						border: none;
						color: $text;
						height: 72px;
						display: flex;
						align-items: center;
						overflow: hidden;
						box-shadow: none;
						&.ant-dropdown-open,&:hover{
							background: #e6f7ff;
						}
					}
					&-avatar{
						width: 32px;
						height: 32px;
						margin: 0 10px;
						border: 2px solid $primary-color;
						border-radius: 50%;
						overflow: hidden;
						font-size: 20px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: 600;
						img{
							width: 100%;
						}
					}
					&-text{
						font-style: normal;
						font-weight: 600;
						font-size: 14px;
						line-height: 24px;
						text-align: right;
						.user{
							&-name{
								font-style: normal;
								font-weight: 600;
								font-size: 14px;
								line-height: 19px;
								letter-spacing: 0.035em;
								color: #252627;
								max-width: 160px;
								overflow: hidden;
								white-space: nowrap;
								display: block;
								text-overflow: ellipsis;
							}
							&-email{
								font-style: normal;
								font-weight: normal;
								font-size: 14px;
								line-height: 19px;
								letter-spacing: 0.035em;
								color: #8C8C8C;
								max-width: 160px;
								overflow: hidden;
								white-space: nowrap;
								display: block;
								text-overflow: ellipsis;
							}
						}
					}
					&-icon{
						font-size: 16px;
						line-height: 16px;
						color: #252627;
					}
				}
			}
			&-body{
				width: 100%;
			}
			&-footer{
				left: 33.33%;
				bottom: 0;
				right: 0;
				height: 60px;
				position: fixed;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				a{
					display: inline-block;
					color: $text;
					margin: 0 13px;
					font-size: 12px;
					&:hover{
						color : $primary-color;
					}
				}
			}
		}
		.page{
			&-title{
				font-weight: 600;
				font-size: 22px;
				line-height: 26px;
				text-align: center;
				text-transform: uppercase;
				letter-spacing: 0.125em;
			}
			&-description{
				font-weight: normal;
				font-size: 14px;
				line-height: 17px;
			}
		}
	}
</style>