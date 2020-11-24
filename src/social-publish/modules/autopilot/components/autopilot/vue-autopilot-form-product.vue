<template>
	<div class="vue-autopilot-form-product" :class="{'input-field-error' : validateCollection.$invalid}">
		<div class="row">
			<div class="col col-12">
				<div class="vue-autopilot-form-product-title">
					<h3>{{ $t('autopilot.form.label.product') }}</h3>
					<div v-if="autopilotType == 'latest'" class="vue-autopilot-form-product-title-info">
						<span @click="show_info = true">
							<i class="text-gray m-l-8">
								<sh-icon icon="info-circle" />
							</i>
						</span>
					</div>
				</div>
			</div>
			
			<div class="col col-12" v-if="autopilotType == 'latest'">
				<transition name="fade-in" mode="out-in">
					<div class="vue-autopilot-form-product-warning m-t-16" v-if="show_info">
						<a class="btn-close" @click="show_info = false">
							<sh-icon :icon="['fal','times']" />
						</a>
						<div class="vue-autopilot-form-product-warning-icon">
							<sh-icon icon="info-circle"/>
						</div>
						<div class="vue-autopilot-form-product-warning-content">
							<h4>{{ $t('autopilot.form.content.latest_warning.title') }}</h4>
							<p>{{ $t('autopilot.form.content.latest_warning.description') }}</p>
							<a href="https://help.socialhead.io/en/articles/3966655-how-to-use-latest-product-autopilot" target="_blank">{{ $t('autopilot.form.content.latest_warning.link') }}</a>
						</div>
					</div>
				</transition>
			</div>
			<template v-if="autopilotType == 'random' || autopilotType == 'review'">
				<div class="col col-12 m-t-16">
					<a-radio-group  v-model="option" class="radio-block">
						<a-radio value="all_product">{{ $t('autopilot.form.option.all_product') }}</a-radio>
						<a-radio value="collection" >{{ $t('autopilot.form.option.collection') }}</a-radio>
					</a-radio-group>
				</div>
				<transition name="fade-in" mode="out-in">
					<div class="col col-12 m-t-16" v-if="option == 'collection'">
						<a-button  @click="showModalCollection('')">
							{{ $t('autopilot.form.btn.select_collection') }}
						</a-button>
						<div class="row">
							<div class="col col-12 m-t-16">
								<div class="list-collections">
									<div class="item-collection item-collection-heading">
										<div class="item-collection-info">
											{{ $t('autopilot.form.label.product_collection') }}
										</div>
										<div class="item-collection-action">
											&nbsp;
										</div>
									</div>
									<template v-if="collection.length">
										<vue-simple v-if="is_visible" class="item-collection-scrollbar">
											<template v-for="(item,index) in collection" >
												<div class="item-collection" :key="`item_index_${index}`">
													<div class="item-collection-content">
														<div class="item-collection-image">
															<img v-if="item.image" :src="item.image" alt="">
															<img v-else src="@publish/assets/icons/default-collection.png" alt="">
														</div>
														<div class="item-collection-title">
															{{ item.title }} ({{ item.products_in_collection_count }})
														</div>
													</div>
													<div class="item-collection-action">
														<a-button @click="collection.splice(index,1)" >
															{{ $t('autopilot.form.btn.remove_collection') }}
														</a-button>
													</div>
												</div>
											</template>
										</vue-simple>
										<div v-else></div>
									</template>
									<template v-else>
										<div class="item-collection item-collection-empty p-l-16">
											{{ $t('autopilot.form.state.no_selected_collection') }}
										</div>
									</template>
									<transition name="fade-in" mode="out-in">
										<div v-if="validateCollection.$invalid && formstate">
											<div class="form-error" v-if="!validateCollection.required">
												{{ $t('autopilot.validate.require_collection') }}
											</div>
										</div>
									</transition>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</template>
			<div class="col col-12 m-t-16" v-if="autopilotType == 'random'">
				<label class="label-title">
					{{ $t('autopilot.form.label.share_type') }}
				</label>
				<a-radio-group v-model="share_type" class="radio-inline radio-share-type">
					<a-radio :disabled="disabled_share_type" value="link">{{ $t('autopilot.form.option.link') }}</a-radio>
					<a-radio value="image">{{ $t('autopilot.form.option.image') }}</a-radio>
				</a-radio-group>
			</div>
		</div>
		<a-modal  transitionName="none" maskTransitionName="none" class="autopilot-collection-modal" title="Select Collection"  wrap-class-name="autopilot-collection-modal-wrap" width="600px" @cancel="visible = false" :footer="false" :visible="visible"  >
			<div class="ant-modal-body-inner" >
				<div class="ant-modal-body-inner-search">
					<span class="ant-input-affix-wrapper ant-input-search">
						<span class="ant-input-prefix">
							<sh-icon :icon="['far','search']" />
						</span>
						<input :placeholder=" $t('autopilot.form.placeholder.search_collection')" type="text" class="ant-input" ref="input_modal" v-model="pagination.keyword" @keyup="onKeywordModal($event)"  >
					</span>
				</div>
				<div class="ant-modal-body-inner-content">
					<transition name="fade-in" mode="out-in">
						<div class="ant-modal-body-inner-content-list" v-if="is_loading" key="is-loading">
							<div class="p-l-16 p-r-16 p-t-16 p-b-16">
								<a-skeleton v-for="item in loading_rows" :key="`item_${item}`" active :avatar="{ shape : 'square'}" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
							</div>
						</div>
						<div class="ant-modal-body-inner-content-list" v-else key="loading-success">
							<template v-if="pagination.data.length > 0">
								<div class="list-collections">
									<div class="item-collection" v-for="(item,index) in pagination.data" :key="`template_index_${index}`" @click="onSelectCollection(item)">
										<div class="item-collection-checkbox">
											<label class="ant-checkbox-wrapper">
												<span class="ant-checkbox" :class="{ 'ant-checkbox-checked' : isChecked(item.id)}">
													<span class="ant-checkbox-inner">
													</span>
												</span>
											</label>
										</div>
										
										<div class="item-collection-info">
											<div class="item-collection-image">
												<img v-if="item.image" :src="item.image" alt="">
												<img v-else src="@publish/assets/icons/default-collection.png" alt="">
											</div>
											<div class="item-collection-title">
												<div v-line-clamp:20="2">
													{{ item.title }} ({{ item.products_in_collection_count }})
												</div>
											</div>
										</div>
									</div>
									<div class="p-b-20 p-t-20" v-if="pagination.total_page > 1">
										<vue-pagination class="m-0" :router-link="false" :change="onChangePage" :pageRange="3" :total="pagination.total_page" v-model="pagination.current_page" />
									</div>
								</div>
							</template>
							<template v-else>
								<div class="ant-modal-body-inner-content-list-not-found">
									{{ $t('autopilot.form.state.empty_collection') }}
								</div>
							</template>
						</div>
					</transition>
				</div>
				<div class="ant-modal-body-inner-actions">
					<a-button @click="onCancel">
						{{ $t('autopilot.form.btn.cancel_modal_collection') }}
					</a-button>
					<a-button @click="onApply" class="m-l-16" type="primary">
						{{ $t('autopilot.form.btn.apply_modal_collection') }}
					</a-button>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
	name: 'AutopilotFormProduct',
	props:{
		select_option :{
			type : String,
			default : 'all_product'
		},
		product_share_type :{
			type : String,
			default : 'image'
		},
		collection_ids:{
			type : Array,
			required : true,
		},
		validateCollection : {
			type : Object,
			required : true,
		},
		formstate:{
			type : Boolean,
			default : false,
		},
		autopilotType :{
			type : String,
			default : 'random'
		},
		socialType :{
			type : String,
			default : 'facebook'
		}
	},
	data(){
		return {
			visible : false,
			is_visible: true,
			is_loading: false,
			is_loading_error: false,
			show_info: true,
			timeout : null,
			timeout_modal: null,
			keyword : '',
			cancel_request: null,
			pagination :{
				current_page: 1,
				total_page: 0,
				keyword: '',
				data : []
			},
			checkbox : [],
			latest_range : [
				{
					id  : 'today',
					text : 'Today'
				},
				{
					id  : 1,
					text : '1 day ago'
				},
				{
					id  : 3,
					text : '3 days ago'
				},
				{
					id  : 7,
					text : '7 days ago'
				},
				{
					id  : 14,
					text : '14 days ago'
				},
				{
					id  : 30,
					text : '30 days ago'
				}
			]
		}
	},
	computed:{
		loading_rows(){
			return 5
		},
		option :{
			get(){
				return this.select_option
			},
			set(value){
				this.$emit('update:select_option', value)
			}
		},

		share_type :{
			get(){
				return this.product_share_type
			},
			set(value){
				this.$emit('update:product_share_type', value)
			}
		},
		collection :{
			get(){
				return this.collection_ids
			},
			set(value){
				this.$emit('update:collection_ids', value)
			}
		},
		disabled_share_type(){
			return this.socialType == 'instagram'
		}
	},
	methods:{
		...mapActions({
			getCollections : 'utils/getCollections'
		}),
		onKeyword(event) {
  			clearTimeout(this.timeout);
  			if (event.keyCode == 13) {
  				this.onChangeKeyword();
  			} else {
  				this.timeout = setTimeout(() => {
  					this.onChangeKeyword();
  				}, 500);
  			}
  		},
		onChangePage(page){
			this.pagination.current_page = page
			this.loadCollections()
		},

		onChangeKeyword(){
			if( this.keyword != ''){
				this.showModalCollection(this.keyword)
			}
		},	
		
		onKeywordModal(event) {
  			clearTimeout(this.timeout_modal);
  			if (event.keyCode == 13) {
  				this.onChangeKeywordModal();
  			} else {
  				this.timeout_modal = setTimeout(() => {
  					this.onChangeKeywordModal();
  				}, 500);
  			}
		},
		onChangeKeywordModal(){
			this.pagination.current_page = 1
			this.pagination.total_page  = 0
			this.loadCollections()
		},
		showModalCollection(keyword = ''){
			this.is_loading = true
			this.pagination.keyword = keyword
			this.pagination.current_page = 1
			this.pagination.total_page  = 0
			this.pagination.data = []
			setTimeout( ()=>{
				this.visible = true
				this.checkbox = this.$clone(this.collection)
				if( keyword ){
					this.$nextTick(()=>{
						this.$refs.input_modal.focus()
					})
				}
				this.loadCollections()
			}, 100);
		},
		onSearch(){
			this.visible = true
		},
		isChecked(id){
			return _.find(this.checkbox , { id : id }) != undefined
		},
		onSelectCollection(item){
			var index  = _.findIndex(this.checkbox , { id : item.id })
			if( index >= 0){
				this.checkbox.splice(index, 1)
			}else{
				this.checkbox.push(item)
			}
		},
		loadCollections(){
			this.is_loading = true
			this.is_loading_error = false

			if (this.cancel_request) {
				this.cancel_request.cancel('Start new request, stop active request');
			}
			this.cancel_request = this.createAxiosCancelRequestToken()
			this.getCollections({
				keyword : this.pagination.keyword,
				current_page : this.pagination.current_page ,
				total_page : this.pagination.total_page ,
				cancel_request_token : this.cancel_request.token
			}).then((res)=>{
				let { status =  false  , data = null } = res.data 
				if( status && data){ 
					let { pagination , rows } = data 
					this.pagination.data = rows 
					this.pagination.current_page = pagination.current_page 
					this.pagination.total_page = pagination.last_page   
				}else{
					this.pagination.data = [] 
				}
				this.is_loading = false
			})
			.catch((err)=>{
				if ( !this.$axios.isCancel(err)) {
					this.is_loading_error = true
				} 
				this.is_loading = false
			})
		},
		onCancel(){
			this.visible = false
		},
		onApply(){
			var collection =this.$clone(this.checkbox)
			this.is_visible = false 
			this.$nextTick(()=>{
				this.collection = collection
				this.is_visible = true 
			})
			
			this.visible = false
		}
	},
	watch :{
		"socialType" : function(value){
			if( value == 'instagram' && this.share_type != 'image'){
				this.share_type = 'image'
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.vue-autopilot-form-product{
		&-title{
			h3{
				display: inline-block;
			}
			&-info{
				display: inline-block;
				font-size: 16px;
			}
		}
		&-warning{
			border: 1px solid $primary-color;
			padding: 16px;
			border-radius: 4px;
			font-weight: 600;
			font-size: 14px;
			line-height: 22px;
			
			position: relative;
			display: flex;

			&-icon{
				@include flex(30px);
				i{
					font-size: 20px;
					color: $primary-color;
				}
			}
			&-content{
				@include flex(calc(100% - 30px));
				font-weight: normal;
				h4{
					color:$primary-color;
					font-size: 14px;
					margin-bottom: 8px;
				}
				p{
					color:$text;
					font-size: 14px;
					margin-bottom: 8px;
				}
			}
			.btn-close{
				position: absolute;
				right: 10px;
				top: 5px;
				color: $text;
				opacity: 0.5;
				font-size: 20px;
				&:hover{
					opacity: 1;
				}
			}
		}
		.radio-block{
			.ant-radio-wrapper{
				display: block;
				margin: 0 0 10px 0;
			}
		}
		.label-title{
			font-weight: 600;
			font-size: 14px;
		}
		.radio-inline{
			.ant-radio-wrapper{
				margin-left: 40px;
				margin-right: 0;
			}
		}
		.latest-select{
			width: 110px;
			&-icon{
				font-size: 16px;
			}
		}
	}
	.list-collections{
		.item-collection{
			position: relative;
			min-height: 57px;
			padding: 8px 0;
			display: flex;
			align-items: center;
			background: #fff;
			&-scrollbar{
				max-height: 228px;
				overflow: hidden auto;
			}
			&-heading{
				background: #EFEFEF;
				border-radius: 4px;
				font-weight: 600;
				min-height: 40px;
			}
			&:not(:last-child):before{
				content : '';
				position: absolute;
				left: 16px;
				right: 16px;
				bottom: 0;
				border-bottom: 1px solid $border-color;
			}
			&:hover{
				background: #f2f2f2;
			}
			&-checkbox{
				@include flex(50px);
				display: flex;
				align-items: center;
				justify-content: center;
				padding-left: 32px;
			}
			&-action{
				@include flex(120px);
				padding: 0 16px;
			}
			&-type{
				@include flex(170px);
				padding: 0 16px;
			}
			&-title{
				@include col;
				margin-left: 16px;
				display: flex;
				align-items: center;
			}
			&-image{
				@include flex(40px);
				height: 40px;
				border-radius: 4px;
				background: #515151;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					max-width: 100%;
					max-height:100%;
				}
			}
			&-content{
				@include col;
				padding: 0 16px;
				display: flex;
			}
			&-info{
				@include col;
				padding: 0 32px 0 16px;
				display: flex;
			}
			&-pagination{
				text-align: center;
				margin-top: 10px;
				margin-bottom: 10px;
				.ant-btn{
					margin: 0 5px;
				}
			}
		}
	}
	
</style>
<style lang="scss">
	.autopilot-collection{
		&-modal {
			
			.ant-modal{
				top: auto;
				padding: 0;
				.ant-modal-content {
					max-height: calc(100vh - 100px);
					position: relative;
					display: flex;
					flex-direction: column;

					.ant-modal-header {
						border-bottom: none;
						padding: 24px;
						height: 70px;
						display: flex;
						align-items: flex-start;
						flex-shrink: 0;
					}
					.ant-modal-footer{
						border-top: 1px solid $border-color;
						padding: 24px;
						height: 70px;
					}
					.ant-modal-body {
						display: flex;
						flex-grow: 1;
						overflow-x: hidden;
						padding: 0;

						&-inner {
							width: 100%;
							position: relative;
							overflow: hidden;
							padding-top: 48px;
							padding-bottom: 65px;
							&-search {
								position: absolute;
								z-index: 20;
								top: 0;
								right: 0;
								left: 0;
								padding: 0 16px;
								background-color: #fff;
							}

							&-content {
								position: relative;
								z-index: 10;
								height: 100%;
								// min-height: 300px;
								&-list {
									height: 100%;
									max-height: 100%;
									overflow: hidden auto;
									position: relative;
									border-top: 1px solid #e2e2e2;

									&-loading {
										height: 100%;
										display: flex;
										align-items: center;
										justify-content: center;
										height: 300px;
									}

									&-not-found {
										height: 300px;
										color: #cecece;
										display: flex;
										align-items: center;
										justify-content: center;
									}
								}
							}
							&-actions{
								position: absolute;
								z-index: 20;
								bottom: 0;
								right: 0;
								left: 0;
								padding: 16px 24px;
								display: flex;
								justify-content: flex-end;
								border-top: 1px solid $border-color;
							}
						}
					}
				}
			}
			&-wrap {
				display: flex;
				align-items: center;
			}

			
			
		}
	}
	.vue-autopilot-form-product{
		&-popover{
			max-width: 400px;
		}
	}
</style>