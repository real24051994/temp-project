<template>
	<div :class="{ 'is-actived' : visible}" class="vue-pricing-table-item">
		<div @click="onClick" class="vue-pricing-table-item-header">
			<slot name="header"></slot>
		</div>
		<vue-slide-toggle :open="visible" class="vue-pricing-table-item-body">
			<div class="vue-pricing-table-item-collapse">
				<slot name="collapse"></slot>
			</div>
		</vue-slide-toggle>
	</div>
</template>
<script>
export default {
	name: "VuePricingTableItem",
	props: {
		collapse: {
			type: Boolean,
			default: true
		},
		value: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			id: this.$helper.createId()
		};
	},
	computed: {
		visible: {
			get() {
				return this.value == this.id;
			}
		}
	},
	methods: {
		onClick() {
			if (this.collapse) {
				if (this.value != this.id) {
					this.$emit("input", this.id);
				} else {
					this.$emit("input", "");
				}
			}
		}
	}
};
</script>
<style lang="scss">
.vue-pricing-table-item {
	background-color: #fff;
	margin-bottom: 1px;
	&:hover,
	&.is-actived {
		background-color: #f7f8fa;
	}
	&-header {
		padding: 0 15px;
		cursor: pointer;
		> .row {
			align-items: center;
			min-height: 48px;
		}
	}
	&-body {
		padding: 0 15px;
		font-size: 12px;
		color: #4f4f4f;
	}
	&-collapse {
		padding-bottom: 15px;
	}
}
</style>