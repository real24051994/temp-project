<template>
	<div>
		<transition name="fade-in" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>
<script>
import { mapGetters , mapActions  } from 'vuex'
export default {
	name: 'VueLayout',
	computed:{

	},
}
</script>