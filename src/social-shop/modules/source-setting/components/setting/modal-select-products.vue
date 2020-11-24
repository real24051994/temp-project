<template>
	<a-modal class="modal-select-product" title="Select Product" width="700px" :after-close="afterClose" v-model="visible" :footer="false" @cancel="closeModal()" :bodyStyle="{ padding: 0}">
		<div class="search-product">
			<a-input v-model="keyword" ref="search" placeholder="Keywords" type="text" @keyup="onKeyword" class="w-100">
				<a-icon slot="prefix" type="search" />
			</a-input>
		</div>
		<transition name="fade-in" mode="out-in">
			<div v-if="is_loading" class="list-products" key="loading">
				<a-skeleton v-for="item in loading_rows"  :key="`loading_${item}`"  active :avatar="{ shape : 'square'}" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
			</div>

			<div v-else class="list-products" key="loaded">
				<template v-if="data.length > 0">
					<div v-for="item in data" :key="item.id" class="product-item" @click="onChangeCollection(item.id)">
						<div class="product-item-checkbox">
							<label class="ant-checkbox-wrapper m-r-10">
								<span class="ant-checkbox" :class="{ 'ant-checkbox-checked': isChecked(item.id) }">
									<span class="ant-checkbox-inner"></span>
								</span>
							</label>
						</div>
						<div class="product-item-content">
							<div class="product-item-image">
								<img v-if="item.main_image" :src="item.main_image" alt />
								<img v-else src="@shop/assets/images/no-image.svg" alt />
							</div>
							<div class="product-item-title" :title="item.title">
								{{ item.title }}
							</div>
						</div>
						<div class="product-item-id">
							{{ item.id }}
						</div>
						<div class="product-item-price">
							<template v-if="item.price">
								<template
									v-if="item.price.min_price == item.price.max_price">{{item.price.max_price | money}}</template>
								<template v-else>
									{{ item.price.min_price | money }} -
									{{ item.price.max_price | money}}
								</template>
							</template>
						</div>
					</div>
				</template>

				<template v-else>
					<div class="d-flex align-items-center justify-content-center p-5">Product not found</div>
				</template>
			</div>
		</transition>
		<div class="modal-action">
			<div class="modal-action-pagination">
				<a-button :disabled="pagination.pageInfoPrev == ''" @click="prev()">
					Prev
				</a-button>
				<a-button class="m-l-15" :disabled="pagination.pageInfoNext == ''" @click="next()">
					Next
				</a-button>
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
				data: [],
				visible : true,
				keyword: "",
				pagination: {
					pageInfoPrev: '',
					pageInfoNext : '',
				},
				selected_items: [],
				timeout : null 
			};
		},
		computed:{
			loading_rows(){
				return this.data.length ? this.data.length : 3
			}
		},
		methods: {
			...mapActions({
				getProducts: "source-setting/getProducts",
			}),

			fetchData(duration) {
				this.is_loading = true;
				if (this.cancel_request) {
					this.cancel_request.cancel('Start new request, stop active request');
				}
				this.cancel_request = this.createAxiosCancelRequestToken()
				var rel = duration ? duration : ''
				this.getProducts({
					keyword : this.keyword,
					rel,
					pageInfoNext : this.pagination.pageInfoNext,
					pageInfoPrev : this.pagination.pageInfoPrev,
				}).then((res)=>{
					const { status = false , data,  page_info_previous , page_info_next } = res.data;
					if (status && data) {
						this.data = data
						this.pagination.pageInfoPrev = page_info_previous;
						this.pagination.pageInfoNext = page_info_next;
					}else{
						this.toastError({
							title: "Error",
							message,
						});
					}
					this.is_loading = false;
				})
				.catch((err)=>{
					this.toastError({
						title: "Error",
						message: "There was an error retrieving data from the server.",
					});
					this.is_loading = false;
				})
			},


			onSearch() {
				this.pagination.pageInfoPrev = '';
				this.pagination.pageInfoNext = '';
				this.fetchData('');
			},

			onClickApply() {
				this.$emit("on-select", this.selected_items);
				this.closeModal()
			},

			onChangeCollection(id) {
				const index = this.selected_items.indexOf(id)
				if (index >= 0) {
					this.selected_items.splice(index, 1);
				} else {
					this.selected_items.push(id);
				}
			},

			isChecked(id) {
				return this.selected_items.indexOf(id) >= 0;
			},

			closeModal() {
				this.visible = false 
			},

			onChangeKeyword(){
				this.pagination.pageInfoPrev = '';
				this.pagination.pageInfoNext = '';
				this.fetchData('')
			},
			next(){
				if( this.pagination.pageInfoNext){
					this.fetchData('next')
				}	
			},
			prev(){
				if( this.pagination.pageInfoPrev){
					this.fetchData('prev')
				}
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
			this.fetchData();
		},
	};
</script>

<style lang="scss" scoped>
	.modal-select-product{
		.product-item {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #e2e2e2;
			padding: 8px 16px;
			cursor: pointer;
			&-checkbox{
				@include flex(30px);
			}
			&-content{
				@include col;
				min-width: 0;
				display: flex;
				align-items: center;
				padding-right: 15px;
			}
			&-id{
				@include flex(120px);
				font-size: 12px;
				color: $dark-gray3;
			}
			&-price{
				@include flex(130px);
				text-align: right;
			}
			&-image{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40px;
				height: 40px;
				border-radius: 4px;
				overflow: hidden;
				padding: 3px;
				@include flex(40px);
				border: 1px solid $border-color;
				img{
					max-width: 100%;
					max-height: 100%;
				}
			}
			&-title{
				padding-left: 12px;
				@include col;
				min-width: 0;
				@include line-clamp(2);
				
			}
		}

		.is-activated {
			border-bottom: 2px solid $primary-color;
			color: $primary-color;
			font-weight: 500;
		}

		.search-product {
			padding: 8px 16px;
			border-bottom: 1px solid #e1e1e1;
		}

		.list-products {
			padding: 0 16px;
			.product-item{
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
