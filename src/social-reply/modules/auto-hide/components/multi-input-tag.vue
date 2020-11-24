<template>
  <div class="multi-tag-container" ref="container" @click="focusToInput">
    <div class="multi-tag-editor">
      <template v-if="showTags">
        <div v-for="(item, index) in items" :key="index">
          <a-tag
            class="editor-tag f-12 mb-2"
            closable
            @close="removeItem(index, item)"
            >{{ item }}
          </a-tag>
        </div>
      </template>

      <div style="min-height: 50px">
        <input
          class="multi-tag-input"
          ref="input"
          type="text"
          :size="inputValue.length + 1"
          v-model="inputValue"
          v-on:keyup.enter="addItem"
          @focusout="addItem"
        />
        <div
          class="multi-tag-popover"
          @click="addItem"
          v-show="inputValue.length > 0"
        >
          <sh-icon class="icon" :icon="['far', 'plus-circle']" />
          <span class="f-12 ml-1">Add "{{ inputValue }}"</span>
        </div>
      </div>
    </div>
    <div class="multi-tag-placeholder">
      <span class="f-12">Press "Tab" button to add keyword</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    mapItemValid: {
      type: Map,
      default: () => new Map(),
    },
  },
  data() {
    return {
      inputValue: "",
      showTags: true,
    };
  },
  methods: {
    focusToInput() {
      this.$refs["input"].focus();
      this.scrollToEnd();
    },
    addItem() {
      if (this.inputValue) {
        if (!this.mapItemValid.has(this.inputValue)) {
          this.mapItemValid.set(this.inputValue, this.items.length);
          this.items.push(this.inputValue);
          this.inputValue = "";
          this.focusToInput();
        } else {
          this.toastError({
            title: "Add keyword failure",
            message: "This keyword already exists!",
          });
          this.inputValue = "";
        }
      }
    },
    removeItem(index, item) {
      if (this.mapItemValid.has(item)) {
        this.mapItemValid.delete(item);
      }
      this.items.splice(index, 1);
      this.showTags = false;
      this.focusToInput();
      this.$nextTick(() => {
        this.showTags = true;
      });
    },
    scrollToEnd() {
      const container = this.$refs.container;
      container.scrollTop = container.clientHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-tag- {
  &container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 101px;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    padding: 8px 8px 4px 8px;
    overflow-x: auto;
    background: #ffffff;
  }
  &placeholder {
    > span {
      color: $placeholder-color;
    }
  }
  &editor {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    flex-wrap: wrap;
    .editor-tag {
      height: 22px;
      background: #f7f8fa;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
    }
  }
  &input {
    border: none;
    width: auto;
    &:focus {
      outline: none;
    }
  }
  &popover {
    display: flex;
    align-items: center;
    cursor: pointer;
    background: #ffffff;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 2px 4px;
    height: 24px;
    > .icon {
      color: $primary-color;
    }
  }
}
</style>
<style lang="scss">
.multi-tag- {
  &container {
    .anticon-close {
      font-size: 10px !important;
      padding: 2px 0px;
    }
  }
}
</style>
