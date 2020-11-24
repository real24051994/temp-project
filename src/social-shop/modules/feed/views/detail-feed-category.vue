<template>
	<div class="detail-feed-category">
		<google-category v-if="socialType == 'google'" :modify.sync="is_modify" />
		<facebook-category v-if="socialType == 'facebook' || socialType == 'facebook_fbe'" :modify.sync="is_modify" />
	</div>
</template>

<script>
import GoogleCategory from '../components/category/assigning-google-category'
import FacebookCategory from '../components/category/assigning-facebook-category'
export default {
	name : 'DetailFeedCategory',
	components:{
		GoogleCategory,
		FacebookCategory
	},
	props :{
		value :{
			type: Object,
		},
		socialType : {
			type : String,
			required : true,
		},
	},
	data(){
		return {
			is_modify : false,
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
	},
	beforeRouteLeave(to, from, next) {
		if (this.is_modify) {
			this.$confirm({
				title: 'Discard Changes',
				content: "The changes won't be saved. Do you want to leave this page?",
				okText: 'Discard',
				cancelText: 'Cancel',
				okType: 'outline-danger',
				zIndex: 10002,
				onOk: () => {
					next()
				},
			})
		} else {
			next()
		}
	},
}
</script>

<style lang="scss">
	.detail-feed-category{
		padding: 24px;
	}
</style>