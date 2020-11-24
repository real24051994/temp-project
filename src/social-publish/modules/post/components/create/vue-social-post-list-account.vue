<template>
	<div class="vue-list-social-account">
		<div class="vue-list-social-account-header">
			<div class="vue-list-social-account-header-inner">
				<div class="vue-list-social-account-header-title">
					<h3>{{ $t('post.title.social_accounts') }}</h3>
				</div>
			</div>
		</div>
		<div class="vue-list-social-account-body">
			<vue-simple class="list-accounts">
				<div class="list-items">
					<div class="item-selectable" v-for="(item,index) in filter_data" :key="`index_${index}`" @click="onSelect(item)">
						<div class="item-social-account" >
							<div class="item-social-account-media">
								<div class="item-social-account-media-avatar">
									<img v-if="item.avatar" :src="item.avatar" alt="">
									<img v-else src="@/assets/icons/user.png" alt="">
								</div>
								<div class="item-social-account-media-social item-social" :class="`social-${item.social_type}`"></div>
							</div>
							<div class="item-social-account-title">
								<div  v-line-clamp:20="2">{{ item.name }}</div>
							</div>
							<div class="item-social-account-action">
								<template v-if="item.connect_error">
									<vue-error-social-account-popover v-model="item.connect_error" :on-click-reconnect="handleManageAccount" />
								</template>
								<template v-else>
									<template v-if="isError(item)">
										<div class="text-danger"  >
											<i v-tooltip="tooltip" :title="$t('post.modal.component.list_account.limit_twitter_account')">
												<sh-icon icon="exclamation-circle" />
											</i>
										</div>
									</template>
									<template v-else>
										<a-checkbox :checked="isChecked(item.id)" ></a-checkbox>
									</template>
								</template>
							</div>
						</div>
					</div>
				</div>
			</vue-simple>
		</div>
		<div class="vue-list-social-account-footer">
			<a-button class="btn-bold btn-block btn-manage-accounts-in-list-socials" data-component="Modal Post" @click="handleManageAccount" >
				{{ $t('account.sidebar.view_more') }}
			</a-button>
		</div>
	</div>
</template>
<script>
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
		}
	},
	data :()=>({
		tooltip : {
			side: 'bottom', 
			maxWidth: 300
		}
	}),
	computed:{
		filter_data(){
			if( this.disabled ){
				return this.data.filter((item)=>{
					return _.find(  this.value , (el)=>{
						return el.id == item.id 
					})
				})
			}
			return this.data
		},
		selected : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		isChecked(id){
			return _.find(this.selected , { id : id }) != undefined
		},
		isError(item){
			if( item.social_type == 'twitter'){
				var arr = this.selected.filter((item)=> item.social_type =='twitter').map((item)=>item.id)
				if( arr.length ){
					return arr.indexOf(item.id) == -1 ? true : false
				}
			}
			return false
		},
		onSelect(item){
			if( this.disabled ) return;
			if( item.connect_error || this.isError(item) ){
				return 
			}
			var index = _.findIndex( this.selected , { id : item.id })
			if( index == -1){
				this.selected.push({
					id : item.id,
					social_type : item.social_type
				})
			}else{
				this.selected.splice(index,1)
			}
		},
		handleManageAccount(){
			this.$emit('on-click-btn')
		},
	}
}
</script>