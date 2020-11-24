<template>
	<div class="vue-social-widget">
		<transition name="fade-in" mode="out-in">
			<div class="app-box-loading" v-if="is_loading_page" key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div class="vue-social-widget-container" v-else key="is-loading-success">
				<template v-if="is_loading_error">
					<div class="vue-social-widget-error" >
						500
					</div>
				</template>
				<template v-else>
					<div class="container p-b-50 p-t-50">
						<div class="row">
							<div class="col col-12">
								<h1 class="page-title">
									General Setting
								</h1>
							</div>
						</div>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
export default {
	name : 'Setting',
	components:{

	},
	metaInfo(){
		return {
			title: 'Settings'
		}
	},
	data(){
		return {
			is_loading : false,
			is_loading_page: true,
			is_loading_error : false,
		}
	},
	mounted(){
		this.is_loading_page = false
	}
}
</script>
<style lang="scss" scoped>
	
</style>