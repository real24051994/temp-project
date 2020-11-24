import { fabric } from "fabric";
import config from "../config";
const { discount_margins , logo_margins , logo_sizes } = config
const MAX_WIDTH = 1200
const EXPORT_CANVAS_WIDTH = 400
export default  class MergeImage {
	constructor(options){
		let { src , discount  = null , logo = null } = options
		this.value = null 
		this.src = src
		this.discount = discount
		this.logo = logo 
		this.root - null 
		// this.options = options 
		this.canvasElement = null 
		this.canvas = null 
	}
	init() {
		return new Promise( async(resolve, reject)=>{
			let images = await this.getDefaultImage()
			if( images.product == null || ( images.discount == null && images.logo  == null) ){
				return resolve(this.src)
			}
			let product_image = images.product 
			let product_image_width = product_image.width 
			let product_image_height = product_image.height 
			let ratio = product_image_width / product_image_height
			let scale = 0 ;
			if( ratio  <=  1) {
				scale =  (product_image_width * 1 ) / MAX_WIDTH
			}else{
				scale =  (product_image_height * 1 ) / MAX_WIDTH
			}
			let resize_ratio = EXPORT_CANVAS_WIDTH / product_image_width
			
			this.root = document.createElement("DIV")
			this.root.classList.add("vue-autopilot-discount-image")
			document.body.appendChild(this.root)
			this.canvasElement = document.createElement("CANVAS")
			this.canvasElement.setAttribute('width', product_image_width  )
			this.canvasElement.setAttribute('height', product_image_height  )
			this.root.appendChild(this.canvasElement)

			this.canvas = new fabric.Canvas(this.canvasElement , {
				width: product_image_width  * resize_ratio,
				height: product_image_height  * resize_ratio,
				crossOrigin: "anonymous",
			});
			let image = new fabric.Image( product_image, {
				left: 0,
				top: 0,
				width: product_image_width   ,
				height: product_image_height  ,
				crossOrigin: "anonymous",
				selectable: false,
				hoverCursor: "default",
			})
			image.scaleToWidth(product_image_width * resize_ratio)
			this.canvas.add(image)
			if( images.discount ){
				this.mergeDiscountImage(images.discount , product_image , scale , resize_ratio)
			}
			if( images.logo ){
				this.mergeLogoImage(images.logo , product_image , scale , resize_ratio)
			}
			let result = this.canvas.toDataURL()
			this.destroy()
			return resolve(result)
			
		});
	}
	mergeDiscountImage(image , product_image , scale , resize ){
		let margin = _.find( discount_margins , { id : this.discount.discount_margin })
		let margin_value = margin ? margin.value : discount_margins.first().value
		let image_margin = margin_value * scale * resize
		let image_width = image.width 
		let image_height = image.height
		let scale_width = image_width * scale * resize
		let scale_height = image_height * scale * resize
		let position = this.getImagePosition( product_image.width * resize , product_image.height * resize , scale_width , scale_height , image_margin , this.discount.discount_position )
		
		let canvas_image = new fabric.Image( image ,  {
			left: position.left,
			top: position.top,
			crossOrigin: "anonymous",
			selectable: false,
			hoverCursor: "default",
		})
		canvas_image.scaleToWidth(scale_width)
		this.canvas.add(canvas_image)
	}
	mergeLogoImage(image , product_image , scale , resize){
		let margin = _.find( logo_margins , { id : this.logo.logo_margin })
		let size = _.find(logo_sizes , { id : this.logo.logo_size })
		let size_scale = size.value / image.width
		let image_margin = margin.value * scale * resize
		let image_width = image.width 
		let image_height = image.height
		let scale_width = image_width * scale * resize* size_scale
		let scale_height = image_height * scale * resize * size_scale
		let position = this.getImagePosition( product_image.width * resize , product_image.height * resize , scale_width , scale_height , image_margin , this.logo.logo_position )
		let canvas_image = new fabric.Image( image ,  {
			left: position.left,
			top: position.top,
			crossOrigin: "anonymous",
			selectable: false,
			hoverCursor: "default",
			opacity : parseFloat(this.logo.logo_transparent / 100)
		})
		canvas_image.scaleToWidth(scale_width)
		this.canvas.add(canvas_image)
	}
	getImagePosition( frame_width , frame_height , image_width , image_height , margin , position ){
		let top  = 0
		let left = 0 
		switch (position) {
			case 1:
				left  = 0 + margin
				top = 0 + margin
				break;
			case 2:
				left  = (frame_width - image_width ) / 2 
				top = 0 + margin
				break;
			case 3:
				left  = frame_width - image_width  - margin
				top = 0 + margin
				break;
			case 4:
				left  = 0 + margin
				top = (frame_height - image_height ) / 2 
				break;
			case 5:
				left  = frame_width - image_width  - margin
				top = (frame_height - image_height ) / 2 
				break;
			case 6:
				left  = 0 + margin
				top = frame_height - image_height - margin
				break;
			case 7:
				left  = (frame_width - image_width ) / 2 
				top = frame_height - image_height - margin
				break;
			case 8:
				left  = frame_width - image_width  - margin
				top = frame_height - image_height - margin
				break;
			default:
				break;
		}
		return {
			top  , left 
		}
	}
	getCanvasAtResoution(newWidth){
		if (this.canvas.width != newWidth) {
			var scaleMultiplier = newWidth / this.canvas.width;
			var objects = this.canvas.getObjects();
			for (var i in objects) {
				objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
				objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
				objects[i].left = objects[i].left * scaleMultiplier;
				objects[i].top = objects[i].top * scaleMultiplier;
			}

			this.canvas.setWidth(this.canvas.getWidth() * scaleMultiplier);
			this.canvas.setHeight(this.canvas.getHeight() * scaleMultiplier);
			this.canvas.renderAll();
			this.canvas.calcOffset();
		}
		return this.canvas.toDataURL()
	}
	destroy(){
		if( this.canvas ){
			this.canvas.dispose()
			this.canvas = null 
			this.canvasElement = null 
		}
		this.removeDom()
	}
	removeDom(){
		if( this.root ){
			this.root.remove()
			this.root = null 
		}
	}
	toDataURL(){
		return this.canvas ? this.canvas.toDataURL() : null 
	}
	loadImage(src) {
		var vm = this;
		return new Promise((resolve,reject) => {
			var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function(event) {
				resolve(this);
			};
			img.onerror = function(err) {
				reject(err);
			};
			img.src = src;
		});
	}
	loadImages(images) {
		return new Promise((resolve, reject) => {
			let promises = [];
			images.forEach(img => {
				promises.push(this.loadImage(img));
			});
			Promise.all(promises).then(results => {
				resolve(results);
			}).catch((err)=>{
				reject(err)
			})
		});
	}
	isBase64(str) {
		try {
			return btoa(atob(str)) == str;
		} catch (err) {
			return false;
		}
	}
	async getDefaultImage(){
		var product = null 
		var discount = null 
		var logo = null 
		try {
			product = await this.loadImage(this.src)
		} catch (error) {
			product = null 
		}
		if( this.discount.is_create_discount && this.discount.is_enable_discount_tag &&  this.discount.discount_image ){
			try {
				var discount_url = this.discount.discount_image
				let is_base64 =  new RegExp('(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)').test(discount_url)
				if( !is_base64 ){
					discount_url +=  '?v=' + Math.random()
				}
				discount = await this.loadImage(discount_url)
			} catch (error) {
				discount = null 
			}
		}
		if( this.logo.is_enable_logo && this.logo.logo_media){
			try {
				var logo_url = this.logo.logo_media
				let is_base64 =  new RegExp('(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)').test(logo_url)
				if( !is_base64 ){
					logo_url +=  '?v=' + Math.random()
				}
				logo = await this.loadImage(logo_url)
			} catch (error) {
				logo = null 
			}
		}
		
		return {
			product , discount, logo 
		}
	}
}