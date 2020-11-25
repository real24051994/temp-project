<template>
	<div class="vue-error-page social-head-error-page"  :data-app-name="app_name" :data-error-type="type">
		<template v-if="type == '404'">
			<img src="@/assets/404.png" alt="">
			<h1>We think you’re lost!</h1>
			<p>You can choose to stay, but we recommend to go back home</p>
			<router-link to="/" class="ant-btn ant-btn-primary">
				<span>Back to Dashboard</span>
			</router-link>
		</template>
		<template v-else-if="type == '500'">
			<img src="@/assets/error-500.svg" alt />
			<h3 class="m-t-20" style="font-size: 22px">Can not load this page</h3>
			<p>Please reload Page</p>
		</template>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'Error',
	props: {
		type : {
			type : [String , Number],
			default : '404'
		}
	},
	computed:{
		...mapGetters({
			app_name : 'getAppName'
		})
	}
}
</script>
<style lang="scss" scoped>
	.vue-error-page{
		text-align: center;
		padding: 30px 0;
		h3{
			font-size: 22px;
			line-height: 26px;
			margin-top: 30px
		}
		p{
			font-size: 15px;
			line-height: 18px;
		}
	}
</style>