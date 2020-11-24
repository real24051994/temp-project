<template>
	<div class="vue-list-social-account" :class="{'is-collapsed' : aside_collapse }">
		<div class="vue-list-social-account-header">
			<div class="vue-list-social-account-header-inner">
				<div class="vue-list-social-account-header-title">
					<h3>{{ $t('post.title.social_accounts') }}</h3>
				</div>
				<div class="vue-list-social-account-header-action">
					<a class="btn-collapse" @click="toggleAsideCollapse">
						<sh-icon :icon="['far','chevron-left']" />
					</a>
				</div>
			</div>
		</div>
		<div class="vue-list-social-account-body">
			<template v-if="loading" >
				<div class="p-l-15 p-r-15 p-t-5 p-b-5" v-if="aside_collapse">
					<a-skeleton class="m-b-10" v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="false"></a-skeleton>
				</div>
				<div class="p-l-15 p-r-15 p-t-5 p-b-5" v-else>
					<a-skeleton class="m-b-10" v-for="item in loading_rows" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
				</div>
			</template>
			<template v-else>
				<template v-if="data.length">
					<vue-simple class="list-accounts">
						<div class="list-items">
							<router-link :to="setRouterLink('all')" class="item-selectable" v-if="showAllOption" :class="{'is-selected' : routerLinkActive('all') }" >
								<div class="item-social-account item-social-account-checkall" >
									<div class="item-social-account-media">
										<div class="item-social-account-media-avatar">
											{{ $t('account.sidebar.all_account_collapse') }}
										</div>
									</div>
									<div class="item-social-account-title">
										{{ $t('account.sidebar.all_account') }}
									</div>
								</div>
							</router-link>
							<template  v-for="(item) in data">
								<router-link :to="setRouterLink(item.id)" class="item-selectable" :key="item.id" :class="{'is-selected' : routerLinkActive(item.id) }" >
									<vue-item-social-account :data="item" :has-checkbox="false" @on-reconnect="handleManageAccount" />
								</router-link>
							</template>
						</div>
					</vue-simple>
				</template>
				<template v-else>
					<vue-empty-social-account-in-list />
				</template>
			</template>
		</div>
		<div class="vue-list-social-account-footer" >
			<router-link :disabled="loading"  :to="{ name: 'ManageAccount'}" type="button" class="btn-bold btn-block ant-btn btn-manage-accounts-in-list-socials" data-component="List Autopilot">
				<sh-icon v-if="aside_collapse" :icon="['far','user']" />
				<span v-else >{{ $t('account.sidebar.view_more') }}</span>
			</router-link>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
	name : 'AutopilotListSocialAccounts',
	props:{
		data : {
			type : Array,
			required : true 
		},
		setRouterLink :{
			type : Function,
			required : true,
		},
		loading:{
			type : Boolean,
			default : false
		}
	},
	data(){
		return {
			is_loading: false,
			timeout : null,
		}
	},
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			accounts : 'account/getAccounts'
		}),
		tab(){
			return this.$route.query && this.$route.query.tab ? this.$route.query.tab : ''
		},
		showAllOption(){
			return this.tab != 'queue'
		},
		loading_rows(){
			return this.accounts && this.accounts.length ? this.accounts.length  : 5
		}
	},
	methods:{
		...mapMutations({
			toggleAsideCollapse : 'utils/toggleAsideCollapse'
		}),
		routerLinkActive(social_id ){
			var id = ''
			if( this.tab == 'queue'){
				id = this.$route.query && this.$route.query.hasOwnProperty('social_id') ? this.$route.query.social_id : this.data.first().id 
			}else{
				id = this.$route.query && this.$route.query.hasOwnProperty('social_id') ? this.$route.query.social_id : 'all'
			}
			return social_id == id 
		},
		handleManageAccount(){
			this.redirect({
				name : 'ManageAccount'
			})
		},
	},
	watch :{
		'tab' : function(){
			this.is_loading = true
			this.$nextTick(()=>{
				this.is_loading = false
			})
		}
	},
}
</script>
<style lang="scss" scoped>
	
</style>