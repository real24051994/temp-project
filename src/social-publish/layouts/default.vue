<template>
	<transition name="fade" mode="out-in">
		<div v-if="is_loading" key="is-loading" class="app-layout-loading">
			<a-spin>
				<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
			</a-spin>
		</div>
		<div v-else key="loaded">
			<div class="app-layout" id="app-layout-master" :class="{'app-layout-show-banner' : banner }">
				<template v-if="loading_error">
					<div>
						<vue-error type="500"></vue-error>
					</div>
				</template>
				<template v-else>
					<div class="app-layout-sidebar">
						<app-sidebar :modules="sidebar.modules" :data="sidebar.data" ></app-sidebar>
					</div>
					<div class="app-layout-toolbar">
						<app-toolbar>
							<template slot="toolbar-right">
								<vue-rate />
								<vue-pricing-toolbar-post-quota class="m-l-24" />
							</template>
							<template slot="toolbar-user">
								<vue-pricing-toolbar-dropdow-user />
							</template>
						</app-toolbar>
					</div>
					<div class="app-layout-container">
						<div class="app-layout-content">
							<transition name="fade-in" mode="out-in">
								<router-view />
							</transition>
						</div>
					</div>
					<app-onboarding-sidebar v-if="!sidebar_onboarding" />
					<module-post-modals />
					<module-pricing />
				</template>
			</div>
		</div>
	</transition>
</template>

<script>
import AppToolbar from "@/layouts/partials/toolbar";
import AppSidebar from "@/layouts/partials/sidebar.vue";
import AppFooter from "@/layouts/partials/footer.vue";
import AppOnboardingSidebar from "@publish/modules/auth/components/vue-onboarding-sidebar";
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
	name: "DefaultLayout",
	components: {
		AppToolbar,
		AppSidebar,
		AppFooter,
		AppOnboardingSidebar
	},
	metaInfo: {
        titleTemplate: '%s - Socialpublish',
    },
	data() {
		return {
			is_loading: true,
			is_loading_error: false,
			sidebar: {
				data: [
					{
						items: [
							{
								title: "Dashboard",
								route: "Dashboard",
								type: "router-link",
								id: "vue-sidebar-dashboard",
								icon: 'board'
							},
							{
								title: "Create Post",
								route: "",
								type: "button",
								id: "vue-sidebar-create-post",
								onClick: () => {
									this.dataLayer({
										"create-post-button": "From Menu"
									});
									this.$POST_Modals.showModalPost();
								},
								icon: 'post'
							},
							{
								title: "Posts Center",
								route: "ManagePost",
								type: "router-link",
								id: "vue-sidebar-manage-post",
								icon: 'post-center'
							},
							{
								title: "Calendar",
								route: "Calendar",
								type: "router-link",
								id: "vue-sidebar-calendar",
								icon: 'schedule'
							},
							{
								title: "Autopilot",
								route: "Autopilot",
								type: "router-link",
								id: "vue-sidebar-autopilot",
								icon: 'autopilot'
							},
							{
								title: "Manage Accounts",
								route: "ManageAccount",
								type: "router-link",
								id: "vue-sidebar-manage-account",
								icon: 'account-center'
							},
							{
								title: "General Settings",
								type: "router-link",
								route: "Setting",
								id: "vue-sidebar-general-settings",
								icon: 'setting'
							}
						]
					},
				],
				modules: {
					Dashboard: ["Dashboard"],
					ManagePost: ["ManagePost"],
					Autopilot: [
						"Autopilot",
						"CreateAutopilot",
						"UpdateAutopilot"
					],
					Calendar: ["Calendar"],
					AutoPilot: ["AutoPilot"],
					Product: ["Product"],
					Setting: ["Setting", "SettingTest"],
					ManageAccount: ["ManageAccount"]
				}
			}
		};
	},
	computed: {
		...mapGetters({
			loading_error: "getLoadingError",
			user: "auth/getUser",
			sidebar_onboarding: "auth/getSidebarOnboarding",
			aside_collapse : 'utils/getAsideCollapse',
			chat_box_token : 'auth/getChatBoxToken',
			chat_box_data : 'auth/getChatBoxData',
			banner: 'pricing/getShowBanner',
		}),
		
	},
	methods: {
		...mapActions({
			getUser: "auth/getUser",
			dataLayer: "auth/dataLayer",
			getShopSetting : "setting/get",
			plan : 'pricing/getUserPlan',
		}),
		...mapMutations({
			setAsideCollapse : 'utils/setAsideCollapse',
		}),
	},
	watch:{
		'aside_collapse' : function(){
			this.$nextTick(() => window.dispatchEvent(new Event('resize')))
		},
		'banner' : function(){
			this.$nextTick(() => window.dispatchEvent(new Event('resize')))
		},
	},
	async mounted(){
		try {
			await this.getShopSetting()
		} catch (e) {
			
		} 
		this.is_loading = false;
		this.is_loading_error = false;
		if (!this.is_loading_error) {
			if( this.user ){
				if( this.chat_box_data ){
					this.$crisp.init({
						token : this.chat_box_token,
						data : this.chat_box_data,
					})
				}
				this.$userpilot.init({ app_id : '32sm45e10' }).then(()=>{
					this.$userpilot.register({
						id : `sp_${this.user.shop.id}` ,
						data :{
							app_name : 'Socialpublish',
							name : this.user.shop.name,
							email : this.user.shop.email,
							created_at : this.user.shop.created_at
						}
					})
					this.$watch('$route',()=>{
						this.$userpilot.reload()
					})
				})
				this.dataLayer({
					userId: this.user ? this.user.id : 'unknown',
					plan_name : this.plan ? this.plan.id : 'unknown',
				});
			}
		}
	},
	beforeDestroy(){
		this.$userpilot.anonymous()
	}
};
</script>
<style lang="scss">
	$app-banner-height : 49px;
	.app-layout{
		&-banner{
			position: fixed;
			z-index: 501;
			right: 0;
			top: $app-toolbar-height;
			background: #fff;
			left: $app-sidebar-width;
			height: $app-banner-height;
			overflow: hidden;
			padding: 11px 15px 0;
		}
		&-container{
			transition:  none ;
		}
		&.app-layout-show-banner{
			.app-layout-container{
				padding-top: #{$app-toolbar-height +  $app-banner-height};
				.page-container-aside{
					top: #{$app-toolbar-height +  $app-banner-height};
				}
			}
			.app-layout-content{
				min-height: calc(100vh - #{$app-toolbar-height +  $app-banner-height});
			}
		}
		&-toolbar{
			// rgba(61, 90, 153, 0.2)
			.vue-pricing-toolbar-post-quota{
				color: #ffffff;
				.vue-pricing-progress{
					.vue-pricing-progress-bar-inner{
						background-color: rgba(61, 90, 153, 0.2);
					}
					.vue-pricing-progress-bar{
						.vue-pricing-progress-bar-active{
							background: #FFFFFF !important;
						}
					}
				}
			}
			
		}
	}
</style>