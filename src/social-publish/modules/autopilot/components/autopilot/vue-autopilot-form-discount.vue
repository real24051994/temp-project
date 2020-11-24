<template>
	<div class="vue-autopilot-discount" >
		<vue-pricing-autopilot-popover :visible="!allowedDiscount" :custom-style="{ 'margin-top' : '50px' }">
			<div class="vue-autopilot-discount-header">
				<div class="vue-autopilot-discount-header-title">
					<h3>{{ $t('autopilot.form.label.discount') }}</h3><span  class="label-premium m-l-16">Premium function</span>
				</div>
				<div class="vue-autopilot-discount-switcher m-t-12">
					<div class="vue-autopilot-discount-switch">
						<a-switch id="vue-autopilot-discount-switch" v-model="form.is_create_discount" :disabled="!allowedDiscount"/>
					</div>
					<div class="vue-autopilot-discount-content">
						<label for="vue-autopilot-discount-switch">{{ $t('autopilot.form.switch.enable_create_discount') }}</label>
						<a-popover :title="false" placement="bottom"  class="vue-autopilot-discount-popover-wrap">
							<template slot="content">
								<div class="vue-autopilot-discount-popover-content">
									{{ $t('autopilot.form.popover.discount') }}
								</div>
							</template>
							<i class="text-gray m-l-8"><sh-icon icon="info-circle" /></i>
						</a-popover>
					</div>
				</div>
			</div>
			<vue-slide-toggle :open="form.is_create_discount" >
				<div class="vue-autopilot-discount-body">
					<div class="row">
						<div class="col col-12 m-b-8 m-t-8">
							<div class="text-primary">
								{{ $t('autopilot.form.content.discount_description') }}
							</div>
						</div>
						<div class="col col-6">
							<div class="m-b-8">
								<label>{{ $t('autopilot.form.label.discount_percentage') }}</label>
							</div>
							<a-input-number :defaultValue="100" :min="0" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" v-model="form.discount_percent" />
						</div>
						<div class="col col-6">
							<div class="m-b-8">
								<label>{{ $t('autopilot.form.label.valid_time') }}</label>
							</div>
							<a-select v-model="form.discount_limit_date">
								<a-select-option v-for="(item,index) in discount_valid_times" :value="item.id" :key="`item_index_${index}`">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</div>
					</div>
				</div>
				<div class="vue-autopilot-discount-footer">
					<transition name="fade-in" mode="out-in">
						<div class="row">
							<div class="col col-12">
								<hr class="m-t-24 m-b-24">
							</div>
							<div class="col col-12" >
								<div class="vue-autopilot-discount-switcher" v-if="productType == 'image'">
									<div class="vue-autopilot-discount-switch">
										<a-switch id="vue-autopilot-discount-enable-tag-image" v-model="form.is_enable_discount_tag" />
									</div>
									<div class="vue-autopilot-discount-content">
										<label for="vue-autopilot-discount-enable-tag-image">{{ $t('autopilot.form.switch.enable_discount_tag') }}</label>
									</div>
								</div>
								<a-popover v-else :title="false" placement="bottom"  class="vue-autopilot-discount-popover-wrap">
									<template slot="content">
										<div class="vue-autopilot-discount-popover-content">
											{{ $t('autopilot.form.popover.discount_tag') }}
										</div>
									</template>
									<div class="vue-autopilot-discount-checkbox checkbox-is-disabled">
										<a-switch id="vue-autopilot-discount-enable-tag-image" :disabled="true" v-model="form.is_enable_discount_tag" />
										<label for="vue-autopilot-discount-enable-tag-image">{{ $t('autopilot.form.switch.enable_discount_tag') }}</label>
									</div>
								</a-popover>
								
								<transition name="fade-in" mode="out-in">
									<div v-if="form.is_enable_discount_tag && productType == 'image'" class="m-t-8">
										<div v-if="form.discount_template" class="vue-autopilot-discount-template m-b-16">
											<div class="vue-autopilot-discount-template-content">
												<template v-if="form.discount_template">
													<div class="vue-autopilot-discount-template-image">
														<img :src="form.discount_template.sample" alt="">
													</div>
													<div class="vue-autopilot-discount-template-name">
														<div class="vue-autopilot-discount-template-name-text">
															{{ form.discount_template.name }}
														</div>
													</div>
												</template>
											</div>
											<div class="spacer"></div>
											<div class="vue-autopilot-discount-template-action">
												<a-button @click="visible_modal_template = true" >{{ $t('autopilot.form.btn.add_discount_template') }}</a-button>
											</div>
										</div>
										<div v-else  class="p-l-50">
											<a-button @click="visible_modal_template = true" >{{ $t('autopilot.form.btn.add_discount_template') }}</a-button>
										</div>
										<transition name="fade-in" mode="out-in">
											<div v-if="validate.$invalid && formstate" class="has-error m-t-8">
												<div class="ant-form-explain">
													{{ $t('autopilot.validate.require_discount_template') }}
												</div>
											</div>
										</transition>
										<transition name="fade-in" mode="out-in">
											<div v-if="form.discount_template && !is_loading_discount_template" class="row">
												<div class="col col-6 m-b-16">
													<div class="m-b-8">
														<label>{{ $t('autopilot.form.label.discount_position') }}</label>
													</div>
													<a-select v-model="form.discount_position" class="autopilot-select-position" dropdownClassName="autopilot-select-position">
														<a-select-option v-for="(item,index) in discount_positions" :value="item.id" :key="`item_index_${index}`">
															<div class="item-position">
																<div class="item-position-image">
																	<img :src="item.sample" alt="">
																</div>
																<div class="item-position-text">
																	{{ item.text }}
																</div>
															</div>
														</a-select-option>
													</a-select>
												</div>
												<div class="col col-6 m-b-16">
													<div class="m-b-8">
														<label>{{ $t('autopilot.form.label.discount_size') }}</label>
													</div>
													<a-radio-group v-model="form.discount_size" buttonStyle="solid">
														<a-radio-button v-for="(item, index) in discount_sizes" :key="`item_index_${index}`" :value="item.id">
															{{ item.text }}
														</a-radio-button>
													</a-radio-group>
												</div>
												<div class="col col-6 m-b-16">
													<div class="m-b-8">
														<label>{{ $t('autopilot.form.label.discount_margin') }}</label>
													</div>
													<a-select v-model="form.discount_margin">
														<a-select-option v-for="(item,index) in discount_margins" :value="item.id" :key="`item_index_${index}`">
															{{ item.text }}
														</a-select-option>
													</a-select>
												</div>
												<div class="col col-12 m-b-16">
													<div class="m-b-8">
														<label>{{ $t('autopilot.form.label.discount_content') }}</label>
													</div>
													<div class="vue-autopilot-discount-item-tags">
														<div class="item-tag" v-for="(item,index) in form.discount_template.content" :key="`index_${index}`">
															<div class="item-tag-index">
																<a-button class="item-tag-btn">{{ index + 1 }}</a-button>
															</div>
															<div class="item-tag-content">
																<vue-autopilot-discount-contenteditable :tags="discount_tags"  placeholder="Type something..."  class=""  v-model="item.text" />
															</div>
															<!-- <div class="item-tag-action">
																<a-button class="item-tag-btn">
																	<div class="item-tag-action-point"></div>
																</a-button>
															</div> -->
														</div>
													</div>
												</div>
											</div>
										</transition>
									</div>
								</transition>
							</div>
						</div>
					</transition>
				</div>
			</vue-slide-toggle>
			<vue-autopilot-discount-template v-model="visible_modal_template"  @on-select="onSelectTemplate" />
		</vue-pricing-autopilot-popover>
	</div>
</template>
<script>
import VueAutopilotDiscountTemplate from './vue-autopilot-discount-template'
import VueAutopilotDiscountContenteditable from './vue-autopilot-discount-contenteditable'
import VueAutopilotDiscountImage from './vue-autopilot-discount-image'
import config from '../../config'
const { discount_valid_times , discount_tags  , discount_margins , discount_sizes  , discount_positions } = config 
import DiscountImage from '../../utils/discount-image'
import { mapGetters } from 'vuex'
export default {
	name : 'VueAutopilotDiscount',
	components:{
		VueAutopilotDiscountTemplate,
		VueAutopilotDiscountContenteditable,
	},
	props:{
		value :{
			type : Object,
			required : true,
		},
		validate: {
			type : Object,
		},
		formstate:{
			type : Boolean
		},
		productType:{
			type : String,
			default : 'link'
		},
	},
	data(){
		return {
			visible_modal_template: false,
			discount_valid_times , 
			discount_tags ,  
			discount_margins , 
			discount_sizes  , 
			discount_positions,
			timeout : null ,
			is_loading_discount_template :  false,
		}
	},
	computed:{
		...mapGetters({
			allowedDiscount : 'pricing/getAllowedDiscount',
		}),
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		}
	},
	methods:{
		onSelectTemplate(item){
			this.is_loading_discount_template  = true 
			this.form.discount_template = item 
			this.$nextTick(()=>{
				this.is_loading_discount_template  = false
			})
		},
		createImage(){
			var discount = JSON.parse(JSON.stringify(this.form))
			if( discount.is_create_discount  && discount.is_enable_discount_tag && discount.discount_template ){
				var size = _.find(this.discount_sizes, { id : discount.discount_size })
				// var scale_ratio = size.value / discount.discount_template.width
				var scale_ratio = 1
				var ratio  = discount.discount_template.width / discount.discount_template.height
				if( ratio < 1){
					scale_ratio = size.value / discount.discount_template.height 
				}else{
					scale_ratio = size.value / discount.discount_template.width 
				}
				var template_content = [] 
				discount.discount_template.content = discount.discount_template.content.map((item)=>{
					item['text'] = this.getTagValue(item.text)
					return item
				})
				let { width, height , background , content } =  discount.discount_template
				var image = new DiscountImage({
					width ,
					height ,
					scale : scale_ratio,
					background,
					content
				})
				image.init().then((res)=>{
					this.form.discount_image = res
				})
				.catch((err)=>{
					this.form.discount_image = ''
				})
			}else{
				this.form.discount_image = ''
			}
		},
		getTagValue(html) {
			var final = html.replace(/{{(.*?)}}/gi, temp => {
				var text = temp.replace("{{", "").replace("}}", "");
				var result = "";
				switch (text) {
					case "DISCOUNT_PERCENTAGE":
						result = `${this.form.discount_percent}%`
						break;
					case "VALID_TIME":
						var item = _.find( this.discount_valid_times , { id : this.form.discount_limit_date})
						if( item ){
							result = item.id 
						}
						break;
					default:
						break;
				}
				return result;
			});
			return final;
		},
		onChangeValue(){
			if( this.timeout ){
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(() => {
				this.createImage()
			}, 1000);
		},
		mergeImage(){
			
		}
	},
	watch :{
		'form.is_create_discount' : function(){
			this.onChangeValue()
		},
		'form.is_enable_discount_tag' : function(){
			this.onChangeValue()
		},
		'form.discount_percent' : function(){
			this.onChangeValue()
		},
		'form.discount_limit_date' : function(){
			this.onChangeValue()
		},
		'form.discount_size' : function(){
			this.onChangeValue()
		},
		'form.discount_template' : {
			handler : function(){
				this.onChangeValue()
			},
			deep : true
		},
		'productType': function(value){
			if( value == 'link'){
				this.form.is_enable_discount_tag = false
			}
		}
	},
	beforeDestroy(){
		$('.vue-autopilot-discount-image').remove()
	}

}
</script>
<style lang="scss">
	.vue-autopilot-discount{
		
		&-header{
			background: #fff;
			// padding: 24px;
		}
		&-body{
			padding: 0 24px;
			label{
				font-weight: 600;
			}
			.ant-select ,.ant-input-number{
				width: 100%;
				display: block;
			}
			.ant-radio-group.ant-radio-group-solid{
				.ant-radio-button-wrapper{
					font-weight: normal;
				}
				.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
					color: $primary-color;
					background: #fff;
					border-color: $primary-color;
				}
			}
		}
		&-switcher{
			display: flex;
			align-items: center;
		}
		&-switch{
			@include flex(50px);
		}
		&-content{
			@include flex(caclc(100% -50px));
			label{
				font-weight: 600;
				font-size: 14px;
				line-height: 22px;
				margin-bottom: 8px;
			}
			p{
				font-size: 14px;
				margin: 0;
			}
		}
		&-checkbox{
			display: flex;
			align-items: center;
			label{
				margin-left: 8px;
			}
			&.checkbox-is-disabled{
				opacity: 0.5;
				display: inline-flex;
			}
		}
		&-template{
			border-radius: 4px;
			border: 1px solid $border-color;
			display: flex;
			align-items: center;
			height: 64px;
			background: #fff;
			padding: 0 16px;
			&-content{
				overflow: hidden;
				display: flex;
			}
			&-image{
				height: 64px;
				padding: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					max-width: 100%;
					max-height: 48px;
				}
			}
			&-name{
				height: 64px;
				display: flex;
				align-items: center;
				padding-left: 8px;
				&-text{
					display: block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					
				}
			}
			&-action{
				@include flex(175px);
				padding: 4px  16px;
				text-align: right;
			}
		}
		&-item-tags{
			.item-tag{
				display: flex;
				align-items: center;
				&-btn{
					padding: 0;
					width: 32px;
					height: 32px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&:not(:first-child){
					margin-top: 8px;
				}
				&-index{
					@include flex(32px);
				}
				&-content{
					@include flex(calc(100% - 32px));
					padding: 0 0 0 16px;
					
				}
				&-action{
					@include flex(32px);
					&-point{
						width: 20px;
						height: 20px;
						background: #4F4F4F;
						border-radius: 4px;
					}
				}
			}
		}
		.ant-select{
			display: block;
			width: 100%;
		}
	}
	.autopilot-select-position{
		.ant-select-selection-selected-value{
			width: 100%;
		}
		.item-position{
			display: flex;
			width: 100%;
			&-image{
				@include flex(30px)
			}
			&-text{
				@include flex(calc(100% - 30px));
			}
		}
	}
	.vue-autopilot-discount-popover{
		&-content{
			max-width: 310px;
		}
	}
</style>