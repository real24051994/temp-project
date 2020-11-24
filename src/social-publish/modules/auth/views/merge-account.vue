<template>
	<div>
		<div class="app-auth-title">
			<h3 v-html="$t('auth.heading.merge_account')"></h3>
		</div>
		<form-merge-account />
	</div>
	
</template>
<script>
import FormMergeAccount from '../components/form-merge-account.vue'
export default {
	name : 'MergeAccount',
	components:{
		FormMergeAccount
	},
	metaInfo: {
		title: 'Merge Account',
	},
}
</script>