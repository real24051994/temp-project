<template>
	<div class="vue-widget-preview">
		<div class="vue-widget-preview-control">
			<div  class="vue-list-tabs vue-list-tabs-center">
				<a class="item-tab" @click="changeMode('desktop')" :class="{ 'is-actived' : mode == 'desktop'}">
					<i class="m-r-8">
						<sh-icon :icon="['far','desktop-alt']" />
					</i>
					Desktop
				</a>
				<a  class="item-tab" @click="changeMode('mobile')"  :class="{ 'is-actived' : mode == 'mobile'}">
					<i  class="m-r-8">
						<sh-icon :icon="['far','mobile-android-alt']" />
					</i>
					Mobile
				</a>
			</div>
		</div>
		<div>
			<div class="social-widget" :class="{ 'is-mobile' : mode == 'mobile' }" :style="styles" >
			    <div class="sw-instagram sw-instagram-box">
			        <div class="sw-instagram-header">
			            <div class="sw-instagram-header-title">{{ form.heading_title }}</div>
			        </div>
					<vue-widget-preview-list   v-if="display_layout == 'grid'" :effect="form.image_hover_effect" :total="images" />
					<vue-widget-preview-slider  v-else-if="display_layout == 'slider'" :effect="form.image_hover_effect" :autoplay="auto_play_slider" :duration="auto_play_duration" :per-page="item_no_of_slider" key="display-slider" />
					<vue-widget-preview-collage  v-else-if="display_layout == 'collage'" :collage-style="form.collage_style"  key="display-collage" />
			    </div>
			</div>
		</div>
	</div>
</template>
<script>
import '@widget/modules/store-frontend/social-widget.scss'
import VueWidgetPreviewList from './vue-widget-preview-list'
import VueWidgetPreviewSlider from './vue-widget-preview-slider'
import VueWidgetPreviewCollage from './vue-widget-preview-collage'
export default {
	name: "VueWidgetPreviewDesktop",
	components:{
		VueWidgetPreviewList,
		VueWidgetPreviewSlider,
		VueWidgetPreviewCollage
	},
	props: {
		value :{
			type : String,
			default : 'desktop'
		},
		data: {
			type: Object
		},
	},
	data(){
		return {
			is_loading : false,
		}
	},
	computed:{
		mode:{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		},
		form :{
			get(){
				return this.data
			}
		},
		styles(){
			var css = this.$clone(this.form.var_css)
			if( this.mode == 'desktop'){
				css["--sw-item-no-of-columns"] =  this.form.item_no_of_columns
			}else {
				css["--sw-item-no-of-columns"] =  this.form.mobile_item_no_of_columns
			}

			return css
		},
		images(){
			if( this.mode == 'desktop')
				return this.form.display_layout == 'slider' ? 20 : this.form.item_no_of_rows * this.form.item_no_of_columns
			else 
				return this.form.mobile_display_layout == 'slider' ? 20 : this.form.mobile_item_no_of_rows * this.form.mobile_item_no_of_columns
		},
		display_layout(){
			return this.mode == 'desktop' ? this.form.display_layout : this.form.mobile_display_layout
		},
		auto_play_slider(){
			return this.mode == 'desktop' ? this.form.auto_play_slider : this.form.mobile_auto_play_slider
		},
		auto_play_duration(){
			return this.mode == 'desktop' ? this.form.auto_play_duration : this.form.mobile_auto_play_duration
		},
		item_no_of_slider(){
			return this.mode == 'desktop' ? this.form.item_no_of_slider : this.form.mobile_item_no_of_slider
		}
	},
	methods:{
		changeMode(mode){
			this.mode = mode
		}
	}
};
</script>
<style lang="scss" scoped>
	.vue-widget-preview{
		background: #ffffff;
		padding-bottom: 50px;
		padding: 50px 30px ;
		position: relative;
		box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
		&-control{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			background-color: $light-gray5;
		}
	}
	.social-widget{
		background-color: #fff;
		padding: 30px;
		&.is-mobile{
			max-width: 600px;
			margin: 0 auto;
		}
	}
</style>
<style lang="scss" >
	.vue-widget-preview{
		width: 100%;
		overflow: hidden;
	}
</style>