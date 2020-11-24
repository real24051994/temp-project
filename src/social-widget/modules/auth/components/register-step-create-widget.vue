<template>
	
	<transition name="fade-in" mode="out-in">
		<div class="app-register-create-widget" v-if="is_loading_page" key="is-loading">
			<div class="app-register-create-widget-loading">
				<a-spin>
					<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
				</a-spin>
			</div>
		</div>
		<div class="app-register-create-widget" v-else key="loaded">
			<div class="page-title m-b-16">Create First Widget</div>
			<div class="app-register-create-widget-form">
				<div class="row">
					<div class="col col-12">
						<div class="item-form m-b-30">
							<div class="item-form-title">
								<label>
									Page
								</label>
							</div>
							<div class="item-form-value">
								<a-select :disabled="is_loading" :class="{'has-error' : formstate && $v.form.page_id.$invalid }"  v-model="form.page_id" placeholder="Select a page" >
									<a-select-option v-for="(item,index) in shopify_pages" :disabled="!item.status" :key="index" :value="item.page_id">
										{{ item.name }}
									</a-select-option>
								</a-select>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col col-12">
						<div class="item-form m-b-30">
							<div class="item-form-title">
								<label>
									Gallery
								</label>
							</div>
							<div class="item-form-value">
								<a-select :disabled="is_loading" :class="{'has-error' : formstate && $v.form.gallery_id.$invalid }" v-model="form.gallery_id" placeholder="Select a gallery">
									<a-select-option v-for="(item,index) in shopify_gallery" :key="index" :value="item.id">
										{{ item.name }}
									</a-select-option>
								</a-select>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col col-12">
						<div class="item-form m-b-30">
							<div class="item-form-title">
								<label>
									Position
								</label>
							</div>
							<div class="item-form-value">
								<a-radio-group :disabled="is_loading"  v-model="form.page_position" >
									<a-radio value="top">At Top</a-radio>
									<a-radio value="bottom">At Bottom</a-radio>
								</a-radio-group>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col col-12">
						<div class="text-center">
							<a-button type="primary" class="btn-submit" @click="onSubmit" :loading="is_loading" :disabled="is_loading">
								Create First Widget 
							</a-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { mapActions } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
	name : 'RegisterCreateWidget',
	props:{
		value :{

		},
		step :{

		}
	},
	data(){
		return {
			is_loading_page : true ,
			is_loading: false,
			formstate: false,
			form :{
				"gallery_id": null,
				"page_name": "",
				"page_id": null,
				"page_position": "top",
				"page_position_element": "",
				"page_custom_position" : "",
				"page_custom_element" : "",
				"heading_title": "Follow Us on Instagram",
				"image_hover_effect": "instagram_icon",
				"display_layout": "grid",
				"item_no_of_rows": 1,
				"item_no_of_columns": 5,
				"item_no_of_slider" : 5,
				"auto_play_slider" : true,
				"auto_play_duration" : 3,
				"mobile_display_layout": "grid",
				"mobile_item_no_of_rows": 1,
				"mobile_item_no_of_columns": 3,
				"mobile_item_no_of_slider" : 3,
				"mobile_auto_play_slider" : true,
				"mobile_auto_play_duration" : 2,
				"on_image_click": "popup",
				"on_image_click_target_link": "_blank",
				"var_css": {
					'--sw-heading-font-size' : '18px',
					'--sw-heading-text-align' : 'center',
					'--sw-heading-font-weight' : 'normal',
					'--sw-heading-color' : '#000000',
					'--sw-item-border-radius' : '3px',
					'--sw-item-no-of-columns' : 5,
					'--sw-item-gutter' : '2px',
					'--sw-overlay-bg' : '#000000',
					'--sw-overlay-opacity' : 0.5,
					'--sw-overlay-color' : '#ffffff',
					'--sw-overlay-font-size' :'14px',
				}
			},
			shopify_pages : [],
			shopify_gallery : [],
		}
	},
	methods : {
		...mapActions({
			'createWidget' : 'widget/create',
			'getListPages' : 'page/getAll',
			'getListGallery' : 'gallery/getAll',
		}),
		onSubmit(){
			if( this.is_loading ) return 
			this.formstate = true 
			if( this.$v.form.$invalid ) return
			this.is_loading = true 
			var formdata = this.getFormData()
			this.createWidget(formdata).then((res)=>{
				let { status = false , data  , message = ''} = res.data 
				if( status ){
					this.toastSuccess({
						title : 'Create widget success !'
					})
					this.$emit('input' , data)
					this.$emit('on-update')
					this.$emit('update:step' , 2)
				}else{
					this.toastError({
						title : 'Error !',
						message : message
					})
				}
			})
			.finally(()=>{
				this.is_loading = false
			})
		},
		getFormData(){
			var page_selected = _.find( this.shopify_pages , { page_id :  this.form.page_id})
			var formdata = this.$clone(this.form)
			formdata['page_name'] = page_selected.name
			return formdata
		},
		handleGetListPage(){
			return new Promise((resolve, reject)=>{
				this.getListPages({}).then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						let { pages = [] , pageSelected = []} = data 
						var selected = pageSelected.map((item)=>item.page_id)
						var calc_page  = pages.map((item)=>{
							item['status'] = selected.indexOf(item.page_id) == -1  
							return item
						}) 
						this.shopify_pages = calc_page
						if( calc_page &&  calc_page.length ){
							var first = calc_page.first()
							this.form.page_id = first.page_id
							
						}
					}
				})
				.finally(()=>{
					resolve()
				})
			});
		},
		handleGetListGallery(){
			return new Promise((resolve, reject)=>{
				this.getListGallery().then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						this.shopify_gallery = data 
						if( data &&  data.length ){
							var first = data.first()
							this.form.gallery_id = first.id
						}
					}
				})
				.finally(()=>{
					resolve()
				})
			});
		}
	},
	validations(){
		var vm = this;
		return {
			form : {
				gallery_id:{
					required
				},
				page_id:{
					required
				},
				page_position:{
					required
				},
			}
		}
	},
	mounted(){
		Promise.all([this.handleGetListPage() , this.handleGetListGallery() ]).then(res => {	})
		.finally(()=>{
			this.is_loading_page = false
		})
	}
}
</script>
<style lang="scss">
	.app-register-create-widget{
		&-loading{
			height: 350px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-form{
			width: 400px;
			margin: 0 auto;
			padding: 45px 30px 30px 30px ;
			.item-form{
				display: flex;
				flex-wrap: wrap;
				user-select: none;
				&-title{
					@include flex(130px);
					label{
						font-weight: 600;
						font-size: 14px;
						line-height: 32px;
					}
				}
				&-value{
					@include flex(calc(100% - 130px));
					.ant-select ,.ant-input{
						width: 100%;
					}
					.radio-block{
						display: block;
						
						.ant-radio-wrapper{
							display: block;
							margin: 0 0 8px 0;
						}
					}
					.ant-input-select-custom-element{
						cursor: pointer;
					}
				}
			}
			.btn-submit{
				min-width: 200px;
				height: 40px;
			}
		}
	}
</style>