<template>
	<div class="app-none-layout">
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>

<script>
export default {
    name: 'None',
    metaInfo: {
        titleTemplate: "%s - Socialpublish"
    },
}
</script>

<style lang="scss">
	.app-none-layout{
		min-height: 100vh;
		width: 100%;
		background-color: #fff;
		display: flex;
		justify-content: center;
	}
</style>
