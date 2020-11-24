<template>
	<div class="vue-feed-product">
		<div class="vue-feed-product-header">
			<div class="vue-feed-product-header-navbar">
				<vue-feed-filter-product  v-model="filters" :is-active="status" @on-change-filter="onChangeFilter" />
				<div class="vue-feed-product-header-search">
					<a-input
						ref="search"
						placeholder="Search by Title"
						type="text"
						@keyup="onKeyword"
						v-model="pagination.keyword"
					>
						<a-icon slot="prefix" type="search" />
					</a-input>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="vue-feed-product-header-action">
				<button @click="visible = !visible" class="ant-btn"><sh-icon class="m-r-5" :icon="['far', 'plus']" />Customize Column</button>
         		<AddColumn :column_feed.sync="show_column" :is_hidden.sync="visible" v-if="visible"></AddColumn>
			</div>
		</div>
		<div class="vue-feed-product-body">
			<vue-feed-list-product @reload="onReload" :loading="is_loading" :show-column="show_column" v-model="data" />
		</div>
		<div class="vue-feed-product-footer">
			<a-button :disabled="pagination.prev_page == null" @click="prev()">
				<sh-icon class="m-r-10" :icon="['far', 'long-arrow-alt-left']" /> Prev
			</a-button>
			<a-button :disabled="pagination.next_page == null" @click="next()">
				Next <sh-icon class="m-l-10" :icon="['far', 'long-arrow-alt-right']" />
			</a-button>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import VueFeedFilterProduct from './vue-feed-filter-product'
import VueFeedListProduct from './vue-feed-list-product'
import AddColumn from '../add-column.vue'
import AssignValue from '../assign-value.vue'
export default {
	name : 'VueFeedProduct',
	components:{
		VueFeedFilterProduct,
		AddColumn,
		VueFeedListProduct
	},
	props :{
		value :{
			type : Array,
		},
		showColumn :{
			type : Array,
		}
	},
	data(){
		return {
			is_loading : true,
			is_loading_error : false,
			pagination : {
				keyword : '',
				current_page : 1,
				total_page : 0,
				next_page : null,
				prev_page : null 
			},
			data : [],
			visible : false,
			cancel_request : null,
			timeout : null ,
			params_sort : ['tab' , 'status' , 'page' , 'keyword']
		}
	},
	computed:{
		filters :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		status(){
			var status = this.$route.query && this.$route.query.status ? this.$route.query.status : ''
			return status  ? status : 'all'
		},
		show_column :{ 
			get(){
				return this.showColumn 
			},
			set(value){
				this.$emit('update:showColumn', value)
			}
		}
	},
	methods :{
		...mapActions({
			getStatusCount : 'feed/getStatisticsStatusDetails',
			getListProductFeed: 'feed/getListProductFeed',
		}),
		onChangeFilter(value){
			var query = {}
			if( this.$route.query && this.$route.query.keyword ){
				query['keyword'] = this.$route.query.keyword
			}
			if( value != 'all'){
				query['status'] = value
			}
			this.pushRouterLinkDefault({
				query: query
			});
		},
		onChangeRoute(){
			this.getProductList(this.$route)
		},
		onChangeKeyword(){
			let query = this.getCurrentQuery(this.$route)
			this.pagination.current_page = 1
			if (this.pagination.keyword) {
				query['keyword'] = this.pagination.keyword
			} else {
				delete query['keyword']
			}
			if (query.hasOwnProperty('page')) {
				delete query['page']
			}
			this.setQueryUrl(query)
		},
		onKeyword(){	
			if( this.timeout ){
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(() => {
				this.onChangeKeyword()
			}, 1000);
		},
		prev(){
			let query =  this.getCurrentQuery
			if (this.pagination.prev_page) {
				query['page'] = this.pagination.prev_page
			}
			this.setQueryUrl(query)
		},
		next(){
			let query =  this.getCurrentQuery
			if (this.pagination.next_page) {
				query['page'] = this.pagination.next_page
			}
			this.setQueryUrl(query)
		},
		getCurrentQuery(route) {
			let query = {}
			if (route.query.page && this.$helper.isNumeric(route.query.page)) {
				query['page'] = route.query.page
			}
			if (route.query.keyword) {
				query['keyword'] = route.query.keyword
			}
			if (route.query.status) {
				query['status'] = route.query.status
			}
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
				query: query,
			})
		},
		getProductList(route){
			return new Promise((resolve, reject) => {
				this.is_loading = true
				let  keyword = '' , page = 1 , status = 'all'
				if (this.$route.query['page']) {
					page = this.$route.query['page']
				}
				if (this.$route.query['keyword']) {
					keyword = this.$route.query['keyword']
				}
				if (this.$route.query['status']) {
					status = this.$route.query['status']
				}
				if (this.cancel_request) {
					this.cancel_request.cancel('Start new request, stop active request');
				}
				this.cancel_request = this.createAxiosCancelRequestToken()
				this.getListProductFeed({
					keyword, page , status,
					limit : 50,
					ss_feed_id : this.$route.params.id,
					social_type : 'google',
				})
				.then((res) => {
					let { status, data, pagination } = res.data
					if (status && data && pagination) {
						this.data = data.map(item=>{
							item['mounted'] = false 
							return item
						})
						this.pagination.current_page = pagination.current_page
						this.pagination.total_page = pagination.total_page
						this.pagination.total = pagination.total
						this.pagination.next_page = pagination.next_page
						this.pagination.prev_page = pagination.prev_page
					}else{
						this.data = null
					}
					this.is_loading = false
					this.is_loading_error = false
					resolve()
				})
				.catch((res) => {
					if ( !this.$axios.isCancel(err)) {
						this.is_loading = false
						this.is_loading_error = true;
					} 
					reject()
				})
			})
		},
		getStatusFilterCount(){
			return new Promise((resolve, reject) => {
				this.getStatusCount({
					ss_feed_id : this.$route.params.id 
				}).then((res)=>{
					let { status = false , data = '' } = res.data 
					if( status && data ){
						let { approved_status } = data 
						var filter = this.$clone(this.filters)
						filter = filter.map((item)=>{
							if( approved_status.hasOwnProperty(item.id)){
								item['count'] = approved_status[item.id]
							}
							return item
						})
						this.$emit('input', filter)
					}
					resolve()
				})
				.catch((err)=>{
					resolve()
				})
			});
		},
		onReload(){
			this.getProductList(this.$route)
		}
	},
	watch  : {
		'$route.query' : function(value){
			this.is_loading = true
			this.onChangeRoute()
		}
	},
	mounted(){
		if (this.$route.query.keyword) {
			this.pagination.keyword = this.$route.query.keyword
		}
		var promises = [ this.getStatusFilterCount() , this.getProductList(this.$route)]
		Promise.all(promises).then((res)=>{

		})
	}
}
</script>

<style lang="scss">
	.vue-feed-product{
		&-header{
			display: flex;
			height: 50px;
			align-items: center;
			padding: 0 24px;
			&-navbar{
				display: flex;
			}
			&-search{
				width : 270px;
				margin-left: 16px;
			}
			&-action{
				position: relative;
			}
		}
		&-body{
			padding: 0 24px;
		}
		&-footer{
			padding: 0 24px;
			height: 50px;
			display: flex;
			align-items: center;
			justify-content: center;
			button{
				margin: 0 10px;
			}
		}
	}
</style>