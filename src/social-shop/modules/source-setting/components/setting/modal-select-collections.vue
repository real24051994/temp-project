<template>
	<a-modal class="modal-select-collection" title="Select Collection" width="600px" :after-close="afterClose" v-model="visible" :footer="false" @cancel="closeModal()" :bodyStyle="{ padding: 0}">
		<div class="search-collection">
			<a-input v-model="keyword" ref="search" placeholder="Keywords" type="text" @keyup="onKeyword" class="w-100">
				<a-icon slot="prefix" type="search" />
			</a-input>
		</div>
		<transition name="fade-in" mode="out-in">
			<div v-if="is_loading" class="list-collections" key="loading">
				<a-skeleton v-for="item in loading_rows"  :key="`loading_${item}`"  active :avatar="{ shape : 'square'}" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>

			<div v-else class="list-collections" key="loaded">
				<template v-if="collections.length > 0">
					<label v-for="item in collections" :key="item.id" class="collection-item" @click="onChangeCollection(item)">
						<div class="item-name">
							<div>
								<label class="ant-checkbox-wrapper m-r-10">
									<span class="ant-checkbox" :class="{ 'ant-checkbox-checked': isChecked(item.internal_id) }">
										<span class="ant-checkbox-inner"></span>
									</span>
								</label>
							</div>

							<div class="item-img">
								<img v-if="item.image" :src="item.image" alt />
								<img v-else src="@shop/assets/images/no-image.svg" alt />
							</div>

							<div class="item-title" :title="item.title">
								{{ item.title }}
							</div>

							<div class="item-counter">({{ item.products_in_collection_count }})</div>
						</div>

						<div class="item-type">
							<template v-if="item.type == 'custom'">Manual Collection</template>
							<template v-else-if="item.type == 'smart'">Smart Collection</template>
						</div>
					</label>
				</template>

				<template v-else>
					<div class="d-flex align-items-center justify-content-center p-5">Collection not found</div>
				</template>
			</div>
		</transition>
		<div class="modal-action">
			<div class="modal-action-pagination">
				<vue-pagination :change="onChangePage" v-model="pagination.current_page" :total="pagination.total_page" :router-link="false" />
			</div>
			<div class="spacer"></div>
			<a-button @click="closeModal()" :disabled="is_loading">Cancel</a-button>
			<a-button @click="onClickApply" :disabled="is_loading" class="m-l-10" type="primary">Apply</a-button>
		</div>
	</a-modal>
</template>

<script>
	import { mapActions } from "vuex";
	export default {
		props: {
			value: {
				type: Boolean,
				default: false,
			},

			selected: {
				type: Array,
				default: () => [],
			},
		},

		data() {
			return {
				is_loading: false,
				collections: [],
				visible : true,
				keyword: "",
				pagination: {
					current_page: 1,
					per_page: 10,
					total_page: 1,
					total: 0,
				},
				selected_items: [],
				timeout : null 
			};
		},
		computed:{
			loading_rows(){
				return this.collections.length ? this.collections.length : 3
			}
		},
		methods: {
			...mapActions({
				getCollections: "source-setting/getCollections",
			}),

			async fetchCollections() {
				this.is_loading = true;
				try {
					let response = await this.getCollections({
						page: this.pagination.current_page,
						limit: this.pagination.per_page,
						keyword: this.keyword,
					});

					const { status, message, data, pagination } = response.data;

					if (!status) {
						this.toastError({
							title: "Error",
							message,
						});
						return;
					}

					this.collections = data;
					this.pagination = JSON.parse(JSON.stringify(pagination));
				} catch (error) {
					this.toastError({
						title: "Error",
						message: "There was an error retrieving data from the server.",
					});
				} finally {
					this.is_loading = false;
				}
			},

			onChangePage(page) {
				this.pagination.current_page = page;
				this.fetchCollections();
			},

			onSearch() {
				this.pagination.current_page = 1;
				this.fetchCollections();
			},

			onClickApply() {
				this.$emit("on-select", this.selected_items);
				this.closeModal()
			},

			onChangeCollection(item) {
				const index = _.findIndex(this.selected_items , { internal_id : item.internal_id  })
				if (index >= 0) {
					this.selected_items.splice(index, 1);
				} else {
					this.selected_items.push(item);
				}
			},

			isChecked(internal_id) {
				return this.selected_items.findIndex((item) => item.internal_id === internal_id) >= 0;
			},

			closeModal() {
				this.visible = false 
			},

			onChangeKeyword(){
				this.pagination.current_page = 1
				this.fetchCollections()
			},
			onKeyword(){
				if( this.timeout ){
					clearTimeout(this.timeout)
				}
				this.timeout = setTimeout(() => {
					this.onChangeKeyword()
				}, 500);
			},
			afterClose(){
				this.$emit('input', false)
			}
		},
		created() {
			if (this.selected ) {
				this.selected_items = JSON.parse(JSON.stringify(this.selected));

			}

			this.fetchCollections();
		},
	};
</script>

<style lang="scss" scoped>
	.modal-select-collection {
		.collection-item {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #e2e2e2;
			padding: 8px 16px;
			cursor: pointer;

			.item-name {
				width: 70%;
				display: flex;
				align-items: center;

				.item-img {
					width: 40px;
					height: 40px;
					min-width: 40px;
					border-radius: 2px;
					overflow: hidden;
					margin-right: 16px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.item-title {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item-counter {
					padding-left: 4px;
				}
			}

			.item-type {
				width: 30%;
				text-align: right;
			}
		}

		.is-activated {
			border-bottom: 2px solid $primary-color;
			color: $primary-color;
			font-weight: 500;
		}

		.search-collection {
			padding: 8px 16px;
			border-bottom: 1px solid #e1e1e1;
		}

		.list-collections {
			padding: 0 16px;
			.collection-item{
				&:last-child{
					border-bottom: none;
				}
			}
		}

		.list-pagination {
			padding: 20px 0 6px 0;
		}

		.modal-action {
			border-top: 1px solid #e1e1e1;
			padding: 16px;
			display: flex;
			justify-content: flex-end;
			&-pagination{
				.pagination{
					margin: 0;
				}
			}
		}
	}
</style>
