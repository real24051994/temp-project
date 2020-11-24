<template>
	<a-modal transitionName="none" maskTransitionName="none" class="modal-connect-hootsuite" :afterClose="afterClose" :bodyStyle="{ padding : 0}" title="Connecting Instagram account" :footer="false" :destroyOnClose="true"  width="520px" v-model="visible" >
		<div>
			<div class="modal-connect-hootsuite-header">
				<div class="item-modal-description  m-b-16" v-if="data.length">
					Choose which account you want to connect
					<span class="text-primary">{{ selected.length }}/{{ quota.limit - quota.total }} Page(s)</span>
					<a-popover :title="false">
						<template slot="content">
							Limited account number of <strong class="text-primary">Basic Plan</strong>
						</template>
						<i class="m-l-8 text-gray"><sh-icon icon="info-circle" /></i>
					</a-popover>
				</div>
			</div>
			<template v-if="data.length">
				<div class="modal-connect-hootsuite-body">
					<vue-simple class="list-row-socials">
						<template v-for="(item,index) in data" >
							<div class="item-row-social" :key="`index_${index}`" :class="{ 'is-disabled' : item.connected  || item.is_available || (  selected.indexOf(item.social_id) == -1 && selected.length >= current_quota  ) }" @click="onSelect(item)">
								<div class="item-row-social-info item-row-social-info-checkbox">
									<div class="item-social-checkbox">
										<label class="ant-checkbox-wrapper" >
											<span class="ant-checkbox" :class="{ 'ant-checkbox-checked' : selected.indexOf(item.social_id) >= 0}">
												<span class="ant-checkbox-inner"></span>
											</span>
										</label>
									</div>
									<div class="item-social-avatar">
										<div  class="item-social-account">
											<div  class="item-social-account-media">
												<div  class="item-social-account-media-avatar">
													<img v-if="item.avatar" :src="item.avatar" alt="">
													<img v-else src="@/assets/icons/user.png" alt="" >
												</div>
												<div  class="item-social-account-media-social item-social" :class="`social-${item.social_type}`"></div>
											</div>
											<div class="item-social-account-title">
												<div class="item-social-account-title-name">{{ item.name }}</div>
												<template v-if="item.connected">
													<div class="item-social-account-title-status text-success" >
														<i class="m-r-5"><sh-icon :icon="['far','check']"  /></i>Connected
													</div>
												</template>
												<template v-else-if="item.is_available">
													<div class="item-social-account-title-status text-danger" >
														<i class="m-r-5"><sh-icon icon="exclamation-triangle"/></i>
														Connected to another account
													</div>
												</template>
												
											</div>
										</div>
									</div>
								</div>
								<div class="item-row-social-type">
									Instagram Business
								</div>
							</div>
						</template>
					</vue-simple>
				</div>
			</template>
			<template v-else>
				<div class="modal-connect-hootsuite-body modal-connect-hootsuite-body-empty">
					<h3>No Instagram Account found</h3>
				</div>
			</template>
			<div class="modal-connect-hootsuite-footer">
				<a-button type="primary" block @click="onConnect" :loading="is_loading" :disabled="!selected.length">
					Connect
				</a-button>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name : 'SelectHootsuiteInstagram',
	props:{
		value :{
			type : Boolean,
			default : false, 
		},
		data : {
			type : Array,
			default : ()=>[]
		},
	},
	data(){
		return {
			is_loading : false,
			selected : [],
		}
	},
	computed:{
		...mapGetters({
			'quota' : 'pricing/getAccountQuota'
		}),
		current_quota  : function(){
			return this.quota.limit - this.quota.total
		},
		visible :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{
		...mapActions({
			chooseHootsuiteInstagram: "account/chooseHootsuiteInstagram",
		}),
		onConnect(){
			if( this.is_loading && !this.selected.length) return 
			this.is_loading = true 
			var data = this.data.filter((item)=>{
				return this.selected.indexOf(item.social_id) >= 0
			}).map((item)=>{
				delete item['connected']
				return item
			})
			this.chooseHootsuiteInstagram({
				data 
			})
			.then((res)=>{
				let { status = false , message = '' , data = []} = res.data 
				if( status ){
					this.$emit('on-connected' , this.data.filter((item)=>{
						return this.selected.indexOf(item.social_id) >= 0
					}))
					this.toastSuccess({
						title : 'Done !',
						message : 'Connected Hootsuite Instagram Account !'
					})
					this.visible = false
				}else{
					this.toastError({
						title : 'Error !',
						message : message
					})
				}
				this.is_loading = false
			})
			.catch(()=>{
				this.is_loading = false
			})
		},
		onSelect(item){
			if( item.connected || item.is_available ) return 
			var index = this.selected.indexOf(item.social_id)
			if( index >= 0){
				this.selected.splice(index,1)
			}else{
				if( this.selected.length < this.current_quota  ){
					this.selected.push(item.social_id)
				}
			}
		},
		afterClose(){
			this.$emit('on-close')
		}
	}
}
</script>