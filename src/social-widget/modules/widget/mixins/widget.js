import { mapActions, mapGetters } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
	data(){
		return {
			is_modify : false,
			is_loading : false,
			is_loading_page : true ,
			is_loading_error : false ,
			is_active : 'options',
			formstate: false,
			tab : 'options',
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
				"collage_style" : 1,
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
		}
	},
	computed :{
		...mapGetters({
			is_logged : 'auth/getLogged',
			shopify_pages :'page/getALl',
			shopify_gallery :'gallery/getAll',
		})
	},
	methods: {
		...mapActions({
			'getPage' : 'page/getAll',
			'getGallery' : 'gallery/getAll',
			'updateStatus' : 'widget/updateStatus',
		}),
		changeTab(payload){
			if( this.is_active != payload){
				this.is_active = payload
			}
		},
		loadDefaultData(){
			return new Promise((resolve, reject)=>{
				Promise.all([ this.getPage({ page_id : this.form.page_id }) , this.getGallery()]).then(values => { 
					resolve()
				})
			});
		},
		getFormData(){
			var page_selected = _.find( this.shopify_pages , { page_id :  this.form.page_id})
			var formdata = this.$clone(this.form)
			formdata['page_name'] = page_selected.name
			return formdata
		},
		setModify(){
			this.$watch( 'form' , {
				handler : function(){
					if( !this.is_modify ){
						this.is_modify = true
					}
				},
				deep :true 
			})
		},
		handleUpdateStatus( id , status ){
			this.$confirm({
				confirmLoading: true,
				title: status ?  'Activate widget' : 'Pause widget',
				content:  status ? 'Do you want to activate this widget ?' : 'Do you want to pause this widget ?',
				okText : status ?  'Activate' : 'Pause',
				cancelText : 'Cancel',
				okType:'primary',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.updateStatus({ id , status}).then((res)=>{
							if( res.data  && res.data.status ){
								this.status = status
								this.toastSuccess({
									title: "Done !",
									message: status ? 'Activate widget success !' : 'Pause widget success !',
								})
							}else{
								this.toastError({
									title : 'Error',
									message: "Can not update status widget",
								})
							}
						})
						.catch((err)=>{
							this.toastError({
								title : 'Error',
								message: "Can not update status widget",
							})
						})
						.finally(()=>{
							resolve()
						})
					})
					
				},
				onCancel :()=>{

				}
			})
		},
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
				page_custom_position : {
					required : requiredIf(()=>{
						return this.form.page_position == 'custom'
					})
				},
				page_custom_element : {
					required : requiredIf(()=>{
						return this.form.page_position == 'custom'
					})
				},
				collage_style :{
					required : requiredIf(()=>{
						return this.form.display_layout == 'collage'
					})
				}
			}
		}
	},
	beforeRouteLeave (to, from, next) {
		if( this.is_modify  && this.is_logged  ){
			this.$confirm({
				title: "Discard Changes",
				content: "These changes won't be saved. Are you sure you want to leave this page?",
				okText: "Discard",
				cancelText: "Cancel",
				okType:'danger',
				zIndex : 10002,
				onOk : ()=>{
					next()
				},
				onCancel :()=>{
					
				}
			})
		}else{
			next()
		}
	}
}