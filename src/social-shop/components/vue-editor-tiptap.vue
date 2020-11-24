<template>
  <div class="vue-tiptap">
    <editor-content class="vue-tiptap-editor" :editor="editor" />
  </div>
</template>
<script>
import ShortCode from '@shop/assets/tiptap/ShortCode'
import EnterHandler from '@shop/assets/tiptap/EnterHandler'
import { Editor, EditorContent } from 'tiptap'
import { Placeholder, History } from 'tiptap-extensions'
const sanitizeHtml = require('sanitize-html')
export default {
  components: {
    EditorContent,
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
    onPaste: {
      type: Function,
      default: () => {
        return true
      },
    },
    tags: {
      type: Array,
      default: () => {
        return []
      },
    },
    placeholder: {
      type: String,
      default: 'Select variant/type text',
    },
    allowNewLine: {
      type: Boolean,
      default: true,
    },
    modify: {
      type: Boolean,
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  computed: {
    isShowSubmit: {
      get() {
        return this.modify
      },
      set(value) {
        this.$emit('update:modify', value)
      },
    },
  },
  methods: {
    convertJsonToText(json) {
      var result = ''
      if (json && json.hasOwnProperty('content')) {
        json.content.forEach((row) => {
          if (row.type == 'paragraph' && row.hasOwnProperty('content')) {
            row.content.forEach((item) => {
              if (item.type == 'text') {
                result += item.text
              } else if (item.type == 'shortcode') {
                result += '{{' + item.attrs.field_key + '}}'
              }
            })
          }
          result += '\n'
        })
      }
      return result
    },
    convertTexttoHTML(text) {
      var paragraphs,
        html = '',
        p
      if (!text) {
        return ''
      }
      paragraphs = text.split(/[\r\n]+/g)
      if (paragraphs.length > 1) {
        for (p = 0; p < paragraphs.length; p += 1) {
          if (paragraphs[p] !== '') {
            html += '<p>' + this.htmlEntities(paragraphs[p]) + '</p>'
          }
        }
      } else {
        html = this.htmlEntities(paragraphs[0])
      }
      var final = html.replace(/{{(.*?)}}/gi, (temp) => {
        var text = temp.replace('{{', '').replace('}}', '')
        var item = _.find(this.tags, { field_key: text })
        if (item) {
          return `<spbshortcode field_key="${item.field_key}" field_name="${item.field_name}">${item.field_name}</spbshortcode>`
        }
        return temp
      })
      return final
    },
    htmlEntities(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    },
    onUpdate() {
      this.isShowSubmit = true
      this.$emit('input', this.convertJsonToText(this.editor.getJSON()))
    },
    addShortCode({ field_key, field_name }) {
      this.editor.commands.shortcode({ field_key, field_name })
      this.editor.view.dispatch(this.editor.state.tr.insertText(' '))
    },
  },
  created() {
    var extensions = [
      new Placeholder({
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
        emptyNodeText: this.placeholder,
        showOnlyWhenEditable: true,
      }),
      new ShortCode(),
      new History(),
    ]
    if (!this.allowNewLine) {
      extensions.push(new EnterHandler())
    }
    this.editor = new Editor({
      extensions: extensions,
      content: this.convertTexttoHTML(this.value),
      onUpdate: this.onUpdate,
      editorProps: {
        transformPastedHTML: (html) => {
          return sanitizeHtml(html, {
            allowedTags: ['p', 'spbshortcode'],
            allowedAttributes: {
              spbshortcode: ['field_key', 'field_name'],
            },
          })
        },
        handlePaste: (EditorView, event) => {
          if (!this.onPaste(event.clipboardData.getData('text/plain'))) {
            return true
          }
        },
        handleDOMEvents: {
          drop: (view, e) => {
            e.preventDefault()
          },
        },
        dropCursor: { width: 0, color: 'transparent' },
      },
    })
    if (this.readOnly) {
      this.editor.setOptions({
        editable: false,
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style lang="scss">
.vue-tiptap {
  &-editor {
    .ProseMirror {
      font-size: 12px;
      &:focus {
        outline: none;
      }
      p {
        margin: 0 0 3px 0;
      }
      spbshortcode {
        color: $text;
        padding: 0 6px;
        background: #f7f8fa;
        border: 1px solid $border-color;
        border-radius: 4px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        margin-bottom: 2px;
        height: 18px;
      }
    }
  }
  &-editor *.is-empty:nth-child(1)::before,
  *.is-empty:nth-child(2)::before {
    content: attr(data-empty-text);
    float: left;
    color: #cecece;
    pointer-events: none;
    height: 0;
  }
}
</style>
