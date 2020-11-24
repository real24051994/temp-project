<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<div v-if="is_loading" key="is-loading" class="app-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div v-else key="is-loading-success">
				<div v-if="is_loading_error" class="app-error">
					<vue-error type="500"></vue-error>
				</div>
				<template v-else>
					<vue-extend-layouts />
					<vue-modal-confirm-dialog />
				</template>
			</div>
		</transition>
	</div>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from 'vuex'
	export default {
		name: 'App',
		computed: {
			...mapGetters({
				is_loading : 'getLoading',
				is_loading_error : 'getLoadingError',
				app_name : 'getAppName'
			}),
		},
		created(){
			if (window.navigator && navigator.serviceWorker) {
				navigator.serviceWorker.getRegistrations()
				.then(function (registrations) {
					for (let registration of registrations) {
						registration.unregister();
					}
				});
			}
		}
	}
</script>
<style lang="scss" >
	.app-loading ,.app-error{
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffff;
	}
	
	.app-layout{
		position: relative;
		min-width: 1200px;
		&.app-layout-no-sidebar{
			.app-layout-container{
				padding:  $app-toolbar-height 0 0 0;
			}
		}
		&-collapse{
			position: fixed;
			z-index: 503;
			top: $app-toolbar-height;
			left: $app-sidebar-width;
			transform: translate(-50% , 10px);
			transition:  all 0.2s ease;
		}
		&-sidebar{
			position: fixed;
			z-index: 502;
			left: 0;
			top: $app-toolbar-height;
			bottom: 0;
			width: $app-sidebar-width;
			background: $app-sidebar-bg;
			overflow: hidden auto;
			transition:  width 0.2s ease;
			border-right: 1px solid $app-sidebar-border;
		}
		&-toolbar{
			position: fixed;
			z-index: 501;
			right: 0;
			top: 0;
			background: $app-toolbar-bg;
			left: 0;
			height: $app-toolbar-height;
			overflow: auto;
		}
		&-container{
			padding:  $app-toolbar-height 0 0 $app-sidebar-width;
			transition:  all 0.2s ease;
		}
		&-content{
			min-height: $app-content-height;
			position: relative;
		
		}
		&-footer{
			border-top: 1px solid $border-color;
			background: #fff;
			height: $app-footer-height;
		}
		.ant-layout-content{
			padding: 15px;
			margin-left: 280px;
			margin-top: 72px;
			min-height: calc(100vh -  #{$app-toolbar-height})
		}
	}
	.app-layout-loading{
		height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
