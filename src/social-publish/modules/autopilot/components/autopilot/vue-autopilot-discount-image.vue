<template>
	<div class="vue-autopilot-discount-image">
		<!-- <canvas :id="canvas_id"></canvas> -->
	</div>
</template>

<script>
import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver";
import config from "../../config";
const { discount_valid_times, discount_tags, discount_percentags, discount_templates, discount_margins, discount_sizes, discount_positions } = config;
import DiscountImage from '../../utils/discount-image.js'
export default {
	name: "VueDiscountImage",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			canvas: null,
			canvas_id: this.$helper.createId(),
		};
	},
	methods: {
		async init() {
			// var image_url = this.images[1]
			await this.loadFontFamily("Rubik");
			this.canvas = new fabric.Canvas(this.canvas_id, {
				width: 500,
				height: 500,
			});
			var img = await this.loadImage(this.value.template.background);
			var image = new fabric.Image(img, {
				left: 0,
				top: 0,
				width: 500,
				height: 500,
				crossOrigin: "anonymous",
				selectable: false,
				hoverCursor: "default",
			});
			this.canvas.add(image);
			var text = [];
			this.value.template.content.forEach(item => {
				var text = new fabric.Textbox( this.getTagValue(item.text) , {
					width: 500,
					left: 0,
					top: item.top,
					height: item.font_size,
					fontFamily: "Rubik",
					fontSize: item.font_size,
					// lineHeight: item.font_size,
					fill: item.color,
					fontWeight: item.font_weight,
					fontStyle: item.font_style,
					selectable : false,
					textAlign: 'center',
        			breakWords: true
				});
				this.canvas.add(text)
			});
			this.canvas.renderAll()
			var data = this.canvas.toDataURL()
		},
		getTagValue(html) {
			var final = html.replace(/{{(.*?)}}/gi, temp => {
				var text = temp.replace("{{", "").replace("}}", "");
				var result = "";
				switch (text) {
					case "DISCOUNT_PERCENTAGE":
						var item = _.find( discount_percentags , { id : this.value.discount_percent})
						if( item ){
							result = item.text 
						}
						break;
					case "VALID_TIME":
						var item = _.find( discount_valid_times , { id : this.value.discount_limit_date})
						if( item ){
							result = item.text 
						}
						break;
					default:
						break;
				}
				return result;
			});
			return final;
		},
		loadFontFamily(font) {
			return new Promise((resolve, reject) => {
				var myfont = new FontFaceObserver(font);
				myfont
					.load()
					.then(() => {
						resolve();
					})
					.catch(e => {
						reject();
					});
			});
		},
		loadImage(src) {
			var vm = this;
			return new Promise(resolve => {
				var img = new Image();
				img.crossOrigin = "Anonymous";
				img.src = src;
				img.onload = function(event) {
					resolve(img);
				};
			});
		},
		loadImages(images) {
			return new Promise((resolve, reject) => {
				let promises = [];
				images.forEach(img => {
					promises.push(this.loadImage(img));
				});
				Promise.all(promises).then(results => {
					resolve(results);
				});
			});
		},
	},
	mounted() {
		var image = new DiscountImage(this.value)
		image.init().then((res)=>{
			image.destroy()
		})
		
	},
};
</script>

<style lang="scss">
	.vue-autopilot-discount-image {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 0;
		width: 0;
		height: 0;
		visibility: hidden;
		opacity: 0;
	}
</style>
