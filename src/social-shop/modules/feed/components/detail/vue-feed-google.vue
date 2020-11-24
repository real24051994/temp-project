<template>
	<div class="vue-google-feed">
		<transition name="fade-in" mode="out-in">
			<vue-feed-products v-if="tab == 'product'" key="tab-product" :show-column.sync="form.show_column" v-model="filter_product_field" :is-ready.sync="is_mount_feed_product" />
			<mapping-google  v-else-if="tab == 'field-mapping'" key="tab-mapping" v-model="form" />
		</transition>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import VueFeedProducts from './vue-feed-products'
import MappingGoogle from '../mapping-export/mapping-google'
export default {
	name : 'GoogleFeed',
	components :{
		VueFeedProducts,
		MappingGoogle
	},
	props:{
		value :{
			type :Object,
		},
		tab :{
			type : String,
		}
	},
	data(){
		return {
			filter_product_field : [
				{
					id : 'all',
					text : 'All Feed',
					count : '',
					color : 'blue'
				},
				{
					id : 'approved',
					text : 'Approved',
					count : '',
					color : 'green'
				},
				{
					id : 'pending',
					text : 'Pending',
					count : '',
					color : 'gray'
				},
				{
					id : 'disapproved',
					text : 'Disapproved',
					count : '',
					color : 'red'
				},
			],
			is_mount_feed_product: false,
		}
	},
	computed :{
		form : {
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{
		...mapActions({
			getStatisticsStatusDetails : 'feed/getStatisticsStatusDetails'
		}),
		routeLeave(){
			console.log('routeLeave');
		},
		routeUpdate(){
			console.log('routeUpdate');
		}
	},
	created(){

	}
}
</script>

<style lang="scss">
	
</style>