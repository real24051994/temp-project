<template>
	<div class="vue-pricing-post-popover" v-clickaway="clickaway">
		<div class="vue-pricing-post-popover-content">
			<div class="vue-pricing-post-popover-arrow"></div>
			<div class="vue-pricing-post-popover-title">
				<h5>Your have reach the limit post numer of this month</h5>
			</div>
			<template v-if="is_loading">
				<a-skeleton :paragraph="{ rows: 2 , width : '100%' }" :title="false" active />
			</template>
			<template v-else>
				<vue-pricing-progress-bar :quota="quota" type="post" />
			</template>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
	name: "VuePricingPostPopover",
	props: {
		value: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			is_loading: true
		};
	},
	computed: {
		...mapGetters({
			quota: "pricing/getPostQuota"
		})
	},
	methods: {
		...mapActions({
			checkPostQuota: "pricing/checkPostQuota"
		}),
		clickaway() {
			this.$emit("input", false);
		}
	},
	mounted() {
		this.checkPostQuota()
			.then(() => {
				this.is_loading = false;
			})
			.catch(() => {
				this.is_loading = false;
			});
	}
};
</script>
<style lang="scss">
.vue-pricing-post-popover {
	position: absolute;
	bottom: 100%;
	left: 50%;
	z-index: 111;
	width: 300px;
	transform: translate(-50%, -15px);

	&-arrow {
		position: absolute;
		display: block;
		width: 10px;
		height: 10px;
		background: 0 0;
		border-style: solid;
		border-width: 5px;
		bottom: -5px;
		border-top-color: #fff;
		border-right-color: transparent;
		border-bottom-color: transparent;
		border-left-color: #fff;
		box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
		transform: translateX(-50%) rotate(-135deg);
		left: 50%;
	}
	&-content {
		padding: 16px 24px;
		position: relative;
		box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
			0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
		background: #ffffff;
		border-radius: 4px;
		text-align: center;
	}
	&-title {
		display: flex;
		width: 100%;
		justify-content: center;
		h5 {
			font-weight: normal;
			font-size: 14px;
			line-height: 22px;
			margin-bottom: 8px;
			max-width: 200px;
		}
	}
	&-btn {
		margin-bottom: 8px;
	}
	&-more {
		a {
			font-weight: normal;
			font-size: 14px;
			line-height: 17px;
			color: #828282;
			&:hover {
				color: $primary-color;
			}
		}
	}
}
</style>