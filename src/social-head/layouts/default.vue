<template>
<transition name="fade" mode="out-in">
    <div v-if="is_loading" key="is-loading" class="app-layout-loading">
        <a-spin>
			<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
		</a-spin>
    </div>
    <div v-else key="loaded" >
		<div class="app-layout  app-layout-no-sidebar" id="app-layout-master">
			<template v-if="loading_error">
				<div>
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
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
        titleTemplate: "%s - Socialhead"
    },
    data(){
		return {
			is_loading: true,
			is_loading_error: false,
		}
	},
	computed:{
		...mapGetters({
			loading_error : 'getLoadingError',
			user : 'auth/getUser',
		})
	},
    async mounted () {
		this.is_loading = false
		this.is_loading_error = false
		if (!this.is_loading_error) {
			
		}
	},
};
</script>
	