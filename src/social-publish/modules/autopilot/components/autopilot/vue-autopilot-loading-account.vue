<template>
	<div class="vue-list-social-account"  :class="{'is-collapsed' : aside_collapse }">
		<div class="vue-list-social-account-header">
			<div class="vue-list-social-account-header-inner">
				<div class="vue-list-social-account-header-title">
					<h3>{{ $t('post.title.social_accounts') }}</h3>
				</div>
				<div class="vue-list-social-account-header-action">
					<a class="btn-collapse">
						<sh-icon :icon="['far','chevron-left']" />
					</a>
				</div>
			</div>
		</div>
		<div class="vue-list-social-account-body">
			<div class="pd-5">
				<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>
		</div>
		<div class="vue-list-social-account-footer" >
			<a :disabled="true" class="btn-bold btn-block ant-btn btn-manage-accounts-in-list-socials">
				<sh-icon v-if="aside_collapse" :icon="['far','user']" />
				<span v-else >{{ $t('post.modal.component.list_account.btn_manage_account') }}</span>
			</a>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'AutopilotLoadingAccount',
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			accounts : 'account/getAccounts'
		}),
		loading_rows(){
			return this.accounts && this.accounts.length ? this.accounts.length  : 5
		}
	},
}
</script>