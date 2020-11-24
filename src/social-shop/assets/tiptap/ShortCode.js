import { Node } from 'tiptap'
import { replaceText } from 'tiptap-commands'

export default class ShortCode extends Node {
  get name() {
    return 'shortcode'
  }

  get schema() {
    return {
      attrs: {
        field_key: {},
        field_name: {},
      },
      group: 'inline',
      inline: true,
      draggable: false,
      selectable: false,
      toDOM: (node) => [
        'spbshortcode',
        {
          field_key: node.attrs.field_key,
          field_name: node.attrs.field_name,
        },
        '[P] ' + node.attrs.field_name,
      ],
      parseDOM: [
        {
          tag: 'spbshortcode',
          getAttrs: (dom) => ({
            field_key: dom.getAttribute('field_key'),
            field_name: dom.getAttribute('field_name'),
          }),
        },
      ],
    }
  }

  commands({ schema }) {
    return (attrs) => replaceText(null, schema.nodes[this.name], attrs)
  }
}
