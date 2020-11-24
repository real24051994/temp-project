<template>
	<div class="vue-form-desktop">
		<div class="row">
			<div class="col col-3">
				<h3>Mobile Display</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-12">
						<div class="list-widget-styles">
							<div class="item-style" @click="form.mobile_display_layout = 'grid'" :class="{ 'is-active' : form.mobile_display_layout == 'grid'}">
								<div class="item-style-image">
									<img svg-inline src="@widget/assets/icons/grid.svg" alt="">
								</div>
								<div class="item-style-title">
									Grid
								</div>
							</div>
							<div class="item-style" @click="form.mobile_display_layout = 'slider'" :class="{ 'is-active' : form.mobile_display_layout == 'slider'}">
								<div class="item-style-image">
									<img svg-inline src="@widget/assets/icons/slider.svg" alt="">
								</div>
								<div class="item-style-title">
									Slider
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="m-t-30">
					<transition name="fade-in" mode="out-in">
						<div v-if="form.mobile_display_layout == 'grid'" key="is-grid-setting">
							<div class="row">
								<div class="col col-6">
									<div>
										<div>
											<label>
												No of Rows
											</label>
										</div>
										<div class="m-t-8">
											<div class="widget-slider">
												<div class="widget-slider-wrap">
													<a-slider v-model="form.mobile_item_no_of_rows" :tipFormatter="(value)=>`${value} item(s)`" :min="1" :max="max_item_no_of_rows" />
												</div>
												<div class="widget-slider-value">
													<span class="ant-input">
														{{ form.mobile_item_no_of_rows }} item(s)
													</span>
												</div>
											</div>
											<!-- <a-select  v-model="form.mobile_item_no_of_rows" >
												<a-select-option v-for="item in max_item_no_of_rows" :key="item" :value="item">
													{{ item }}
												</a-select-option>
											</a-select> -->
										</div>
									</div>
									<div class="m-t-8">
										<div>
											<label>
												No of Columns:
											</label>
										</div>
										<div class="m-t-8">
											<div class="widget-slider">
												<div class="widget-slider-wrap">
													<a-slider v-model="form.mobile_item_no_of_columns" :tipFormatter="(value)=>`${value} item(s)`" :min="1" :max="max_item_no_of_rows" />
												</div>
												<div class="widget-slider-value">
													<span class="ant-input">
														{{ form.mobile_item_no_of_columns }} item(s)
													</span>
												</div>
											</div>
											<!-- <a-select  v-model="form.mobile_item_no_of_columns" >
												<a-select-option v-for="item in max_item_no_of_columns" :key="item" :value="item">
													{{ item }}
												</a-select-option>
											</a-select> -->
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else-if="form.mobile_display_layout == 'slider'" key="is-slider-setting">
							<div class="row">
								<div class="col col-6">
									<div >
										<div>
											<label>
												Slide to show
											</label>
										</div>
										<div class="m-t-8">
											<div class="widget-slider">
												<div class="widget-slider-wrap">
													<a-slider v-model="form.mobile_item_no_of_slider" :tipFormatter="(value)=>`${value} item(s)`" :min="1" :max="max_item_no_of_slider" />
												</div>
												<div class="widget-slider-value">
													<span class="ant-input">
														{{ form.mobile_item_no_of_slider }} item(s)
													</span>
												</div>
											</div>
											<!-- <input type="text" class="ant-input" v-model="form.mobile_item_no_of_slider"> -->
											<!-- <a-select  v-model="form.mobile_item_no_of_slider" >
												<a-select-option v-for="item in max_item_no_of_slider" :key="item" :value="item">
													{{ item }}
												</a-select-option>
											</a-select> -->
										</div>
									</div>
									<div class="m-t-8">
										<div class="item-form-title">
											<label>
												Slider Autoplay
											</label>
										</div>
										<div class="m-t-8">
											<a-checkbox v-model="form.mobile_auto_play_slider">
												<template v-if="form.mobile_auto_play_slider">
													Enable
												</template>
												<template v-else>
													Disable
												</template>
											</a-checkbox>
										</div>
									</div>
									<div class="m-t-8" v-if="form.mobile_auto_play_slider">
										<div>
											<label>
												Slide duration
											</label>
										</div>
										<div class="m-t-8">
											<div class="widget-slider">
												<div class="widget-slider-wrap">
													<a-slider v-model="form.mobile_auto_play_duration" :tipFormatter="(value)=>`${value} second(s)`" :min="1" :max="max_slide_duration" />
												</div>
												<div class="widget-slider-value">
													<span class="ant-input">
														{{ form.mobile_auto_play_duration }} second(s)
													</span>
												</div>
											</div>
											<!-- <a-select  v-model="form.mobile_auto_play_duration" >
												<a-select-option v-for="(item,index) in slide_duration" :key="index" :value="item">
													{{ item }}
												</a-select-option>
											</a-select> -->
										</div>
									</div>
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
import { mapGetters } from 'vuex'
import config from '../config'
export default {
	name : 'FormMobile',
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
			max_slide : 10,
			max_item_no_of_columns : 10,
			max_item_no_of_rows : 10,
			max_item_no_of_slider : 5,
			max_slide_duration : 10,
			collage_styles : config.collage_styles,
			slide_duration  : [ 1, 2 , 3, 4, 5, 6, 7, 8, 9 ,10],
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
		}
	}
}
</script>