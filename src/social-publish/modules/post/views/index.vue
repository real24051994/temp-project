<template>
	<div class="page-container vue-list-post-page"  :class="{ 'page-container-collapse' : aside_collapse }">
		<div class="list-post-container" >
			<template v-if="is_loading_error">
				<div class="list-post-error" >
					<vue-error type="500"></vue-error>
				</div>
			</template>
			<template v-else>
				<div class="page-container-aside list-post-aside" id="vue-list-post-accounts">
					<vue-list-post-account :loading="is_loading_page" :set-router-link="setRouterLinkAccount"  :data="social_accounts"/>
				</div>
				<div class="page-container-content list-post-content">
					<div class="page-container-wrapper">
						<div class="list-post-content-header page-container-header bg-light-gray4">
							<div class="page-container-header-title">
								<div class="list-post-content-title">
									<h1 class="page-title">{{ $t('post.title.post_center')}}</h1>
								</div>
								<div class="list-post-content-actions">
									<a-button id="btn-create-post-in-post-center" type="primary" @click="showModalCreatePost">
										<sh-icon  icon="paper-plane"/>
										<span class="m-l-10">{{ $t('post.btn.create_post') }}</span>
									</a-button>
								</div>
							</div>
							<vue-position-sticky :offsetTop="offsetTop" sticky-class="list-post-content-sticky" >
								<div class="vue-list-tabs">
									<router-link class="item-tab" v-for="(item,index) in status" :key="`tab_${index}`" :to="setRouterLinkTab(item)"
										:class="{ 'is-actived' : activeRouterLinkTab(item)}">
										{{ $t(`post.tab.${item}`) }}
										<template v-if="item == 'error'">
											<div class="item-tab-count item-tab-count-danger">
												{{ status_count.hasOwnProperty('error') ? status_count.error : 0 }}
											</div>
										</template>
									</router-link>
								</div>
								<a-button id="btn-create-post-in-post-center-sticky" class="btn-create-post" type="primary" @click="showModalCreatePost">
									<sh-icon icon="paper-plane" />
									<span class="m-l-10">{{ $t('post.btn.create_post') }}</span>
								</a-button>
							</vue-position-sticky>
						</div>
						<div class="list-post-content-body page-container-body">
							
							<div class="list-post-content-filter m-t-16">
								<div class="list-post-content-filter-search">
									<span class="ant-input-affix-wrapper">
										<span class="ant-input-prefix icon-search">
											<sh-icon :icon="['far','search']" />
										</span>
										<input @keyup="onKeyword" v-model="filters.keyword" placeholder="Search..." type="text" class="ant-input">
									</span>
								</div>
								<div class="spacer"></div>
								<div class="list-post-content-filter-daterange">
									<a-range-picker v-model="filters.date" @change="onChangeDate"  >
										<i slot="suffixIcon">
											<sh-icon :icon="['far','calendar']" />
										</i>
									</a-range-picker>
								</div>
							</div>
							<div class="list-post-content-table">
								<div class="m-t-16">
									<vue-list-post-table :loading="is_loading_post || is_loading_page" 
									:is-error="is_loading_post_error" 
									@on-sort-date="sortDate" 
									@on-reload="reload" 
									:setRouterLink="setRouterLinkSort"
									:data="pagination.data"
									:page.sync="pagination.current_page"
									:total="pagination.total_page" 
									:filters="filters" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import VueListPostTable from '../components/list/vue-list-post-table'
import VueListPostAccount from '../components/list/vue-list-post-account'
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name : 'ManagePost',
	mixins : [mixin_time_format],
	components:{
		VueListPostAccount,
		VueListPostTable,
	},
	metaInfo(){
		return {
			title: 'Post Center'
		}
	},
	data(){
		return {
			is_loading_page: true,
			is_loading_error : false,
			is_loading_post : false,
			is_loading_post_error : false,
			social_accounts : [],
			cancel_request: null,
			params_sort: ['status', 'social_id', 'from', 'to', 'sort', 'keyword', 'page'],
			status: ['published', 'scheduled', 'draft' , 'error'],
			default_sort: 'DESC',
			default_status : 'published',
			default_social_id : '',
			filters : {
				keyword : '',
				sort : '',
				date :[]
			},
			pagination :{
				total : 0,
				data: [],
				current_page : 1,
				total_page : 0,
			},
			status_count : {
				error : null
			},
		}
	},
	computed:{
		...mapGetters({
			aside_collapse : 'utils/getAsideCollapse',
			banner : 'pricing/getShowBanner',
			time_setting : 'auth/getTimeSetting',
		}),
		offsetTop(){
			return this.banner ? 48 + 49 : 48 
		}
	},
	methods:{
		...mapActions({
			getPosts: "post/list",
			getPostStatusCount : 'post/getStatusCount',
			getSocialAccounts: "account/list",
			dataLayer : 'auth/dataLayer'
		}),
		parseTimezoneToUTC( time , format = 'YYYY-MM-DD HH:mm:ss' , format_target ){
			return timezone.tz( time , format, true, this.time_setting.timezone).utc().format(format_target ? format_target : format)
		},
		onChangeKeyword() {
			let query = this.getCurrentQuery(this.$route)
			var keyword = this.filters.keyword
			if( keyword ){
				query['keyword'] = keyword
			}else{
				delete query['keyword'] 
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}
			this.setQueryUrl(query)
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

		onChangeDate(dates) {
			let query = this.getCurrentQuery(this.$route)
			if (dates.length) {
				var from = dates[0].format("YYYY-MM-DD");
				var to = dates[1].format("YYYY-MM-DD");
				query['from'] = from
				query['to'] = to
			} else {
				if (query.hasOwnProperty('from')) {
					delete query['from']
				}
				if (query.hasOwnProperty('to')) {
					delete query['to']
				}
			}
			this.setQueryUrl(query);
		},

		sortDate() {
			let query = this.getCurrentQuery(this.$route)
			var sort = ''
			if (query.sort) {
				sort = query.sort == 'DESC' ? 'ASC' : 'DESC'
			} else {
				sort = 'ASC'
			}
			query['sort'] = sort
			this.setQueryUrl(query)
		},

		changeToPage(page) {
			let query = this.getCurrentQuery(this.$route)
			if (query['page'] != page) {
				query['page'] = page
				this.setQueryUrl(query)
			}
		},

		setRouterLinkTab(value) {
			var query = this.getCurrentQuery(this.$route)
			if( value == this.status[0]){
				delete query['status']
			}else{
				query['status'] = value
			}
			for (var op in query) {
				if (query.hasOwnProperty(op)) {
					if (query[op] == '') {
						delete query[op]
					}
				}
			}
			if (value != 'draft' && value != 'error') {
				if( query.hasOwnProperty('social_id') && query['social_id'] == 'all' ){
					delete query['social_id']
				}
				
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}

			return {
				name: 'ManagePost',
				query: this.sortQueryUrl(query)
			}
		},

		setRouterLinkAccount( value ) {
			var query = this.getCurrentQuery(this.$route)
			query['social_id'] = value
			for (var op in query) {
				if (query.hasOwnProperty(op)) {
					if (query[op] == '') {
						delete query[op]
					}
				}
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}
			
			return {
				name: 'ManagePost',
				query: this.sortQueryUrl(query)
			}
		},

		setRouterLinkSort( value ) {
			var query = this.getCurrentQuery(this.$route)
			if( value == 'DESC'){
				query['sort'] = 'ASC'
				// delete query['sort']
			}else{
				delete query['sort']
				// query['sort'] = 'ASC'
			}
			for (var op in query) {
				if (query.hasOwnProperty(op)) {
					if (query[op] == '') {
						delete query[op]
					}
				}
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}
			
			return {
				name: 'ManagePost',
				query: this.sortQueryUrl(query)
			}
		},

		activeRouterLinkTab(tab) {
			var status = this.$route.query && this.$route.query.status ? this.$route.query.status : 'published'
			return status == tab
		},

		getCurrentQuery(route) {
			let query = {}
			if (route.query.page && this.$helper.isNumeric(route.query.page)) {
				query['page'] = route.query.page
			}
			if (route.query.status && this.status.indexOf(route.query.status) >= 0) {
				query['status'] = route.query.status
			}else{
				delete query['status']
			}
			if (route.query.keyword) {
				query['keyword'] = route.query.keyword
			}
			if (route.query.sort) {
				query['sort'] = route.query.sort
			} else {
				delete query['sort']
			}
			if (route.query.social_id) {
				query['social_id'] = route.query.social_id
			}
			if (route.query.from && route.query.to) {
				query['from'] = route.query.from
				query['to'] = route.query.to
			} else {
				if (query.hasOwnProperty('from')) {
					delete query['from']
				}
				if (query.hasOwnProperty('to')) {
					delete query['to']
				}
			}
			return query
		},

		sortQueryUrl(object){
			var query = {}
			this.params_sort.forEach((item) => {
				if (object.hasOwnProperty(item)) {
					query[item] = object[item]
				}
			})
			return query
		},

		setQueryUrl(object) {
			var query = {}
			this.params_sort.forEach((item) => {
				if (object.hasOwnProperty(item)) {
					query[item] = object[item]
				}
			})
			this.pushRouterLinkDefault({
				name: 'ManagePost',
				query: query
			});
		},

		getListPost(next) {
			var route = next ? next : this.$route
			var query = this.getCurrentQuery(route)
			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()

			this.is_loading_post = true;
			this.is_loading_post_error = false
			this.is_loading_error = false
			var current_page = this.pagination.current_page;
			this.pagination.total_page = 0;
			this.pagination.total = 0;
			let page = query.page ? query.page : 1 
			let keyword = query.keyword ? query.keyword : ''
			let social_id = query.social_id ? query.social_id : this.default_social_id
			let status = query.status ? query.status : this.default_status
			let sort =  query.sort ? query.sort :  this.default_sort
			
			
			var date = []
			var date_from = moment(query.from ? query.from : '', 'YYYY-MM-DD')
			var date_to = moment(query.to ? query.to : '', 'YYYY-MM-DD')
			let from = '' , to = '';
			if (date_from.isValid() && date_to.isValid()) {
				date = [date_from, date_to]
				let string_from = date_from.format('YYYY-MM-DD 00:00:00')
				let string_to = date_to.format('YYYY-MM-DD 23:59:59')
				// from = moment.utc(moment(string_from, 'YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss')
				// to = moment.utc(moment(string_to, 'YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss')
				from = this.mixinParseTimezoneToUTC(string_from , 'YYYY-MM-DD HH:mm:ss')
				to = this.mixinParseTimezoneToUTC(string_to , 'YYYY-MM-DD HH:mm:ss')
			}
			this.filters.date = date
			this.filters.status =  status 
			this.filters.sort = sort
			this.getPosts({
				page, 
				keyword, 
				status, 
				from, 
				to, 
				social_id , 
				sort, 
				cancel_request_token : this.cancel_request.token
			})
			.then((res)=>{
				let { data , status = false , pagination} = res.data;
				if (status) {
					if(data) {
						this.pagination.data = data;
						this.pagination.current_page = pagination.current_page
						this.pagination.total_page = pagination.total_page;
						this.pagination.total = pagination.total;
						if (!data.length && query.page > pagination.total_page && pagination.total_page > 0) {
							this.changeToPage(pagination.total_page);
						}
					} else {
						this.pagination.data = []
						this.is_loading_post_error = 'empty'
					}
				} else {
					this.is_loading_post_error = '404'
				}
				this.is_loading_post = false;
			})
			.catch((err) => {
				if ( !this.$axios.isCancel(err)) {
					this.is_loading_error = true
					this.is_loading_post = false;
				} 
			})
		},

		reload() {
			this.getListPost();
		},

		showModalCreatePost(){
			this.dataLayer({
				'create-post-button' : 'From Post Center'
			})
			this.$POST_Modals.showModalPost()
		},
		getStatusCount(){
			return new Promise((resolve, reject)=>{
				this.getPostStatusCount().then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						this.status_count = data 
					}
					resolve(res)
				})
				.catch((err)=>{
					reject(err)
				})
			})
		},
		onScroll(){
			// window.onscroll = function() {myFunction()};

			// var navbar = document.getElementById("navbar");
			// var sticky = navbar.offsetTop;

			// function myFunction() {
			// 	if (window.pageYOffset >= sticky) {
			// 		navbar.classList.add("sticky")
			// 	} else {
			// 		navbar.classList.remove("sticky");
			// 	}
			// }
		},
		isSticky(el) {
			
		},
		loadDefaultData(){
			return new Promise((resolve, reject)=>{
				Promise.all([ this.getStatusCount() , this.getListPost(this.$route)]).then(values => { 
					resolve()
				})
			});
			
		}
	},
	async beforeRouteUpdate(to, from, next) {
		try {
			this.is_loading_post = true;
			this.is_loading_post_error = false
			await this.getListPost(to);
		} catch (e) {
			
		} finally {
			next();
		}
	},
	created(){
		this.$eventBus.$on("reload-list-post", ()=>{
			this.reload()
		});
	},
	async mounted(){
		try {
			var accounts = await this.getSocialAccounts()
			let { status = false , data = null } = accounts.data
			if ( status && data ) {
				this.social_accounts = data
				if( data.length ){
					this.default_social_id = data[0].id
				}
			}else{
				this.is_loading_error = 'empty'
			}
		} catch (e) {
			this.is_loading_error = true
			this.is_loading_page = false
		}
		if( !this.is_loading_error ){
			await this.loadDefaultData()
			this.is_loading_page = false
			await this.$nextTick()
		}
	},
	beforeDestroy() {
		this.$eventBus.$off("reload-list-post");
	}
}
</script>
<style lang="scss" scoped>
	.vue-list-post-page{
		position: relative;
		.list-post{
			&-loading ,&-error{
				height: 400px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			&-container{
				display: flex;
			}
			&-content{
				&-title{
					@include flex(50%);
				}
				&-actions{
					@include flex(50%);
					text-align: right;
				}
				&-filter{
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					&-total-record{

					}
					&-search{
						@include flex(360px);
						.icon-search{
							color: rgba(37, 38, 39, 0.65);
						}
					}
					&-daterange{
						margin-left: 8px;
						@include flex(240px)
					}
				}
			}
		}
	}
</style>
<style lang="scss">
	.vue-list-post-page{
		.list-post-content-sticky{
			background: transparent;
			padding: 0 150px 0 24px;
			.btn-create-post{
				position: absolute;
				top: 4px;
				right : 24px;
				opacity: 0;
				visibility: hidden;
				transition: all 0s ease;
			}
			&.vue-position-sticky{
				background: $light-gray4;
				.btn-create-post{
					opacity:1;
					visibility: visible;
					transition: all 0.2s ease;
				}
			}
		}
	}
</style>