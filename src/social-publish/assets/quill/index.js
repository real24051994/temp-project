import Quill from "quill";
import "quill/dist/quill.core.css";
const Delta = Quill.import('delta')
const Embed = Quill.import('blots/embed');
const Clipboard = Quill.import('modules/clipboard')

class ItemProductTag extends Embed {
	static create(value) {
		let node = super.create(value);
		node.setAttribute('alt', value);
		node.setAttribute('src', require('@publish/assets/product-tags/' + value + '.png'))
		return node;
	}
	static formats(domNode) {
		return domNode.hasAttribute('alt') ? domNode.hasAttribute('alt') : ''
	}
	static value(domNode) {
		return domNode.getAttribute('alt');
	}
}

ItemProductTag.blotName = 'item-product-tag';
ItemProductTag.className = 'item-product-tag';
ItemProductTag.tagName = 'img';

Quill.register({
	'formats/item-product-tag': ItemProductTag
});

class PlainClipboard extends Clipboard {
	onPaste(e) {
		e.preventDefault()
		const range = this.quill.getSelection()
		const text = e.clipboardData.getData('text/plain')
		if( typeof this.quill.options.onPasteContent == 'function' && !this.quill.options.onPasteContent(text) ){
			return
		}
		const delta = new Delta()
			.retain(range.index)
			.delete(range.length)
			.insert(text)
		const index = text.length + range.index
		const length = 0
		this.quill.updateContents(delta, 'silent')
		this.quill.setSelection(index, length, 'silent')
		this.quill.scrollIntoView()
		if( typeof this.quill.options.onPasteSuccess == 'function' ){
			this.quill.options.onPasteSuccess()
		}
	}
}

Quill.register('modules/clipboard', PlainClipboard, true)


export default Quill