<template>
	<div class="page-container" :class="{ 'page-container-collapse' : aside_collapse }">
		<div class="autopilot list-autopilot">
			<div class="page-container-aside list-autopilot-social">
				<vue-list-autopilot-account :data="socials" :loading="is_loading_page" :setRouterLink="setRouterLinkAccount" />
			</div>
			<div class="page-container-content list-autopilot-main">
				<div class="page-container-wrapper">
					<div class="list-autopilot-header page-container-header">
						<div class="page-container-header-title">
							<div class="autopilot-title">
								<h1 class="page-title">
									{{ $t('autopilot.title.autopilot')}}
								</h1>
							</div>
							<div class="spacer"></div>
							<a-button id="btn-create-autopilot" type="primary" @click="showModalCreate">
								<span>{{ $t('autopilot.btn.create_autopilot')}}</span>
							</a-button>
						</div>
						<vue-position-sticky :offsetTop="offsetTop" sticky-class="list-autopilot-content-sticky" >
							<div class="vue-list-tabs">
								<router-link class="item-tab" :to="setRouterLinkTab('autopilot')" :class="{ 'is-actived' : activeRouterLinkTab('autopilot')}">
									{{ $t('autopilot.tab.autopilot')}}
								</router-link>
								<router-link class="item-tab" :to="setRouterLinkTab('queue')" :class="{ 'is-actived' : activeRouterLinkTab('queue')}">
									{{ $t('autopilot.tab.queue')}}
								</router-link>
							</div>
							<a-button id="btn-create-autopilot-sticky" class="btn-create-autopilot" type="primary" @click="showModalCreate">
								<span>{{ $t('autopilot.btn.create_autopilot')}}</span>
							</a-button>
						</vue-position-sticky>
					</div>
					<div class="list-autopilot-body page-container-body">
						<div key="is-change-success">
							<div class="list-autopilot-filter m-t-16">
								<div class="list-autopilot-filter-search">
									<span class="ant-input-affix-wrapper">
										<span class="ant-input-prefix icon-search">
											<sh-icon :icon="['far','search']" />
										</span>
										<input @keyup="onKeyword" v-model="pagination.keyword" placeholder="Search..." type="text" class="ant-input">
									</span>
								</div>
								<div class="spacer"></div>
							</div>
							<transition name="fade-in" mode="out-in">
								<div class="m-t-16" v-if="is_loading_error" key="is-loading-error">
									<vue-error type="500"></vue-error>
								</div>
								<div class="list-autopilot-table m-t-16" v-else key="is-loading-success">
									<div v-if="is_queue">
										<vue-list-autopilot-queue @on-click-empty="showModalCreate" :setRouterLink="setRouterLinkSort" :data="pagination.data" :loading="is_loading" @reload="reload"></vue-list-autopilot-queue>
									</div>
									<div v-else>
										<vue-list-autopilot-table @on-click-empty="showModalCreate" :setRouterLink="setRouterLinkSort" :data="pagination.data" :loading="is_loading" @reload="reload"></vue-list-autopilot-table>
									</div>
									<div class="m-t-16">
										<vue-pagination v-model="pagination.current_page" :total="pagination.total_page"></vue-pagination>
									</div>
								</div>
							</transition>
						</div>
					</div>
				</div>
			</div>
		
			<a-modal transitionName="none" maskTransitionName="none" :title="$t('autopilot.modal.create_autopilot.title')" :bodyStyle="{ padding : '0px' , overflow : 'hidden'}" :visible="visible" :closable="true" :footer="false" @cancel="visible = false" width="600px">
				<div class="list-autopilot-type">
					<router-link :disabled="allowedAutopilotType.indexOf('latest') == - 1" :to="{ name : 'CreateAutopilot' , query : { type : 'latest' } }" class="item-modal-autopilot-type btn-select-autopilot-type" data-type="Latest Product Autopilot">
						<div class="item-modal-autopilot-type-image">
							<sh-icon icon="star" />
						</div>
						<div class="item-modal-autopilot-type-content">
							<h4>{{ $t('autopilot.modal.create_autopilot.lastest.title')}} <span v-if="show_label_premium" class="label-premium m-l-8">Premium function</span></h4>
							<p>{{ $t('autopilot.modal.create_autopilot.lastest.description')}}</p>
						</div>
						<div class="item-modal-autopilot-type-action">
							<sh-icon :icon="['far','chevron-right']" />
						</div>
					</router-link>
					<router-link :disabled="allowedAutopilotType.indexOf('random') == - 1" :to="{ name : 'CreateAutopilot' }" class="item-modal-autopilot-type btn-select-autopilot-type" data-type="Random Product Autopilot">
						<div class="item-modal-autopilot-type-image">
							<sh-icon icon="tag" />
						</div>
						<div class="item-modal-autopilot-type-content">
							<h4>{{ $t('autopilot.modal.create_autopilot.random.title')}}</h4>
							<p>{{ $t('autopilot.modal.create_autopilot.random.description')}}</p>
						</div>
						<div class="item-modal-autopilot-type-action">
							<sh-icon :icon="['far','chevron-right']" />
						</div>
					</router-link>
					<router-link :disabled="allowedAutopilotType.indexOf('review') == - 1" :to="{ name : 'CreateAutopilot' , query : { type : 'review' } }" class="item-modal-autopilot-type btn-select-autopilot-type" data-type="Publish Product Review">
						<div class="item-modal-autopilot-type-image item-modal-autopilot-type-image-alireview">
							<img src="@publish/assets/icons/alireviews.svg" alt="">
						</div>
						<div class="item-modal-autopilot-type-content">
							<h4>{{ $t('autopilot.modal.create_autopilot.review.title')}}<label class="m-l-8">Ali Reviews Integrate</label></h4>
							<p>{{ $t('autopilot.modal.create_autopilot.review.description')}}</p>
						</div>
						<div class="item-modal-autopilot-type-action">
							<sh-icon :icon="['far','chevron-right']" />
						</div>
					</router-link>
				</div>
			</a-modal>
			
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VueListAutopilotAccount from '../components/list/vue-list-autopilot-account'
import VueListAutopilotTable from '../components/list/vue-list-autopilot-table'
import VueListAutopilotQueue from '../components/list/vue-list-autopilot-queue'
import VueListAutopilotFilter from '../components/list/vue-list-autopilot-filter'
export default {
	name : 'Autopilot',
	components:{
		VueListAutopilotAccount,
		VueListAutopilotTable,
		VueListAutopilotFilter,
		VueListAutopilotQueue
	},
	metaInfo(){
		return {
			title: 'Manage Autopilot'
		}
	},
	data(){
		return {
			is_loading: false,
			is_loading_page : false,
			is_changing : false,
			is_loading_error : false,
			timeout : null,
			socials: [],
			cancel_request : null,
			params_sort: ['tab','social_id','page' , 'sort_by' , 'order_by', 'keyword' ],
			tabs : ['autopilot' ,'queue'],
			default_sort: '',
			pagination :{
				data : [],
				total : 0,
				current_page : 1,
				total_page : 1,
				tab : '',
				social_ids : [],
				sort_field : '',
				sort_by : '',
			},
			filter:{
				day : 10,
				autopilot : [],
				all_autopilot : true,
			},
			visible : false,
			show_sticky : true,
		}
	},
	computed:{
		...mapGetters({
			'aside_collapse' : 'utils/getAsideCollapse',
			'show_label_premium'  : 'pricing/getShowLabelPremium',
			'allowedAutopilotType' : 'pricing/getAllowedAutopilotType',
			'banner' : 'pricing/getShowBanner',
		}),
		offsetTop(){
			return this.banner ? 48 + 49 : 48
		},
		check_all :{
			get(){
				return this.social_ids.length == this.socials.length
			},
			set(value){
				this.pagination.social_ids = value ? this.socials.map((item)=>item.id) : []
			}
		},
		is_queue(){
			return this.$route.query && this.$route.query.tab == 'queue'
		}
	},
	methods:{
		...mapActions({
			getSocialAccounts : 'account/list',
			getAutopilot : 'autopilot/list',
			getQueue : 'queue/list'
		}),
		showModalCreate(){
			this.visible = true
		},
		setRouterLinkTab(payload){
			var query = {}
			if( payload != this.tabs.first() && this.tabs.indexOf(payload) >= 0 ){
				query['tab'] = payload
			}
			let social_id = this.$route.query && this.$route.query.hasOwnProperty('social_id') ? this.$route.query.social_id : ''
			if( social_id ){
				query['social_id'] = social_id
			}
			return {
				name : 'Autopilot',
				query
			}
		},
		activeRouterLinkTab(payload){
			let tab = this.$route.query && this.$route.query.hasOwnProperty('tab') ? this.$route.query.tab : this.tabs.first()
			return tab == payload
		},
		setRouterLinkAccount( id ){
			let query = this.getQuery(this.$route)
			if( id  && id != 'all'){
				query['social_id'] = id 
			}else{
				delete query['social_id']
			}
			delete query['page']
			return  {
				name : 'Autopilot',
				query : this.sortQuery(query),
			}
		},
		setRouterLinkSort( field ){
			let query = this.getQuery(this.$route)
			if( query['sort_by'] == field){
				
				if( query['order_by'] == 'asc'){
					query['order_by'] = 'desc'
				}else{
					query['order_by'] = 'asc'
				}
			}else{
				query['sort_by'] = field
			}
			delete query['page']
			return  {
				name : 'Autopilot',
				query : this.sortQuery(query),
			}
		},
		handleGetSocialAccount(){
			return new Promise((resolve, reject)=>{
				this.getSocialAccounts().then((res)=>{
					let { status = false , data = [] } = res.data
					if( status ){
						this.socials = data 
						this.check_all = true
					} 
					resolve()
				})
				.catch((err)=>{
					reject()
				})
			});
		},
		
		onKeyword(event) {
  			clearTimeout(this.timeout);
  			if (event.keyCode == 13) {
  				this.onChangeKeyword();
  			} else {
  				this.timeout = setTimeout(() => {
  					this.onChangeKeyword();
  				}, 500);
  			}
		},
		onChangeKeyword(){
			let query = this.getQuery(this.$route)
			var keyword = this.pagination.keyword
			if( keyword ){
				query['keyword'] = keyword
			}else{
				delete query['keyword'] 
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}
			this.setQuery(query)
		},
		reload(){
			this.getList()
		},
		getQuery(route){
			let query = {}
			if (route.query.page && this.$helper.isNumeric(route.query.page)) {
				query['page'] = route.query.page
			}
			if (route.query.tab && this.tabs.indexOf(route.query.tab) >= 0 && route.query.tab != this.tabs.first()) {
				query['tab'] = route.query.tab
			}
			if (route.query.keyword) {
				query['keyword'] = route.query.keyword
			}
			if (route.query.sort_by) {
				query['sort_by'] = route.query.sort_by
			} else {
				delete query['sort_by']
			}
			if (route.query.order_by) {
				query['order_by'] = route.query.order_by
			} else {
				delete query['order_by']
			}
			if (route.query.social_id ) {
				query['social_id'] = route.query.social_id
			}
			return query
		},
		sortQuery(object){
			var query = {}
			this.params_sort.forEach((item) => {
				if (object.hasOwnProperty(item)) {
					query[item] = object[item]
				}
			})
			return query
		},
		setQuery(object) {
			var query = {}
			this.params_sort.forEach((item) => {
				if (object.hasOwnProperty(item)) {
					query[item] = object[item]
				}
			})
			this.pushRouterLinkDefault({
				name: 'Autopilot',
				query: query
			});
		},
		getList(route){
			if( !route ){
				route = this.$route 
			}
			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()
			// this.is_loading = true
			let query = this.getQuery(route)
			let tab = query.tab ? query.tab : this.tabs.first()
			let current_page = query.page ? query.page : 1 
			let keyword = query.keyword ? query.keyword : ''
			let social_id = query.social_id ? query.social_id : ''
			
			let sort_by =  query.sort_by ? query.sort_by :  ''
			let order_by = query.order_by ? query.order_by :  ''
			let autopilot_ids = this.filter.all_autopilot ? [] : this.filter.autopilot
			this.pagination.keyword = keyword 

			if( tab == 'queue' ){
				this.getListQueue({
					current_page , keyword , social_id , sort_by , order_by, autopilot_ids , 
					social_id: social_id  == '' ? this.socials.first().id  : social_id ,
					cancel_request_token : this.cancel_request.token
				})
			}else{
				this.getListAutopilot({
					current_page , keyword , social_id , sort_by , order_by, 
					cancel_request_token : this.cancel_request.token
				})
			}
			
		},
		getListAutopilot(payload){
			this.is_loading_error = false
			this.is_loading = true
			this.getAutopilot(payload).then((res)=>{
				let { status = false, data = null , pagination } = res.data 
				if( status ){
					this.pagination.data = data 
					this.pagination.current_page = pagination.current_page 
					this.pagination.total_page = pagination.total_page 
					this.pagination.total = pagination.total 
				}else{
					this.pagination.data = [] 
				}
				this.is_loading = false
			})
			.catch((err)=>{
				if ( !this.$axios.isCancel(err)) {
					this.is_loading_error = true
					this.is_loading = false
				}
			})
		},
		getListQueue(payload){
			this.is_loading_error = false
			this.is_loading = true
			this.getQueue(payload).then((res)=>{
				let { status = false, data = null , pagination } = res.data 
				if( status ){
					this.pagination.data = data.map((item)=>{
						item['preview_image'] = ''
						if( item.auto_post_type == 3 && item.integrate_json && item.integrate_json.review_priority ){

							if( item.review && item.review.review && item.review.review && item.review.review.images && item.review.review.images.length ){
								item.preview_image = item.review.review.images.first()
							}
						}
						if( !item['preview_image'] ){
							if( item.product_json && item.product_json.selected_images && item.product_json.selected_images.length ){
								item.preview_image = item.product_json.selected_images.first()
							}
						}
						return item
					})
					this.pagination.current_page = pagination.current_page 
					this.pagination.total_page = pagination.total_page 
					this.pagination.total = pagination.total 
				}else{
					this.pagination.data = []
				}
				this.is_loading = false
			})
			.catch((err)=>{
				if ( !this.$axios.isCancel(err)) {
					this.is_loading_error = true
					this.is_loading = false
				}
			})
		}
	},
	async beforeRouteUpdate(to, from, next) {
		try {
			this.is_loading = true;
			await this.getList(to);
		} catch (e) {
			
		} finally {
			next();
		}
	},
	async created(){
		this.is_loading_page = true 
		this.is_loading = true
		try {
			await this.handleGetSocialAccount()
		} catch (e) {
			this.is_loading_error = true
		}
		this.getList(this.$route);
		this.is_loading_page = false
	}
}
</script>
<style lang="scss" scoped>
	.list-autopilot{
		position: relative;
		display: flex;
		&-loading{
			height: 400px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		&-filter{
			display: flex;
			align-items: center;
			&-status{
				width: 100%;
			}
			&-search{
				@include flex(360px);
			}
			&-daterange{
				@include flex(220px);
				margin-left: 16px;
			}
		}
		&-header{
			background-color: $light-gray4;
		}
	}
	.item-modal-autopilot-type{
		min-height: 88px;
		display: flex;
		align-items: center;
		padding: 16px;
		width: 100%;
		cursor: pointer;
		border-bottom: 1px solid $border-color;
		background-color: transparent;
		transition: all 0.3s ease;
		* {
			pointer-events: none;
		}
		&:hover:not(.item-modal-autopilot-type-disabled){
			background-color: #f2f2f2;
		}
		&-disabled{
			opacity: 0.5;
			cursor: not-allowed;
		}
		&-image{
			@include flex(56px);
			height: 56px;
			background: #E8F4FF;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 22px;
			color: $primary-color;
			border-radius: 4px;
			&-alireview{
				background-color: #FEF5ED;
			}
		}
		&-content{
			position: relative;
			@include col;
			color: $text;
			padding: 0 16px;
			h4{
				font-size: 14px;
				margin: 0;
				label{
					background-color: #FEF5ED;
					color: #F2994A;
					padding: 4px 8px;
					font-weight: 600;
					font-size: 12px;
					line-height: 22px;
					margin-left: 8px;
					border-radius: 4px;
				}
			}
			p{
				font-size: 14px;
				margin: 0;
				// white-space: nowrap;
			}
		}
		&-action{
			@include flex(30px);
			text-align: right;
			color: #CECECE;
		}
		&:last-child{
			border-bottom: none;
		}
	}
</style>
<style lang="scss">
	.list-autopilot{
		.list-autopilot-content-sticky{
			background: transparent;
			padding: 0 150px 0 24px;
			.btn-create-autopilot{
				position: absolute;
				top: 4px;
				right : 24px;
				opacity: 0;
				visibility: hidden;
				transition: all 0s ease;
			}
			&.vue-position-sticky{
				background: $light-gray4;
				.btn-create-autopilot{
					opacity:1;
					visibility: visible;
					transition: all 0.2s ease;
				}
			}
		}
	}
</style>