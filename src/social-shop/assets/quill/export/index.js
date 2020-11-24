import Quill from 'quill'
import 'quill/dist/quill.core.css'
const Delta = Quill.import('delta')
const Embed = Quill.import('blots/embed')
const Clipboard = Quill.import('modules/clipboard')

class ItemMappingValue extends Embed {
  static create(value) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = ctx.measureText(value.field_name).width + value.field_name.length * 2 + 30
    canvas.height = 20
    ctx.font = '500 12px Rubik'
    ctx.fillStyle = '#252627'
    ctx.textAlign = 'center'
    ctx.fillText('[P] '+ value.field_name, canvas.width / 2, 14)

    let node = super.create(value)
    node.setAttribute('alt', value.field_key)
    node.setAttribute('src', canvas.toDataURL())
    return node
  }
  static formats(domNode) {
    return domNode.hasAttribute('alt') ? domNode.hasAttribute('alt') : ''
  }
  static value(domNode) {
    return domNode.getAttribute('alt')
  }
}

ItemMappingValue.blotName = 'item-mapping-value'
ItemMappingValue.className = 'item-mapping-value'
ItemMappingValue.tagName = 'img'

Quill.register({
  'formats/item-mapping-value': ItemMappingValue,
})

class PlainClipboard extends Clipboard {
  onPaste(e) {
    // e.preventDefault() // allow copy and paste
    const range = this.quill.getSelection()
    const text = e.clipboardData.getData('text/plain')
    if (typeof this.quill.options.onPasteContent == 'function' && !this.quill.options.onPasteContent(text)) {
      return
    }
    const delta = new Delta().retain(range.index).delete(range.length)
    const index = text.length + range.index
    const length = 0
    this.quill.updateContents(delta, 'silent')
    this.quill.setSelection(index, length, 'silent')
    this.quill.scrollIntoView()
    if (typeof this.quill.options.onPasteSuccess == 'function') {
      this.quill.options.onPasteSuccess()
    }
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)

export default Quill
