<template>
  <div class="titap-editor">
    <div class="titap-editor--body">
      <editor-content
        class="editor__content position-relative"
        :editor="editor"
      />
    </div>

    <div class="titap-menu-actions">
      <editor-menu-bar :editor="editor" v-slot="{ commands }">
        <a-dropdown
          overlayClassName="titap-menu-actions-shortcode"
          :trigger="['click']"
          placement="bottomRight"
        >
          <div class="menu-shortcode center">
            <span class="center">Add Variant</span>
            <a class="center f-12">
              {/}
            </a>
          </div>

          <a-menu slot="overlay">
            <a-menu-item key="0">
              <a @click="commands.shortcode({ shortcode: 'USERNAME' })"
                >USERNAME</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </editor-menu-bar>
    </div>
  </div>
</template>

<script>
import ShortCode from "./extensions/ShortCode";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";

const sanitizeHtml = require("sanitize-html");

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    message: {
      type: Object,
      default: () => new Object(),
    },
    raw_message: {
      type: String,
      default: () => "",
    },
  },

  data() {
    return {
      editor: null,
    };
  },

  created() {
    const self = this;
    let extensions = [new ShortCode()];
    let contentEditor = this.initMessage();
    this.editor = new Editor({
      extensions,
      content: contentEditor,
      onUpdate() {
        self.onUpdateDate();
      },
      onPaste(view, { type }, slice, moved = false) {
        if (type === "paste") {
          return false;
        }

        return false;
      },
    });
  },
  methods: {
    onUpdateDate() {
      this.$emit("onUpdate", this.editor.getJSON());
    },
    initMessage() {
      let regItem = /[^%]+|(%\w+%)/g;
      let regVariant = /%[a-zA-Z]+%/;
      let data = {
        type: "doc",
        content: [],
      };
      if (this.raw_message) {
        // Get split line
        let arrValue = this.raw_message.split(/\n/g);
        if (arrValue && arrValue.length > 0) {
          arrValue.map((item) => {
            let itemContent = {
              type: "paragraph",
              content: [],
            };
            if (regVariant.test(item)) {
              let matchVariant = item.match(regItem);
              if (matchVariant) {
                matchVariant.map((content) => {
                  if (regVariant.test(content)) {
                    // Is variant
                    itemContent.content.push({
                      type: "shortcode",
                      attrs: {
                        shortcode: content.match(/%(\w.+)%/)[1]
                          ? content.match(/%(\w.+)%/)[1]
                          : content,
                      },
                    });
                  } else {
                    // Free text
                    itemContent.content.push({
                      type: "text",
                      text: content,
                    });
                  }
                });
              }
            } else {
              itemContent.content.push({
                type: "text",
                text: item,
              });
            }
            data.content.push(itemContent);
          });
        }
      } else {
        data.content.push({
          type: "paragraph",
          content: [],
        });
      }
      this.$emit("onUpdate", data);
      return data;
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.editor__content > .ProseMirror {
  min-height: 100px;
  border: 1px solid #e2e2e2;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
  line-height: 16px;
  padding: 10px 40px 10px 10px;

  &.ProseMirror-focused {
    outline: none !important;
  }

  .is-editor-empty:nth-child(1)::before {
    content: "Input Message...";
    float: left;
    font-size: 14px;
    opacity: 0.4;
    pointer-events: none;
    height: 0;
  }
}

/* stylelint-disable-next-line */
titapshortcode[shortcode] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #5b86e5;
  padding: 3px 6px 2px 6px;
  border-radius: 4px;
  font-weight: 500 !important;
  line-height: 1 !important;
  font-size: 12px !important;
  margin: 0 2px;
  color: #ffffff;
}
</style>
<style lang="scss" scoped>
.titap-editor {
  position: relative;
  background: #ffffff;
  .titap-editor--body {
    position: relative !important;
    max-height: 100px;
    overflow-y: auto;
  }

  p {
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 0;
    min-height: 16px;
  }

  .titap-menu-actions {
    .ant-dropdown-open span {
      display: inline-block !important;
    }
  }
}

.titap-menu-actions-shortcode {
  .ant-dropdown-menu-item > a {
    font-size: 12px !important;
    font-weight: 500;
  }
}

.titap-menu-actions {
  position: absolute;
  top: 10px;
  right: 10px;
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
