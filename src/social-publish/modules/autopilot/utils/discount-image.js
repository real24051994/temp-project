import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver";
const DEFAULT_WIDTH = 500
const DEFAULT_HEIGHT = 500
export default  class DiscountImage {
	constructor(options){
		this.value = null 
		this.options = options 
		this.canvasElement = null 
		this.canvas = null 
		this.root = null
	}
	init() {
		return new Promise( async (resolve, reject)=>{
			try {
				await this.loadFontFamily("Rubik")
			} catch (arr) {
				
			}

			this.root = document.createElement("DIV")
			this.root.classList.add("vue-autopilot-discount-image")
			document.body.appendChild(this.root)
			this.canvasElement = document.createElement("CANVAS")
			this.canvasElement.setAttribute('width', this.options.width)
			this.canvasElement.setAttribute('height', this.options.height)
			this.root.appendChild(this.canvasElement)
			this.canvas = new fabric.Canvas(this.canvasElement , {
				width: this.options.width,
				height: this.options.height,
			});
			let img = await this.loadImage(this.options.background)
			let image = new fabric.Image(img, {
				left: 0,
				top: 0,
				width: this.options.width,
				height: this.options.height,
				crossOrigin: 'anonymous',
				selectable: false,
				hoverCursor: "default",
			})
			this.canvas.add(image)
			this.options.content.forEach(item => {
				var text = new fabric.Textbox( item.text , {
					width: this.options.width,
					left: 0,
					top: item.top,
					height: item.font_size,
					fontFamily: "Rubik",
					fontSize: item.font_size,
					fill: item.color,
					fontWeight: item.font_weight,
					fontStyle: item.font_style,
					selectable : false,
					textAlign: 'center',
					breakWords: true
				});
				this.canvas.add(text)
			})
			this.canvas.renderAll()
			if( this.options.scale == 1 ){
				var result = this.canvas.toDataURL()
				this.destroy()
				return resolve(result)
			}else{
				var base64 = this.canvas.toDataURL()
				this.destroy()
				var result = await this.resizeImage(base64)
				return resolve(result)
			}
			
		});
	}
	resizeImage(base64){
		return new Promise( async (resolve, reject)=>{
			var root = document.createElement("DIV")
			root.classList.add("vue-autopilot-discount-image")
			document.body.appendChild(root)
			var canvasElement = document.createElement("CANVAS")
			canvasElement.setAttribute('width', this.options.width * this.options.scale)
			canvasElement.setAttribute('height', this.options.height * this.options.scale)
			root.appendChild(canvasElement)
			var canvas = new fabric.Canvas(canvasElement , {
				width: this.options.width * this.options.scale,
				height: this.options.height * this.options.scale,
			});
			let img = await this.loadImage(base64)
			let image = new fabric.Image( img, {
				left: 0,
				top: 0,
				width: this.options.width,
				height: this.options.height,
				crossOrigin: 'anonymous',
				selectable: false,
				hoverCursor: "default",
			})
			image.scaleToWidth(this.options.width * this.options.scale)
			canvas.add(image)
			var result = canvas.toDataURL()
			canvas.dispose()
			root.remove()
			resolve(result)
		});
		
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
			});
		});
	}
	
}