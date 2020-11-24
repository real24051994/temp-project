<template>
	<modal-post  v-if="visible" v-model="visible" :date="date" :post-id="post_id" :social-ids="social_ids" />
</template>
<script>
import Modal from '../plugins/modal'
import ModalPost from './create/vue-modal-post'
export default {
	name : 'PostModals',
	components:{
		ModalPost,
	},
	data(){
		return {
			visible : false,
			post_id : '' ,
			social_ids : [],
			date : ''
		}
	},
	watch : {
		visible : function(value){
			if( !value ){
				this.post_id = ''
			}
		},
	},
	beforeCreate(){
		Modal.EventBus.$on('showModalPost', ( payload ) => {
			let { post_id  = '', date = '' , social_ids } = payload
			this.post_id = post_id
			this.date = date 
			this.social_ids = social_ids
			this.visible = true
		})
		Modal.EventBus.$on('hideModalPost', (  ) => {
			this.visible = false
			this.post_id = ''
			this.date = '' 
			this.social_ids = []
		})
	}
}
</script>