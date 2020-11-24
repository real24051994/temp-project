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
									Gallery
								</h1>
							</div>
							<div class="col col-6">
								<div class="text-right">
									<a-button type="primary" @click="showModalAccounts">
										<i class="m-r-5"><sh-icon :icon="['fal','plus']" /></i> Add Gallery
									</a-button>
								</div>
							</div>
						</div>
						<div class="row m-t-30">
							<div class="col col-12">
								<vue-list-gallery-table @reload="reload" @on-add-gallery="showModalAccounts" :data="pagination.data" :loading="is_loading" />
							</div>
						</div>
					</div>
					<vue-list-gallery-modal-accounts @reload="reload" v-model="is_modal_account_visible" />
				</template>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import VueListGalleryTable from '../components/vue-list-gallery-table'
import VueListGalleryModalAccounts from '../components/vue-list-gallery-modal-accounts'
export default {
	name : 'Gallery',
	components:{
		VueListGalleryTable,
		VueListGalleryModalAccounts
	},
	metaInfo(){
		return {
			title: 'Gallery'
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
			getListGallery : 'gallery/getList'
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
			this.is_loading = true
			this.getListGallery({
				cancel_request_token : this.cancel_request.token
			}).then((res)=>{
				let { data = null, status = false } = res.data;
				if (status) {
					this.pagination.data = data
				}else{
					this.pagination.data = data
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