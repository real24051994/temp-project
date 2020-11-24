<template>
  <div class="row d-flex align-items-center">
    <div class="col col-6">
      <div class="w-100 d-flex mb-2">
        <div class="mr-auto">
          <div class="font-medium">
            Keyword
          </div>
        </div>
      </div>
      <MultiInputTag
        :items="settings.reply_comment_keywords[index].keywords"
        :mapItemValid="mapItemValid"
      />
    </div>

    <div class="col col-6">
      <div class="w-100 font-medium mb-2">
        Reply content
      </div>
      <!-- <tiptap v-model="settings.reply_comment_keywords[index].reply_content" /> -->
      <tiptap
        :raw_message="settings.reply_comment_keywords[index].reply_content"
        v-on:onUpdate="updateReplyMessage"
      />
    </div>

    <fa-button
      class="btn-remove m-r-8"
      v-if="remove_item"
      @click="removeItem(index)"
    >
      <sh-icon :icon="['fas', 'times']" />
    </fa-button>
  </div>
</template>

<script>
import Tiptap from "./tiptap/index";
import MultiInputTag from "../components/multi-input-tag";

export default {
  components: { Tiptap, MultiInputTag },
  props: {
    settings: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    remove_item: {
      type: Boolean,
      default: false,
    },
    mapItemValid: {
      type: Map,
      default: () => new Map(),
    },
  },
  methods: {
    removeItem(number) {
      this.settings.reply_comment_keywords.splice(number, 1);
    },
    updateReplyMessage(message) {
      this.settings.reply_comment_keywords[
        this.index
      ].reply_content_json = message;
    },
  },
};
</script>
<style lang="scss" scoped>
.textarea-greeting {
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  padding: 12px;
  resize: none;

  &.error {
    border: 1px solid #f2545d;
  }

  &::placeholder {
    font-size: 14px;
    line-height: 22px;
    color: #4f4f4f;
  }

  &:focus {
    outline: none;
  }
}

.keyword-suggestion {
  color: #5b86e5;
  cursor: pointer;

  .keyword-suggestion-link {
    border-bottom: 1px solid;
  }
}

.btn-remove {
  position: absolute;
  right: -60px;
  top: 65px;
  width: 30px;
  height: 30px;
}
</style>
