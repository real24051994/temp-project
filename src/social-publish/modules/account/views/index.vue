<template>
	<div class="vue-list-account-page">
		<div class="container">
			<div class="row">
				<div class="col col-12">
					<template v-if="is_loading_error">
						<div class="list-account-error">
							<vue-error type="500"></vue-error>
						</div>
					</template>
					<template v-else>
						<div class="page-container">
							<div class="page-container-header">
								<div class="page-container-header-title">
									<h1 class="page-title"> {{ $t('account.title.page_account') }} </h1>
									<div class="spacer"></div>
									<a-button id="btn-create-post-in-post-center" type="primary" @click="showModal">
										{{ $t('account.btn.show_modal_create_account') }}
									</a-button>
								</div>
							</div>
							<div class="page-container-body">
								<vue-list-account-table @on-reload="reload" :loading="is_loading_page" />
							</div>
						</div>
						<vue-list-account-modal-create v-if="visible" v-model="visible" @on-reload="reload" :data="data" />
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueListAccountTable from "../components/vue-list-account-table";
import VueListAccountModalCreate from "../components/vue-list-account-modal-create";

export default {
	name: "ManageAccount",
	components: {
		VueListAccountTable,
		VueListAccountModalCreate
	},
	metaInfo() {
		return {
			title: "Manage Account"
		};
	},
	data() {
		return {
			is_loading_page: true,
			is_loading_error: false,
			is_loading: false,
			visible: false,
			data: null,
		};
	},
	computed:{
		...mapGetters({
			
		})
	},
	methods: {
		...mapActions({
			getList: "account/list",
		}),
		showModal() {
			this.visible = true;
		},
		hideModal() {
			this.visible = false;
		},
		handleGetList() {
			this.getList()
				.then(res => {
					let { data = [], status = false } = res.data;
					if (status) {
						this.data = data;
					} else {
						this.is_loading_error = true;
					}
					this.is_loading_page = false;
					this.is_loading = false;
				})
				.catch(res => {
					this.is_loading_error = true;
					this.is_loading_page = false;
					this.is_loading = false;
				})
		},
		reload() {
			this.is_loading = true;
			this.handleGetList();
		},
	},
	mounted() {
		this.handleGetList();
	}
};
</script>
<style lang="scss" scoped>
.vue-list-account-page {
	position: relative;
	.list-account {
		&-loading,
		&-error {
			height: 400px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-content {
			&-title {
				@include flex(50%);
			}
			&-actions {
				@include flex(50%);
				text-align: right;
			}
			&-filter {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				&-total-record {
				}
				&-search {
					@include flex(200px);
					.icon-search {
						color: rgba(37, 38, 39, 0.65);
					}
				}
				&-daterange {
					margin-left: 8px;
					@include flex(240px);
				}
			}
		}
	}
}

</style>