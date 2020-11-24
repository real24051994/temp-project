<template>
	<div class="vue-feed-filter-product">
		<template v-for="item in filters">
			<template v-if="item.description">
				<div class="item-filter-product" v-tooltip="tooltip" :title="item.description"  @click="onClick(item.id)" :class="[setColor(item.color) , { 'is-active' : item.id == isActive }]" :key="item.id">
					<div class="item-filter-product-text">
						{{ item.text }}
					</div>
					<transition name="fade-in" mode="out-in">
						<div  class="item-filter-product-count" v-if="typeof item.count == 'number'" key="loaded">
							{{ item.count }}
						</div>
						<a-spin v-else key="is-loading">
							<a-icon slot="indicator" type="loading" style="font-size: 14px" spin />
						</a-spin>
					</transition>
				</div>
			</template>
			<template v-else>
				<div class="item-filter-product"  @click="onClick(item.id)" :class="[setColor(item.color) , { 'is-active' : item.id == isActive }]" :key="item.id">
					<div class="item-filter-product-text">
						{{ item.text }}
					</div>
					<transition name="fade-in" mode="out-in">
						<div  class="item-filter-product-count" v-if="typeof item.count == 'number'" key="loaded">
							{{ item.count }}
						</div>
						<a-spin v-else key="is-loading">
							<a-icon slot="indicator" type="loading" style="font-size: 14px" spin />
						</a-spin>
					</transition>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
export default {
	name : 'FilterProduct',
	props :{
		value :{
			type : Array,
		},
		isActive :{
			type : String,
		}
	},
	data(){
		return {
			tooltip : {
				contentAsHTML: true,
				side: 'bottom',
				maxWidth: 230,
				repositionOnScroll: true,
			}
		}
	},
	computed :{
		filters :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
	},
	methods :{
		setColor(color){
			return 'item-filter-product-' + color ;
		},
		setActive(id){
			return this.isActive == id 
		},
		onClick(id){
			this.$emit('on-change-filter' , id )
		},
	}
}
</script>

<style lang="scss">
	.vue-feed-filter-product{
		display: flex;
		.item-filter-product{
			background-color: #f7f8fa;
			border: 1px solid transparent;
			border-radius: 4px;
			height: 32px;
			padding: 0 10px;
			display: inline-flex;
			align-items: center;
			cursor: pointer;
			margin-left: 15px;
			user-select: none;
			&:first-child{
				margin-left: 0;
			}
			&-text{
				margin-right: 10px;
			}
			&-count{
				border-radius: 4px;
				font-weight: 500;
				font-size: 12px;
				color: #fff;
				height: 18px;
				padding: 0 5px;
				min-width: 32px;
				text-align: center;
			}
			&-blue{
				&.is-active{
					background-color: #ddefff;
					color: #5b86e5;
					border: 1px solid #5b86e5;
				}
				.item-filter-product-count{
					background: #5b86e5;
				}
			}
			&-red{
				&.is-active{
					background-color: #fce6e6;
					color: #f2545d;
					border: 1px solid #f2545d;
				}
				.item-filter-product-count{
					background: #f2545d;
				}
			}
			&-gray{
				&.is-active{
					background-color: #e2e2e2;
					color: #252627;
					border: 1px solid #cecece;
				}
				.item-filter-product-count{
					background: #cecece;
				}
			}
			&-green{
				&.is-active{
					background-color: #dff3e7;
					color: #27ae60;
					border: 1px solid #27ae60;
				}
				.item-filter-product-count{
					background: #27ae60;
				}
			}
			&-yellow{
				&.is-active{
					background-color: #fcf4db;
					color: #f2ce54;
					border: 1px solid #f2ce54;
				}
				.item-filter-product-count{
					background: #f2ce54;
				}
			}
		}
	}
</style>