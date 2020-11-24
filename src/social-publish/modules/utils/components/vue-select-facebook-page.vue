<template>
	<a-modal transitionName="none" maskTransitionName="none" class="modal-connect-social-facebook" :afterClose="afterClose" :bodyStyle="{ padding : 0}" :title="false" :footer="false" :destroyOnClose="true"  width="520px" v-model="visible" >
		<div v-if="info">
			<div class="modal-connect-social-facebook-header">
				<div class="item-modal-title m-b-16">
					{{ $t('account.connect_facebook.title') }}
				</div>
				<div class="item-modal-account  m-b-12">
					<div class="item-social-avatar">
						<div  class="item-social-account">
							<div  class="item-social-account-media">
								<div  class="item-social-account-media-avatar">
									<img  :src="info.avatar" alt="">
								</div>
								<div  class="item-social-account-media-social item-social social-facebook"></div>
							</div>
							<div class="item-social-account-title">
								<div>{{ info.name }}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item-modal-description  m-b-16" v-if="data.length">
					{{ $t('account.connect_facebook.description') }}
					<span class="text-primary">{{ selected.length }}/{{ quota.limit - quota.total }} Account(s)</span>
				</div>
			</div>
			<template v-if="data.length">
				<div class="modal-connect-social-facebook-body">
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
														<i class="m-r-5"><sh-icon :icon="['far','check']"  /></i>
														{{ $t('account.label.status') }}
													</div>
												</template>
												<template v-else-if="item.is_available">
													<div class="item-social-account-title-status text-danger" >
														<i class="m-r-5"><sh-icon icon="exclamation-triangle"/></i>
														{{ $t('account.error.connect_facebook') }}
													</div>
												</template>
												
											</div>
										</div>
									</div>
								</div>
								<div class="item-row-social-type">
									{{ $t('account.social_types.facebook') }}
								</div>
							</div>
						</template>
					</vue-simple>
				</div>
			</template>
			<template v-else>
				<div class="modal-connect-social-facebook-body modal-connect-social-facebook-body-empty">
					<h3>{{ $t('account.state.empty_connect_facebook') }}</h3>
				</div>
			</template>
			<div class="modal-connect-social-facebook-footer">
				<a-button type="primary" block @click="onConnect" :loading="is_loading" :disabled="!selected.length">
					{{ $t('account.btn.connect_facebook_page') }}
				</a-button>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name : 'SelectFacebookPage',
	props:{
		value :{
			type : Boolean,
			default : false, 
		},
		data : {
			type : Array,
			default : ()=>[]
		},
		info :{
			type : Object,
			required: true
		},
		secret :{
			type : String,
			default : ''
		}
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
			checkPageSelected: "account/checkPageSelected",
		}),
		onConnect(){
			if( this.is_loading && !this.selected.length) return 
			this.is_loading = true 
			this.checkPageSelected({
				social_info: this.selected,
          		secret: this.secret
			})
			.then((res)=>{
				let { status = false , message = '' , data = []} = res.data 
				if( status ){
					this.$emit('on-connected' , this.data.filter((item)=>{
						return this.selected.indexOf(item.social_id) >= 0
					}))
					this.toastSuccess({
						title : this.$t('account.toast.connect_facebook_success.title'),
						message : this.$t('account.toast.connect_facebook_success.message'),
					})
					this.visible = false
				}else{
					this.toastError({
						title : this.$t('account.toast.connect_facebook_error.title'),
						message : message
					})
				}
				this.is_loading = false
			})
			.catch(()=>{
				this.toastError({
					title : this.$t('account.toast.connect_facebook_error.title'),
					message : this.$t('account.toast.connect_facebook_error.message'),
				})
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