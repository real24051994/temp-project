<template>
	<div class="vue-social-widget">
		<transition name="fade-in" mode="out-in">
			<div class="app-box-loading" v-if="is_loading_page" key="is-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
			<div class="vue-social-widget-container" v-else key="is-loading-success">
				<template v-if="is_loading_error">
					<div class="vue-social-widget-error" >
						<vue-error type="500"></vue-error>
					</div>
				</template>
				<template v-else>
					<div class="container p-b-50 p-t-50">
						<div class="row">
							<div class="col col-6">
								<h1 class="page-title">
									Widget
								</h1>
							</div>
							<div class="col col-6">
								<div class="text-right">
									<router-link  class="ant-btn ant-btn-primary" :to="{ name : 'CreateWidget'}">
										<span><i class="m-r-5"><sh-icon :icon="['fal','plus']" /></i>Add Widget</span>
									</router-link>
								</div>
							</div>
						</div>
						<div class="row m-t-30">
							<div class="col col-12">
								<vue-list-pages-table @reload="reload" :data="pagination.data" :loading="is_loading" />
							</div>
						</div>
					</div>
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import VueListPagesTable from '../components/vue-list-pages-table'
export default {
	name : 'Gallery',
	components:{
		VueListPagesTable,
	},
	metaInfo(){
		return {
			title: 'Widget'
		}
	},
	data(){
		return {
			is_loading : true,
			is_loading_page: true,
			is_loading_error : false,
			is_modal_account_visible : false,
			pagination :{
				data : []
			},
			cancel_request : null
		}
	},
	methods:{
		...mapActions({
			getListWidgets : 'widget/getList',
		}),
		showModalAccounts(){
			this.is_modal_account_visible = true
		},
		changeToPage(page) {
			let query = this.$route.query
			if (query['page'] != page) {
				query['page'] = page
			}
		},
		reload(){
			this.getList(this.$route)
		},
		getList(next){
			var route = next ? next : this.$route
			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()
			let query = next.query
			let page = query.page ? query.page : 1 
			let keyword = query.keyword ? query.keyword : ''
			this.is_loading = true
			this.getListWidgets({
				page, 
				keyword, 
				cancel_request_token : this.cancel_request.token
			}).then((res)=>{
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
				}
			})
			.finally(()=>{
				this.is_loading = false
			})
		}
	},
	async mounted(){
		try {
			await this.getList(this.$route)
		} catch (e) {
			this.is_loading_error = true
		} finally {
			this.is_loading_page = false
		}
		
	}
}
</script>
<style lang="scss" scoped>
	
</style>