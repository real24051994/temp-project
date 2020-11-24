<template>
	<div class="vue-form-general">
		<div class="row">
			<div class="col col-3">
				<h3>Update Widget</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-6">
						<div>
							<label>
								Gallery
							</label>
						</div>
						<div class="m-t-8">
							<a-select :class="{'has-error' : formstate && validate.gallery_id.$invalid }" v-model="form.gallery_id" placeholder="Select a gallery">
								<a-select-option v-for="(item,index) in gallery" :key="index" :value="item.id">
									{{ item.name }}
								</a-select-option>
							</a-select>
							<transition name="fade-in" mode="out-in">
								<div class="form-error" v-if="formstate && validate.gallery_id.$invalid">
									Please select gallery
								</div>
							</transition>
						</div>
					</div>
				</div>
				<div class="row m-t-16">
					<div class="col col-6">
						<div>
							<label>
								Page
							</label>
						</div>
						<div class="m-t-8">
							<a-select @change="onChangePage" :class="{'has-error' : formstate && validate.page_id.$invalid }"  v-model="form.page_id" placeholder="Select a page" >
								<a-select-option v-for="(item,index) in page" :disabled="!item.status" :key="index" :value="item.page_id">
									{{ item.name }}
								</a-select-option>
							</a-select>
							<transition name="fade-in" mode="out-in">
								<div class="form-error" v-if="formstate && validate.page_id.$invalid">
									Please select page
								</div>
							</transition>
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>
								Position
							</label>
						</div>
						<div class="m-t-8">
							<a-select v-model="form.page_position" placeholder="Select position"  :disabled="!form.page_id">
								<a-select-option v-for="(item,index) in page_position"  :key="index" :value="item.id">
									{{ item.name }}
								</a-select-option>
							</a-select>
						</div>
					</div>
				</div>
				<div class="row m-t-16">
					<transition name="fade-in" mode="out-in">
						<div v-if="form.page_position == 'custom'" class="col col-12 m-t-15">
							<vue-widget-select-element-from-store :url="page_url" :disabled="!form.page_id" :element.sync="form.page_custom_element" :position.sync="form.page_custom_position" />
							<transition name="fade-in" mode="out-in">
								<div class="form-error" v-if="formstate && (validate.page_custom_position.$invalid || page_custom_element.$invalid)">
									Please select element 
								</div>
							</transition>
						</div>
					</transition>
				</div>
			</div>
		</div>
		<hr class="m-t-20 m-b-20">
		<div class="row">
			<div class="col col-3">
				<h3>Navigation</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-6">
						<div>
							<label>When image clicked</label>
						</div>
						<div class="m-t-8">
							<a-select  v-model="form.on_image_click" >
								<a-select-option v-for="(item,index) in event_click" :key="index" :value="item.id">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>Open link type</label>
						</div>
						<div class="m-t-8">
							<a-select  v-model="form.on_image_click_target_link" >
								<a-select-option v-for="(item,index) in open_type" :key="index" :value="item.id">
									{{ item.text }}
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
				<h3>Content</h3>
			</div>
			<div class="col col-9">
				<div class="row">
					<div class="col col-6">
						<div>
							<label>Heading title</label>
						</div>
						<div class="m-t-8">
							<input type="text" class="ant-input" v-model="form.heading_title">
						</div>
					</div>
					<div class="col col-6">
						<div>
							<label>Image hover effect</label>
						</div>
						<div class="m-t-8">
							<a-select  v-model="form.image_hover_effect" >
								<a-select-option v-for="(item,index) in image_hover_effects" :key="index" :value="item.id">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import VueWidgetSelectElementFromStore from './vue-widget-select-element-from-store'
export default {
	name : 'FormGeneral',
	components:{
		VueWidgetSelectElementFromStore,
	},
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
			page_position : [
				{
					id : 'top',
					name : 'At Top'
				},
				{
					id : 'bottom',
					name : 'At Bottom'
				},
				{
					id : 'custom',
					name : 'Custom Position'
				}
			],
			image_hover_effects : [
				{
					id : 'no_overlay',
					text : 'No overlay / No text',
				},
				{
					id : 'bw_layout',
					text : 'No overlay & gray layout',
				},
				{
					id : 'instagram_icon',
					text : 'Show Instagram icon',
				},
				{
					id : 'icon_caption',
					text : 'Instagram icon with little caption',
				},
				{
					id : 'caption',
					text : 'Show Caption',
				},
			],
			open_type : [
				{
					id : '_blank',
					text : 'Open link in new window'
				},
				{
					id : '_self',
					text : 'Open link in same window'
				}
			],
			event_click: [
				{
					id : 'popup',
					text : 'Open popup'
				},
				{
					id : 'instagram_post',
					text : 'Open Instagram post'
				}
			],
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
		page_url : function(){
			var url = ''
			if( this.form.page_id ){
				var page = _.find( this.page , { page_id : this.form.page_id })
				if( page ){
					url = page.url
				}
			}
			return url 
		}
	},
	methods :{
		onChangePage(){
			console.log('change')
			if( this.form.page_position == 'custom'){
				this.form.page_custom_element = ''
				this.form.page_custom_position = ''
			}
		},
	}
}
</script>