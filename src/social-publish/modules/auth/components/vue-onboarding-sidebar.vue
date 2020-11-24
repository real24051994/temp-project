<template>
	<div class="vue-onboarding-sidebar">
		<transition name="fade-in" mode="out-in">
			<div class="vue-onboarding-sidebar-mask" v-if="show_mask"></div>
		</transition>
		<transition name="fade-in" mode="out-in">
			<vue-onboarding-sidebar-item v-if="visible" :data="current_step" :current="step" :total="data.length" />
		</transition>
			
	</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

import VueOnboardingSidebarItem from './vue-onboarding-sidebar-item'
export default {
	name: "VueSidebarOnboarding",
	components:{
		VueOnboardingSidebarItem
	},
	data() {
		return {
			clone_style: {},
			container_style: {},
			show_complete: false,
			images: [
				require("../assets/onboarding/step-0.png"),
				require("../assets/onboarding/step-2.png"),
				require("../assets/onboarding/step-3.png"),
				require("../assets/onboarding/step-4.png")
			],
			step: 0,
			visible: false,
			show_mask: false,
			data: [
				{
					id: "#vue-sidebar-create-post",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "Create a post",
					content:
						"Compose and schedule a post that matches your social media presence",
					icon: require("../assets/onboarding/1.png"),
					iconStyle: {
						height : "110px"
					},
					btn: "Next",
					btnClass: "primary",
					eventClick: event => {
						this.changeStep(1)
					}
				},
				{
					id: "#vue-sidebar-manage-post",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "Posts Center",
					content:
						"Manage all your posts in one place with detailed status and performance",
					caretType: "left",
					caretStyle: {
						top: "20px"
					},
					icon: require("../assets/onboarding/2.png"),
					iconStyle: {
						height : "101px"
					},
					btn: "Next",
					btnClass: "primary",
					eventClick: event => {
						this.changeStep(2)
					}
				},
				{
					id: "#vue-sidebar-autopilot",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "Autopilot",
					content:
						"Create different content for all products and have them published automatically",
					caretType: "left",
					caretStyle: {
						top: "20px"
					},
					icon: require("../assets/onboarding/3.png"),
					iconStyle: {
						height : "113px"
					},
					btn: "Next",
					btnClass: "primary",
					eventClick: event => {
						this.changeStep(3)
					}
				},
				{
					id: "#vue-sidebar-manage-account",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "Manage account",
					content:
						"Start growing your audience with Socialpublish",
					caretType: "left",
					caretStyle: {
						top: "20px"
					},
					icon: require("../assets/onboarding/4.png"),
					iconStyle: {
						height : "110px"
					},
					btn: "Next",
					btnClass: "primary",
					eventClick: event => {
						this.changeStep(4)
					}
				},
				{
					id: "#vue-sidebar-general-settings",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "General settings",
					content:
						"Set up your time zone, UTM tags and Bit.ly account ",
					caretType: "left",
					caretStyle: {
						top: "20px"
					},
					icon: require("../assets/onboarding/5.png"),
					iconStyle: {
						height : "106px"
					},
					btn: "Next",
					btnClass: "primary",
					eventClick: event => {
						this.changeStep(5)
					}
				},
				{
					id: "#vue-sidebar-helper-center",
					containerCustomStyle: {
						transform: "translate(20px, -54px)"
					},
					title: "Get help",
					content:
						"Access our library to find answers for your issues and questions",
					caretType: "left",
					caretStyle: {
						top: "20px"
					},
					icon: require("../assets/onboarding/6.png"),
					iconStyle: {
						height : "99px"
					},
					btn: "Done",
					btnClass: "primary",
					eventClick: event => {
						this.done();
					}
				}
			]
		};
	},
	computed: {
		...mapGetters({}),
		current_step() {
			return this.data[this.step];
		}
	},
	methods: {
		...mapActions({
			updateOnboarding: "auth/updateOnboarding"
		}),
		...mapMutations({
			setOnboardingSidebar: "auth/setOnboardingSidebar"
		}),
		changeStep(index) {
			this.visible = false 
			this.step = index 
			$('.vue-onboarding-sidebar-is-focused').removeClass('vue-onboarding-sidebar-is-focused')
			this.$nextTick(()=>{
				this.visible = true
				$(this.current_step.id).addClass('vue-onboarding-sidebar-is-focused')
			})
		},
		next() {},
		prev() {},
		createOnboarding() {
			var body = document.querySelector("body");
			body.classList.add("vue-onboarding-sidebar-showed");
			this.changeStep(0)
			this.$nextTick(()=>{
				this.show_mask = true
			})
		},
		removeOnboardingClass() {
			var arr = [
				"vue-onboarding-sidebar-showed",
				"vue-onboarding-sidebar-focused"
			];
			arr.forEach(item => {
				this.findAndRemove(item);
			});
		},
		findAndRemove(className) {
			var items = document.querySelectorAll(`.${className}`);
			[].forEach.call(items, function(el) {
				el.classList.remove(className);
			});
		},
		done() {
			this.updateOnboarding({
				type: "sidebar"
			});
			this.setOnboardingSidebar(true);
		}
	},
	watch: {

	},
	mounted() {
		this.createOnboarding();
	},
	beforeDestroy() {
		this.removeOnboardingClass();
	}
};
</script>

<style lang="scss">
.vue-onboarding-sidebar {
	.fade-in-lazy-enter-active,
	.fade-in-lazy-leave-active {
		transition: opacity 0.5s;
	}

	.fade-in-lazy-enter,
	.fade-in-lazy-leave-to {
		opacity: 0;
	}

	&-showed {
		width: 100%;
		height: 100%;
		overflow: hidden;
		.app-layout{
			.app-layout-sidebar{
				z-index: 10002;
				.app-sidebar-menu {
					.navbar-link{
						pointer-events: none;
						user-select: none;
						.navbar-icon{
							background: transparent;
							color: $app-sidebar-text-color;;
						}
						&:before{
							content: none;
						}
						&.vue-onboarding-sidebar-is-focused{
							.navbar-icon{
								background-color: #5b86e5;
    							color: #fff;
							}
						}
					}
				}
			}
		}
	}

	&-mask {
		z-index: 10000;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.65);
	}

	&-clone {
		background: #fff;
		z-index: 10001;
		position: fixed;
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid #777;
		border: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
		user-select: none;
		pointer-events: none;
	}

	&-container {
		z-index: 10002;
		padding: 8px 0 8px 16px;
	}

	&-wrapper {
		position: relative;
		width: 420px;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 32px;
		z-index: 2;
		&:before {
			content: "";
			width: 98px;
			height: 104px;
			position: absolute;
			left: 0;
			top: 0;
			pointer-events: none;
			z-index: 0;
			background-image: url("../assets/onboarding/left.png");
		}

		&:after {
			content: "";
			width: 88px;
			height: 104px;
			position: absolute;
			right: 0;
			top: 0;
			pointer-events: none;
			z-index: 0;
			background-image: url("../assets/onboarding/right.png");
		}
	}

	&-icon {
		// margin-bottom: 20px;

		img {
			max-width: 100%;
		}
	}

	&-title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	&-message {
		font-size: 14px;
		margin-bottom: 10px;
		min-height: 45px;
	}

	&-step {
		color: #97999f;
		font-size: 14px;
		font-weight: 600;
		text-align: right;
	}

	&-content {
		position: relative;
		
	}

	&-footer {
		display: flex;
		align-items: center;
		margin-top: 10px;
	}

	&-btn,
	&-step {
		@include flex(50%);
	}

	&-arrow {
		width: 20px;
		height: 20px;
		left: 10px;
		z-index: 1;
		&:before{
			content : '';
			transform: rotate(45deg);
			background: #fff;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			position: absolute;
		}
	}
}
</style>
