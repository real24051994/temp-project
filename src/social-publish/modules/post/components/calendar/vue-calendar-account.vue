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
							<div class="item-selectable" v-for="(item,index) in data" :class="{'is-disabled' : item.connect_error}" :key="`index_${index}`" @click="onSelect(item)">
								<vue-item-social-account :data="item" :has-checkbox="true" :is-checked="isChecked(item.id)" @on-reconnect="handleManageAccount" />
							</div>
						</div>
					</vue-simple>
				</template>
				<template v-else>
					<vue-empty-social-account-in-list />
				</template>
			</template>
		</div>
		<div class="vue-list-social-account-footer">
			<a-button class="btn-bold btn-block btn-manage-accounts-in-list-socials"  @click="handleManageAccount" >
				<template v-if="aside_collapse">
					<sh-icon :icon="['far','user']" />
				</template>
				<template v-else>
					{{ $t('account.sidebar.view_more') }}
				</template>
			</a-button>
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
		value :{
			type : Array,
			required : true 
		},
		disabled :{
			type : Boolean,
			default : false,
		},
		loading: {
			type : Boolean,
			default : false,
		}
	},
	data :()=>({
		tooltip : {
			side: 'bottom', 
			maxWidth: 300
		}
	}),
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			accounts : 'account/getAccounts'
		}),
		selected : {
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
		isChecked(id){
			return this.selected.indexOf(id) >= 0
		},
		onSelect(item){
			if( this.disabled ) return;
			if( item.connect_error ){
				return 
			}

			var index =  this.selected.indexOf(item.id)
			if( index == -1){
				this.selected.push(item.id)
			}else{
				this.selected.splice(index,1)
			}
		},
		handleManageAccount(){
			this.redirect({
				name : 'ManageAccount'
			})
		},
	}
}
</script>