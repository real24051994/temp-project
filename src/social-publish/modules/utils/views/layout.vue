<template>
	<div>
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>
<script>
	export default {
		name: 'VueLayout',
	}
</script>