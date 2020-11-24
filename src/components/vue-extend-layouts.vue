<template>
  <component :is="currentLayout" />
</template>

<script>
export default {
	name: "VueExtendLayouts",

	props: {
  		layout: {
  			type: String,
  			default: "default"
  		},
  		loading: {
  			type: String,
  			default: null
  		},
  		prefix: {
  			type: String,
  			default: ""
  		},
	  },

  	data() {
  		return {
  			layoutName: "default"
  		};
  	},

  	watch: {
  		$route: {
  			immediate: true,
  			handler(route) {
  				const newLayout = route.meta.layout;
  				if (!newLayout && !this.$route.name) {
  					this.layoutName = this.loading;
  					return;
  				}
  				if (!newLayout) {
  					this.layoutName = this.layout || "default";
  					return;
  				}
  				this.layoutName = newLayout;
  			}
  		}
  	},

  	computed: {
  		currentLayout() {
  			if (!this.layoutName) return;
			return () => import(/* webpackChunkName: "layout-[request]" */`@layouts/${this.layoutName}.vue`);
  		}
  	}
};
</script>
