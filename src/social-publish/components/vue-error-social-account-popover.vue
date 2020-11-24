<template>
	<a-popover :title="false" placement="rightTop" >
		<template slot="content">
			<div class="vue-list-social-account-popover">
				<template v-if="value.code && error_codes.indexOf(value.code) >= 0">
					Invalid Token
					<template v-if="onClickReconnect">
						<a-button @click="onClickReconnect" class="ant-btn ant-btn-block m-t-8">
							<span>Reconnect</span>
						</a-button>
					</template>
					<template v-else>
						<router-link :to="{ name : 'ManageAccount'}" class="ant-btn ant-btn-block m-t-8">
							<span>Reconnect</span>
						</router-link>
					</template>
				</template>
				<template v-else>
					{{ value.message }}
				</template>
			</div>
		</template>
		<slot>
			<i class="text-danger">
				<sh-icon  icon="exclamation-circle" />
			</i>
		</slot>
	</a-popover>
</template>
<script>
export default {
	name : 'VueErrorSocialAccountPopover',
	props:{
		value :{
			required: true,
		},
		onClickReconnect:{
			type : Function,
		}
	},
	data(){
		return {
			error_codes: [10,190,64, 89, 93, 99, 220, 326]
		}
	},
	methods:{

	}
}
</script>
<style lang="scss" scoped>
	.vue-list-social-account-popover{
		font-size: 14px;
		line-height: 1.5;
		color: $danger;
	}
</style>