<template>
	<div class="vue-list-autopilot-template p-t-50 p-b-50">
		<div class="container">
			<div class="row">
				<div class="col col-6">
					<h1 class="page-title">Discount Templates</h1>
				</div>
				<div class="col col-6 text-right">
					<a-button  type="primary" @click="redirect({ name : 'CreateAutopilotTemplate'})">
						<span>Discount Template</span>
					</a-button>
				</div>
				<div class="col col-12 m-t-20">
					<transition name="fade-in" mode="out-in">
						<div class="vue-create-autopilot-template-loading" v-if="is_loading_page" key="is-loading">
							<a-spin>
								<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
							</a-spin>
						</div>
						<div  v-else key="is-loading-success">
							
							<div class="list-item-templates">
								<div class="item-template" v-for="(item,index) in data" :key="`index_${index}`">
									<img v-if="item.sample && item.sample" :src="item.sample" alt="">
									<a-button type="outline-danger" class="item-template-remove" @click="remove(item.id)">
										<sh-icon :icon="['fal','trash-alt']" />
									</a-button>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>
		
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
export default {
	name : 'AutopilotTemplates',
	components:{
		VueSlider
	},
	metaInfo(){
		return {
			title: 'Create Template',
		}
	},
	data(){
		return {
			is_loading_page : true,
			is_loading : false,
			data : []
		}
	},
	methods:{
		...mapActions({
			getDiscountTemplate : 'utils/getDiscountTemplate',
			removeDiscountTemplate : 'utils/removeDiscountTemplate'
		}),
		remove(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Delete Template',
				content: 'Are you sure you want to delete this Template?',
				okText : 'Delete',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.removeDiscountTemplate({ id }).then((res)=>{
							let { status = false } = res.data 
							if( status ){
								this.toastSuccess({
									title: "Done !",
                    				message: "Delete Template success",
								})
								this.handleLoad()
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not delete this Autopilot",
								})
							}
							resolve()
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not delete this Autopilot",
							})
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})

		},
		handleLoad(){
			this.is_loading_page = true
			this.getDiscountTemplate().then((res)=>{
				let { status = false , data = []}  = res.data 
				if( status ){
					this.data = data 
				}
				this.is_loading_page = false
			})
			.catch(()=>{
				this.is_loading_page = false
			})
		}
	},
	mounted(){
		this.handleLoad()
	}
}
</script>
<style lang="scss" >
	.vue-list-autopilot-template{
		.list-item-templates{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			.item-template{
				@include flex(200px);
				height: 200px;
				display: flex;
				align-items: center;
				justify-items: center;
				padding: 24px;
				border: 1px solid $border-color;
				position: relative;
				margin: 0 10px 20px 10px;
				img{
					max-width: 100%;
					max-height: 100%;
				}
				&-remove{
					position: absolute;
					top: 0;
					right: 0;
					z-index: 1;
				}
				&-edit{
					position: absolute;
					top: 0;
					right: 50px;
					z-index: 1;
				}
			}
		}
		
	}
	
</style>