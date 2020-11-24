import { Node } from 'tiptap'
import { replaceText } from 'tiptap-commands'

export default class ShortCode extends Node {
	get name() {
		return 'shortcode'
	}

	get schema() {
		return {
			attrs: {
				shortcode: {},
			},
			group: 'inline',
			inline: true,
			draggable: false,
			selectable: false,
			toDOM: (node) => [
				'spbshortcode',
				{
					shortcode: node.attrs.shortcode,
				},
				node.attrs.shortcode,
			],
			parseDOM: [
				{
					tag: 'spbshortcode',
					getAttrs: (dom) => ({
						shortcode: dom.getAttribute('shortcode'),
					}),
				},
			],
		}
	}

	commands({ schema }) {
		return (attrs) => replaceText(null, schema.nodes[this.name], attrs)
	}
}
