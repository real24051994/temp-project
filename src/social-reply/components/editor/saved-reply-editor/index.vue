<template>
  <div class="srp-saved-reply-editor">
    <div class="srp-saved-reply-editor--body m-r-40">
      <editor-content class="editor__content position-relative" :editor="editor" />
    </div>

    <div class="srp-menu-actions">
      <editor-menu-bar :editor="editor" v-slot="{ commands }">
        <a-dropdown overlayClassName="srp-menu-actions-shortcode" :trigger="['click']" placement="bottomRight">
          <div class="menu-shortcode center">
            <span class="center">Add Variant</span>
            <a class="center f-12">
              {/}
            </a>
          </div>

          <a-menu slot="overlay">
            <a-menu-item key="0">
              <a @click="commands.shortcode({ shortcode: 'SHOP_NAME' })">SHOP_NAME</a>
            </a-menu-item>

            <a-menu-item key="1">
              <a @click="commands.shortcode({ shortcode: 'NAME' })">NAME</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </editor-menu-bar>
    </div>
  </div>
</template>

<script>
import ShortCode from './extensions/ShortCode'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Placeholder } from 'tiptap-extensions'
const sanitizeHtml = require('sanitize-html')

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },

  props: {
    value: {
      type: [String, Object],
      required: true,
      default: () => '',
    },

    read_only: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data() {
    return {
      editor: null,
    }
  },

  created() {
    const self = this

    let extensions = [
      new Placeholder({
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
        showOnlyWhenEditable: true,
      }),
      new ShortCode(),
    ]

    this.editor = new Editor({
      extensions,
      content: this.value,

      onUpdate() {
        self.onUpdateDate()
      },

      onPaste(view, { type }, slice, moved = false) {
        if (type === 'paste') {
          return false
        }

        return false
      },

      editorProps: {
        transformPastedHTML: (html) => {
          const clean = sanitizeHtml(html, {
            allowedTags: ['p', 'srpshortcode'],
            allowedAttributes: {
              srpshortcode: ['shortcode'],
            },
          })
          return clean
        },

        handlePaste: (view, e, slice) => {
          e.stopPropagation()
          e.preventDefault()
        },
      },
    })

    if (this.read_only) {
      this.editor.setOptions({
        editable: false,
      })
    }
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    onUpdateDate() {
      this.$emit('input', this.editor.getHTML())
    },
  },
}
</script>

<style lang="scss">
.srp-saved-reply-editor {
  .editor__content > .ProseMirror {
    min-height: 300px;
    border: none !important;
    font-size: 14px;
    line-height: 16px;

    &.ProseMirror-focused {
      outline: none !important;
    }

    .is-editor-empty:nth-child(1)::before {
      content: 'Input Message...';
      float: left;
      font-size: 14px;
      opacity: 0.4;
      pointer-events: none;
      height: 0;
    }
  }

  p {
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 0;
    min-height: 16px;
  }

  /* stylelint-disable-next-line */
  srpshortcode[shortcode] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(216, 216, 216, 0.5);
    padding: 3px 6px 2px 6px;
    border-radius: 4px;
    font-weight: 500 !important;
    line-height: 1 !important;
    font-size: 12px !important;
    margin: 0 2px;
  }

  .srp-menu-actions {
    .ant-dropdown-open span {
      display: inline-block !important;
    }
  }
}

.srp-menu-actions-shortcode {
  .ant-dropdown-menu-item > a {
    font-size: 12px !important;
    font-weight: 500;
  }
}
</style>

<style lang="scss" scoped>
.srp-saved-reply-editor--body {
  position: relative !important;
  max-height: 375px;
  overflow-y: auto;
}

.srp-menu-actions {
  position: absolute;
  top: 121px;
  right: 24px;
}

.menu-shortcode {
  height: 24px;
  border-radius: 4px;
  background-color: #e7f3fe;
  color: #5b86e5;
  padding: 0 6px;
  transition: all 0.3s;
  cursor: pointer;

  span {
    display: none;
    margin-right: 8px;
    font-size: 12px;
    transition: all 0.3s;
  }

  &:hover {
    span {
      display: inline-block;
    }
  }

  a {
    line-height: 1;
  }
}
</style>
