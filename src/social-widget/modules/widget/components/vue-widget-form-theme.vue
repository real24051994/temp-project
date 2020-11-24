<template>
	<div class="vue-form-theme">
		<div class="row">
			<div class="col col-3">
				<h3>
					Heading
				</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-6">
						<div>
							<label>
								Font size
							</label>
						</div>
						<div class="m-t-8">
							<div class="widget-slider">
								<div class="widget-slider-wrap">
									<a-slider v-model="heading_font_size" :tipFormatter="(value)=>`${value} px`" :min="min_font_size" :max="max_font_size" />
								</div>
								<div class="widget-slider-value">
									<span class="ant-input">
										{{ form.var_css['--sw-heading-font-size'] }}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>
								Font weight
							</label>
						</div>
						<div class="m-t-8">
							<a-select  v-model="form.var_css['--sw-heading-font-weight']" >
								<a-select-option v-for="(item,index) in font_weight" :key="index" :value="item">
									{{ item | capitalize }}
								</a-select-option>
							</a-select>
						</div>
					</div>
					<div class="col col-6 m-t-30">
						<div>
							<label>Color</label>
						</div>
						<div class="m-t-8">
							<vue-color-picker v-model="form.var_css['--sw-heading-color']" />
						</div>
					</div>
					<div class="col col-6 m-t-30">
						<div>
							<label>Text align</label>
						</div>
						<div class="m-t-8">
							<a-select  v-model="form.var_css['--sw-heading-text-align']" >
								<a-select-option v-for="(item,index) in text_align" :key="index" :value="item">
									{{ item  | capitalize }}
								</a-select-option>
							</a-select>
						</div>
					</div>
				</div>
			</div>
		</div>
		<hr class="m-t-20 m-b-20">
		<div class="row">
			<div class="col col-3">
				<h3>
					Style
				</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-6">
						<div>
							<label>Border radius</label>
						</div>
						<div class="m-t-8">
							<div class="widget-slider">
								<div class="widget-slider-wrap">
									<a-slider v-model="border_radius" :tipFormatter="(value)=>`${value} px`" :min="0" :max="15" />
								</div>
								<div class="widget-slider-value">
									<span class="ant-input">
										{{ form.var_css['--sw-item-border-radius'] }}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>Item Gutter</label>
						</div>
						<div class="m-t-8">
							<div class="widget-slider">
								<div class="widget-slider-wrap">
									<a-slider v-model="gutter" :tipFormatter="(value)=>`${value} px`" :min="0" :max="10" />
								</div>
								<div class="widget-slider-value">
									<span class="ant-input">
										{{ form.var_css['--sw-item-gutter'] }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<hr>
				<div class="row">
					<div class="col col-6">
						<div>
							<label>Overlay color</label>
						</div>
						<div class="m-t-8">
							<vue-color-picker v-model="form.var_css['--sw-overlay-bg']" />
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>Font color</label>
						</div>
						<div class="m-t-8">
							<vue-color-picker v-model="form.var_css['--sw-overlay-color']" />
						</div>
					</div>
					<div class="col col-6  m-t-30">
						<div>
							<label>Overlay font size</label>
						</div>
						<div class="m-t-8">
							<div class="widget-slider">
								<div class="widget-slider-wrap">
									<a-slider v-model="overlay_font_size" :tipFormatter="(value)=>`${value} px`" :min="min_font_size" :max="max_font_size" />
								</div>
								<div class="widget-slider-value">
									<span class="ant-input">
										{{ form.var_css['--sw-overlay-font-size'] }}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col col-6 m-t-30">
						<div>
							<label>Opacity</label>
						</div>
						<div class="m-t-8">
							<div class="widget-slider">
								<div class="widget-slider-wrap">
									<a-slider v-model="form.var_css['--sw-overlay-opacity']" :tipFormatter="(value)=>`${value * 100} %`" :min="0" :max="1" :step="0.1" />
								</div>
								<div class="widget-slider-value">
									<span class="ant-input">
										{{ form.var_css['--sw-overlay-opacity']  * 100 }} %
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/antd.css'
import config from '../config'
export default {
	name : 'FormTheme',
	props :{
		value :{
			type : Object,
			require : true,
		},
		validate:{
			type : Object,
			require :true
		},
		formstate:{
			type : Boolean
		}
	},
	data(){
		return {
			min_font_size: 8,
			max_font_size:30,
			font_weight : [ 'lighter' , 'normal' , 'bold'],
			text_align : [ 'left' , 'center' , 'right'],
		}
	},
	computed:{
		...mapGetters({
			page :'page/getALl',
			gallery :'gallery/getAll',
		}),
		form :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input',value)
			}
		},
		heading_font_size : {
			get(){
				return typeof this.value.var_css['--sw-heading-font-size'] == 'string' ? parseInt(this.value.var_css['--sw-heading-font-size'].replace('px' , '')) : 10
			},
			set(value){
				this.form.var_css['--sw-heading-font-size']  = `${value}px`
			}
		},
		overlay_font_size : {
			get(){
				return typeof this.value.var_css['--sw-overlay-font-size'] == 'string' ? parseInt(this.value.var_css['--sw-overlay-font-size'].replace('px' , '')) : 10
			},
			set(value){
				this.form.var_css['--sw-overlay-font-size']  = `${value}px`
			}
		},
		border_radius : {
			get(){
				return typeof this.value.var_css['--sw-item-border-radius'] == 'string' ? parseInt(this.value.var_css['--sw-item-border-radius'].replace('px' , '')) : 0
			},
			set(value){
				this.form.var_css['--sw-item-border-radius']  = `${value}px`
			}
		},
		gutter : {
			get(){
				return typeof this.value.var_css['--sw-item-gutter'] == 'string' ? parseInt(this.value.var_css['--sw-item-gutter'].replace('px' , '')) : 0
			},
			set(value){
				this.form.var_css['--sw-item-gutter']  = `${value}px`
			}
		},
		
	},
	filters :{
		capitalize : function(value){
			if( typeof value == 'string'){
				return _.capitalize(value)
			}
			return value
		}
	}
}
</script>