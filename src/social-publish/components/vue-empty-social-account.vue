<template>
	<div class="vue-empty-social-account">
		<img src="@publish/assets/icons/empty-account.png" alt />
		<h4 class="show-display-text m-t-20" >
			{{ $t('error.empty_account.title') }}
		</h4>
		<p>
			{{ $t('error.empty_account.content') }}
		</p>
		<a-button @click="onClick" class="ant-btn ant-btn-primary m-t-20">
			{{ $t('error.empty_account.btn') }}
		</a-button>
	</div>
</template>
<script>
export default {
	name : 'EmptySocialAccount',
	methods:{
		onClick(){
			this.$POST_Modals.hideModalPost()
			this.redirect({
				name : 'ManageAccount'
			})
		}
	}
}
</script>
<style lang="scss">
	.vue-empty-social-account{
		text-align: center;
		img{
			max-width: 220px;
		}
	}
</style>