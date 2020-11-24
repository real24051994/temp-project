<template>
<transition name="fade" mode="out-in">
    <div v-if="is_loading" key="is-loading" class="app-layout-loading">
        <a-spin>
			<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
		</a-spin>
    </div>
    <div v-else key="loaded" >
		<div class="app-layout" id="app-layout-master">
			<template v-if="loading_error">
				<div>
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
				<div class="app-layout-sidebar" >
					<app-sidebar :modules="sidebar.modules" :data="sidebar.data" ></app-sidebar>
				</div>
				<div class="app-layout-toolbar">
					<app-toolbar ></app-toolbar>
				</div>
				<div class="app-layout-container">
					<div class="app-layout-content">
						<transition name="fade-in" mode="out-in">
							<router-view />
						</transition>
					</div>
				</div>
				<app-onboarding-sidebar v-if="!sidebar_onboarding " />
			</template>
		</div>
		
    </div>
</transition>
</template>

<script>
import AppToolbar from "@/layouts/partials/toolbar";
import AppSidebar from "@/layouts/partials/sidebar.vue";
import AppOnboardingSidebar from "@widget/modules/auth/components/vue-onboarding-sidebar";
import {
    mapActions,
    mapMutations,
    mapGetters,
} from "vuex";
export default {
    name: "DefaultLayout",
    components: {
        AppToolbar,
        AppSidebar,
		AppOnboardingSidebar
    },
    metaInfo: {
        titleTemplate: "%s - Socialwidget"
    },
    data(){
		return {
			is_loading: true,
			is_loading_error: false,
			sidebar :{
				data : [
					{
						items: [
							{
								title : 'Gallery',
								route : 'Gallery',
								type : 'router-link',
								id : 'social-widget-sidebar-gallery',
								icon : 'image',
							},
							{
								title : 'Widget',
								route : 'Widget',
								type : 'router-link',
								id : 'social-widget-sidebar-widget',
								icon : 'widget',
							},
						],
					},
				],
				modules: {
					'Dashboard' : ['Dashboard'],
					'Gallery' : ['Gallery' , 'GalleryDetail'],
					'Widget' : ['Widget' ,'CreateWidget' , 'WigetDetail'],
					'Setting' : ['Setting'],
					'Account' : ['Account']
				},
			}
		}
	},
	computed:{
		...mapGetters({
			loading_error : 'getLoadingError',
			user : 'auth/getUser',
			sidebar_onboarding: "auth/getSidebarOnboarding",
			chat_box_token : 'auth/getChatBoxToken',
			chat_box_data : 'auth/getChatBoxData',
		})
	},
    methods: {
        ...mapActions({
			getUser : 'auth/getUser',
		}),
    },
    async mounted () {
		this.is_loading = false
		this.is_loading_error = false
		if (!this.is_loading_error) {
			if( this.user ){
				if( this.chat_box_data ){
					this.$crisp.init({
						token : this.chat_box_token,
						data : this.chat_box_data
					})
				}
			}
		}
	},
};
</script>
	