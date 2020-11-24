<template>
	<div class="social-post-tab social-post-tab-product">
		<transition name="fade" mode="out-in">
			<div v-if="product" key="is-has-product">
				<div class="item-product">
					<div class="item-product-image" :style="{ 'background-image': 'url(' + product.images.first() + ')' }"></div>
					<div class="item-product-content">
						<span v-line-clamp:20="3">{{ product.product_title }}</span>
					</div>
					<div class="item-product-action">
						<a-button :disabled="true">{{ $t('post.modal.component.select_product.btn_delete') }}</a-button>
					</div>
				</div>
				<div class="item-product-type">
					<h4>{{ $t('post.modal.component.select_product.sub_title') }}</h4>
					<div class="ant-radio-group ant-radio-group-outline ant-radio-group-default">
						<label  class="ant-radio-wrapper" :class="{ 'ant-radio-wrapper-checked' : subType == 'link' }">
							<span class="ant-radio" :class="{ 'ant-radio-checked' : subType == 'link' , 'ant-radio-disabled' : subType != 'link' }">
								<input type="radio" class="ant-radio-input" value="link" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>Link</span>
						</label>
						<label  class="ant-radio-wrapper" :class="{ 'ant-radio-wrapper-checked' : subType == 'image' }">
							<span class="ant-radio" :class="{ 'ant-radio-checked' : subType == 'image' , 'ant-radio-disabled' : subType != 'image' }">
								<input type="radio" class="ant-radio-input" value="image" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>Image</span>
						</label>
					</div>
					<transition name="fade" mode="out-in">
						<div class="m-t-10" v-if="!product.images.length" key="is-warning-product-empty">
							<div class="text-danger">
								<i class="m-r-8" >
									<sh-icon :icon="['far','exclamation-circle']" />
								</i>
								This product don’t have any image
							</div>
						</div>
						<div class="m-t-10" v-if="subType == 'image'" key="is-sub-type-image">
							<div class="list-items-image">
								<template v-for="(item , index) in product.images">
									<div class="item-image" :class="product.selected_images.includes(item) ? 'is-active' : 'is-disabled'" :key="`index${index}`">
										<div class="item-image-preview">
											<img :src="item" alt />
										</div>
										<div class="item-image-checked">
											<sh-icon :icon="['far','check']" />
										</div>
									</div>
								</template>
							</div>
						</div>
					</transition>
				</div>
			</div>
			<span v-else key="is-empty-product" class="m-b-12 ant-input-group-wrapper ant-input-search ant-input-search-enter-button">
				<span class="ant-input-wrapper ant-input-group">
					<input ref="input" :readonly="true" type="text" class="ant-input" />
					<span class="ant-input-group-addon">
						<button type="button" class="btn-bold ant-btn ant-input-search-button">
							<span>{{ $t('post.modal.component.select_product.btn_select') }}</span>
						</button>
					</span>
				</span>
			</span>
		</transition>
	</div>
</template>
<script>
import { mapActions } from "vuex";
export default {
	name: "TabProduct",
	props: {
		product: {
			required: true
		},
		subType: {
			type: String,
			required: true
		},
		autopilotType :{
			type : String,
			default : 'random'
		}
	},
	components: {},
	data() {
		return {
			visible: false,
			is_loading: false,
			max_file_selected: 4
		};
	},
	computed: {},
	methods: {
		isActive(url) {
			var index = _.findIndex(this.product.selected_images, { src: url });
			return index >= 0;
		}
	}
};
</script>
<style lang="scss" scoped>
.social-post-tab-product {
	padding-bottom: 40px;
	.item-product {
		display: flex;
		border-radius: 4px;
		overflow: hidden;
		background: #f3f3f3;
		border: 1px solid #d9d9d9;
		margin-bottom: 16px;
		height: 64px;
		cursor: pointer;
		&-image {
			@include flex(64px);
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
		}
		&-content {
			@include col;
			padding: 8px 16px;
			display: flex;
			align-items: center;
			font-size: 13px;
			line-height: 17px;
		}
		&-action {
			@include flex(100px);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.item-product-type {
		user-select: none;
		h4 {
			display: inline-block;
			font-weight: 600;
			margin: 0;
		}
		.ant-radio-group {
			margin-left: 15px;

			.ant-radio-wrapper {
				color: $text;
			}
		}
	}
	.text-selected {
		color: #4f4f4f;
		span {
			font-weight: 600;
		}
	}
	.list-items-image {
		.item-image {
			width: 64px;
			height: 64px;
			margin: 0 8px 8px 0;
			float: left;
			border-radius: 4px;
			border: 2px solid $border-color;
			overflow: hidden;
			position: relative;
			background-color: #fafafa;
			display: block;
			&.is-active {
				border-color: $primary-color;
				.item-image-checked {
					opacity: 1;
					visibility: visible;
				}
			}
			&.is-disabled{
				opacity: 0.6;
				cursor: not-allowed;
				.item-image-preview{
					cursor: not-allowed;
				}
			}
			&-checked {
				position: absolute;
				top: 0;
				left: 0;
				width: 16px;
				height: 16px;
				background: $primary-color;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom-right-radius: 2px;
				opacity: 0;
				visibility: hidden;
			}
			&-preview {
				height: 100%;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				background-image: url("~@publish/assets/icons/default.png");
				background-position: center center;
				background-size: cover;
				background-repeat: no-repeat;
			}
			img {
				max-height: 100%;
				max-width: 100%;
			}
		}
		&:after {
			@include clear;
		}
	}
}
</style>