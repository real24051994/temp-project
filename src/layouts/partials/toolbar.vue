<template>
  	<div class="app-toolbar">
		<div class="app-toolbar-brands">
			<div class="app-toolbar-brands-main">
				<a href="/">
					<img svg-inline src="@/assets/logo/socialhead.svg" alt="socialhead.svg" />
				</a>
			</div>
			<div class="app-toolbar-brands-apps">
				<template v-for="item in apps">
					<template v-if="item.id == app_name">
						<router-link :key="item.id" to="/" class="item-social-app is-active">
							<span class="item-social-app-content">
								<span class="item-social-app-icon" v-html="require(`!html-loader!@/assets/logo/${item.id}.svg`)"></span>
								<span class="item-social-app-text">{{ item.name }}</span>
							</span>
						</router-link>
					</template>
					<template v-else>
						<a :key="item.id" :href="item.href" class="item-social-app">
							<span class="item-social-app-content">
								<span class="item-social-app-icon" v-html="require(`!html-loader!@/assets/logo/${item.id}.svg`)"></span>
								<span class="item-social-app-text">{{ item.name }}</span>
							</span>
						</a>
					</template>
					
				</template>
			</div>
		</div>
		<div class="spacer"></div>
		<slot name="toolbar-right"></slot>
		<div class="app-toolbar-user" v-if="user && avatar">
			<a-button class="btn-trigger" @click="visible = true">
				<a-avatar class="btn-trigger-avatar" :style="{ backgroundColor : avatar.backgroundColor }">
					{{ avatar.name }}
				</a-avatar>
				<span class="btn-trigger-icon">
					<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-chevron-down fa-w-14"><path fill="currentColor" d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z" class=""></path></svg>
				</span>
			</a-button>
			<a-drawer :visible="visible" @close="visible = false" width="360px" :destroyOnClose="true" :title="false" wrapClassName="app-toolbar-user-drawer">
				<vue-simple class="app-toolbar-user-drawer-scrollbar">
					<div class="app-toolbar-user-drawer-wrapper">
						<div class="app-toolbar-user-drawer-header">
							<div class="user-info">
								<div class="user-info-avatar">
									{{ user.name | shop_avatar}}
								</div>
								<div class="user-info-domain">
									{{ user.domain }}
								</div>
								<div class="user-info-email">
									{{ user.email }}
								</div>
							</div>
							<ul class="user-info-actions">
								<li>
									<a href="#" @click="handleGoToStore">
										<i>
											<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="store" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 616 512" class="svg-inline--fa fa-store fa-w-20"><path fill="currentColor" d="M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-29.6 47.2-10 110.6 38 130.8v227.4c0 19.4 14.3 35.2 32 35.2h448c17.7 0 32-15.8 32-35.2V249.4c48-20.2 67.6-83.6 38-130.8zM516 464H100v-96h416zm-.2-144.2H100v-64.7c24-3.3 45.1-15.2 60.3-32.2 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 15.3 17 36.3 28.9 60.3 32.2zm47.9-133c-3.2 6.8-10.9 18.6-27 20.8-2.4.3-4.8.5-7.2.5-14.7 0-28.2-6.1-38.1-17.2L455.7 151 420 190.8c-9.9 11.1-23.5 17.2-38.1 17.2s-28.2-6.1-38.1-17.2L308 151l-35.7 39.8c-9.9 11.1-23.5 17.2-38.1 17.2-14.7 0-28.2-6.1-38.1-17.2L160.3 151l-35.7 39.8c-9.9 11.1-23.5 17.2-38.1 17.2-2.5 0-4.9-.2-7.2-.5-16-2.2-23.8-13.9-27-20.8-5-10.8-7.1-27.6 2.3-42.6L114.8 48h386.3l60.2 96.1c9.5 15.1 7.5 31.9 2.4 42.7z" class=""></path></svg>
										</i>
										<span>Go to store</span>
									</a>
								</li>
								<li>
									<a href="#" @click="handleLogout" id="btn-logout">
										<i>
											<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="sign-out-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-sign-out-alt fa-w-16"><path fill="currentColor" d="M272 112v51.6h-96c-26.5 0-48 21.5-48 48v88.6c0 26.5 21.5 48 48 48h96v51.6c0 42.6 51.7 64.2 81.9 33.9l144-143.9c18.7-18.7 18.7-49.1 0-67.9l-144-144C323.8 48 272 69.3 272 112zm192 144L320 400v-99.7H176v-88.6h144V112l144 144zM96 64h84c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H96c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h84c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H96c-53 0-96-43-96-96V160c0-53 43-96 96-96z" class=""></path></svg>
										</i>
										<span>Logout</span>
									</a>
								</li>
							</ul>
						</div>
						<div class="app-toolbar-user-drawer-body">
							<div class="app-toolbar-user-drawer-body-scrollbar">
								<slot name="toolbar-user"></slot>
							</div>
						</div>
						<div class="app-toolbar-user-drawer-footer">
							<a target="_blank" href="https://socialhead.io/terms-of-use/">Term of use</a>
							• <a target="_blank" href="https://socialhead.io/privacy-policy/">Privacy policy</a>
						</div>
					</div>
				</vue-simple>
			</a-drawer>
		</div>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSignOutAlt } from "@fortawesome/pro-regular-svg-icons";
export default {
	name : 'Toolbar',
	components:{
		FontAwesomeIcon
	},
	data(){
		return{
			colors : ['#F2545D', '#CC474E', '#B32D34', '#35B26F', '#2E9960', '#268050', '#F2CE54','#CCAE47','#B3983E'],
			apps: [
				{
					id: 'publish',
					name : 'socialpublish',
					href : '/socialpublish'
				},
				{
					id: 'reply',
					name : 'socialreply',
					href : '/socialreply'
				},
				{
					id: 'widget',
					name : 'socialwidget',
					href : '/socialwidget'
				},
				{
					id: 'shop',
					name : 'socialshop',
					href : '/socialshop'
				},
			]
		}
	},
	computed:{
		...mapGetters({
			'user' : 'auth/getShop',
			'show_user_info' : 'getShowUserInfo',
			'app_name' : 'getAppName'
		}),
		visible :{
			get(){
				return this.show_user_info 
			},
			set(value){
				this.setShowUserInfo(value)
			}
		},
		avatar(){
			let chars = ''
			if (this.user && this.user.name ) {
				this.user.name.split(' ').filter(Boolean).forEach(function(item) {
					if (chars.length < 2) {
					chars += item[0].toUpperCase()
					}
				})
			}
			return {
				name : chars,
				backgroundColor : this.colors[this.getNumberFromText(chars) % this.colors.length]
			}
		}
	},
	methods:{
		...mapActions({
			'logout' : 'auth/logout'
		}),
		...mapMutations({
			'setShowUserInfo' : 'setShowUserInfo',
		}),
		handleLogout(){
			this.logout()
			if( typeof this.$crisp != 'undefined'){
				this.$crisp.reset()
			}
		},
		handleGoToStore(){
			window.open(`https://${this.user.domain}` , '_blank')
		},
		getNumberFromText(text) {
			const charCodes = text.split('').map(char => char.charCodeAt(0)).join('')
			return parseInt(charCodes, 10);
		}
	}
}
</script>
<style lang="scss">
	.app-toolbar{
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		z-index: 0;
		overflow: hidden;
		&-brands{
			display: flex;
			flex-wrap: nowrap;
			height: 100%;
			&-main{
				width: $app-sidebar-width;
				display: flex;
				align-items: center;
				justify-content: center;
				a{
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			&-apps{
				display: flex;
				align-items: center;
				padding-top: 8px;
				.item-social-app{
					padding: 0 4px;
					overflow: hidden;
					&-content{
						border-top-left-radius: 8px;
						border-top-right-radius: 8px;
						position: relative;
						background-color: transparent;
						text-align: center;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						height: 40px;
						min-width: 145px;
						color: #fff;
						padding: 0 10px;
						&::before ,&::after{
							content : '';
							position: absolute;
							width: 8px;
							height: 6px;
							bottom: 0;
							z-index: 1;
							opacity: 0;
						}
						&::before{
							right: 100%;
							background-image: url('~@/assets/icons/border-left.svg');
						}
						&::after{
							left: 100%;
							background-image: url('~@/assets/icons/border-right.svg');
						}
					}
					&-icon{

					}
					&-text{
						font-family: Montserrat;
						font-style: normal;
						font-weight: 500;
						font-size: 14px;
						line-height: 20px;
						// margin-left: 8px;
						padding-bottom: 6px;
					}
					&.is-active,&:hover{
						.item-social-app{
							&-content{
								background-color: #fff;
								color: $app-toolbar-active;
								&::before ,&::after{
									opacity: 1;
								}
							}
						}
						
					}
					
				}
			}
		}
		&-user{
			padding: 0;
			position: relative;
			&-btn{
				border-right: 1px solid $border-color;
				overflow: hidden;
			}
			&-drawer{
				&-wrapper{
					height: 100vh;
					position: relative;
					background: #fff;
				}
				&-scrollbar{
					height: 100%;
					position: relative;
					overflow: hidden auto;
				}
				&-header{
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					height: 210px;
					z-index: 2;
					border-bottom: 1px solid $border-color;
					background-color: #ffffff;
					.user-info{
						padding: 24px 16px;
						text-align: center;
						&-avatar{
							width: 60px;
							height: 60px;
							border-radius: 50%;
							background-color: $primary-color;
							color: #fff;
							font-weight: 500;
							font-size: 30px;
							line-height: 36px;
							display: inline-flex;
							justify-content: center;
							align-items: center;
							margin-bottom: 16px;
						}
						&-domain{
							font-weight: 500;
							font-size: 16px;
							line-height: 19px;
							color: $text;
							display: block;
							margin-bottom: 8px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						&-email{
							font-weight: normal;
							font-size: 14px;
							line-height: 17px;
							color: #828282;
							display: block;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						&-actions{
							padding: 0;
							list-style-type: none;
							margin: 0;
							padding: 0;
							li{
								display: block;
								width: 50%;
								float: left;
								a{
									display: block;
									text-align: center;
									color: $text;
									padding: 10px 5px;
									font-weight: 14px;
									i{
										margin-right: 10px;
									}
									&:hover{
										color:$primary-color;
									}
									&:nth-child(2n+1){
										border-right: 1px solid $border-color;
									}
								}
							}
							&:after{
								@include clear;
							}
						}
					}
				}
				&-body{
					padding: 210px 0 40px 0;	
					height: 100%;
					background-color: #F8F8F8;
					position: relative;
					background-color: #F8F8F8;
					&-scrollbar{
						height: 100%;
						overflow: hidden auto;
					}
				}
				&-footer{
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 40px;
					z-index: 2;
					display: flex;
					align-items: center;
					padding: 0 16px;
					border-top: 1px solid $border-color;
					background-color: #ffffff;
					a{
						color: $text;
						margin-right: 8px;
						&:last-child{
							margin-right: 0;
						}
						&:hover{
							color: $primary-color;
						}
					}
				}
				.ant-drawer-body{
					padding: 0;
					height: 100%;
					overflow: hidden;
					position: relative;
				}
				.btn-close{
					position: absolute;
					top: 5px;
					right: 5px;
					z-index: 1;
					color: #CECECE;
					border: none;
					&:hover,&:focus{
						outline: none;
						box-shadow: none;
					}
					&:hover{
						color: $text;
					}
				}
			}
			.btn{
				&-trigger{
					border: none;
					color: #CECECE;
					height: $app-toolbar-height;
					display: flex;
					align-items: center;
					overflow: hidden;
					background-color: transparent;
					&.ant-dropdown-open,&:hover{
						background-color: transparent;
					}
					&-icon{
						font-size: 16px;
						line-height: 16px;
						margin-left: 16px;
					}
					&-avatar{
						width: 36px;
						height: 36px;
						margin: 0 0 0 10px;
						border: 1px solid rgba(255,255,255,0.5);
						background-color: #fff;
						border-radius: 50%;
						overflow: hidden;
						font-size: 14px;
						color: #fff;
						font-weight: 500;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						img{
							width: 100%;
						}
					}
				}
				&-text{
					font-style: normal;
					font-weight: 500;
					font-size: 14px;
					line-height: 24px;
					text-align: right;
					.user{
						&-name{
							font-style: normal;
							font-weight: 500;
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
				
			}
		}
		
	}
	@media (max-width: $app-toolbar-breakpoint ){
		.app-toolbar{
			&-brands{
				&-apps{
					.item-social-app{
						&-content{
							min-width: 60px;
						}
						&-text{
							display: none;
						}
						&.is-active{
							.item-social-app{
								&-content{
									min-width: 200px;
								}
								&-text{
									display: block;
								}
							}
							
						}
						
					}
				}
			}
		}
	}
</style>