<template>
	<div class="vue-create-feed-rule">
		<div class="vue-create-feed-rule-header">
			<h5>
				Products Filter
			</h5>
			<div class="d-flex">
				<p>
					Use this section to include only specific products in the  feed, instead of all your products
				</p>
				<div class="spacer"></div>
				<a-switch v-model="active" />
			</div>
		</div>
		<transition name="fade-in" mode="out-in">
			<div class="vue-create-feed-rule-body" v-if="active">
				<h5>Select the products which meet all the following condition.</h5>
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
							:validate="errors[index]" 
							:formstate="formstate" 
							:mapping-rules="mappingRules" 
							:product-filters="productFilters" 
							@on-remove="()=>removeCondition(index)"/>
					</template>
				</template>
				<template v-else>
					<div class="list-item-rules m-b-0">
						<p>
							No Condition
						</p>
					</div>
				</template>
				<transition name="fade-in" mode="out-in">
					<div class="text-danger m-t-15" v-if="validate.$invalid && formstate">
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
	name : 'CreateFeedRule',
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
		mappingRules : {
			type : Object,
		},
		productFilters :{
			type : Array,
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
		active: {
			get(){
				return this.status 
			},
			set(value){
				this.$emit('update:status' , value )
			}
		},
		rules : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value )
			}
		},
		errors(){
			return Object.values(this.validate.$each.$iter)
		},
	},
	methods :{
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
	.vue-create-feed-rule{
		padding: 16px 24px;
		&-body{
			.list-item-rules{
				background: #F7FAFF;
				border-radius: 4px;
				padding: 24px 16px;
				// border: 1px solid $border-color;
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