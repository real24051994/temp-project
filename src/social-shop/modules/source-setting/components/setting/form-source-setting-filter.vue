<template>
	<div class="form-source-setting-item">
		<div class="form-source-setting-item-label" v-if="showLabel">
			<h4>
				Source Filter
			</h4>
			<p>
				Filter the products that your want to sync to this feed.
			</p>
		</div>
		<div class="form-source-setting-item-content">
			<div class="form-source-setting-item-card">
				<div class="form-source-setting-item-card-body p-b-0">
					<div class="d-flex">
						<div class="item-source-category m-b-24">
							<div class="item-source-category-item" @click="form.type_get_product = 'all_product'" :class="{ 'is-active' : form.type_get_product == 'all_product'}">
								<span class="m-r-8"><sh-icon :icon="['fas','pallet-alt']" /></span>
								<span>All Product</span>
							</div>
							<div class="item-source-category-item m-l-10" @click="form.type_get_product = 'specific_collections'" :class="{ 'is-active' : form.type_get_product == 'specific_collections'}">
								<span class="m-r-8"><sh-icon :icon="['fas','box-check']" /></span>
								<span>Specific Collections</span>
							</div>
						</div>
						<div class="spacer"></div>
						<a-button v-if="form.type_get_product == 'specific_collections' && form.collections.length" type="primary" @click="showModalCollection">
							<span class="m-r-8"><sh-icon :icon="['fal','plus']" /></span> Add Collections
						</a-button>
					</div>
					<transition name="fade-in" mode="out-in">
						<form-source-setting-filter-collection v-if="form.type_get_product == 'specific_collections'" v-model="form.collections" @on-show-modal-collection="showModalCollection" :formstate="formstate" :validate="validate.collections" />
					</transition>
				</div>
			</div>
			<hr>
			<div class="form-source-setting-item-card pd-0">
				<div class="form-source-setting-item-card-header">
					<h5>Exclude Products</h5>
				</div>
				<div class="form-source-setting-item-card-body pd-0">
					<form-source-setting-filter-specific v-model="form.exclude_product_ids" :shop-id="account.shop_id" :status.sync="form.exclude_product_ids_status" :formstate="formstate" :validate="validate.exclude_product_ids" />
					<hr class="m-0">
					<form-source-setting-filter-rule v-model="form.exclude_rules" :mapping-rules="form.mapping_rule" :product-filters="form.products_filter" :status.sync="form.exclude_rules_status" :formstate="formstate" :validate="validate.exclude_rules" />
				</div>
			</div>
		</div>
		<modal-select-collections v-if="visible" v-model="visible" :selected="form.collections" @on-select="onSelectCollection" />
	</div>
</template>

<script>
import ModalSelectCollections from './modal-select-collections'
import FormSourceSettingFilterCollection from './form-source-setting-filter-collection'
import FormSourceSettingFilterSpecific from './form-source-setting-filter-specific'
import FormSourceSettingFilterRule from './form-source-setting-filter-rule'
export default {
	name : 'SourceFilter',
	components : {
		ModalSelectCollections,
		FormSourceSettingFilterCollection,
		FormSourceSettingFilterSpecific,
		FormSourceSettingFilterRule
	},
	props :{
		value :{
			type : Object,
		},
		formstate :{
			type : Boolean
		},
		validate :{
			type : Object,
		},
		account :{
			type : Object,
		},
		showLabel : {
			type : Boolean,
			default : true
		}
	},
	data(){
		return {
			visible : false,
		}
	},
	computed:{
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{
		showModalCollection(){
			this.visible  = true 
		},
		onSelectCollection(payload){
			this.form.collections = payload
		}
	}
}
</script>

<style lang="scss">
	
	.item-source-category{
		display: inline-flex;
		background: #F3F3F3;
		border-radius: 10px;
		padding: 6px;
		&-item{
			padding: 8px 16px;
			height: 36px;
			
			border-radius: 6px;
			color: #828282;
			font-weight: 500;
			cursor: pointer;
			&:hover,&.is-active{
				background: #ffffff;
				box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.08);
			}
			&.is-active{
				color: $primary-color;
			}
		}
	}
	.form-source-setting-filter-product{
		&-header{
			padding: 16px 24px;
			display: flex;
			align-items: center;
		}
		&-body{
			padding: 16px 24px;
			.list-item-rules{
				background: #F7FAFF;
				border-radius: 4px;
				padding: 24px 16px;
				&-action{
					padding-left: 50px;
				}
				&-spacer{
					padding:8px;
					color: #4F4F4F;
					span{
						position: relative;
						display: inline-block;
						padding:8px 0px;
						font-weight: 600;
						&:before,&:after{
							content : '';
							height: 10px;
							left: 50%;
							width:2px;
							background: #C1CBDC;
							position: absolute;
						}
						&:before{
							top: 0;
						}
						&:after{
							bottom: 0;
						}
					}
				}
			}
		}
	}
</style>