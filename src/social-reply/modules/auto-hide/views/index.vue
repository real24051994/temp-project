<template>
  <div class="page-container" v-if="!is_loading">
    <div class="row">
      <div class="col col-12">
        <span class="page-title"> Settings - {{ social_id }} </span>
      </div>
    </div>
    <div class="divider m-t-24 m-b-24"></div>
    <div class="row ">
      <div class="col-12 d-flex">
        <div class="mr-auto">
          <div class="d-flex">
            <div class="item-icon float-left d-flex align-items-center">
              <div class="item-icon-bg">
                <div class="h-100 d-flex align-items-center">
                  <sh-icon :icon="['fas', 'eye-slash']" />
                </div>
              </div>
            </div>
            <div class="float-left align-items-center">
              <span class="font-medium">Auto Hide Comment</span>
              <div class="f-12">
                Donec id mi morbi quis vitae auctor magna tellus. Hendrerit nec
                pellentesque pellentesque aliquam eget imperdiet phasellus.
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <a-switch v-model="settings.hide_comment_status" />
          <div class="m-l-8 font-medium">
            <template v-if="settings.hide_comment_status">
              Enable
            </template>
            <template v-else>
              Disable
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="divider m-t-24 m-b-24"></div>
    <template v-if="settings.hide_comment_status">
      <div class="row">
        <div class="col-12 d-flex">
          <div class="w-100 d-flex">
            <div class="item-icon float-left d-flex align-items-center">
              &nbsp;
            </div>
            <div class="w-100 float-left align-items-center">
              <a-radio-group
                class="w-100"
                v-model="settings.hide_comment_filter"
              >
                <a-radio :style="radioStyle" value="all">
                  Auto-hide all comments
                </a-radio>
                <div class="f-12 ml-4 pl-1 mb-2">
                  Donec id mi morbi quis vitae auctor magna tellus.
                </div>
                <div class="d-flex">
                  <div class="mr-auto">
                    <a-radio :style="radioStyle" value="keywords">
                      Auto-hide by keywords
                    </a-radio>
                    <div class="f-12 ml-4 pl-1">
                      Auto-hide comment contain keyword below.
                    </div>
                  </div>
                  <div
                    class="d-flex align-content-end vertical_align_bottom"
                    v-if="settings.hide_comment_filter === 'keywords'"
                  >
                    <div
                      class="d-flex align-items-center keyword-suggestion"
                      @click="handleModal"
                    >
                      <div class="mr-1 float-left ">
                        <sh-icon :icon="['far', 'key']" />
                      </div>
                      <div
                        class="float-left align-items-center keyword-suggestion-link"
                      >
                        Keyword Suggestion
                      </div>
                    </div>
                  </div>
                </div>
              </a-radio-group>
            </div>
          </div>
        </div>
        <div
          class="col-12 d-flex"
          v-if="settings.hide_comment_filter === 'keywords'"
        >
          <div class="w-100 mr-auto">
            <div class="d-flex">
              <div class="item-icon float-left d-flex align-items-center">
                &nbsp;
              </div>
              <div class="w-100 float-left align-items-center">
                <MultiInputTag
                  class="mt-3"
                  :mapItemValid="mapHideItemValid"
                  :items="settings.hide_comment_keywords"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider m-t-24 m-b-24"></div>
    </template>
    <div class="row">
      <div class="col-12 d-flex">
        <div class="mr-auto">
          <div class="d-flex">
            <div class="item-icon float-left d-flex align-items-center">
              <div class="item-icon-bg">
                <div class="h-100 d-flex align-items-center">
                  <sh-icon :icon="['fas', 'comment-alt-dots']" />
                </div>
              </div>
            </div>
            <div class="float-left align-items-center">
              <span class="font-medium">Auto Reply Comment</span>
              <div class="f-12">
                Donec id mi morbi quis vitae auctor magna tellus. Hendrerit nec
                pellentesque pellentesque aliquam eget imperdiet phasellus.
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <a-switch v-model="settings.reply_comment_status" />
          <div class="m-l-8 font-medium">
            <template v-if="settings.reply_comment_status">
              Enable
            </template>
            <template v-else>
              Disable
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="divider m-t-24 m-b-24"></div>
    <template v-if="settings.reply_comment_status">
      <div class="row">
        <div class="col-12 d-flex">
          <div class="w-100">
            <div class="d-flex">
              <div class="item-icon float-left d-flex align-items-center">
                &nbsp;
              </div>
              <div class="w-100 align-items-center">
                <a-radio-group
                  class="w-100"
                  v-model="settings.reply_comment_filter"
                >
                  <a-radio :style="radioStyle" value="all" class="w-100">
                    Reply all comments
                  </a-radio>
                  <template v-if="settings.reply_comment_filter === 'all'">
                    <div class="col-12 d-flex pl-0 my-3">
                      <div class="w-100 mr-auto">
                        <div class="d-flex">
                          <div class="w-50 float-left align-items-center">
                            <tiptap
                              :raw_message="settings.reply_comment_message"
                              :message="reply_message"
                              v-on:onUpdate="updateReplyMessage"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <a-radio :style="radioStyle" value="keywords">
                    Reply by keywords
                  </a-radio>
                  <template v-if="settings.reply_comment_filter === 'keywords'">
                    <div class="col-12 d-flex pl-0 my-3">
                      <div class="w-100 mr-auto">
                        <div class="d-flex">
                          <div class="w-100 float-left align-items-center">
                            <div
                              class="reply_comment_keyword"
                              :key="`keyword_${index}`"
                              v-for="(item,
                              index) in settings.reply_comment_keywords"
                            >
                              <reply-by-keywords
                                :settings="settings"
                                :index="index"
                                :remove_item="is_remove_item"
                                :mapItemValid="mapReplyItemValid"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 d-flex">
                      <div class="w-100 mr-auto">
                        <div class="d-flex">
                          <div class="w-100 float-left align-items-center">
                            <fa-button class="btn-addmore" @click="addMore">
                              <div class="d-flex">
                                <div class="m-r-8">
                                  <sh-icon :icon="['fas', 'plus']" />
                                </div>
                                <div>
                                  Add more keywords & content
                                </div>
                              </div>
                            </fa-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider m-t-24 m-b-24"></div>
    </template>

    <div class="flex content-end m-t-24">
      <fa-button class="btn-cancel m-r-8" @click="resetSettings">
        Discard Settings
      </fa-button>

      <fa-button
        type="primary"
        class="btn-save flex items-center content-center "
        :disabled="disabled_save"
        @click="onSave"
      >
        <a-icon
          v-if="is_submiting"
          type="loading"
          style="font-size: 14px; color: white; position: relative; left: -8px"
          spin
        />
        Save Settings
      </fa-button>
    </div>
    <modal-keywords
      :show.sync="show_modal"
      :settings="settings"
      :mapItemValid="mapHideItemValid"
      v-on:clearItem="clearMapHideItemValid"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Tiptap from "../components/tiptap";
import ReplyByKeywords from "../components/reply-by-keywords";
import ModalKeywords from "../components/modal-keywords";
import MultiInputTag from "../components/multi-input-tag";

export default {
  name: "AutoHide",
  components: {
    ModalKeywords,
    ReplyByKeywords,
    Tiptap,
    MultiInputTag,
  },
  metaInfo: {
    title: "Auto-hide Setting",
  },
  data: () => ({
    radioStyle: {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    },
    pages: [],
    social_id: null,
    original_settings: {},
    settings: {
      hide_comment_status: false,
      hide_comment_filter: "all",
      hide_comment_keywords: [],
      reply_comment_status: false,
      reply_comment_filter: "all",
      reply_comment_message: null,
      reply_comment_keywords: [],
    },
    is_loading: false,
    is_submiting: false,
    is_remove_item: false,
    show_modal: false,
    mapReplyItemValid: new Map(),
    mapHideItemValid: new Map(),
    reply_message: {},
  }),
  async created() {
    this.fetchSetting();
  },
  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
    }),

    disabled_save() {
      return this.is_submiting;
    },
  },
  watch: {
    // "settings.hide_comment_status"() {
    //   if (this.settings.hide_comment_status == false) {
    //     this.settings.hide_comment_filter = "all";
    //     this.settings.hide_comment_keywords = [];
    //   }
    // },
    // "settings.hide_comment_filter"() {
    //   if (this.settings.hide_comment_filter == "all") {
    //     this.settings.hide_comment_keywords = [];
    //     this.mapHideItemValid = new Map();
    //   } else {
    //     this.settings.hide_comment_keywords =
    //       this.original_settings.hide_comment_keywords &&
    //       this.original_settings.hide_comment_keywords.length > 0
    //         ? [...this.original_settings.hide_comment_keywords]
    //         : [];
    //     this.mapHideItemValid = new Map();
    //     for (
    //       let index = 0;
    //       index < this.settings.hide_comment_keywords.length;
    //       index++
    //     ) {
    //       const key = this.settings.hide_comment_keywords[index];
    //       this.mapHideItemValid.set(key, index);
    //     }
    //   }
    // },
    // "settings.reply_comment_status"() {
    //   if (this.settings.reply_comment_status == false) {
    //     this.settings.reply_comment_filter = "all";
    //     this.settings.reply_comment_message = "";
    //     this.settings.reply_comment_keywords = [];
    //   }
    // },
    // "settings.reply_comment_filter"() {
    //   if (this.settings.reply_comment_filter == "all") {
    //     let message = this.original_settings.reply_comment_message;
    //     this.settings.reply_comment_message = message;
    //     this.settings.reply_comment_keywords = [];
    //     this.mapReplyItemValid = new Map();
    //   } else {
    //     this.settings.reply_comment_message = "";
    //     this.settings.reply_comment_keywords =
    //       this.original_settings.reply_comment_keywords &&
    //       this.original_settings.reply_comment_keywords.length > 0
    //         ? [...this.original_settings.reply_comment_keywords]
    //         : [];
    //     this.mapReplyItemValid = new Map();
    //     for (
    //       let index = 0;
    //       index < this.settings.reply_comment_keywords.length;
    //       index++
    //     ) {
    //       const item = this.settings.reply_comment_keywords[index];
    //       for (let indexKey = 0; indexKey < item.keywords.length; indexKey++) {
    //         const key = item.keywords[indexKey];
    //         this.mapReplyItemValid.set(key, `${index}-${index}`);
    //       }
    //     }
    //   }
    // },
    "settings.reply_comment_keywords"() {
      this.checkRemoveReplyCommentKeywords();
    },
  },
  methods: {
    ...mapActions({
      fetchAccounts: "Account/fetchAccounts",
    }),
    async fetchSetting() {
      this.is_loading = true;
      try {
        // Get list social account
        await this.fetchAccounts();
        this.social_id = this.accounts[0]["social_id"];
        // Get setting by selected social id
        let { data } = await this.$api.SETTINGS.fetchSetting(this.social_id);
        this.original_settings = this.clone(data);
        this.settings = Object.assign(this.settings, this.clone(data));
        // Init keyword for checking valid
        this.initKeywordItem();
      } catch (error) {
      } finally {
        this.is_loading = false;
      }
    },
    async onSave() {
      this.settings.reply_comment_message = this.getReplyRawMessage(
        this.reply_message
      );
      if (this.is_submiting) {
        return;
      }
      let msg = "Something went wrong!";
      try {
        this.is_submiting = true;
        if (this.settings.hide_comment_status === true) {
          // Validate hide comment
          if (
            this.mapHideItemValid.size === 0 &&
            this.settings.hide_comment_filter == "keywords"
          ) {
            msg = "Please select your keywords!";
            throw msg;
          }
        }
        if (this.settings.reply_comment_status === true) {
          // Validate reply comment
          if (this.settings.reply_comment_filter == "keywords") {
            let items = this.settings.reply_comment_keywords;
            for (let index = 0; index < items.length; index++) {
              const item = items[index];
              if (!item.keywords || item.keywords.length === 0) {
                msg = "Please select your keywords!";
                throw msg;
              }
              if (!item.reply_content_json) {
                msg = "Please input the reply content!";
                throw msg;
              }
              let rawMessage = this.getReplyRawMessage(item.reply_content_json);
              if (!rawMessage) {
                msg = "Please input the reply content!";
                throw msg;
              }
              this.settings.reply_comment_keywords[
                index
              ].reply_content = rawMessage;
            }
          } else {
            if (this.settings.reply_comment_message.length === 0) {
              console.log("3---");
              msg = "Please input the reply content!";
              throw msg;
            }
          }
        }
        let payload = Object.assign({}, this.settings);
        if (
          payload.reply_comment_keywords &&
          payload.reply_comment_keywords.length === 1 &&
          payload.reply_comment_keywords[0].keywords.length === 0
        ) {
          payload.reply_comment_keywords = [];
        }
        let { data } = await this.$api.SETTINGS.updateSetting(
          this.social_id,
          payload
        );

        this.original_settings = this.clone(data);

        this.toastSuccess({
          title: "Done",
          message: "Saved settings successfully",
        });
      } catch (error) {
        this.toastError({
          title: "Error",
          message: msg,
        });
      } finally {
        this.is_submiting = false;
      }
    },
    clearMapHideItemValid() {
      this.mapHideItemValid = new Map();
    },
    updateReplyMessage(message) {
      this.reply_message = message;
    },
    getReplyRawMessage(message) {
      let rawMessage = "";
      let msgContent = message.content;
      if (msgContent && msgContent.length > 0) {
        msgContent.map((item, index, array) => {
          if (item.content && item.content.length > 0) {
            item.content.map((childItem) => {
              switch (childItem.type) {
                case "shortcode":
                  rawMessage += `%${childItem.attrs.shortcode}%`;
                  break;
                default:
                  rawMessage += childItem.text;
                  break;
              }
            });
          }
          if (index < array.length - 1) {
            rawMessage += "\n";
          }
        });
      }
      return rawMessage;
    },
    initKeywordItem() {
      // Push keyword reply to map
      if (
        this.settings.reply_comment_keywords &&
        this.settings.reply_comment_keywords.length > 0
      ) {
        const replyItems = this.settings.reply_comment_keywords;
        for (let indexItem = 0; indexItem < replyItems.length; indexItem++) {
          const replyItem = replyItems[indexItem];
          if (replyItem.keywords && replyItem.keywords.length > 0) {
            const keywords = replyItem.keywords;
            for (let indexKey = 0; indexKey < keywords.length; indexKey++) {
              const key = keywords[indexKey];
              this.mapReplyItemValid.set(key, `${indexItem}-${indexKey}`);
            }
          }
        }
      }
      // Push key word hide comment to map
      if (
        this.settings.hide_comment_keywords &&
        this.settings.hide_comment_keywords.length > 0
      ) {
        const keywords = this.settings.hide_comment_keywords;
        for (let index = 0; index < keywords.length; index++) {
          const key = keywords[index];
          this.mapHideItemValid.set(key, index);
        }
      }
    },
    addMore() {
      this.settings.reply_comment_keywords.push({
        keywords: [],
        reply_content: null,
      });
    },
    checkRemoveReplyCommentKeywords() {
      if (this.settings.reply_comment_keywords.length > 1) {
        this.is_remove_item = true;
      } else {
        this.is_remove_item = false;
      }
      if (this.settings.reply_comment_keywords.length === 0) {
        this.addMore();
      }
    },
    resetSettings() {
      this.settings = this.clone(this.original_settings);
    },
    handleModal() {
      this.show_modal = true;
    },
  },
};
</script>

<style lang="scss">
.input-tags {
  .ant-select-selection__rendered {
    height: 101px !important;
  }

  .ant-select-selection__placeholder {
    display: flex !important;
    height: 55px;
    justify-content: flex-end;
    flex-direction: column;
  }
}
</style>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  max-width: 1100px !important;
  margin: 0 auto;
  padding-top: 32px;
  padding-bottom: 24px;
}

.page-title {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}

.divider {
  height: 1px;
  width: 100%;
  background: #f0f0f0;
}

.item-icon {
  width: 50px;

  .item-icon-bg {
    text-align: center;
    background-color: #ebf1ff;
    width: 40px;
    height: 40px;

    .svg-inline--fa {
      font-size: 18px;
      color: #5b86e5;
      margin: 0 auto;
    }
  }
}

.info-item {
  margin-top: 24px;

  .info-item--title {
    font-weight: 500;
  }

  .info-item--body {
    margin-top: 8px;
  }
}

.select-icon-item {
  margin-right: 16px;
  width: 50px;
  height: 50px;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.active {
    border: 2px solid $primary-color;
  }
}

.btn-cancel {
  width: 150px;
  height: 32px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  background: white;
  outline: 0;
  cursor: pointer;
  color: #252627;
  font-weight: 500;
  user-select: none;
}

.btn-save {
  user-select: none;
  width: 150px;
  height: 32px;
  border-radius: 4px;
  outline: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
}

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

.visibility-pages {
  background: #f7f8fa;
  border-radius: 4px;
  min-height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-page-item {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  height: 26px;
  color: #4f4f4f;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  margin-right: 8px;
  white-space: nowrap;
  margin-top: 8px;

  .btn-remove {
    border-left: 1px solid #e2e2e2;
    cursor: pointer;
    margin-left: 8px;
    height: 100%;
    padding: 0 6px;
  }
}

.reply_comment_keyword {
  background-color: #fafafa;
  border-radius: 4px;
  width: 100%;
  padding: 15px;
  position: relative;
}

.keyword-suggestion {
  color: #5b86e5;
  cursor: pointer;

  .keyword-suggestion-link {
    border-bottom: 1px solid;
  }
}
</style>
