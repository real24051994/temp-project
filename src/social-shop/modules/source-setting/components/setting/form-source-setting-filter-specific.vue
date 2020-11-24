<template>
	<div class="form-source-setting-filter-product">
		<div class="form-source-setting-filter-product-header">
			Exclude specific products
			<div class="spacer"></div>
			<label for="form-source-setting-filter-specific-product" class="m-r-8">
				<transition name="fade-in" mode="out-in">
					<span v-if="enable" key="enable">Enable</span>
					<span v-else key="disable">Disable</span>
				</transition>
			</label>
			<a-switch id="form-source-setting-filter-specific-product" v-model="enable" />
		</div>
		<transition name="fade-in" mode="out-in">
			<div class="form-source-setting-filter-product-body p-t-0" v-if="enable">
				<input-tag v-model="selected" class="specific-product-tags"  empty-placeholder="Please insert the product ID you want to exclude here">
					<slot name="input-tag-footer">
						<div class="input-tag-footer">
							<span>
								Press “Tab” or “Enter” button to add more product ID
							</span>
							<div class="spacer"></div>
							<a @click="visible = true">
								Select Products
							</a>
						</div>
					</slot>
				</input-tag>
				<transition name="fade-in" mode="out-in">
					<div class="text-danger m-b-10 m-t-10" v-if="validate.$invalid && formstate">
						This field is required 
					</div>
				</transition>
			</div>
		</transition>
		<modal-select-products v-if="visible" v-model="visible" :selected="selected" @on-select="onSelect" />
	</div>
</template>

<script>
	import ModalSelectProducts from './modal-select-products'
	export default {
		name : 'SourceFilterSpecificProduct',
		components : {
			ModalSelectProducts,
		},
		props :{
			value :{
				type : Array,
			},
			status :{
				type : Boolean
			},
			shopId :{
				type : [String ,Number],
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
				tag : ''
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
			},
			enable :{
				get(){
					return this.status 
				},
				set(value){
					this.$emit('update:status', value)
				}
			}
		},
		methods :{
			onSelect(payload){
				this.selected = payload
			}
		}
	}
</script>

<style lang="scss">
	.form-source-setting-filter-product{
		
		.specific-product-tags{
			.input-tag-footer{
				position: absolute;
				bottom: 10px;
				left: 0;
				right: 0;
				display: flex;
				align-items: center;
				padding: 0 16px;
				span{
					color: $dark-gray3;
					font-weight: normal;
					font-size: 12px;
					line-height: 14px;
					color: #CECECE;
					user-select: none;
					pointer-events: none;
				}
				a{
					color: $primary-color;
					text-decoration: underline;
				}
			}
		}
	}
</style>