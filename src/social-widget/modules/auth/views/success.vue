<template>
	<div class="auth-autoclose-tab">
		<div class="auth-autoclose-tab-content">
			<h3>
				Login successfully! 
			</h3>
			<p>
				You can close this window and refresh the app in order to continue using the app.
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'VueAuthSucess',
		methods: {
			onClick() {
				open(location, '_self').close()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.auth-autoclose-tab{
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		&-content{
			text-align: center;
			h3{
				font-size: 22px;
			}
			p{
				font-size: 16px;
			}
			.ant-btn{
				height: 40px;
				min-width: 120px;
			}
		}
	}
</style>