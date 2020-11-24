<template>
	<div class="source-setting-module">
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>

<script>
	export default {
		name: "VueLayout",
	};
</script>
<style lang="scss"></style>
