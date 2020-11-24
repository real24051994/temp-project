<template>
	<div class="form-source-setting-filter-product">
		<div class="form-source-setting-filter-product-header">
			Exclude products by rules
			<a-popover :title="false">
				<template slot="content">
					<div class="form-source-setting-popover">
						Use this section to exclude specific products (via rule setting) in the product source, instead of all your products
					</div>
				</template>
				<span class="m-l-8 text-primary"><sh-icon :icon="['far','question-circle']" /></span>
			</a-popover>
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
			<div class="form-source-setting-filter-product-body" v-if="enable">
				<p>
					Products that satisfy the following conditions will be <strong>excluded</strong>:
				</p>
				<template v-if="rules.length">
					<template v-for="(item, index) in rules">
						<template v-if="index > 0 ">
							<div class="list-item-rules-spacer" :key="`item_rule_${index}`"  >
								<span>OR</span>
							</div>
						</template>
						<vue-group-rule  
							:key="`item_rule_index_${index}`"  
							v-model="rules[index]" 
							:formstate="formstate" 
							:mapping-rules="mappingRules" 
							:product-filters="productFilters" 
							:validate="errors[index]"
							@on-remove="()=>removeCondition(index)"/>
					</template>
				</template>
				<template v-else>
					<div class="list-item-rules m-b-0">
						<div class="list-item-rules-empty-state">
							<div>
								<sh-icon :icon="['fas','filter']" />
							</div>
							No condition yet
						</div>
					</div>
				</template>
				<transition name="fade-in" mode="out-in">
					<div class="text-danger m-t-15" v-if="!validate.required && formstate">
						This field is required 
					</div>
				</transition>
				<a-button @click="addCondition" class="m-t-15">
					<span class="m-r-5"><sh-icon :icon="['fal','plus']" /></span> Condition(s)
				</a-button>
			</div>
		</transition>
	</div>
</template>

<script>
import VueGroupRule from './vue-group-rule.vue'
export default {
	name : 'SourceFilterRule',
	components : {
		VueGroupRule
	},
	props :{
		value :{
			type : Array,
		},
		status :{
			type : Boolean
		},
		formstate :{
			type : Boolean
		},
		validate :{
			type : Object,
		},
		mappingRules : {
			type : Object,
		},
		productFilters :{
			type : Array,
		},
	},
	data(){
		return {
			visible : false,
		}
	},
	computed:{
		rules :{
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
		},
		errors(){
			return Object.values(this.validate.$each.$iter)
		},
	},
	methods :{
		onSelect(payload){
			console.log(payload);
		},
		addCondition(){
			this.rules.push([{
				key: undefined,
				operator: undefined,
				value: "",
			}])
		},
		removeCondition(index){
			this.rules.splice(index,1)
		}
	}
}
</script>

<style lang="scss">
	.list-item-rules-empty-state{
		color: #828282;
		text-align: center;
	}	
</style>