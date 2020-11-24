<template>
  <div class="wrapper-export-facebook-specific">
    <div v-if="!is_loading" class="vue-mapping-value-contenteditable">
      <vue-editor-tiptap
        :modify.sync="saveSetting"
        v-model="text"
        :allowNewLine="false"
        :tags="tags"
        class="vue-mapping-value-contenteditable-content"
        ref="editor"
      />
      <a-dropdown
        transitionName="fade"
        :getPopupContainer="(trigger) => trigger.parentNode"
        :trigger="['click']"
        class="vue-autopilot-add-variant-trigger"
        v-model="visible"
      >
        <slot name="btn-trigger">
          <a-button class="vue-mapping-value-contenteditable-btn">
            <sh-icon style="color: #828282" :icon="['fal', 'clipboard-list']" />
          </a-button>
        </slot>
        <a-menu slot="overlay" class="vue-mapping-value-variant-menu">
          <a-menu-item class="vue-mapping-value-variant-menu-item" v-for="(item, index) in tags" :key="`item_index_${index}`" @click="onClick(item)">
            [P] {{ item.field_name }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VueMappingExportFbConteneditable',
  props: {
    value: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => {
        return []
      },
    },
    modify: {
      type: Boolean,
    },
    seen: {
      type: Boolean,
    },
  },
  data() {
    return {
      visible: false,
      isShow: false,
      is_loading: true,
    }
  },
  computed: {
    text: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    saveSetting: {
      get() {
        return this.modify
      },
      set(value) {
        this.$emit('update:modify', value)
      },
    },
  },
  methods: {
    onClick(item) {
      this.$refs.editor.addShortCode(item)
      this.visible = false
    },
    onMount(){
      this.is_loading = false
    }
  },
}
</script>
<style lang="scss">
.wrapper-export-facebook-specific {
  .validate-field {
    font-size: 12px;
    color: $danger;
  }
  .border-field {
    border: 1px solid $danger !important;
    border-radius: 4px;
  }
  .vue-mapping-value-contenteditable {
    position: relative;
    border: 1px solid $border-color;
    border-radius: 4px;
    .ProseMirror {
      overflow: auto;
      padding: 6px 11px;
      line-height: 20px;
      max-height: 80px;
      font-size: 13px;
      p {
        margin: 0;
      }
    }
    .ProseMirror::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    &-btn {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      border: none;
      &:hover,
      &:focus {
        border: none;
        background: none;
      }
    }
  }
  .vue-mapping-value-variant-menu {
    min-width: 228px;
    max-height: 300px;
    overflow: auto;
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: #f5f5f5;
      border-radius: 10px;
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar {
      width: 7px;
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .ant-dropdown {
    .ant-dropdown-menu {
      padding: 0;
      border: 1px solid $border-color;
      &-item {
        padding: 8px 16px;
        width: 218px;
        &:hover {
          background: #f3f3f3;
        }
      }
    }
  }
}
</style>
