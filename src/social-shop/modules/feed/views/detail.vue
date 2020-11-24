<template>
	<transition name="fade-in" mode="out-in">
		<div class="feed-detail-page" v-if="is_loading_page" key="is-loading">
			<div class="feed-detail-page-header">
				<a-skeleton class="m-b-10"  active :avatar="false" :title="false" :paragraph="{ rows: 3 , width : '100%' }"></a-skeleton>
			</div>
			<div class="feed-detail-page-body">
				<a-skeleton class="m-b-10" v-for="item in 5" :key="`item_${item}`" active :avatar="false" :title="false" :paragraph="{ rows: 3 , width : '100%' }"></a-skeleton>
			</div>
		</div>
		<div class="feed-detail-page" v-else key="loaded">
			<template v-if="is_loading_error">
				<div class="feed-detail-page-error">
					<vue-error :type="is_loading_error" />
				</div>
			</template>
			<template v-else>
				<div class="feed-detail-page-header">
					<div class="feed-detail-page-header-navbar">
						<div class="feed-detail-page-header-title">
							<router-link class="btn-back" :to="{ name: 'FeedCenter' }">
								<span class="m-r-10"><sh-icon  :icon="['far', 'chevron-left']" /></span>
								<span class="title-feed">Feed</span>
							</router-link>
							<strong class="m-l-8" v-if="data.ss_feed">/ {{ data.ss_feed.name || ''}}</strong>
						</div>
						<div class="feed-detail-page-header-tab">
							<div class="vue-list-tabs">
								<router-link class="item-tab" v-for="(item,index) in tabs" :key="`tab_${index}`" :to="{ name : item.router }"
									:class="{ 'is-actived' : $route.name == item.router}">
									{{ item.text }}
								</router-link>
							</div>
						</div>
					</div>
					<div class="spacer"></div>
					<div class="feed-detail-page-header-account">
						<vue-social-account :account="data.social_account" />
					</div>
				</div>
				<div class="feed-detail-page-body">
					<transition name="fade-in" mode="out-in">
						<router-view v-model="data" :social-type="social_type" :status-count.sync="status_count" />
					</transition>
				</div>
				<vue-modal-suggest v-if="show_modal_suggest" :status="createStatus" :account="data.social_account" :social-type="social_type" />
			</template>
			
		</div>
	</transition>
</template>

<script>
import { mapActions } from 'vuex'
import VueSocialAccount from '../components/detail/vue-social-account'
import VueFeedGoogle from '../components/detail/vue-feed-google'
import VueFeedFacebook from '../components/detail/vue-feed-facebook'
import VueModalSuggest from '../components/detail/vue-modal-suggest'
export default {
	name : 'FeedDetail',
	metaInfo(){
		return {
			title: this.title
		}
	},
	components:{
		VueSocialAccount,
		VueFeedGoogle,
		VueFeedFacebook,
		VueModalSuggest
	},
	props :{
		createStatus : {
			type : Object,
			default : ()=>({
				modal_suggest_facebook : true,
				modal_success : true,
			}),
		}
	},
	data(){
		return {
			is_loading_page : true,
			is_loading_error : false,
			title : '',
			id : '',
			data : null,
			social_type : '',
			tabs : [
				{
					router : 'FeedDetail',
					text : 'Product'
				},
				{
					router : 'FeedDetailMapping',
					text : 'Field Mapping'
				},
				{
					router : 'FeedDetailCategory',
					text : 'Category Mapping'
				},
				// {
				// 	id : 'optimization',
				// 	text : 'Optimization'
				// },
				// {
				// 	id : 'setting',
				// 	text : 'Setting'
				// }
			],
			status_count : null ,
			filter_product_field_google : [
				{
					id : 'all',
					text : 'All Feed',
					count : '',
					color : 'blue'
				},
				{
					id : 'approved',
					text : 'Approved',
					count : '',
					color : 'green',
					description : "Your item is approved and active on Google Merchant"
				},
				{
					id : 'pending',
					text : 'Pending',
					count : '',
					color : 'yellow',
					description : "Your item is being reviewed by Google. This process can take up to 3 business days"
				},
				{
					id : 'disapproved',
					text : 'Disapproved',
					count : '',
					color : 'red',
					description : "Your item is disapproved and is not active on Google Merchant"
				},
			],
			filter_product_field_facebook : [
				{
					id : 'all',
					text : 'All Feed',
					count : '',
					color : 'blue'
				},
				{
					id : 'activated',
					text : 'Activated',
					count : '',
					color : 'green'
				},
				{
					id : 'deactivated',
					text : 'Deactivated',
					count : '',
					color : 'gray'
				},
				{
					id : 'pending',
					text : 'Pending',
					count : '',
					color : 'yellow'
				},
				{
					id : 'error',
					text : 'Error',
					count : '',
					color : 'red'
				},
			],
		}
	},
	computed:{
		tab(){
			var tab = this.$route.query && this.$route.query.tab ? this.$route.query.tab : ''
			return tab  ? tab : 'product'
		},
		show_modal_suggest(){
			return this.createStatus.modal_success
		}
	},
	methods :{
		...mapActions({
			getDetailFeed: 'feed/getDetailFeed',
			getFeedInfo : 'feed/getFeedInfo',
		}),
	},
	beforeRouteUpdate : async function(to, from ,next){
		next()
	},
	beforeRouteLeave : async function(to, from ,next){
		next()
	},
	async created(){
		try {
			this.id = this.$route.params.id 
			var res =  await this.getFeedInfo({
				ss_feed_id : this.id
			})
			let { status = false , data = null } = res.data
			if( status && data ){
				this.data = data 
				let { ss_feed , social_account }  = data 
				if( ss_feed ){
					this.title = ss_feed.name 
				}
				if( social_account ){
					this.social_type = social_account.social_type 
					if( social_account.social_type  == 'google' ){
						this.status_count = this.$clone(this.filter_product_field_google)
					}else if( social_account.social_type == 'facebook' || social_account.social_type == 'facebook_fbe' ){
						this.status_count = this.$clone(this.filter_product_field_facebook)
					}
				}

			}else{
				this.is_loading_error = 404 
			}
		} catch (error) {
			console.log(error);
			this.is_loading_error = 500  
		}
		this.is_loading_page = false
	}
}
</script>

<style lang="scss">
	.feed-detail-page{
		height: calc(100vh - #{$app-toolbar-height});
		&-header{
			
			background: #FFFFFF;
			border-bottom: 1px solid #EEEEEE;
			display: flex;
			padding: 0px 24px;
			&-navbar{
				height: 95px;
			}
			&-account{
				height: 95px;
				display: inline-flex;
				align-items: center;
			}
			&-title{
				display: inline-flex;
				align-items: center;
				font-size: 20px;
				line-height: 24px;
				font-weight: 600;
				height: 55px;

				a{
					color: $dark-gray2;
				}
				strong{
					color: $dark-gray1;
					margin: 0;
				}
			}
		}
		&-body{
			position: relative;
		}
		&-error{
			padding: 50px 0;
		}
	}
</style>