<template>
  <div class="vue-list-product">
  	<a-modal transitionName="none" maskTransitionName="none" v-model="visible" class="vue-list-product-modal" :z-index="1002" wrap-class-name="vue-list-product-modal-wrap"  :title="$t('post.modal.component.list_product.title')" @cancel="visible = false" width="600px" :footer="false" :afterClose="afterCloseModal" >
		<div class="ant-modal-body-inner" >
			<div class="ant-modal-body-inner-search">
				<span class="ant-input-affix-wrapper ant-input-search">
					<span class="ant-input-prefix">
						<sh-icon :icon="['far','search']" />
					</span>
					<input @keyup="onKeyword" ref="input"  v-model="pagination.search" :placeholder="$t('post.modal.component.list_product.placeholder_search')" type="text" class="ant-input" />
				</span>
			</div>
			<div class="ant-modal-body-inner-content">
				<transition name="fade-in" mode="out-in">
					<div class="ant-modal-body-inner-content-list" v-if="is_loading" key="is-loading">
						<div class="p-l-16 p-r-16 p-t-16 p-b-16">
							<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active :avatar="{ shape : 'square'}" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
						</div>
					</div>
					<div class="ant-modal-body-inner-content-list" v-else key="loading-success">
						<template v-if="pagination.data.length > 0">
							<div>
								<div v-for="(item , index) in pagination.data" :key="`index_${index}`">
									<div @click.stop.prevent="setCurrent(item)" class="item-product">
										<div class="item-product-content">
											<div class="item-product-content-image">
												<template v-if="item.main_image">
													<v-lazy-image  :src="item.main_image" :src-placeholder="require('@publish/assets/icons/default.png')" />
												</template>
												<template v-else>
													<img src="@publish/assets/icons/default.png" alt="">
												</template>
											</div>
											<div class="item-product-content-title">
												<div v-line-clamp:17="2">
													{{item.title}}
												</div>
											</div>
										</div>
										<div class="item-product-price">
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
								</div>
								<div class="p-b-20 p-t-20">
									<div class="box-product-pagination">
										<a-button :disabled="pagination.pageInfoPrev == ''" @click="prev()">
											Prev
										</a-button>
										<a-button :disabled="pagination.pageInfoNext == ''" @click="next()">
											Next
										</a-button>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="ant-modal-body-inner-content-list-not-found">
								{{ $t('post.modal.component.list_product.empty') }}
							</div>
						</template>
					</div>
				</transition>
			</div>
		</div>
  	</a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  	name: "VueListProduct",
  	data() {
  		return {
  			visible: false,
  			selected: null,
			timeout: null,
			cancel_request : null,
  			pagination: {
  				pageInfoNext: '',
  				pageInfoPrev: '',
  				limit: 8,
				search: "",
				data: []
  			},
			is_loading: false,
  		};
  	},
	computed:{
		...mapGetters({
			shop : 'auth/getShop'
		}),
		loading_rows(){
			return 5
		}
	},
  	methods: {
  		...mapActions({
  			getListProduct : "utils/getListProduct"
  		}),

  		showListProduct(duration) {
			this.is_loading = true;
			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()
			var rel = duration ? duration : ''
  			var keyword = this.pagination.search;
			this.getListProduct({
				keyword,
				rel,
				pageInfoNext : this.pagination.pageInfoNext,
				pageInfoPrev : this.pagination.pageInfoPrev,
				cancel_request_token : this.cancel_request.token
			})
			.then(res => {
				let { status, data,  page_info_previous , page_info_next} = res.data;
				if (status) {
					this.pagination.data = data.map(item=>{
						item['link'] = `https://${this.shop.domain}/products/${item.handle}`
						return item
					});
					this.pagination.pageInfoPrev = page_info_previous;
					this.pagination.pageInfoNext = page_info_next;
					// this.pagination.total_page = pagination.total_page;
					// this.pagination.total = pagination.total;
				} else {
					this.pagination.data = [];
				}
				this.is_loading = false;
				resolve()
			})
			.catch(res => {
				this.is_loading = false;
			})
  		},

  		showModal(keyword = "") {
  			this.visible = true;
  			if (keyword) {
				this.is_loading = true;
				this.pagination.search = keyword;
				this.$nextTick(()=>{
					this.$refs.input.focus()
				})
  			}else{
				this.showListProduct();
			}
  		},

  		closeModalProduct() {
  			this.visible = false;
  		},

  		setCurrent(data) {
  			this.$emit("on-select", data);
  			this.closeModalProduct();
  		},

  		onChange() {
  			this.pagination.pageInfoPrev = '';
			this.pagination.pageInfoNext = '';
  			this.showListProduct('');
  		},

  		onKeyword(event) {
  			clearTimeout(this.timeout);
  			if (event.keyCode == 13) {
  				this.onChange();
  			} else {
  				this.timeout = setTimeout(() => {
  					this.onChange();
  				}, 1000);
  			}
  		},

  		resetModal() {
  			this.selected = null;
  			if (this.timeout) {
  				clearTimeout(this.timeout);
  			}
  			this.pagination = {
  				pageInfoNext: '',
  				pageInfoPrev: '',
  				limit: 8,
				search: "",
				data: []
  			}
  			this.is_loading = false
		},
		next(){
			if( this.pagination.pageInfoNext){
				this.showListProduct('next')
			}	
		},
		prev(){
			if( this.pagination.pageInfoPrev){
				this.showListProduct('prev')
			}
		},
		afterCloseModal(){
			this.resetModal();
		}
  	},
};
</script>

<style lang="scss">
.vue-list-product {
	

	h1 {
		font-size: 16px;
	}

	.product-search {
		padding: 0 24px;
	}

	.selected-img {
		border: 2px solid $primary-color;
	}

	.selected-title {
		color: $primary-color;
	}

	

	
	&-modal{
		top: auto;
		padding: 0;
		
		&-wrap{
			display: flex;
			align-items: center;
		}
		.ant-modal{
			top: auto;
			padding: 0;
		
			.ant-modal-content{
				max-height: calc(100vh - 100px);
				position: relative;
				display: flex;
				flex-direction: column;
				.ant-modal-header {
					border-bottom: none;
					padding: 24px;
					height: 70px;
					display: flex;
					align-items: flex-start;
					flex-shrink: 0;
				}
				.ant-modal-body {
					display: flex;
					flex-grow: 1;
					overflow-x: hidden;
					padding: 0;
					&-inner{
						width: 100%;
						position: relative;
						overflow: hidden;
						padding-top: 48px;
						&-search{
							position: absolute;
							z-index: 20;
							top: 0;
							right: 0;
							left: 0;
							padding: 0 16px;
							background-color: #fff;
						}
						&-content{
							position: relative;
							z-index: 10;
							height: 100%;
							&-list{
								height: 500px;
								max-height: 100%;
								overflow-y: scroll;
								position: relative;
								border-top: 1px solid #e2e2e2;
								&-loading{
									height: 100%;
									display: flex;
									align-items: center;
									justify-content: center;
								}
								&-not-found{
									height: 100%;
									color: #cecece;
									display: flex;
									align-items: center;
									justify-content: center;
								}
								.item-product{
									display: flex;
									flex-wrap: nowrap;
									flex-direction: row;
									align-items: center;
									border-bottom: 1px solid $border-color;
									padding: 15px 16px;
									cursor: pointer;
									&:hover{
										background: #f3f3f3;
									}
									&-content{
										@include flex(calc(100% - 120px));
										display: flex;
										&-image{
											@include flex(40px);
											border-radius: 3px;
											overflow: hidden;
											height: 40px;
											border: 1px solid $border-color;
											img{
												max-width: 100%;
												max-height: 100%;
											}
										}
										&-title{
											padding: 0 8px;
										}
									}
									&-price{
										@include flex(120px);
										font-size: 14px;
										text-align: right;
									}
								}
							}
						}
					}
				}
			}
		}

		
		.box-content-product {
			border-bottom: 1px solid #e2e2e2;
			padding: 15px 24px;
			cursor: pointer;

			&:hover {
				background: #f3f3f3;
				width: 100%;
			}

			.img-product img {
				border-radius: 2px;
			}

			.title-product {
				display: inline-block;
				margin-left: 15px;
				width: 278px;
				height: 40px;
				overflow: hidden !important;
				text-overflow: ellipsis;
				color: #252627;
			}
		}
		.box-product-pagination{
			text-align: center;
			margin-top: 10px;
			.ant-btn{
				margin: 0 6px;
				min-width: 80px;
			}
		}
		
	}
	
}	


</style>