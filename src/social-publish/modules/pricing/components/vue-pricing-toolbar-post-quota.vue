<template>
	<div class="vue-pricing-toolbar-post-quota" v-if="!is_loading_error">
		<template v-if="is_loading">
			<a-skeleton :paragraph="{ rows: 2 , width : '100%' }" :title="false" active />
		</template>
		<template v-else>
			<template v-if="plan.id =='custom'">
				<vue-pricing-progress-bar :quota="postQuota" background-color="#ffffff" type="post" />
			</template>
			<template v-else>
				<a-popover :title="false" :trigger="['click']" placement="bottom" v-model="visible">
					<template slot="content">
						<div class="vue-pricing-toolbar-post-quota-popover">
							<h5>Upgrade plan to get more post per month</h5>
							<a-button @click="onClick" class="btn-track-event btn-event-pricing" data-position="toolbar" data-status="start-trial" type="primary" v-if="trial">Start Free Trial</a-button>
							<a-button @click="onClick" class="btn-track-event btn-event-pricing" data-position="toolbar" data-status="upgrade" type="primary" v-else>Upgrade Plan</a-button>
						</div>
					</template>
					<slot>
						<vue-pricing-progress-bar :quota="postQuota" background-color="transparent" type="post" />
					</slot>
				</a-popover>
			</template>
		</template>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
	name: "VuePricingPostQuota",
	data() {
		return {
			is_loading: true,
			is_loading_error: false,
			visible: false
		};
	},
	computed: {
		...mapGetters({
			postQuota: "pricing/getPostQuota",
			trial: "pricing/getTrial",
			plan : 'pricing/getUserPlan',
		})
	},
	methods: {
		...mapActions({
			checkPostQuata: "pricing/checkPostQuota"
		}),
		onClick() {
			this.redirect({
				name: "Pricing"
			});
			this.visible = false;
		}
	},
	mounted() {
		this.checkPostQuata()
			.then(() => {
				this.is_loading = false;
			})
			.catch(() => {
				this.is_loading = false;
				this.is_loading_error = true;
			});
	}
};
</script>

<style lang="scss">
.vue-pricing-toolbar-post-quota {
	cursor: pointer;
	min-width: 210px;
	display: block;
	.ant-skeleton-content {
		.ant-skeleton-paragraph {
			margin: 0;
			padding-top: 4px;
			padding-right: 8px;
			> li + li{
				margin-top: 8px;
			}
		}
	}
	&-popover {
		text-align: center;
		h5 {
			font-weight: normal;
			font-size: 14px;
			line-height: 22px;
			margin-bottom: 8px;
		}
		.ant-btn {
			min-width: 210px;
		}
	}
}
</style>