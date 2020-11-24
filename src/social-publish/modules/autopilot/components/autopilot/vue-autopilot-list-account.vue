<template>
	<div class="vue-list-social-account"  :class="{'is-collapsed' : aside_collapse }">
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
							<template  v-for="(item , index) in data">
								<div  class="item-selectable" :key="`index_${index}`" :class="{'is-selected' : item.id == selected ,'is-disabled' : item.connect_error }" @click="onSelect(item)">
									<vue-item-social-account :data="item" :has-checkbox="false" @on-reconnect="handleManageAccount" />
								</div>
								
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
			<router-link :disabled="loading" :to="{ name: 'ManageAccount'}" type="button" class="btn-bold btn-block ant-btn btn-manage-accounts-in-list-socials" data-component="Create Autopilot">
				<sh-icon v-if="aside_collapse" :icon="['far','user']" />
				<span v-else >{{ $t('account.sidebar.view_more') }}</span>
			</router-link>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
	name : 'ListSocialAccounts',
	props:{
		data : {
			type : Array,
			required : true 
		},
		value : {
			type : [String , Number],
			required : true
		},
		loading:{
			type : Boolean,
			default : false,
		}
	},
	data :()=>({
		tooltip : {
			side: 'bottom', 
			maxWidth: 300
		},
		is_loading: false,
		timeout : null
	}),
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			accounts : 'account/getAccounts'
		}),
		selected:{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		loading_rows(){
			return this.accounts && this.accounts.length ? this.accounts.length  : 5
		}
	},
	methods:{
		...mapMutations({
			toggleAsideCollapse : 'utils/toggleAsideCollapse'
		}),
		onSelect(item){
			if( item.connect_error ) return 
			let { id } = item 
			var current = _.find( this.data , { id : this.selected})
			var target = _.find(this.data , { id : id })
			if( current && target ){
				if( current.social_type != target.social_type ){
					this.selected = id
				}
			}
			this.selected = id
		},
		handleManageAccount(){
			this.redirect({
				name : 'ManageAccount'
			})
		}
	},
	watch :{
		'status' : function(){
			this.is_loading = true
			this.$nextTick(()=>{
				this.is_loading = false
			})
		}
	}
}
</script>
