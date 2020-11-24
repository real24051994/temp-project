<template>
	<div class="social-publish-error-not-found">
		<img src="@publish/assets/error/404.png" alt="">
		<h1>We think you’re lost!</h1>
		<p>You can choose to stay, but we recommend to go back home</p>
		<router-link to="/" class="ant-btn ant-btn-primary">
			<span>Back to Dashboard</span>
		</router-link>
	</div>
</template>
<style lang="scss" scoped>
	.social-publish-error-not-found{
		text-align: center;
		h1{
			font-weight: 600;
			font-size: 29px;
			line-height: 34px;
		}
		p{
			font-size: 16px;
			line-height: 19px;
			color: #92929C;
		}
	}
</style>