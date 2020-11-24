<template>
	<div class="vue-autopilot-logo" >
		<vue-pricing-autopilot-popover :visible="!allowedLogo" :custom-style="{ 'margin-top' : '50px' }">
			<div class="vue-autopilot-logo-header m-t-12 m-b-8">
				<div class="vue-autopilot-logo-header-switch">
					<a-switch id="vue-autopilot-logo-switch" v-model="form.is_enable_logo" :disabled="!allowedLogo" />
				</div>
				<div class="vue-autopilot-logo-header-content">
					<label for="vue-autopilot-logo-switch">{{ $t('autopilot.form.switch.enable_logo') }}</label> <span  class="label-premium m-l-16">Premium function</span>
				</div>
			</div>
			<vue-slide-toggle :open="form.is_enable_logo" >
				<div class="vue-autopilot-logo-body">
					<div class="row">
						<div class="col col-12" v-if="form.logo_image" key="loading-file-exits">
							<div>
								<label class="vue-autopilot-logo-template m-b-16" for="vue-autopilot-logo-template-file">
									<div class="vue-autopilot-logo-template-content">
										<template v-if="form.logo_image">
											<div class="vue-autopilot-logo-template-image">
												<img :src="form.logo_image" alt="">
											</div>
											<div class="vue-autopilot-logo-template-name">
												<div class="vue-autopilot-logo-template-name-text">
													{{ form.logo_name }}
												</div>
											</div>
										</template>
									</div>
									<div class="vue-autopilot-logo-template-action">
										<div class="ant-btn btn-upload-file">
											<span>{{ $t('autopilot.form.btn.upload_file') }}</span>
										</div>
									</div>
									<input type="file" accept="image/*" hidden class="hide" id="vue-autopilot-logo-template-file" @change="onChange($event)">
								</label>
							</div>
						</div>
						<div class="co col-12" v-else key="loading-empty-file">
							<div class="p-l-26">
								<label class="ant-btn btn-upload-file">
									<span> {{ $t('autopilot.form.btn.upload_file') }}</span>
									<input type="file" accept="image/*" hidden class="hide" @change="onChange($event)">
								</label>
							</div>
							<transition name="fade-in" mode="out-in">
								<div v-if="validate.$invalid && formstate" class="has-error m-t-8">
									<div class="ant-form-explain">
										{{ $t('autopilot.validate.require_image_logo') }}
									</div>
								</div>
							</transition>
						</div>
					</div>
					<transition name="fade-in" mode="out-in">
						<div class="row" v-if="form.logo_image">
							<div class="col col-6 m-b-16">
								<div class="m-b-8">
									<label>{{ $t('autopilot.form.label.logo_position') }}</label>
								</div>
								<a-select v-model="form.logo_position" class="autopilot-select-position" dropdownClassName="autopilot-select-position">
									<a-select-option v-for="(item,index) in logo_positions" :value="item.id" :key="`item_index_${index}`">
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
									<label>{{ $t('autopilot.form.label.logo_size') }}</label>
								</div>
								<a-radio-group v-model="form.logo_size" buttonStyle="solid">
									<a-radio-button v-for="(item, index) in logo_sizes" :key="`item_index_${index}`" :value="item.id">
										{{ item.text }}
									</a-radio-button>
								</a-radio-group>
							</div>
							<div class="col col-6">
								<div class="m-b-8">
									<label>{{ $t('autopilot.form.label.logo_margin') }}</label>
								</div>
								<a-select v-model="form.logo_margin">
									<a-select-option v-for="(item,index) in logo_margins" :value="item.id" :key="`item_index_${index}`">
										{{ item.text }}
									</a-select-option>
								</a-select>
							</div>
							<div class="col col-6">
								<div class="m-b-8">
									<label>{{ $t('autopilot.form.label.logo_transparent') }}</label>
								</div>
								<div class="vue-autopilot-logo-slider">
									<div class="vue-autopilot-logo-slider-content">
										<vue-slider v-model="form.logo_transparent" :min="0" :max="100" :interval="1" :lazy="true" />
									</div>
									<div class="vue-autopilot-logo-slider-label">
										<span>
											{{ form.logo_transparent }} %
										</span>
									</div>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</vue-slide-toggle>
		</vue-pricing-autopilot-popover>
	</div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import config from '../../config'
import LogoImage from '../../utils/logo-image'
import { mapGetters } from 'vuex'
const { logo_margins , logo_sizes  , logo_positions } = config 
export default {
	name : 'AutopilotLogo',
	components:{
		VueSlider
	},
	props:{
		value :{
			type : Object,
			required : true 
		},
		validate: {
			type : Object,
		},
		formstate:{
			type : Boolean
		}
	},
	data(){
		return {
			logo_margins,
			logo_sizes,
			logo_positions,
			max_size: 4,
			file_extensions : ['JPEG' , 'JPG' , 'PNG'],
			demo : ''
		}
	},
	computed:{
		...mapGetters({
			allowedLogo : 'pricing/getAllowedLogo',
		}),
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value )
			}
		}
	},
	methods :{
		toBase64(file){
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (event)=>{
					var file_extension =  file.name.replace(/^.*\./, '').toUpperCase()
					if( this.file_extensions.indexOf(file_extension) == -1){
						this.toastError({
							title : this.$t('error.file_extension.title'),
							message : this.$t('error.file_extension.content' , { file_name : file.name }),
						})
						reject()
					}
					if( file.size <= (this.max_size * 1024 * 1024) ){
						resolve({
							src : event.target.result,
							name: file.name,
						})
					}else{
						this.toastError({
							title : this.$t('error.file_size.title'),
							message : this.$t('error.file_size.content' , { file_name : file.name , max_size : config.max_size  }),
						})
						reject()
					}
				}
				reader.onerror = error => reject(error);
			})
		},
		async onChange($event){
			var files = $event.target.files || $event.dataTransfer.files;
			if( files.length ){
				try {
					var image = await this.toBase64(files[0])
					this.form.logo_name = image.name
					this.form.logo_image = image.src
				} catch (error) {

				}
			}
			$event.target.value = null 
		},
		createImage(){
			if( this.form.is_enable_logo  && this.form.logo_image ){
				var size = _.find(this.logo_sizes, { id : this.form.logo_size })
				var size = _.maxBy(this.logo_sizes, 'value')
				
				var image = new LogoImage({
					size : size.value,
					src : this.form.logo_image,
				})
				image.init().then((res)=>{
					this.form.logo_media = res
				})
				.catch((err)=>{
					this.form.logo_media = ''
				})
			}else{
				this.form.logo_media = ''
			}
		},
	},
	watch :{
		'form.logo_size' : function(){
			this.createImage()
		},
		'form.logo_image' : function(){
			this.createImage()
		},
		'form.is_enable_logo' : function(){
			this.createImage()
		},
	},
}
</script>
<style lang="scss">
	.vue-autopilot-logo{
		&-header{
			background: #fff;
			display: flex;
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
		}
		&-body{
			padding: 0px 24px;
			.btn-upload-file{
				line-height: 30px;
			}
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
			.vue-autopilot-logo{
				&-checkbox{
					display: flex;
					align-items: center;
					label{
						margin-left: 8px;
					}
				}
				&-template{
					border-radius: 4px;
					border: 1px solid $border-color;
					display: flex;
					align-items: center;
					height: 64px;
					background: #fff;
					cursor: pointer;
					&-content{
						@include flex(calc(100% - 175px));
						overflow: hidden;
						display: flex;
						padding: 0 8px;
					}
					&-image{
						height: 64px;
						padding: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						@include flex(72px);
						img{
							max-width: 100%;
							max-height: 48px;
						}
					}
					&-name{
						height: 64px;
						@include flex(calc(100% - 72px));
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
				&-slider{
					display: flex;
					align-items: center;
					&-content{
						@include flex(calc(100% - 70px));
					}
					&-label{
						@include flex(70px);
						text-align: right;
						span{
							display: inline-flex;
							height: 32px;
							min-width: 55px;
							justify-content: center;
							border:1px solid $border-color;
							align-items: center;
							border-radius: 4px;
						}
					}
				}
			}
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
	.vue-slider{
		.vue-slider-process{
			background-color : $primary-color;
		}
		.vue-slider-dot-handle{
			border-color : $primary-color;
		}
		&:hover{
			.vue-slider-process{
				background-color : $primary-color;
			}
			.vue-slider-dot-handle{
				border-color : $primary-color;
			}
		}
	}
</style>