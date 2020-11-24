<template>
	<div class="vue-item-rule" :class="{'vue-item-rule-if' : index == 0 , 'vue-item-rule-and' : index != 0}">
		<div class="vue-item-rule-index" :class="{'vue-item-rule-index-if' : index == 0 , 'vue-item-rule-index-and' : index != 0}">
			<template v-if="index == 0 ">
				IF
			</template>
			<template v-else>
				AND
			</template>
		</div>
		<div class="vue-item-rule-name"  >
			<a-select placeholder="Choose field" v-model="form.key" :class="{'vue-item-rule-error' : validate.key.$invalid && formstate }">
				<a-select-option v-for="(item,index) in productFilters" :key="`index_${index}`" :title="item.field_name" :value="item.field_key">
					{{ item.product_type | product_type }}{{ item.field_name }}
				</a-select-option>
			</a-select>
		</div>
		<div class="vue-item-rule-content">
			<div class="vue-item-rule-group">
				<div class="vue-item-rule-group-select">
					<a-select placeholder="Choose operator" @change="onChangeOperator"  v-model="form.operator" :class="{'vue-item-rule-error' : validate.operator.$invalid && formstate }">
						<a-select-option v-for="(item,index) in rules" :key="`index_${index}`"  :value="item.id">
							{{ item.name }}
						</a-select-option>
					</a-select>
				</div>
				<div class="vue-item-rule-group-input">
					<a-input v-model="form.value" :disabled="disabled_input_field" :class="{'vue-item-rule-error' : validate.value.$invalid && formstate }" />
				</div>
			</div>
		</div>
		<div class="vue-item-rule-action">
			<a-button @click="removeItem()">
				<sh-icon :icon="['fal','times']" />
			</a-button>
		</div>
	</div>
</template>
<script>
export default {
	name : 'VueItemRule',
	props : {
		value :{
			type : Object,
		},
		mappingRules : {
			type : Object,
		},
		productFilters :{
			type : Array,
		},
		index :{
			type : Number
		},
		validate :{

		},
		formstate : {

		},
	},
	data(){
		return {
			disabled_operators: ['is_empty' ,'is_not_empty']
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
		},
		selected_field(){
			return _.find( this.productFilters , { field_key  : this.form.key })
		},
		rules(){
			if( this.selected_field ){
				return this.mappingRules.hasOwnProperty(this.selected_field.data_type) ? this.mappingRules[this.selected_field.data_type] : []
			}
			return []
		},
		disabled_input_field(){
			return this.disabled_operators.indexOf(this.form.operator) >= 0 
		}
	},
	methods :{
		removeItem(){
			this.$emit('on-remove')
		},
		onChangeOperator(value){
			if( this.disabled_operators.indexOf(value) >= 0 ){
				this.form.value = ''
			}
		}
	},
	watch : {
		'form.key' : function(value){
			var find = _.find(this.rules , { id : this.form.operator })
			if( find == undefined){
				this.form.operator = undefined 
				this.form.value = ''
			}
		}
	},
	filters : {
		product_type(value){
			if( typeof value == 'string'){
				return `[${value.charAt(0).toUpperCase()}] `
			}
			return value
		}
	}
}
</script>
<style lang="scss">
	.vue-item-rule{
		display: flex;
		margin-bottom: 12px;
		position: relative;
		&:before{
			content: '';
			position: absolute;
			width: 2px;
			left: 2px;
			background: #C1CBDC;
		}
		&-if{
			&:before{
				top: 30px;
				left: 2px;
				bottom: -12px;
			}
		}
		&-and{
			&:before{
				top: -12px;
				bottom: 0px;
			}
		}
		&-index{
			@include flex(50px);
			display: flex;
			align-items: center;
			padding-right: 5px;
			&-if{
				display: flex;
				align-items: center;
				color: #252627;
				font-weight: 600;
			}
			&-and{
				justify-content: flex-end;
				color: #4F4F4F;
				font-size: 13px;
			}
		}
		&-name{
			@include flex(195px);
			
		}
		&-content{
			@include col;
			min-width: 0;
			padding: 0 12px;
			
		}
		&-action{
			@include flex(36px);
			.ant-btn{
				width: 36px;
				height: 36px;
				padding: 0;
			}
		}
		&-group{
			display: flex;
			width : 100%;
			height: 32px;
			&-select{
				@include flex(160px);
				.ant-select{
					.ant-select-selection{
						border-right: none;
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
					}
				}
				
			}
			&-input{
				@include col;
				min-width : 0;
				.ant-input{
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
			}
		}
		.ant-select{
			width : 100%;
			
			.ant-select-selection--single{
				height: 36px;
				.ant-select-selection__rendered{
					line-height: 34px;
				}
			}
		}
		.ant-input{
			height: 36px;
    		padding: 4px 11px;
		}
		&-error{
			&.ant-input{
				border-color: $danger-color;
			}
			&.ant-select{
				.ant-select-selection{
					border-color: $danger-color;
				}
			}
		}
	}
</style>