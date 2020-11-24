<template>
	<div class="vue-social-post-hashtag">
		<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomCenter" class="vue-social-post-hashtag-trigger" v-model="visible" @visibleChange="onVisibleChange" :overlayClassName="overlayClassName">
			<slot name="btn-trigger">
				<a-button class="btn-trigger">
					<sh-icon icon="hashtag" />
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-social-post-hashtag-menu">
				<a-menu-item key="0" class="vue-social-post-hashtag-menu-item">
					<transition name="fade-in" mode="out-in">
						<div v-if="mode == 'list'" class="vue-social-post-hashtag-tab" key="tab-list">
							<div class="vue-hashtag-header vue-hashtag-header-search">
								<a-input placeholder="Search" type="text"  class="search-input" @keyup="onKeyword" v-model="pagination.keyword" >
									<a-icon slot="prefix" type="search" />
								</a-input>
								<div class="search-append">
									<a-button type="primary" block @click="mode ='create'">
										Create Group
									</a-button>
								</div>
							</div>
							<div class="vue-hashtag-body">
								<transition name="fade-in" mode="out-in">
									<div class="vue-hashtag-loading" v-if="is_loading" key="is-loading-list">
										<a-spin>
											<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
										</a-spin>
									</div>
									<div class="list-hashtag" v-else key="is-loading-success">
										<vue-simple class="list-hashtag-simple">
											<template v-if="pagination.data">
												<template v-if="pagination.data.length">
													
														<div v-for="item in pagination.data" :key="item.id" class="item-hashtag" @click="apply(item)">
															<div class="item-hashtag-wrap">
																<div class="item-hashtag-title" :title="item.title ? item.title : 'Untitled'">
																	{{ item.title ? item.title : 'Untitled' }}
																</div>
																<div class="item-hashtag-content" :title="item.content">
																	{{ item.content }}
																</div>
															</div>
															<div class="item-hashtag-action">
																<a-button type="primary">Apply</a-button>
																<a-button class="m-l-8" @click.stop.prevent="edit(item)">Edit</a-button>
															</div>
														</div>
														<div class="p-t-8 p-b-8">
															<vue-pagination :pageRange="3" :change="onChangePage" v-model="pagination.current_page" :total="pagination.total_page"
															:router-link="false" />
														</div>
													
												</template>
												<template v-else>
													<div class="vue-hashtag-empty">
														<h3>No Hashtag Group found</h3>
														<p>
															<a @click="mode = 'create'">Create Group Hashtag</a> to apply hashtag faster
														</p>
													</div>
												</template>
											</template>
											<template v-else>
												<div class="vue-hashtag-empty">
													<h3>No Hashtag Group created</h3>
													<p>
														<a @click="mode = 'create'">Create Group Hashtag</a> to apply hashtag faster
													</p>
												</div>
											</template>
										</vue-simple>
									</div>
								</transition>
							</div>
						</div>
						<div v-else-if="mode == 'create' || mode == 'edit'" class="vue-social-post-hashtag-tab" key="tab-create">
							<div class="vue-hashtag-header">
								<a-button class="btn-back" v-if="mode == 'create'"  @click="mode ='list'">
									<i><sh-icon :icon="['far','chevron-left']" /></i> Create Hashtag Group
								</a-button>
								<a-button class="btn-back" v-if="mode == 'edit'"  @click="mode ='list'">
									<i><sh-icon :icon="['far','chevron-left']" /></i> Edit Hashtag Group
								</a-button>
							</div>
							<div class="vue-hashtag-body">
								<form class="vue-hashtag-form" @submit.stop.prevent="onSubmit">
									<div class="form-item">
										<div class="form-item-label"><label>Group name</label></div>
										<div class="form-item-error">
											<transition name="fade-in" mode="out-in">
												<div  v-if="formstate && !$v.form.title.maxLength">
													Please enter no more than 50 characters
												</div>
											</transition>
										</div>
									</div>
									<a-form-item class="m-b-15"  :validate-status="formstate && $v.form.title.$invalid ? 'error' : ''" >
										<a-input placeholder="Name"  type="text" v-model="form.title" :disabled="is_form_loading" />
									</a-form-item>
									<div class="form-item">
										<div class="form-item-label"><label>Hashtag Content</label></div>
										<div class="form-item-error">
											<transition name="fade-in" mode="out-in">
												<div  v-if="formstate && !$v.form.content.required" >
													Please type some hashtag to Create Group
												</div>
												<div  v-else-if="formstate && !$v.form.content.maxLength">
													Please enter no more than 100 characters
												</div>
											</transition>
										</div>
									</div>
									<a-form-item class="m-b-15" :validate-status="formstate && $v.form.content.$invalid ? 'error' : ''" >
										<a-textarea placeholder="Hashtag" v-model="form.content" />
										<div class="textarea-count" :class="{ 'is-error' : !$v.form.content.maxLength }">
											{{ 100 - form.content.length}} character avaialabe
										</div>
									</a-form-item>
									<div class="form-item-action">
										<div class="form-item-action-left">
											<a-button @click="remove"  v-if="mode=='edit'" html-type="button" type="outline-danger"  :loading="is_delete_loading" >
												Delete
											</a-button>
										</div>
										<div class="form-item-action-right">
											<a-button type="primary" html-type="submit" :loading="is_form_loading">
												<template v-if="mode=='create'">Create Group</template>
												<template v-if="mode=='edit'">Save</template>
											</a-button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</transition>
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import { mapActions } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
	name : 'VueHashtag',
	props :{
		overlayClassName :{
			type : String,
			default : ''
		}
	},
	data(){
		return {
			visible : false,
			mode : 'create',
			formstate : false,
			is_loading: false,
			is_delete_loading: false,
			is_form_loading : false,
			timeout : null,
			form :{
				id : '',
				title : '',
				content : '',
			},
			pagination:{
				data : null,
				current_page : 1,
				total_page : 0,
				total : 0,
				keyword: ''
			}
		}
	},
	methods:{
		...mapActions({
			getHashTags: "hashtag/list",
			createHashtags: "hashtag/create",
			updateHashtags: "hashtag/update",
			deleteHashtags: "hashtag/delete"
		}),
		onSubmit(){
			this.formstate = true 
			if( !this.$v.form.$invalid  && !this.is_form_loading ){
				if( this.mode == 'create'){
					this.create()
				}else if( this.mode == 'edit'){
					this.update()
				}
			}
		},
		create(){
			this.is_form_loading = true;
			this.createHashtags({
				title: this.form.title,
				content: this.form.content,
			})
			.then(res => {
				let { status } = res.data;
				if (status) {
					this.toastSuccess({
						title: "Done !",
						message: "Create hashtags success"
					});
					this.mode = 'list';
					this.load(1)
				} else {
					this.toastError({
						title : 'Error',
						message: 'Something went wrong !',
					})
				}
				this.is_form_loading = false;
			})
			.catch(res => {
				this.toastError({
					title : 'Error',
					message: 'Something went wrong !',
				})
				this.is_form_loading = false;
			})
		},
		update(){
			this.is_form_loading = true;
			this.updateHashtags({
				title: this.form.title,
				content: this.form.content,
				id : this.form.id
			})
			.then(res => {
				let { status } = res.data;
				if (status) {
					this.toastSuccess({
						title: "Done !",
						message: "Update hashtags success"
					});
					this.mode = 'list';
					this.load()
				} else {
					this.toastError({
						title : 'Error',
						message: 'Something went wrong !',
					})
				}
				this.is_form_loading = false;
			})
			.catch(res => {
				this.toastError({
					title : 'Error',
					message: 'Something went wrong !',
				})
				this.is_form_loading = false;
			})
		},
		load(page){
			this.is_loading = true 
			let  current_page = page ? page : this.pagination.current_page
			this.getHashTags({
				keyword : this.pagination.keyword.trim(),
				page  : current_page
			})
			.then(res => {
				let { status, data, pagination } = res.data;
				if (status) {
					this.pagination.data = data;
					if( pagination ){
						this.pagination.current_page = pagination.current_page;
						this.pagination.total_page = pagination.total_page;
						this.pagination.total = pagination.total;
						if( data && !data.length && current_page > pagination.total_page && pagination.total_page > 0 ){
							this.load(pagination.total_page)
						}
					}else{

					}
					
				}
				this.is_loading = false;
			})
			.catch(err => {
				this.is_loading = false;
			})
		},
		onChangePage(page){
			this.load(page)
		},
		onKeyword(event) {
			clearTimeout(this.timeout);
			if (event.keyCode == 13) {
				this.load(1);
			} else {
				this.timeout = setTimeout(() => {
					this.load(1);
				}, 1000);
			}
		},
		apply(item){
			this.$emit('on-select' , item.content)
		},
		edit(item){
			let { id  , content, title = ''} = item 
			this.form = {
				id , content , title 
			}
			this.mode = 'edit'
		},
		remove(){
			if( this.is_delete_loading ) return 
			this.is_delete_loading = true
			this.deleteHashtags({ id : this.form.id}).then((res)=>{
				let { status = false } = res.data 
				if( status ){
					this.toastSuccess({
						title: "Done !",
						message: "Update hashtags success"
					});
					this.mode = 'list';
					this.load()
				}else{
					this.toastError({
						title : 'Error',
						message: 'Something went wrong !',
					})
				}
				this.is_delete_loading = false
			})
			.catch((err)=>{
				this.toastError({
					title : 'Error',
					message: 'Something went wrong !',
				})
				this.is_delete_loading = false
			})
		},
		onVisibleChange(visible){
			if( visible ){
				this.is_loading = true
				this.mode = 'list'
				this.formstate = false
				this.is_form_loading = false
				this.form = {
					id : '',
					title : '',
					content : '',
				}
				this.pagination = {
					data : null,
					current_page : 1,
					total_page : 0,
					total : 0,
					keyword : ''
				}
				this.load(1)
			}else{
				this.is_loading = true
				this.mode = 'list'
			}
		}
	},
	watch : {
		'mode' : function(value){
			this.formstate = false
			if( value == 'create'){
				this.form = {
					id : '',
					title : '',
					content : ''
				}
			}
		}
	},
	mounted(){

	},
	validations: ()=>({
		form: {
			title :{
				maxLength: maxLength(50)
			},
			content :{
				required,
				maxLength: maxLength(100)
			},
		},
	}),
	
}
</script>
<style lang="scss" >
	.vue-social-post-hashtag{
		display: inline-block;
		position: relative;
		&-tab{
			width: 100%;
			display: block;
			overflow: hidden;
			border-radius: 4px;
			overflow: hidden;
			.vue-hashtag{
				&-header{
					height: 70px;
					border:1px solid $border-color;
					.btn-back{
						border: none;
						text-align: left;
						font-weight: 600;
						font-size: 20px;
						height: 70px;
						border: none;
						box-shadow: none;
						background: transparent;
						i{
							margin-right: 10px;
						}
					}
					&-search{
						position: relative;
						display: flex;
						flex-wrap: wrap;
						align-items: stretch;
						width: 100%;
						padding: 18px 16px;
						.search-input{
							flex: 1 1 auto;
							width: 1%;
							display: block;
							margin-right: 15px;
						}
					}
					
				}
				&-body{
					
					.list-hashtag{
						height: 310px;
						overflow: hidden;
						.list-hashtag-simple{
							height: 100%;
							overflow: hidden auto;
						}
						.item-hashtag{
							padding: 8px 16px;
							min-height: 60px;
							background: transparent;
							position: relative;
							display: flex;
							flex-wrap: nowrap;
							width: 100%;
							align-items: stretch;
							border-bottom: 1px solid $border-color;
							&:hover{
								background: #F3F3F3;
							}
							&-wrap{
								flex: 1 1 auto;
								width: 1%;
								display: block;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
							&-title{
								font-size: 14px;
								font-weight: 600;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
							&-content{
								font-size: 12px;
								color: $primary-color;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
							&-action{
								padding: 6px 0;
								display: none;
								margin-left: 10px;
							}
							&:hover{
								.item-hashtag-action{
									display: block;
								}
							}
						}
					}
				}
				&-form{
					display: block;
					padding: 16px;
					.form-item{
						position: relative;
						display: flex;
						flex-wrap: wrap;
						align-items: stretch;
						width: 100%;
						margin-bottom: 8px;
						&-label{
							flex: 1 1 auto;
							width: 1%;
							display: block;
							margin-right: 15px;
							font-weight: 600;
						}
						&-error{
							font-size: 11px;
							color: $danger;
						}
						&-action{
							display: flex;
							.ant-btn{
								min-width: 140px;

							}
							&-left{
								@include flex(50%);
								text-align: left;
							}
							&-right{
								@include flex(50%);
								text-align: right;
							}
						}
					}
					.ant-form-item{
						&-label{
							line-height: 24px;
							font-weight: 600;
						}
					}
					textarea.ant-input{
						height: 110px;
						resize: none;
					}
					.textarea-count{
						font-weight: 300;
						font-size: 11px;
						line-height: 14px;
						&.is-error{
							color : $danger;
						}
					}
				}
				&-loading{
					height: 310px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-empty{
					padding: 70px 0;
					text-align: center;
				}
			}
		}
		&-menu{
			padding: 0;
			.ant-dropdown-menu{
				padding: 0;
				box-shadow: none;
				.vue-hashtag-picker-item{
					padding: 0;
				}
			}
			.ant-dropdown-menu-item{
				background: transparent;
				width: 450px;
				background: #FFFFFF;
				box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
				border-radius: 6px;
				padding: 0;
				&:hover,&:focus{
					background: transparent;
				}
			}
		}
	}
</style>