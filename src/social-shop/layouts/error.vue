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
