<template>
	<div class="vue-dashboard-article">
		<div class="vue-dashboard-article-left">
			<div class="vue-dashboard-article-header">
				<div class="d-flex">
					<h3>
						What’s New?
					</h3>
					<div class="spacer"></div>
					<a :href="view_all" target="_blank">
						View All
					</a>
				</div>
				<div class="vue-list-tabs">
					<template v-for="item in tabs">
						<a  class="item-tab" :key="item.id" :class="{ 'is-actived' : tab == item.id }" @click="changeTab(item.id)">
							{{ item.text }}
						</a>
					</template>
				</div>
			</div>
			<div class="vue-dashboard-article-body p-t-16" v-if="is_loading">
				<div class="vue-item-article" v-for="item in 3" :key="`item_index_${item}`">
					<a-skeleton active :avatar="{ shape : 'square'}" :title="false" :paragraph="{ rows: 2 , width : '100%' }" />
				</div>
			</div>
			<div class="vue-dashboard-article-body" v-else >
				<vue-simple class="vue-dashboard-article-scrollbar">
					<vue-item-article v-for="item in data" :data="item" :key="item.title" />
				</vue-simple>
			</div>
		</div>
		<div class="vue-dashboard-article-right">
			<vue-dashboard-banner />
		</div>
	</div>
</template>
<script>
import VueDashboardBanner from './vue-dashboard-banner'
import VueItemArticle from './vue-item-article'
import { mapActions } from 'vuex'
export default {
	name : 'DashboardArticles',
	components: {
		VueDashboardBanner,
		VueItemArticle
	},
	data(){
		return {
			is_loading : true,
			is_loading_error : false, 
			xhr_request : null,
			cancel_request_token : null,
			view_all : 'https://socialhead.io/blog/',
			tab : 'rencent',
			tabs : [
				{
					id : 'rencent',
					text : 'Recent Update',
					category_id : '55'
				},
				{
					id  : 'grow',
					text : 'Grow Hack',
					category_id : '11'
				}
			],
			data : []
		}
	},
	methods :{
		...mapActions({
			getDashboardArticle : 'dashboard/getDashboardArticle'
		}),
		changeTab(tab){
			if( this.is_loading ) return 
			if( this.tab != tab ){
				this.tab = tab 
			}
		},
		fetchData(){
			if (this.xhr_request && this.is_loading ) {
				this.xhr_request.abort()
			}
			// this.cancel_request = this.createAxiosCancelRequestToken()
			var tab =  _.find(this.tabs ,  { id : this.tab} )
			if( tab == undefined ) return 
			this.is_loading = true 
			this.xhr_request = this.getDashboardArticle({
				tab : this.tab,
				category_id : tab.category_id
				// cancel_request_token : this.cancel_request_token
			})
			.then((res)=>{
				if( res && this.$helper.isArray(res) ){
					this.data = res 
				}else{
					this.data = []
				}
				this.is_loading = false 
			})
			.catch((err)=>{
				this.is_loading_error = true
				this.is_loading = false 
				this.data = []
			})
		}
	},
	watch : {
		'tab' : function(){
			this.fetchData()
		}
	},
	mounted(){
		this.fetchData()
	}
}
</script>
<style lang="scss">
	.vue-dashboard-article{
		display: flex;
		flex-wrap: nowrap;
		box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
		overflow: hidden;
		height: 348px;
		&-left{
			height: 100%;
			@include col();
			position: relative;
		}
		&-right{
			@include flex(675px);
			height: 100%;
		}
		&-header{
			height: 88px;
			width: 100%;
			padding: 24px 24px 0 24px;
			position: absolute;
			top: 0;
			right : 0;
			left: 0;
			z-index: 1;
			h3{
				margin: 0;
			}
		}
		&-body{
			top: 88px;
			position: absolute;
			bottom: 0;
			right : 0;
			left: 0;
			z-index: 1;
		}
		&-scrollbar{
			height: 100%;
			overflow: hidden auto;
			padding: 8px 0;
		}
	}
</style>