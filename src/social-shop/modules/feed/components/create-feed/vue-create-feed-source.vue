<template>
	<div class="vue-create-feed-source">
		<div class="vue-create-feed-source-header">
			<h5>
				Products Source
			</h5>
			<div class="spacer"></div>
			<div class="vue-create-feed-source-count">
				<strong>{{ total_product  }} </strong>
				<template v-if="total_product == 1">
					Total Product
				</template>
				<template v-else>
					Total Products
				</template>
			</div>
		</div>
		<div class="vue-create-feed-source-body">
			<a-checkbox-group class="list-item-sources" v-model="form">
				<div class="item-source" v-for="(item,index) in sources" :key="`key_index_${index}`">
					<div class="item-source-wrap">
						<div class="item-source-checkbox">
							<a-checkbox :value="item.shop_id" :id="`checkbox_id_${item.shop_id}`" />
						</div>
						<label class="item-source-content" :for="`checkbox_id_${item.shop_id}`">
							<div class="item-source-icon">
								<img v-if="item.shop.platform == 'shopify'" src="@shop/assets/icons/icon-source-shopify.svg" alt="">
							</div>
							<div class="item-source-info" v-if="item.shop">
								<div class="item-source-name" :title="item.shop.name">
									{{ item.shop.name }}
								</div>
								<div class="item-source-count">
									<strong>{{ item.count }}</strong> 
									<template v-if="item.count == 1">
										Product
									</template>
									<template v-else>
										Products
									</template>
								</div>
							</div>
						</label>
					</div>
				</div>
			</a-checkbox-group>
			<transition name="fade-in" mode="out-in">
				<div class="feed-form-group-info text-danger" v-if="validate.$invalid && formstate">
					This field is required 
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
export default {
	name : 'CreateFeedSource',
	props : {
		value :{
			type : Array,
			required: true,
		},
		sources :{
			type : Array,
			default : ()=>[]
		},
		validate : {
			type : Object,
			required: true,
		},
		formstate :{
			type : Boolean,
		}
	},
	data(){
		return {

		}
	},
	computed :{
		form : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		total_product(){
			return this.sources.reduce((accumulator, current) => {
				return accumulator + current.count
			},0)
		}
	},
}
</script>
<style lang="scss">
	.vue-create-feed-source{
		padding: 16px 24px;
		&-header{
			display: flex;
			align-items: center;
			strong{
				color: $primary-color;
				
			}
		}
		&-body{
			.list-item-sources{
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				margin-left: -10px;
				margin-right: -10px;
				.item-source{
					@include flex(33.33%);
					padding: 0 10px;
					margin-bottom: 20px;
					&-wrap{
						background: #FAFAFA;
						border: 1px solid #E2E2E2;
						border-radius: 4px;
						min-height: 75px;
						overflow: hidden;
						cursor: pointer;
						display: flex;
						flex-wrap: nowrap;
					}
					&-checkbox{
						@include flex(34px);
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					&-content{
						@include col;
						min-width: 0;
						border-left: 1px solid #E2E2E2;
						padding: 0 17px;
						display: flex;
						align-items: center;
						cursor: pointer;
					}
					&-icon{
						@include flex(37px);
					}
					&-info{
						@include col;
						min-width: 0;
						padding-left: 12px;
					}
					&-name{
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					&-count{
						color: #828282;
						strong{
							color: #252627;
						}
					}
				}
			}
		}
	}
</style>