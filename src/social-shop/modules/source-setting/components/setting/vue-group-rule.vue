<template>
	<div class="list-item-rules" >
		<template v-for="(item,index) in rule" >
			<vue-group-rule-item 
				:key="`rule_element_index_${index}`" 
				:mapping-rules="mappingRules" 
				:product-filters="productFilters" 
				:index="index" v-model="rule[index]" 
				:validate="errors[index]"
				:formstate="formstate"
				@on-remove="()=>removeSubCondition(index)"  />
		</template>
		<div class="list-item-rules-action">
			<a @click="addSubCondition()">
				<sh-icon :icon="['fal','plus']" /> Sub-Condition
			</a>
		</div>
	</div>
</template>
<script>
import VueGroupRuleItem from './vue-group-rule-item'
export default {
	name : 'VueGroupRule',
	components:{
		VueGroupRuleItem
	},
	props :{
		value : {

		},
		validate :{

		},
		formstate : {

		},
		mappingRules : {
			type : Object,
		},
		productFilters :{
			type : Array,
		}
	},
	computed :{
		rule : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		errors(){
			return Object.values(this.validate.$each.$iter)
		},
	},
	methods : {
		addSubCondition(){
			this.rule.push({
				key: undefined,
				operator: undefined,
				value: "",
			})
		},
		removeSubCondition(index){
			if( this.rule.length == 1){
				this.$emit('on-remove')
			}else{
				this.rule.splice(index,1)
			}
		}
	}
}
</script>