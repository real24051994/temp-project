<template>
	<a-modal transitionName="none" maskTransitionName="none" title="Select Template" :footer="false" width="800px" v-model="visible" >
		<div class="modal-autopilot-choose-template">
			<transition name="fade-in" mode="out-in">
				<div class="modal-autopilot-choose-template-loading" v-if="is_loading" key="is-loading">
					<a-spin>
						<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
					</a-spin>
				</div>
				<div class="modal-autopilot-choose-template-list" v-else key="is-loading-success">
					<div class="item-template" v-for="(item,index) in templates" :key="`index_${index}`" @click="onClick(item)">
						<img :src="item.sample" alt="">
					</div>
				</div>
			</transition>
		</div>
    </a-modal>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name : 'ModalChooseTemplate',
	props:{
		value :{
			type : Boolean,
		},
	},
	data(){
		return {
			templates : [],
			is_loading : true
		}
	},
	computed:{
		visible  :{
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
			getDiscountTemplate : 'autopilot/getDiscountTemplate',
		}),
		onClick(item){
			this.$emit('on-select', item)
			this.visible = false
		},
	},
	mounted(){
		this.getDiscountTemplate().then((res)=>{
			let { status = false , data = []} = res.data 
			if( status  ){
				this.templates =  data.map((item)=>{
					return {
						id : item.id ,
						name : item.name,
						width : item.width,
						height : item.height,
						content : JSON.parse(item.content),
						background : item.background,
						sample : item.sample
					}
				}) 
			}
			this.is_loading = false
		})
		.catch((err)=>{
			this.is_loading_error = true 
			this.is_loading = false
		})
	}
}
</script>
<style lang="scss" scoped>
	.modal-autopilot-choose-template{
		&-loading{

		}
		&-list{
			display: flex;
			flex-wrap: wrap;
		}
		.item-template{
			width: 20%;
			height: 160px;
			padding: 15px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			img{
				max-width: 100%;
				max-height: 100% ;
			}
			&:hover{
				background-color: #F3F3F3;
			}
		}
	}
</style>