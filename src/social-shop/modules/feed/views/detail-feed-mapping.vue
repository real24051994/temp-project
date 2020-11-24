<template>
	<div class="detail-feed-mapping">
		<google-mapping v-if="socialType == 'google'"  v-model="value" :modify.sync="is_modify" />
		<facebook-mapping v-else-if="socialType == 'facebook' || socialType == 'facebook_fbe'"  v-model="value" :modify.sync="is_modify" />
	</div>
</template>
<script>
import GoogleMapping from '../components/mapping-export/mapping-google'
import FacebookMapping from '../components/mapping-export/mapping-facebook'
export default {
	name : 'DetailFeedMapping',
	components : {
		GoogleMapping,
		FacebookMapping
	},
	props :{
		value : {
			type :Object,
		},
		socialType :{
			type : String,
			required: true
		}
	},
	data(){
		return {
			is_modify : false, 
		}
	},
	beforeRouteLeave (to, from, next) {
		if( this.is_modify ){
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
		}else{
			next()
		}
	}
}
</script>
<style lang="scss" scoped>
	.detail-feed-mapping{
		padding: 24px; 
	}
</style>