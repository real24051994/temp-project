<template>
	<div class="vue-autopilot-form-content">
		<div class="row">
			<div class="col col-6">
				<h3>
					{{ $t('autopilot.form.label.content') }}
					<a-popover :title="false" placement="bottom"  class="vue-autopilot-form-content-popover-wrap">
						<template slot="content">
							<div class="vue-autopilot-form-content-popover">
								<div class="vue-autopilot-form-content-popover-header" v-html="$t('autopilot.form.popover.content')"></div>
								<div class="vue-autopilot-form-content-popover-body">
									<div class="item-content-popover" v-for="(item,index) in variants" :key="`item_index_${index}`">
										<div class="item-content-popover-title">
											<span>{{ item }}</span>
										</div>
										<div class="item-content-popover-description">
											{{ $t(`autopilot.form.popover.variants.${item}`)}}
										</div>
									</div>
								</div>
							</div>
						</template>
						<i class="text-gray"><sh-icon icon="info-circle"  /></i>
					</a-popover>
				</h3>
			</div>
			<div class="col col-6">
				<div class="text-right">
					<vue-autopilot-add-template :data="autopilot_templates" :type="socialType"  @on-select="onSelectTemplate" />
				</div>
			</div>
			<div class="col col-12 m-t-16" v-if="autopilotType == 'review'">
				You can diversify your content by using multiple content templates at the same time. Each product will then get a randomly assigned template. 
			</div>
			<div class="col col-12  m-t-16">
				<div class="vue-autopilot-form-content-wrapper" :class="{ 'is-invalid' : validateTemplate.$invalid && formstate}">
					<div class="vue-autopilot-form-content-header">
						<ul>
							<li class="item-tab-icon">
								<i>
									<sh-icon :icon="['far','random']" />
								</i>
							</li>
							<li v-for="(item,index) in templates" :key="`index_${index}`" :index="index" class="item-tab-content"
							:class="{ 'is-active' : index == selected ,'is-error' : errors[index].$invalid  && formstate }">
								<div class="item-tab" @click.self="changeTemplateActive(index)">
									<span>{{ index + 1}}</span>
									<a class="btn-remove" @click="removeTemplate(index)"  :class="{'is-disabled' : !allow_remove}">
										<sh-icon  :icon="['fal' ,'times']"  />
									</a>
								</div>
							</li>
							<li class="item-tab-add-more" v-if="templates.length < max_template">
								<div class="item-tab" @click.self="addTemplate()">
									<span>
										<sh-icon :icon="['far' ,'plus']" />
									</span>
								</div>
							</li>
						</ul>
					</div>
					<div class="vue-autopilot-form-content-body">
						<div class="text-center p-t-50 p-b-50" v-if="is_loading" key="is-loading-content">
							<a-spin>
								<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
							</a-spin>
						</div>
						<div key="is-loading-content-body-scrollbar" v-else>
							<template v-for="(item,index) in templates"  >
								<vue-simple class="vue-autopilot-form-content-body-scrollbar" :key="`index_product_${index}`" v-if="index == selected" >
									<vue-autopilot-contenteditable :variants="variants" :is-error="validateTemplate.$invalid" :ref="item.id" v-model="item.content" :placeholder="$t('autopilot.form.placeholder.add_content')" />
								</vue-simple>
							</template>
							<div class="vue-autopilot-form-content-sticky">
								<vue-autopilot-add-variant  @on-select="onAddVariant" :variants="variants" />
							</div>
						</div>
					</div>
					<div class="vue-autopilot-form-content-footer">
						
						<div class="spacer"></div>
						<vue-hashtag @on-select="onSelectHashtag" class="m-r-18" overlayClassName="z-index-500">
							<template slot="btn-trigger">
								<a class="btn-add-hashtag">
									<sh-icon icon="hashtag" />
								</a>
							</template>
						</vue-hashtag>
						<vue-emoji-picker :on-select-emoji="onSelectEmoji" overlayClassName="z-index-500">
							<template slot="btn-trigger">
								<a class="btn-add-emoji">
									<sh-icon :icon="['far','smile']"  />
								</a>
							</template>
						</vue-emoji-picker>
					</div>
				</div>
				<transition name="fade-in" mode="out-in">
					<div v-if="validateTemplate.$invalid && formstate" class="has-error m-t-2">
						<div class="ant-form-explain">
							{{ $t('autopilot.validate.require_template') }}
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
import VueAutopilotContenteditable from "./vue-autopilot-contenteditable";
import VueAutopilotAddVariant from "./vue-autopilot-add-variant.vue";
import VueAutopilotAddTemplate from "./vue-autopilot-add-template"
import VueEmojiPicker from '@publish/modules/utils/components/vue-emoji-picker'
import VueHashtag from '@publish/modules/utils/components/vue-hashtag'
import config from '../../config'
import { mapActions, mapGetters } from 'vuex';
export default {
	name: 'AutopilotFormContent',
	components:{
		VueAutopilotContenteditable,
		VueAutopilotAddVariant,
		VueAutopilotAddTemplate,
		VueEmojiPicker,
		VueHashtag
	},
	props:{
		value :{
			type : Array,
			required : true
		},
		autopilotType :{
			type : String,
			default : 'random'
		},
		validateTemplate : {
			type : Object,
			required : true
		},
		isSelect:{
			type : [String,Number],
			required: true
		},
		formstate:{
			type : Boolean,
			default : false 
		},
		socialType :{
			type : String,
			default : 'facebook'
		}
	},
	data(){
		return{
			visible: false,
			is_loading : false,
			is_loading_template: true,
			max_template : 10,
			current_social_type : '',
			temp_template :{
				facebook : [{
					id : this.$helper.createId(),
					content : '',
				}],
				twitter: [{
					id : this.$helper.createId(),
					content : '',
				}],
				instagram : [{
					id : this.$helper.createId(),
					content : '',
				}],
			},
			product_variants : config.product_variants,
			discount_tags : config.discount_tags,
			rate_tags : config.rate_tags
		}
	},
	computed :{
		...mapGetters({
			'data' : 'autopilot-template/getTemplates'
		}),
		templates:{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		},
		selected:{
			get(){
				return this.isSelect
			},
			set(value){
				this.$emit('update:is-select', value)
			}
		},
		allow_remove(){
			return this.value.length > 1
		},
		contenteditable(){
			if( this.$refs[this.templates[this.selected].id] && this.$refs[this.templates[this.selected].id][0] ){
				return this.$refs[this.templates[this.selected].id][0]
			}
			return null
		},
		errors(){
			return Object.values(this.validateTemplate.$each.$iter)
		},
		autopilot_templates(){
			return this.data.filter((item)=>{
				if( this.autopilotType == 'random' || this.autopilotType == 'latest'){
					return item.type == 'default'
				}else if( this.autopilotType == 'review' ){
					return item.type == 'review'
				}
				return true
			})
		},
		variants(){
			return this.autopilotType == 'review' ?   this.rate_tags : [...this.product_variants,...this.discount_tags]
		},
	},
	methods:{
		addTemplate(){
			if( this.templates.length < this.max_template){
				this.templates.push({
					id : this.$helper.createId(),
					content : '',
				})
				this.$nextTick(()=>{
					this.selected = this.templates.length - 1
				})
			}
		},
		removeTemplate(index){
			if( this.allow_remove ){
				this.is_loading = true 
				this.templates.splice(index, 1)
				if( this.selected >= this.templates.length){
					this.selected = this.templates.length - 1
				}
				this.$nextTick(()=>{
					this.is_loading = false
				})
			}
		},
		changeTemplateActive(index){
			if( this.selected != index  ){
				this.is_loading = true 
				this.$nextTick(()=>{
					this.selected = index 
					this.is_loading = false
				})
			}
		},
		onAddVariant(item){
			if( this.contenteditable ){
				this.contenteditable.addProductHashtag(item)
			}
		},
		onSelectTemplate(template = null){
			if( template && this.contenteditable){
				this.contenteditable.addProductTemplate(template.content)
			}
		},
		onSelectEmoji(item){
			if( this.contenteditable){
				this.contenteditable.addEmoji(item)
			}
		},
		onSelectHashtag(item){
			if( this.contenteditable){
				this.contenteditable.addHashtag(item)
			}
		}
	},
	watch:{
		'socialType' : function(value){
			this.is_loading = true
			if( value != this.current_social_type ){
				this.temp_template[this.current_social_type] = this.$clone(this.value)
				this.templates = this.$clone(this.temp_template[value]) 
				this.current_social_type = value 
			}
			this.$nextTick(()=>{
				this.selected = 0
				this.is_loading = false
			})
		}
	},
	created(){
		this.current_social_type = this.socialType
		this.temp_template[this.socialType] = this.$clone(this.value)
	}
}
</script>
<style lang="scss" scoped>
	.vue-autopilot-form-content{
		&-wrapper{
			border: 1px solid $border-color;
			border-radius: 4px;
			transition: border-color 0.2s ease;
			&.is-invalid{
				border-color: $danger;
				.vue-autopilot-form-content-header{
					border-color: $danger;
				}
			}
		}
		&-header{
			height: 38px;
			position: relative;
			border-bottom: 1px solid $border-color;
			transition: border-color 0.2s ease;
			ul{
				list-style-type: none;
				padding: 0;
				margin: 0;
				display: flex;
				li{
					height: 37px;
					width: 40px;
					text-align: left;
					position: relative;
					line-height: 37px;
					font-weight: 600;
					font-size: 14px;
					user-select: none;
					span{
						user-select: none;
						pointer-events: none;
						padding-left: 8px;
					}
					~ li{
						margin-left: 4px;
					}
					&.item-tab-add-more{
						text-align: center;
						span{
							padding: 0;
						}
						&:before{
							content: none;
						}
						&:hover{
							.item-tab{
								color: $primary-color;
							}
						}
					}
					.item-tab{
						cursor: pointer;
					}
					&.item-tab{
						&-icon{
							width: 45px;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: $light-gray5;
						}
						&-content{
							&:before{
								content: '';
								position: absolute;
								bottom: -1px;
								left: 0;
								right: 0;
								height: 3px;
								background-color: transparent;
								transition: all 0.3s ease;
							}
						}
					}
					.btn-remove{
						opacity: 0;
						visibility: hidden;
						display: inline-block;
						color: #BEBEBE;
						transition: all 0.3s ease;
						margin-left: 5px;
						position: absolute;
						right: 5px;
						top: 0;
						&:hover{
							color: #000;
						}
					}
					&:hover{
						.btn-remove:not(.is-disabled){
							opacity: 1;
							visibility: visible;
						}
					}
					&.is-active, &:hover{
						&:before{
							background-color: $primary-color;
						}
						.btn-remove:not(.is-disabled){
							opacity: 1;
							visibility: visible;
						}
					}
					&.is-error{
						color: $danger;
					}
				}
			}
		}
		&-footer{
			height: 38px;
			position: relative;
			padding: 0 16px;
			display: flex;
			align-items: center;
			.btn-add-variant{
				background: #fff;
				color: $primary-color;
				line-height: 32px;
				font-size: 14px;
			}
			.btn-add{
				&-hashtag,&-emoji{
					color: $text;
					font-size: 18px;
					&:hover{
						color: $primary-color;
					}
				}
			}
		}
		&-body{
			height: 172px;
			overflow: hidden;
			position: relative;
			&-scrollbar{
				height: 172px;
				overflow: hidden auto;
				padding: 10px 24px ;
			}
		}
		&-sticky{
			position: absolute;
			top: 16px;
			right: 16px;
			a{

			}
		}
		&-popover{
			width: 425px;
			margin: -16px;
			&-header{
				font-size: 14px;
				padding-bottom: 15px;
				border-bottom: 1px solid $border-color;
				padding: 16px;
				strong{
					color : $primary-color;
				}
			}
			&-body{
				padding: 16px;
				background: #F9F9F9;
				.item-content-popover{
					display: flex;
					font-size: 12px;
					margin-bottom: 16px;
					&-title{
						@include flex(40%);
						text-align: right;
						span{
							display: inline-block;
							padding: 0 6px;
							line-height: 20px;
							border-radius: 4px;
							background: #D8D8D8;
							text-transform: uppercase;
							font-weight: 600;
							
						}
					}
					&-description{
						@include flex(60%);
						padding-left: 16px;
					}
				}
			}
		}
	}
	.list-autopilot-template{
		&-header{
			padding: 16px 24px;
			color: #252627;
			background: #fff;
			border-bottom: 1px solid #e8e8e8;
			border-radius: 4px 4px 0 0;
			h3{

			}
		}
		&-content{
			height: 400px;
			overflow: hidden;
			position: relative;
			
		}
		&-loading{
			height: 400px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.list-templates{
			height: 100%;
			overflow: hidden auto;
			padding: 16px;
			.item-template{
				min-height: 160px;
				background: #FFFFFF;
				border: 1px solid $border-color;
				border-radius: 4px;
				transition: all 0.2s ease;
				padding: 16px;
				cursor: pointer;
				~ .item-template{
					margin-top: 16px;
				}
				&:hover{
					background-color: #e6f7ff;
				}
				&-blank{
					border: 2px dashed $border-color;
					display: flex;
					align-items: center;
					justify-content: center;
					&-content{
						display: inline-flex;
						align-items: center;
						i{
							font-size: 24px;
							color: #7D7D7D;
							margin-right: 5px;
						}
					}
					
				}
				&-title{
					font-weight: 600;
					font-size: 14px;
				}
				&-content{
					
				}
			}
		}
	}
</style>
<style lang="scss">
	.modal-autopilot-template{
		.ant-modal-content{
			.ant-modal-header{
				display: none;
			}
			.ant-modal-body{
				padding: 0;
				.note-editor{
					pointer-events: none;
				}
				.note-editor.note-frame .note-editing-area .note-editable{
					background-color: transparent;
				}
			}
		}
	}
</style>