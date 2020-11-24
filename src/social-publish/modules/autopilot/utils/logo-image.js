import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver"
export default  class DiscountImage {
	constructor(options){
		let { src , size } = options
		this.value = null 
		this.src = src 
		this.size = size 
		this.canvasElement = null 
		this.canvas = null 
		this.root = null
	}
	init() {
		return new Promise( async (resolve, reject)=>{
			let img = await this.loadImage(this.src)
			let { width , height } = img 
			var scale = 1
			var ratio  = width / height
			if( ratio < 1){
				scale = this.size / height 
			}else{
				scale = this.size / width 
			}
			this.root = document.createElement("DIV")
			this.root.classList.add("vue-autopilot-discount-image")
			document.body.appendChild(this.root)
			this.canvasElement = document.createElement("CANVAS")
			this.canvasElement.setAttribute('width', width * scale)
			this.canvasElement.setAttribute('height', height * scale)
			this.root.appendChild(this.canvasElement)
			this.canvas = new fabric.Canvas(this.canvasElement , {
				width : width * scale,
				height : height * scale,
			});
			let image = new fabric.Image(img, {
				left: 0,
				top: 0,
				width:width,
				height:height,
				crossOrigin: 'anonymous',
				selectable: false,
				hoverCursor: "default",
			})
			image.scaleToWidth(width * scale)
			this.canvas.add(image)
			this.canvas.renderAll()
			var result = this.canvas.toDataURL()
			this.destroy()
			return resolve(result)
		});
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
				// objects[i].setCoords();
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
			});
		});
	}
	
}