<template>
	<div class="detail-feed-product">
		<vue-feed-products :show-column.sync="form.show_column" :social-type="socialType" v-model="status" />
	</div>
</template>

<script>
import VueFeedProducts from '../components/detail/vue-feed-products'
export default {
	name : 'DetailFeedProduct',
	components:{
		VueFeedProducts
	},
	props :{
		value :{
			type: Object,
		},
		socialType : {
			type : String,
			required : true,
		},
		statusCount :{
			required : true,
		}
	},
	data(){
		return {
			
		}
	},
	computed :{
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		status :{
			get(){
				return this.statusCount 
			},
			set(value){
				this.$emit('update:statusCount', value)
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>