<template>
	<div class="vue-list-autopilot-template p-t-50 p-b-50">
		<div class="container">
			<div class="row">
				<div class="col col-6">
					<h1 class="page-title">Autopilot Templates</h1>
				</div>
				<div class="col col-6 text-right">
					<a-button  type="primary" @click="visible_modal = true" class="m-r-15">
						<span>Import Review Template</span>
					</a-button>
					<a-button  type="primary" @click="showModalCreate">
						<span>Create Template</span>
					</a-button>
				</div>
				<div class="col col-12 m-t-20">
					<div class="list-items-table">
						<div class="item-row item-row-heading item-template">
							<div class="item-col item-template-index">#</div>
							<div class="item-col item-template-content">
								Content
							</div>
							<div class="item-col item-template-type">
								Social
							</div>
							<div class="item-col item-template-type">
								Type
							</div>
							<div class="item-col item-template-action">&nbsp;</div>
						</div>
						
						<div v-if="is_loading_page" class="p-t-5 p-b-5">
							<a-skeleton v-for="item in 10" :key="`item_${item}`" active avatar :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
						</div>
						<div v-else key="is-loading-success">
							<template v-if="data">
								<template v-if="data.length">
									<div class="item-row item-template" v-for="(item,index) in data" :key="item.id" >
										<div class="item-col item-template-index">{{index + 1}}</div>
										<div class="item-col item-template-content">
											{{ item.content }}
										</div>
										<div class="item-col item-template-type">
											<i :class="`item-social social-${item.social_type}`"></i>
										</div>
										<div class="item-col item-template-type">
											{{ item.type }}
										</div>
										<div class="item-col item-template-action">
											<a href="#" class="text-danger" @click="handleRemove(item.id)">
												<a-icon type="delete" />
											</a>
											<a href="#" class="text-primary m-l-16" @click="handleEdit(item)">
												<a-icon type="edit" />
											</a>
										</div>
									</div>
								</template>
								<template v-else>
									<div class="autopilot-error-empty">
										<div class="text-center">
											<div class="m-t-20">No results found !</div>
										</div>
									</div>
								</template>
							</template>
							<template v-else>
								<div class="autopilot-error-empty">
									<div class="text-center">
										<div class="m-t-20">No Autopilot Template</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
		<a-modal transitionName="none" maskTransitionName="none" :destroyOnClose="true" :afterClose="afterCloseModal" title="Template" v-model="visible" :footer="false" width="600px">
			<div class="modal-create-autopilot-template">
				<div class="m-b-4">
					<strong>Title</strong>
				</div>
				<div class="m-b-16">
					<input type="text" class="ant-input" v-model="form.title">
				</div>
				<div class="m-b-16">
					<div class="row">
						<div class="col col-6">
							<div class="m-b-4"><strong>Type</strong></div>
							<a-radio-group name="radioType" v-model="form.type">
								<a-radio value="default">
									Default
								</a-radio>
								<a-radio value="review">
									Review
								</a-radio>
							</a-radio-group>
						</div>
						<div class="col col-6">
							<div class="m-b-4"><strong>Social Type</strong></div>
							<a-radio-group name="radioSocialType" v-model="form.social_type">
								<a-radio value="facebook">
									Facebook
								</a-radio>
								<a-radio value="twitter">
									Twitter
								</a-radio>
							</a-radio-group>
						</div>
						<div class="col col-12 m-t-16">
							<a-checkbox v-model="form.is_free" id="is_free_label" /> 
							<label for="is_free_label" class="m-l-16">Free</label>
						</div>
					</div>
				</div>
				<div class="m-b-4">
					<div class="row">
						<div class="col col-6">
							<strong>Content</strong>
						</div>
						<div class="col col-6 text-right">
							<div class="vue-autopilot-add-variant">
								<a-dropdown transitionName="none" maskTransitionName="none" :trigger="['click']"  class="vue-autopilot-add-variant-trigger" v-model="dropdown_visibile" >
									<slot name="btn-trigger">
										<a-button class="btn-trigger" id="btn-add-variant-autopilot">
											<sh-icon :icon="['fal','plus']" />
										</a-button>
									</slot>
									<a-menu slot="overlay" class="vue-autopilot-add-variant-menu" >
										<a-menu-item class="vue-autopilot-add-variant-menu-item" v-for="(item,index) in variants" :key="`item_index_${index}`" @click="onSelectVariant(item)">
											{{ item }}
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</div>
						</div>
					</div>
				</div>
				<div class="m-b-16">
					<vue-autopilot-contenteditable :variants="variants" ref="contenteditable" :is-error="false" v-model="form.content" placeholder="add content " />
				</div>
				<div class="text-right">
					<a-button type="primary" @click="onSubmit" :loading="is_loading">
						<template v-if="form.id">
							Update
						</template>
						<template v-else>
							Create
						</template>
					</a-button>
				</div>
			</div>
		</a-modal>
		<a-modal transitionName="none" maskTransitionName="none" :destroyOnClose="true" title="Template" v-model="visible_modal" :footer="false" width="600px">
			<div class="modal-create-autopilot-template">
				<template v-for="(item,index) in templates">
					<div :key="`index_${index}`">
						<a-button @click="importCreate(index)"  class="m-b-5 m-t-5">
							<span>{{index + 1}} . </span><span> {{ item.status ? 'done' : 'none'}}</span>
						</a-button>
						<vue-autopilot-contenteditable :variants="variants" ref="contenteditable" :is-error="false" v-model="item.content" placeholder="add content " />
					</div>
				</template>
				
			</div>
		</a-modal>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import VueAutopilotContenteditable from "@publish/modules/autopilot/components/autopilot/vue-autopilot-contenteditable";
export default {
	name : 'AutopilotTemplates',
	components:{
		VueAutopilotContenteditable
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
			loading : false,
			data : [],
			visible : false,
			visible_modal : false,
			is_import: false,
			form :{
				id : '',
				title : 'Template',
				content : '',
				type : 'default',
				social_type : 'facebook',
				is_free : true
			},
			dropdown_visibile : false,
			template_index : 0,
			variants : ['PRODUCT_URL','PRODUCT_TITLE','VENDOR_NAME','LOWEST_PRICE','PRODUCT_TAGS','STORE_URL' ,'DISCOUNT_CODE','DISCOUNT_PERCENTAGE','VALID_TIME' ,'REVIEW_RATING','REVIEWER_NAME' ,'REVIEW_BODY','REVIEW_RATING_ICON'],
			templates : [
				{
					title : 'Template for review autopilot',
					content : '{{REVIEW_RATING_ICON}} {{REVIEW_RATING}} star review from {{REVIEWER_NAME}}:\n{{REVIEW_BODY}}\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'facebook',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop got a {{REVIEW_RATING}} star review from {{REVIEWER_NAME}}:\n{{REVIEW_BODY}}\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'facebook',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'New {{REVIEW_RATING}} star review by {{REVIEWER_NAME}}. Here is their review:\n{{REVIEW_BODY}}\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'facebook',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop was given a {{REVIEW_RATING}} star review by {{REVIEWER_NAME}}:\n{{REVIEW_BODY}}\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'facebook',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop received a {{REVIEW_RATING}} star rating from {{REVIEWER_NAME}}:\n{{REVIEW_BODY}}\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'facebook',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : '{{REVIEW_RATING}} star review from {{REVIEWER_NAME}}:\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'twitter',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop got a {{REVIEW_RATING}} star review from {{REVIEWER_NAME}}:\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'twitter',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'New {{REVIEW_RATING}} star review by {{REVIEWER_NAME}}:\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'twitter',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop was given a {{REVIEW_RATING}} star review by {{REVIEWER_NAME}}:\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'twitter',
					is_free : true,
					status : false,
				},
				{
					title : 'Template for review autopilot',
					content : 'Shop received a {{REVIEW_RATING}} star rating from {{REVIEWER_NAME}}:\n{{PRODUCT_URL}}',
					type : 'review',
					social_type : 'twitter',
					is_free : true,
					status : false,
				}
			]
		}
	},
	methods:{
		...mapActions({
			getList : 'autopilot-template/list',
			create : 'autopilot-template/create',
			update : 'autopilot-template/update',
			delete : 'autopilot-template/delete',
		}),
		handleLoad(){
			this.is_loading_page = true
			this.getList().then((res)=>{
				let { status = false , data = []}  = res.data 
				if( status ){
					this.data = data.sort( (a,b)=>{
						return a.id - b.id
					})
				}
				this.is_loading_page = false
			})
			.catch(()=>{
				this.is_loading_page = false
			})
		},
		handleRemove(id){
			this.$confirm({
				confirmLoading: true,
				title: 'Delete Template',
				content: 'Are you sure you want to delete this Template?',
				okText : 'Delete',
				cancelText : 'Cancel',
				okType:'danger',
				onOk : ()=>{
					return new Promise((resolve, reject) => {
						this.delete({ id }).then((res)=>{
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
		handleEdit(item){
			this.form.id = item.id 
			this.form.content = item.content
			this.form.type = item.type 
			this.form.social_type = item.social_type
			this.form.title = item.title
			this.form.is_free = item.is_free
			this.visible = true
		},
		onSubmit(){
			if( this.form.content && this.form.title ){
				if( this.is_loading ) return 
				this.is_loading = true
				if( this.form.id ){
					this.update({
						id : this.form.id ,
						formdata :{
							title : this.form.title,
							content  : this.trimContent(this.form.content),
							type : this.form.type,
							social_type : this.form.social_type,
							positions: null,
							is_free : this.form.is_free,
						}
					})
					.then((res)=>{
						let { status = false } = res.data 
						if( status ){
							this.toastSuccess({
								title : 'Success',
								message: 'Update success !',
							})
							this.visible = false
							this.handleLoad()
						}else{
							this.toastError({
								title : 'Error!',
								message: 'Update fail !',
							})
						}
						this.is_loading = false
					})
					.catch(()=>{
						this.toastError({
							title : 'Error!',
							message: 'Update fail !',
						})
						this.is_loading = false
					})
				}else{
					this.create({
						title : this.form.title,
						content  : this.trimContent(this.form.content),
						type : this.form.type,
						social_type : this.form.social_type,
						positions: null,
						is_free : this.form.is_free,
					})
					.then((res)=>{
						let { status = false } = res.data 
						if( status ){
							this.toastSuccess({
								title : 'Success',
								message: 'Create success !',
							})
							this.visible = false
							this.handleLoad()
						}else{
							this.toastError({
								title : 'Error!',
								message: 'Create fail !',
							})
						}
						this.is_loading = false
					})
					.catch(()=>{
						this.toastError({
							title : 'Error!',
							message: 'Create fail !',
						})
						this.is_loading = false
					})
				}
			}
		},
		showModalCreate(){
			this.visible = true
		},
		onSelectVariant(item){
			this.$refs.contenteditable.addProductHashtag(item)
			this.dropdown_visibile = false 
		},
		trimContent(content) {
			return content.replace(/^\s+|\s+$/g, "");
		},
		afterCloseModal(){
			this.dropdown_visibile = false
			this.form.id = ''
			this.form.title = 'Template',
			this.form.content = '',
			this.form.type = 'default',
			this.form.social_type = 'facebook'
			this.form.is_free = true
		},
		bulkImport(){
			this.template_index  = 0 
			this.is_import = true
			this.import()
		},
		import(){
			if( this.template_index < this.templates.length){
				var index = this.template_index
				var temp = this.templates[index]
				this.create({
					title : temp.title,
					content  : temp.content,
					type : temp.type,
					social_type : temp.social_type,
					positions: null,
					is_free : temp.is_free,
				})
				.then((res)=>{
					let { status = false } = res.data 
					if( status ){
						this.templates[index].status = true 
						this.template_index += 1
						setTimeout(()=>{
							this.import()
						},500)
					}else{
						setTimeout(()=>{
							this.import()
						},500)
					}
				})
				.catch(()=>{
					setTimeout(()=>{
						this.import()
					},500)
				})
			}else{
				this.is_import = false
			}
		},
		importCreate(index){
			var item = this.templates[index]
			this.create({
				title : item.title,
				content  : item.content,
				type : item.type,
				social_type : item.social_type,
				positions: null,
				is_free : item.is_free,
			})
			.then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.templates[index].status = true 
					this.toastSuccess({
						title : 'Success',
						message: 'Create success !',
					})
				}else{
					this.toastError({
						title : 'Error!',
						message: 'Create fail !',
					})
				}
			})
			.catch(()=>{
				this.toastError({
					title : 'Error!',
					message: 'Create fail !',
				})
			})
		}

	},
	mounted(){
		this.handleLoad()
	}
}
</script>
<style lang="scss" >
	.item-template{
		height: 80px;
		border-bottom: 1px solid #ccc;
		cursor: default !important;
		&-index{
			@include flex(50px);
		}
		&-action{
			@include flex(130px);
			text-align: right;
		}
		&-content{
			@include col;
		}
		&-type{
			@include flex(100px);
		}
	}
	.modal-create-autopilot-template{
		padding: 15px;
		.vue-autopilot-contenteditable{
			border: 1px solid #ccc;
			padding: 15px;
		}
	}
</style>