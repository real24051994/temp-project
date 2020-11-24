const helper = {
    createId(){
        var text = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (text()+text()+""+text()+""+text()+""+text()+""+text()+text()+text());
	},
	isUrl(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	},
	isNumeric(value) {
        return /^-{0,1}\d+$/.test(value)
    },
	isObjectEmpty(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	},
	isDate(date){
		return date instanceof Date && !isNaN(date.valueOf())
	},
	loadingImage(url){
		return new Promise(function(resolve, reject) {
			var img = new Image(); 
			img.src = url;
			img.setAttribute('crossorigin', 'anonymous')
			img.onload = function() {
				resolve({
					width : this.width,
					height : this.height,
				})
			}
			img.onerror = function(err) {
				reject(err)
			}
		});
	},
	showFormData(formData){
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ' :  ' + pair[1]); 
		}
	},
	pasteHtmlAtCaret(html, selectPastedContent) {
		var sel, range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
	
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);
				
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if ( (sel = document.selection) && sel.type != "Control") {
			var originalRange = sel.createRange();
			originalRange.collapse(true);
			sel.createRange().pasteHTML(html);
			var range = sel.createRange();
			range.setEndPoint("StartToStart", originalRange);
			range.select();
		}
	},
	
	isFirefox  : typeof InstallTrigger !== 'undefined' ,
	isChrome : !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
	isArray : Array.isArray
}
export default helper