<template>
	<transition name="fade-in" mode="out-in">
		<div class="app-set-token" v-if="is_loading" key="is-loading">
			<a-spin>
				<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
			</a-spin>
		</div>
		<div v-else key="loading-success">
			<vue-error type="500"></vue-error>
		</div>
	</transition>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
export default {
	name : 'AuthToken',
	metaInfo: {
		title: 'Authorization',
	},
	data : ()=>({
		token : '',
		is_loading : true
	}),
	methods:{

    },
    created(){
		this.is_loading = false 
    }
}
</script>
<style lang="scss">
	.app-set-token{
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: transparent;
		.loading-icon{
			display: inline-block;
			display: inline-block;
		}
	}
</style>