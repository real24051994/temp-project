<template>
  <div class="flex flex-col page-container" v-if="!is_loading">
    <div class="flex">
      <div class="w-50 flex flex-col p-r-40">
        <div class="flex items-center">
          <div class="page-title">
            Customer Chat Widget
          </div>

          <div class="p-l-16 flex items-center">
            <a-switch v-model="settings.enable" />
            <div class="m-l-8 font-medium">Enable</div>
          </div>
        </div>

        <!--  -->

        <div class="m-t-20">
          <span class="font-medium">Facebook page</span>

          <div class="w-50 m-t-8">
            <a-select
              class="w-100 select-fb-page"
              placeholder="Select your Facebook Page"
              v-model="settings.social_id"
            >
              <a-select-option
                :value="item.social_id"
                v-for="item in accounts"
                :key="item.social_id"
              >
                <div class="flex items-center p-t-4 p-b-4">
                  <img
                    :src="item.avatar"
                    alt=""
                    class="rounded-circle m-r-8"
                    width="32px"
                    height="32px"
                  />
                  <div>{{ item.name }}</div>
                </div>
              </a-select-option>
            </a-select>

            <div v-if="invalid_page_id" class="text-danger m-t-4 f-13">
              Please select Facebook page.
            </div>
          </div>
        </div>

        <!-- visibility  -->
        <div class="info-item">
          <div class="info-item--title">
            Visibility
          </div>

          <div class="info-item--body flex">
            <a-radio-group v-model="settings.visibility">
              <a-radio value="all">
                All Pages
              </a-radio>

              <a-radio value="exclude_pages">
                Exclude Pages
              </a-radio>

              <a-radio value="specific_pages">
                Specific Pages
              </a-radio>
            </a-radio-group>
          </div>

          <div
            class="visibility-pages m-t-16"
            v-if="settings.visibility !== 'all'"
          >
            <fa-button
              class="flex items-center"
              v-if="isEmpty(settings.pages)"
              @click="show_modal_page = true"
            >
              {{
                `+ Add ${
                  settings.visibility == "exclude_pages"
                    ? "Exclude"
                    : "Specific"
                } Pages`
              }}
            </fa-button>

            <div v-else class="flex flex-col w-100 p-b-16 p-t-16" sty>
              <div class="flex w-100 p-l-16 p-r-16">
                <div class="f-14">
                  {{
                    `${settings.pages.length} ${
                      settings.visibility == "exclude_pages"
                        ? "Excluded"
                        : "Specificed"
                    } Pages`
                  }}
                </div>
                <div class="flex-1"></div>
                <div><a @click="show_modal_page = true">Edit</a></div>
              </div>

              <div class="flex w-100 p-l-16 p-r-16" style="flex-wrap: wrap;">
                <div
                  class="selected-page-item"
                  v-for="item in settings.pages"
                  :key="item"
                >
                  <div>
                    {{ getPageName(item) }}
                  </div>

                  <div class="btn-remove center" @click="onRemovePage(item)">
                    <sh-icon :icon="['fas', 'times']" />
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <ModalChoosePages
              :show.sync="show_modal_page"
              :pages="pages"
              @change="onChangePages"
              :settings="settings"
            />
            <!--  -->
          </div>
        </div>
        <!--  -->

        <div class="info-item">
          <div class="info-item--title">
            Device Target
          </div>

          <div class="info-item--body flex">
            <a-radio-group v-model="settings.device_target">
              <a-radio value="desktop">
                Desktop
              </a-radio>

              <a-radio value="mobile">
                Mobile
              </a-radio>

              <a-radio value="all">
                Desktop & Mobile
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!--  -->

        <!--  -->
        <div class="divider m-t-24 m-b-24"></div>
        <div class="f-18 font-medium">
          Styles
        </div>

        <div class="info-item">
          <div class="info-item--title">
            Icon (first icon is default on mobile)
          </div>

          <div class="info-item--body flex">
            <div
              :class="`select-icon-item ${settings.icon == i ? 'active' : ''}`"
              v-for="i in [1, 2, 3, 4, 5, 6]"
              :key="i"
              @click="settings.icon = i"
            >
              <svg-icon2
                :key="`${i}-active`"
                fill="#5B86E5"
                v-if="settings.icon == i"
                :name="`chat-widget/chat-widget-icon-${i}`"
                class="text-primary"
                size="24px"
              />
              <svg-icon2
                v-else
                :key="`${i}`"
                :name="`chat-widget/chat-widget-icon-${i}`"
                size="24px"
              />
            </div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-item--title">
            Tab Size
          </div>

          <div class="info-item--body flex">
            <a-radio-group v-model="settings.icon_size">
              <a-radio value="small">
                Small
              </a-radio>

              <a-radio value="medium">
                Medium
              </a-radio>

              <a-radio value="large">
                Large
              </a-radio>
            </a-radio-group>
          </div>
        </div>

        <!--  -->
        <div class="info-item">
          <div class="info-item--title">
            Default State
          </div>

          <div class="info-item--body flex">
            <a-radio-group v-model="settings.default_state">
              <a-radio value="expanded">
                Expanded
              </a-radio>

              <a-radio value="collapse">
                Collapse
              </a-radio>
            </a-radio-group>
          </div>
        </div>

        <!--  -->
        <div class="info-item">
          <div class="info-item--title">
            Theme Color
          </div>

          <div class="info-item--body flex">
            <a-radio-group v-model="settings.theme_color">
              <a-radio value="default">
                Default
              </a-radio>

              <a-radio value="custom">
                Custom Color
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <!--  -->
        <div
          v-if="settings.theme_color == 'custom'"
          class="m-t-24 p-t-16 p-b-16 p-l-20 p-r-20"
          style="background-color: #f7f8fa; border-radius: 4px;"
        >
          <div class="info-item--title font-medium" style="color: #4f4f4f;">
            Theme color setting
          </div>

          <div class="flex flex-col">
            <div class="m-t-16 flex items-center">
              <VueColorPicker
                v-model="settings.custom_color.background_color"
                class="m-r-16"
              />
              Tab background color
            </div>

            <div class="m-t-16 flex items-center">
              <VueColorPicker
                v-model="settings.custom_color.icon_color"
                class="m-r-16"
              />
              Icon & text color
            </div>

            <div class="m-t-16 flex items-center">
              <VueColorPicker
                v-model="settings.custom_color.theme_color"
                class="m-r-16"
              />
              Theme Color
            </div>

            <div class="m-t-16 f-12 text-danger" v-if="is_invalid_color">
              Invalid theme color setting!
            </div>
          </div>
        </div>

        <!--  -->

        <div class="info-item">
          <div class="info-item--title">
            Widget Position
          </div>

          <div class="info-item--body flex">
            <slider
              :min="1"
              :max="100"
              :default-value="90"
              class="w-100"
              v-model="position_left"
            />
          </div>

          <div class="flex">
            <div class="flex-1">
              Chat Icon Position On Your Website (Left To Right):
            </div>
            <div>{{ `${settings.position_margin.horizontal}%` }}</div>
          </div>
        </div>

        <!--  -->

        <div class="info-item">
          <div class="info-item--title">
            Margin bottom (Px)
          </div>

          <div class="info-item--body flex">
            <slider
              :min="1"
              :max="200"
              :default-value="30"
              class="w-100"
              v-model="margin_bottom"
            />
          </div>

          <div class="flex">
            <div class="flex-1">
              Chat Icon Position On Your Website (Bottom To Top):
            </div>
            <div>{{ `${settings.position_margin.vertical}px` }}</div>
          </div>
        </div>

        <!--  -->
        <div class="divider m-t-24 m-b-24"></div>
        <!--  -->
        <div class="f-18 font-medium flex-1">
          Greeting Message
        </div>
        <!--  -->
        <div class="info-item m-t-16 items-center">
          <textarea
            rows="2"
            :class="`textarea-greeting w-100 ${len === 0 ? 'error' : ''}`"
            v-model="settings.greeting_message"
            placeholder="Enter your greeting message"
          />
        </div>

        <div class="flex">
          <div v-if="is_invalid_message" class="f-12 text-danger font-medium">
            Please leave your greeting message
          </div>

          <div class="flex flex-1 content-end f-12" style="color: #828282;">
            {{ len }}/80 Characters
          </div>
        </div>
        <!--  -->
        <div class="flex content-end m-t-24">
          <fa-button
            class="btn-cancel m-r-8"
            :disabled="is_submiting"
            @click="onCancel"
            >Cancel</fa-button
          >

          <fa-button
            type="primary"
            class="btn-save flex items-center content-center"
            :disabled="disabled_save"
            @click="onSave"
          >
            <a-icon
              v-if="is_submiting"
              type="loading"
              style="font-size: 14px; color: white;"
              spin
              class="m-r-16"
            />
            <template v-if="is_submiting">
              Updating
            </template>

            <template v-else>
              Save
            </template>
          </fa-button>
        </div>
        <!--  -->
      </div>

      <div class="w-50">
        <preview :settings="settings" :selected_account="selected_account" />
      </div>
    </div>

    <ModalReconnect
      :show.sync="show_modal_reconnect"
      :social_id="settings.social_id"
      :account_name="selected_account_name"
    />
  </div>
</template>

<script>
import preview from "../components/preview";
import ModalChoosePages from "../components/modal-choose-pages";
import ModalReconnect from "../components/modal-reconnect";

import { mapGetters, mapActions } from "vuex";
import VueColorPicker from "@reply/components/utils/vue-color-picker";
import Slider from "ant-design-vue/lib/slider";

export default {
  name: "ChatWidget",

  components: {
    preview,
    VueColorPicker,
    Slider,
    ModalChoosePages,
    ModalReconnect,
  },

  metaInfo: {
    title: "Customer Chat Widget",
  },

  data() {
    return {
      original_settings: {},
      settings: {
        social_id: undefined,
        enable: false,
        icon: undefined,
        icon_size: undefined,
        icon_text: "",
        visibility: undefined,
        pages: [],
        device_target: undefined,
        position: undefined,
        position_margin: {
          horizontal: "",
          vertical: "",
        },
        theme_color: "default",
        custom_color: {
          background_color: "#ffffff",
          icon_color: "#0078FF",
          theme_color: "#0078FF",
        },
        default_state: undefined,
        greeting_message: "",
      },

      is_loading: false,
      is_submiting: false,
      invalid_page_id: false,

      pages: [],

      show_modal_page: false,

      reconnect_account_info: {},
      show_modal_reconnect: false,
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
    }),

    selected_account_name() {
      let account = this.accounts.find(
        (item) => item.social_id === this.settings.social_id
      );
      return account ? account.name : "Select your Facebook Page";
    },

    selected_account() {
      let account = this.accounts.find(
        (item) => item.social_id === this.settings.social_id
      );
      return account || {};
    },

    disabled_save() {
      return (
        this.is_submiting || this.is_invalid_color || this.is_invalid_message
      );
    },

    len() {
      return this.settings.greeting_message
        ? this.settings.greeting_message.length
        : 0;
    },

    is_invalid_color() {
      const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
      return (
        !regex.test(this.settings.custom_color.background_color) ||
        !regex.test(this.settings.custom_color.icon_color) ||
        !regex.test(this.settings.custom_color.theme_color)
      );
    },

    is_invalid_message() {
      if (
        this.settings.greeting_message &&
        this.settings.greeting_message.trim().length > 0
      ) {
        return false;
      }
      return true;
    },

    margin_bottom: {
      get() {
        return this.settings.position_margin.vertical
          ? parseInt(this.settings.position_margin.vertical)
          : 0;
      },

      set(val) {
        this.settings.position_margin.vertical = val;
      },
    },

    position_left: {
      get() {
        return this.settings.position_margin.horizontal
          ? parseInt(this.settings.position_margin.horizontal)
          : 0;
      },

      set(val) {
        this.settings.position_margin.horizontal = val;
      },
    },
  },

  watch: {
    "settings.social_id"() {
      this.invalid_page_id = false;
    },

    "settings.theme_color"(val) {
      if (val === "default") {
        this.settings.custom_color = {
          background_color: "#ffffff",
          icon_color: "#0078FF",
          theme_color: "#0078FF",
        };
      }
    },

    "settings.visibility"(val, oldVal) {
      if (oldVal != undefined) {
        this.settings.pages = [];

        if (val == this.original_settings.visibility) {
          this.settings.pages = this.clone(this.original_settings.pages);
        }
      }
    },

    len(val) {
      if (val >= 80) {
        this.settings.greeting_message = this.settings.greeting_message.slice(
          0,
          80
        );
      }
    },
  },

  created() {
    this.fetchPages();
    this.fetchAccounts();
    this.fetchInfo();
  },

  methods: {
    ...mapActions({
      fetchAccounts: "Account/fetchAccounts",
    }),

    async fetchInfo() {
      this.is_loading = true;
      try {
        let { data } = await this.$api.SETTINGS.fetchChatWidgetSetting();

        this.original_settings = this.clone(data);
        this.settings = Object.assign(this.settings, this.clone(data));

        if (this.settings.social_id === null) {
          this.settings.social_id = undefined;
        }

        if (!this.settings.visibility) {
          this.settings.visibility = "all";
        }

        if (!this.settings.device_target) {
          this.settings.device_target = "desktop";
        }
      } catch (error) {
      } finally {
        this.is_loading = false;
      }
    },

    async fetchPages() {
      try {
        const { data } = await this.$api.SHOPIFY.fetchPages();
        if (data) {
          this.pages = data;
        }
      } catch (error) {}
    },

    getPageName(page_id) {
      const item = this.pages.find((item) => item.page_id == page_id);
      if (item) {
        return item.name;
      }
      return false;
    },

    async onSave() {
      if (this.is_submiting) {
        return;
      }

      this.invalid_page_id = false;

      if (!this.settings.social_id) {
        this.invalid_page_id = true;

        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (
        this.settings.visibility != "all" &&
        this.isEmpty(this.settings.pages)
      ) {
        this.toastError({
          title: "Error !",
          message: "Please select at least one page.",
        });
        return;
      }

      this.is_submiting = true;
      try {
        let { data } = await this.$api.SETTINGS.updateChatWidgetSetting(
          this.settings
        );

        this.original_settings = this.clone(data);

        this.toastSuccess({
          title: "Done !",
          message: "Saved settings successfully",
        });
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.code === 190
        ) {
          this.show_modal_reconnect = true;
          return;
        }

        let msg = "Something went wrong !";

        if (
          this.oGet(error, ["response", "data", "message"]) ===
          "(#613) Calls to this api have exceeded the rate limit."
        ) {
          msg =
            `[${error.response.data.code}] ` +
            "(#613) You have updated the widget setting too many times. Please wait a few mins then try again.";
        } else if (this.oGet(error, ["response", "data", "message"])) {
          msg =
            `[${error.response.data.code}] ` +
            this.oGet(error, ["response", "data", "message"]);
        }

        this.toastError({
          title: "Error !",
          message: msg,
        });
      } finally {
        this.is_submiting = false;
      }
    },

    onCancel() {
      this.settings = Object.assign(this.settings, this.original_settings);
    },

    onChangePages(pages) {
      this.settings.pages = this.clone(pages);
    },

    onRemovePage(page_id) {
      this.settings.pages = this.settings.pages.filter(
        (item) => item != page_id
      );
    },
  },
};
</script>

<style lang="scss">
.select-fb-page {
  > .ant-select-selection--single {
    height: 42px !important;
  }
}
.ant-select-selection__rendered {
  height: 42px !important;
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
</style>
