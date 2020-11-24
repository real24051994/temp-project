<template>
	<div class="vue-create-autopilot-template p-t-50 p-b-50">
		<div class="container">
			<div class="row">
				<div class="col col-12">
					<transition name="fade-in" mode="out-in">
						<div class="vue-create-autopilot-template-loading" v-if="is_loading_page" key="is-loading">
							<a-spin>
								<a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
							</a-spin>
						</div>
						<div  v-else key="is-loading-success">
							<div class="row">
								<div class="col col-6">
									<div class="m-b-7">
										<label for="">Name</label>
										<a-input v-model="form.name" />
									</div>
									<div class="list-info-inline">
										<div class="item-info-inline">
											<div>Background</div>
											<label class="item-template-image">
												<img v-if="form.background" :src="form.background" alt="">
												<input type="file" hidden class="hide" @change="onChange($event, 'background')">
											</label>
										</div>
										<div class="item-info-inline m-l-15">
											<div>Sample</div>
											<label class="item-template-image">
												<img v-if="form.sample" :src="form.sample" alt="">
												<input type="file" hidden class="hide" @change="onChange($event, 'sample')">
											</label>
										</div>
										<div class="item-info-inline m-l-15 p-t-20">
											<div class="m-b-20">
												<label class="m-w-100">Width</label>
												<a-input-number :disabled="true" v-model="form.width" />
											</div>
											<div class="m-b-20">
												<label class="m-w-100">Height</label>
												<a-input-number :disabled="true" v-model="form.height" />
											</div>
										</div>
									</div>
									<h3>Template Content </h3>
									<div class="m-b-20 item-content" v-for="(item,index) in form.content" :key="`index_${index}`">
										<div class="row">
											<div class="col col-6">
												<h4>Line  {{ index + 1 }}</h4>
											</div>
											<div class="col col-6 text-right">
												<a-button type="outline-danger" @click="form.content.splice(index,1)">
													remove
												</a-button>
											</div>
											<div class="col col-12 m-t-10 m-b-20 item-content-row">
												<label>Text</label>
												<div class="item-content-value">
													<a-input v-model="item.text" />
												</div>
											</div>
											<div class="col col-12 m-b-20 item-content-row">
												<label>Offset Top</label>
												<div class="item-content-value">
													<a-input-number  v-model="item.top" />
												</div>
											</div>
											<div class="col col-12 m-b-20 item-content-row">
												<label>Font size</label>
												<div class="item-content-value">
													<a-input-number  v-model="item.font_size" />
												</div>
											</div>
											<div class="col col-12 m-b-20 item-content-row">
												<label>Color</label>
												<div class="item-content-value">
													<vue-color-picker v-model="item.color" />
												</div>
											</div>
											<div class="col col-12 m-b-20 item-content-row">
												<label>Font weight</label>
												<div class="item-content-value">
													<a-radio-group v-model="item.font_weight" buttonStyle="solid">
														<a-radio-button v-for="(el, el_index) in font_weight" :key="`item_index_${el_index}`" :value=" el.id">
															{{ el.text }}
														</a-radio-button>
													</a-radio-group>
												</div>
											</div>
											<div class="col col-12 m-b-20 item-content-row">
												<label>Font style</label>
												<div class="item-content-value">
													<a-radio-group v-model="item.font_style" buttonStyle="solid">
														<a-radio-button v-for="(el, el_index) in font_style" :key="`item_index_${el_index}`" :value=" el.id">
															{{ el.text }}
														</a-radio-button>
													</a-radio-group>
												</div>
											</div>
										</div>
									</div>
									<div class="text-center">
										<a-button type="primary" @click="addContent">
											add row content
										</a-button>
									</div>
								</div>
								<div class="col col-6">
									<h3>Preview</h3>
									<div class="box-preview">
										<img v-if="preview_image" :src="preview_image" alt="">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col col-12 text-right">
									<a-button type="primary" :loading="is_loading" @click="handleCreate">Submit</a-button>
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
import DiscountImage from '@publish/modules/autopilot/utils/discount-image.js'
export default {
	name : 'CreateTemplate',
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
			is_loading_page : false,
			is_loading : false,
			form: {
				name: "Template 1",
				width : 0,
				height : 0,
				background : '',
				sample : '',
				content : [
					{
						text : '',
						font_size : 80,
						top : 100,
						color : '#ffffff',
						font_weight: 'normal',
						font_style : 'normal'
					},
				]
			},
			preview_image: '',
			font_weight: [
				{
					id : 'light',
					text : 'Light'
				},
				{
					id : 'normal',
					text : 'Regular'
				},
				{
					id : 'bold',
					text : 'Bold'
				}
			],
			font_style: [
				{
					id : 'italic',
					text : 'Italic'
				},
				{
					id : 'normal',
					text : 'normal'
				},
			]
		}
	},
	methods:{
		...mapActions({
			createDiscountTemplate : 'utils/createDiscountTemplate'
		}),
		toBase64(file){
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			})
		},
		onChange(event, name){
			var files = event.target.files
			var vm = this
			if( files.length ){
				const reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onload = function(event){
					let result = this.result
					vm.form[name] = result
					if( name  == 'background'){
						var image = new Image();
						image.src = result;
						image.onload = function () {
							vm.form.width = this.width 
							vm.form.height = this.height 
						};
					}
					
				}
				reader.onerror = function(err){

				}
			}
		},
		handleCreate(){
			if( this.is_loading ) return 
			this.is_loading = true 
			var formdata = { }
			for (const key in this.form) {
				if (this.form.hasOwnProperty(key)) {
					if( key == 'content'){
						formdata[key]  = JSON.stringify(this.form[key])
					}else{
						formdata[key]  = this.form[key]
					}
				}
			}
			this.createDiscountTemplate(formdata).then(res=>{
				let { status = false } = res.data 
				if( status ){
					this.toastSuccess({
						title : 'Create succcess',
						message: 'Create succcess',
					})
					this.form =  {
						name: "Template 1",
						width : 0,
						height : 0,
						background : '',
						sample : '',
						content : [
							{
								text : '',
								font_size : 80,
								top : 100,
								color : '#ffffff',
								font_weight: 'normal',
								font_style : 'normal'
							},
						]
					}
				}
				this.is_loading =  false
			})
			.catch(()=>{
				this.is_loading =  false
			})
		},
		addContent(){
			this.form.content.push({
				text : '',
				font_size : 80,
				top : 100,
				color : '#ffffff',
				font_weight: 'normal',
				font_style : 'normal'
			})
		},
		updatePreview(){
			let { width, height , background , content } =  this.form
			if( background ){
				var template_content = JSON.parse(JSON.stringify(content)).map((item)=>{
					var object = Object.assign(item, { text : this.getTagValue(item.text)})
					return object
				})
				var image = new DiscountImage({
					width ,
					height ,
					scale : 1,
					background : background,
					content : template_content
				})
				image.init().then((res)=>{
					this.preview_image = res
				})
				.catch((err)=>{
					this.preview_image = ''
				})
			}else{
				this.preview_image = ''
			}
			
		},
		getTagValue(html) {
			var final = html.replace(/{{(.*?)}}/gi, temp => {
				var text = temp.replace("{{", "").replace("}}", "");
				var result = "";
				switch (text) {
					case "DISCOUNT_PERCENTAGE":
						result = `50%`
						break;
					case "VALID_TIME":
						result = 2
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
				clearTimeout(this.timeout )
			}
			this.timeout = setTimeout(() => {
				this.updatePreview()
			}, 1000);
		}
	},
	watch :{
		'form.background' : function(){
			this.onChangeValue()
		},
		'form.content' : {
			handler : function(){
				this.onChangeValue()
			},
			deep : true
		}
	}
}
</script>
<style lang="scss" scoped>
	.vue-create-autopilot-template{
		.list-info-inline{
			display: flex;
			align-items: flex-start;
			label{
				display: inline-block;
			}
			.ant-input-number{
				width: 200px;
			}
		}
		.item-template-image{
			width: 150px;
			height: 150px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10px;
			border: 1px solid $border-color;
			img{
				max-width: 100%;
				max-height: 100%;
			}
		}
		.item-content{
			padding-left: 50px;
			&-row{
				display: flex;
			}
			label{
				@include flex(100px);
			}
			&-value{
				@include flex(calc(100% - 100px));
				.ant-input-number{
					display: block;
					width: 100%;
				}
			}
		}
		.ant-input-number-input{
			display: block;
			width: 100%;
		}
		.box-preview{
			height: 500px;
			width: 500px;
			display: flex;
			align-items: center;
			justify-content: center;
			border:1px solid $border-color;
			img{
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
</style>