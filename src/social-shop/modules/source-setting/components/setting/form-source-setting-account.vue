<template>
	<div class="form-source-setting-item">
		<div class="form-source-setting-item-label" v-if="showLabel">
			<h4>
				Account
			</h4>
			<p>
				Manage the product source connected with this account.
			</p>
		</div>
		<div class="form-source-setting-item-content">
			<div class="form-source-setting-item-card">
				<div class="form-source-setting-item-card-body">
					<div class="item-source-account">
						<div class="item-source-account-info" v-if="value.platform == 'shopify'">
							<div class="item-source-account-info-icon">
								<img src="@shop/assets/icons/icon-source-shopify.svg" alt="">
							</div>
							<div class="item-source-account-info-content">
								<div class="item-source-account-info-title">
									{{ value.domain }}
								</div>
								<div class="item-source-account-info-email">
									{{ value.email }}
								</div>
							</div>
						</div>
						<div class="spacer"></div>
						<div class="item-source-account-product">
							<div class="item-source-account-product-count">
								<strong>{{ value.total_products  || 0}}</strong>
								<span>Total Products</span>
							</div>
							<div class="divider"></div>
							<div class="item-source-account-product-count">
								<strong>{{ value.total_variants || 0}}</strong>
								<span>Total Variants</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'SourceAccount',
		props :{
			value :{
				type : Object,
			},
			showLabel : {
				type : Boolean,
				default : true
			}
		}
	}
</script>

<style lang="scss">
	.item-source-account{
		display: flex;
		align-items: center;
		&-info{
			@include col;
			min-width: 0;
			display: flex;
			&-icon{

			}
			&-content{
				@include col;
				min-width: 0;
				padding-left: 16px;
			}
			&-title{
				font-weight: 600;
				color: $dark-gray1;
			}
			&-email {
				color :$dark-gray3;
				font-size: 12px;
			}
		}
		&-product{
			@include flex(210px);
			text-align: right;
			.divider{
				height: 45px;
				width:1px;
				background: #E2E2E2;
				margin: 0 15px;
				display: inline-block;
			}
			&-count{
				display: inline-block;
				text-align: left;
				strong{
					font-style: normal;
					font-weight: bold;
					font-size: 18px;
					display: block;
				}
				span{
					font-style: normal;
					font-weight: normal;
					font-size: 12px;
					color: #828282;
					display: block;
				}
			}
		}
	}
</style>