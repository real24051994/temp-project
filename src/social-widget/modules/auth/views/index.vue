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
        ...mapMutations({
			'setToken' : 'auth/setToken',
			'removeToken' : 'auth/removeToken'
		}),
		...mapActions({
			'getUser' : 'auth/getUser',
		})
    },
    async created(){
		var token = this.$route.query.token ? this.$route.query.token : ''
        if( token ){
			this.setToken(token)
			try {
				var res = await this.getUser()
				let { status , data } = res.data 
				if( status && data){
					this.redirect({name : 'Gallery' })
				}else{
					this.removeToken()
					this.redirect({name : 'Login'})
				}
			} catch (err) {
				console.log(err);
				this.is_loading = false 
			}
            
        }else{
			this.removeToken()
            this.redirect({name : 'Login'})
        }
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