<template>
	<div class="vue-onboarding-sidebar-container" ref="container">
		<div class="vue-onboarding-sidebar-wrapper">
			<div class="vue-onboarding-sidebar-content">
				<div class="vue-onboarding-sidebar-icon" v-if="data.icon" :style="data.iconStyle">
					<img :src="data.icon" alt />
				</div>
				<div class="vue-onboarding-sidebar-title">{{ data.title }}</div>
				<div class="vue-onboarding-sidebar-message">{{ data.content }}</div>
				<div class="vue-onboarding-sidebar-footer" v-if="data.btn">
					<div class="vue-onboarding-sidebar-btn">
						<a-button  :type="data.btnClass" @click="data.eventClick">
							<span>{{ data.btn }}</span>
						</a-button>
					</div>
					<div class="vue-onboarding-sidebar-step">Step {{ current + 1 }} / {{ total }}</div>
				</div>
			</div>
		</div>
		<div class="vue-onboarding-sidebar-arrow" ref="arrow"></div>
	</div>
</template>
<script>
import { createPopper } from '@popperjs/core';
export default {
	name  : 'VueOnboardingSidebarItem',
	props: {
		data :{
			type : Object,
		},
		current :{
			type : Number,
		},
		total : {
			type : Number,
		}
	},
	data(){
		return {
			popper : null
		}
	},
	mounted(){
		const reference = document.querySelector(this.data.id);
		const popper = this.$refs.container
		const arrow = this.$refs.arrow
		this.popper = createPopper(reference, popper, {
			placement: 'right',
			modifiers: [
				{
					name: 'arrow',
					options: {
						element: arrow,
					},
				},
			],
		});
	},
	beforeDestroy(){
		this.popper.destroy()
	}
}
</script>