<template>
	<div class="page-container autopilot-form" :class="{ 'page-container-collapse' : aside_collapse }" >
		<div class="page-container-aside autopilot-social">
			<vue-autopilot-loading-account />
		</div>
		<div class="page-container-content">
			<div class="page-container-wrapper autopilot-main p-t-30">
				<div class="autopilot-content">
					<vue-simple class="autopilot-scrollbar" ref="scrollbar">
						<div class="autopilot-scrollbar-content">
							<div class="form-group-content form-group-content-heading">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content" data-type="title">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content" data-type="template">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content" data-type="collection">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content"  data-type="discount" >
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content" data-type="schedule">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
							<div class="form-group-content" data-type="setting">
								<a-skeleton active :title="false" :paragraph="{ rows: 3 , width : '100%' }" />
							</div>
						</div>
					</vue-simple>
				</div>
			</div>
		</div>
		<div class="page-container-preview autopilot-preview">
			<vue-autopilot-loading-preview />
		</div>
	</div>
</template>
<script>
import VueAutopilotLoadingPreview from './vue-autopilot-loading-preview'
import VueAutopilotLoadingAccount from './vue-autopilot-loading-account'
import { mapGetters } from 'vuex'
export default {
	name : 'AutopilotLoadingPreview',
	components:{
		VueAutopilotLoadingPreview,
		VueAutopilotLoadingAccount
	},
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse'
		})
	}
}
</script>