<template>
	<div class="autopilot-form-navbar" :style="{ left : width + 'px'}">
		<slot></slot>
	</div>
</template>
<script>
export default {
	name : 'VueAutopilotFormNavbar',
	data(){
		return {
			width : 0,
		}
	},
	methods :{
		onReize(){
			var el = document.querySelector(".app-toolbar .app-toolbar-brands");
			if( el ){
				this.width = el.clientWidth
			}
		},
	},
	created(){
		this.onReize()
		window.addEventListener('resize', this.onReize);
	},
	beforeDestroy(){
		window.removeEventListener('resize', this.onReize);
	}

}
</script>