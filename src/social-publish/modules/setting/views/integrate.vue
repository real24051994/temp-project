<template>
	<div class="container m-t-20">
		<div class="row">
			<div class="col col-12" v-if="is_loading_error">
				<div class="list-setting-error" >
					<vue-error type="500"></vue-error>
				</div>
			</div>
			<div class="col col-12" v-else>
				<div v-if="is_loading_page">
					<div class="row">
						<div class="col col-6">
							<div class="vue-setting-integrate">
								<div class="item-integrate">
									<a-skeleton :avatar="{ shape: 'square' }" active title :paragraph="{ rows: 2 , width : '100%' }" />
								</div>
							</div>
						</div>
						<div class="col col-6">
							<div class="vue-setting-integrate">
								<div class="item-integrate">
									<a-skeleton :avatar="{ shape: 'square' }" active title :paragraph="{ rows: 2 , width : '100%' }" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="list-setting-content-integrate" >
					<vue-setting-integrate v-model="integrations" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import VueSettingIntegrate from '../components/vue-setting-integrate'
import { mapActions } from 'vuex'
export default {
	name : "Intergrate",
	components:{
		VueSettingIntegrate
	},
	data(){
		return {
			is_loading_page: true,
			is_loading_error : false,
			integrations: {
				bit_ly :{
					status : false,
					name : null 
				},
				ar_review :{
					status : false,
					message : ''
				}
			},
		}
	},
	methods:{
		...mapActions({
			integration: 'intergate/list',
		}),
		getIntegration(){
			return new Promise((resolve, reject)=>{
				this.integration({ }).then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						this.integrations = data
					} 
					resolve()
				})
				.catch((e)=>{
					resolve()
				})
			});
		},
	},
	async mounted(){
		try {
			await this.getIntegration()
		} catch (error) {
			console.log(error);
			this.is_loading_error = true
		}
		this.is_loading_page = false
	},
}
</script>