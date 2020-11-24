<template>
    <div class="error-layout">
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'ErrorLayout',
	metaInfo: {
		titleTemplate: "%s - Socialpublish"
	},
	created(){
		// this.$intercom.init({
		// 	page_name : 'error_page'
		// })
	},
	beforeDestroy(){
		// this.$intercom.destroy()
	}
}
</script>
<style lang="scss" scoped>
	.error-layout{
		min-height: 100vh;
		padding: 50px 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		user-select: none;
	}
</style>
