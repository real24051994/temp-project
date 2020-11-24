<template>
	<div class="form-source-setting-filter-collection">
		<transition name="fade-in" mode="out-in">
			<div class="form-source-setting-filter-collection-list" v-if="selected.length" key="has-collection">
				<div class="item-collection-row item-collection-row-heading">
					<div class="item-collection-col item-collection-col-title">
						Selected Collections
					</div>
					<div class="item-collection-col item-collection-col-total-product">
						Total products
					</div>
					<div class="item-collection-col item-collection-col-type">
						Type
					</div>
					<div class="item-collection-col item-collection-col-action">
						&nbsp;
					</div>
				</div>
				<div class="item-collection-row" v-for="(item,index) in selected"  :key="`item_index_${index}`">
					<div class="item-collection-col item-collection-col-title">
						<div class="item-collection-info">
							<div class="item-collection-image">
								<img v-if="item.image" :src="item.image" alt />
								<img v-else src="@shop/assets/images/no-image.svg" alt />
							</div>
							<div class="item-collection-title">
								{{ item.title }}
							</div>
						</div>
					</div>
					<div class="item-collection-col item-collection-col-total-product">
						{{ item.products_in_collection_count }}
					</div>
					<div class="item-collection-col item-collection-col-type">
						<template v-if="item.type == 'smart'">Smart Collection</template>
						<template v-else>Manual Collection</template>
					</div>
					<div class="item-collection-col item-collection-col-action">
						<a @click="selected.splice(index,1)">
							<sh-icon :icon="['fal','trash-alt']" />
						</a>
					</div>
				</div>
			</div>
			<div v-else class="form-source-setting-filter-collection-empty" key="none-collection">
				<img src="@shop/assets/icons/category-selection.png" alt="">
				<p>
					Please import product from selected Shopify’s Collections
				</p>
				<a-button type="primary" @click="showModalCollection">
					<span class="m-r-8"><sh-icon :icon="['fal','plus']" /></span> Add Collections
				</a-button>
			</div>
		</transition>
		<transition name="fade-in" mode="out-in">
			<div class="text-danger m-b-10 m-t-10" v-if="validate.$invalid && formstate">
				This field is required 
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name : 'SourceFilterCollection',
		props :{
			value :{
				type : Array,
			},
			formstate :{
				type : Boolean
			},
			validate :{
				type : Object,
			},
		},
		data(){
			return {
				visible : false,
			}
		},
		computed:{
			selected :{
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
				this.$emit('on-show-modal-collection')
			},
		}
	}
</script>

<style lang="scss">
	.form-source-setting-filter-collection{
		&-list{
			margin-left: -24px;
			margin-right: -24px;
		}
		.item-source-setting-collection{
			display: flex;
			align-items: center;
			min-height: 70px;
			border-bottom: 1px solid $border-color;
		}
		&-empty{
			text-align: center;
			padding: 50px 30px;
		}
		.item-collection{
			&-row{
				display: flex;
				align-items: center;
				border-bottom: 1px solid $border-color;
				padding: 0 10px;
				&-heading{
					font-weight: 600;
					min-height: 50px;
				}
			}
			&-col{
				padding: 6px 12px;
				&-total-product,&-type{
					@include flex(25%);
				}
				&-action{
					@include flex(50px);
					text-align: right;
					a{
						color: $dark-gray3;
						&:hover{
							color: $danger-color;
						}
					}
				}
				&-title{
					@include col;
				}
			}
			&-info{
				display: flex;
				align-items: center;
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
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				@include col;
				min-width: 0;
			}
		}
	}
</style>