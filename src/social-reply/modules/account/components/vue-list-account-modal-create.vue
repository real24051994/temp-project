<template>
  <div class="vue-list-account-modal-create">
    <a-modal
      v-model="visible"
      :footer="false"
      :body-style="{ padding: 0 }"
      :destroy-on-close="true"
      :after-close="() => {}"
      :title="type === 'add-account' ? 'Add Social Account' : ''"
      width="500px"
    >
      <div class="modal-add-social-content">
        <div v-if="type === 'warning-add-account'" class="warning-container">
          <div class="warning-title">
            <span> Please connect your social account</span>
          </div>
          <div class="warning-content mt-3">
            <div>
              You have not connect to any Social Account yet
            </div>
            <div>
              Connect to any Socical Account to build your branding now
            </div>
          </div>
        </div>

        <transition name="fade-in" mode="out-in">
          <div
            v-if="modal.visible"
            key="is-loading"
            class="text-center p-t-50 p-b-50"
          >
            <a-spin>
              <a-icon
                slot="indicator"
                type="loading"
                style="font-size: 24px;"
                spin
              />
            </a-spin>
          </div>

          <div v-else key="is-loading-success">
            <transition name="fade-in">
              <div v-if="is_error_message" class="is-error-message">
                <div class="is-error-message-content">
                  <div class="is-error-message-icon">
                    <sh-icon :icon="['fas', 'exclamation-triangle']" />
                  </div>
                  <div
                    class="is-error-message-text"
                    v-html="is_error_message"
                  />
                </div>
              </div>
            </transition>

            <div v-if="modal.inserted.length" class="list-items-social">
              <vue-simple class="list-items-social-scroll">
                <div
                  v-for="(item, index) in modal.inserted"
                  :key="`index_${index}`"
                  class="item-row-social"
                >
                  <div class="item-row-social-info">
                    <div class="item-social-avatar">
                      <div
                        class="item-social-account d-flex align-items-center"
                      >
                        <social-avatar
                          :src="item.avatar"
                          :social_type="item.social_type"
                        />

                        <div class="item-social-account-title">
                          <div class="item-social-account-title-name">
                            {{ item.name }}
                          </div>
                          <div
                            class="item-social-account-title-status status-success"
                          >
                            <sh-icon :icon="['far', 'check']" class="m-r-5" />
                            Connected
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="item-row-social-type">
                    <template v-if="item.social_type == 'facebook'">
                      Facebook Page
                    </template>

                    <template v-else-if="item.social_type == 'twitter'">
                      Twitter
                    </template>
                  </div>
                </div>
              </vue-simple>
            </div>

            <div class="list-items-register p-t-24 p-b-24">
              <vue-add-social-account
                :data="data"
                @on-twitter-error="onTwitterError"
                @on-connect="onConnect"
              />
            </div>

            <div
              v-if="modal.inserted.length"
              class="text-center  p-b-24 p-l-30 p-r-30"
            >
              <a-button block type="primary" @click="visible = false">
                Finish
              </a-button>
            </div>
          </div>
        </transition>
      </div>
    </a-modal>
    <!-- <vue-add-social-account v-model="modal" @on-connect="onConnect" @on-twitter-error="onTwitterError" :data="data" /> -->
  </div>
</template>

<script>
import VueAddSocialAccount from "@reply/components/social/vue-add-social-account";

export default {
  name: "ModalCreateAccount",

  components: {
    VueAddSocialAccount,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {},
    type: {
      type: String,
      default: "add-account",
    },
  },

  data() {
    return {
      is_loading_facebook: false,
      is_loading_twitter: false,
      modal: {
        visible: false,
        url: "",
        social: "",
        data: [],
        inserted: [],
      },
      is_error_message: null,
    };
  },

  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  mounted() {
    this.modal.data = this.$clone(this.data);
  },

  beforeDestroy() {
    if (this.modal.inserted.length) {
      this.$emit("on-reload");
    }
  },

  methods: {
    onConnect(data) {
      this.modal.data = this.modal.data.concat(data);
      this.modal.inserted = this.modal.inserted.concat(data);
      if (this.type === "warning-add-account") {
        this.visible = false;
      }
    },

    onTwitterError(payload) {
      if (payload) {
        let { data, message } = payload;
        this.is_error_message = `
					<p>Can not connect with <strong>${data.name}</strong></p>
					<p>${message}</p>
				`;
      } else {
        this.is_error_message = null;
      }
    },
    async handleRegister(social) {
      this.is_error_message = null;
      if (this.is_loading_twitter || this.is_loading_facebook) return;
      this.modal.social = social;
      if (social == "facebook") {
        this.is_loading_facebook = true;
      } else if (social == "twitter") {
        this.is_loading_twitter = true;
      }

      try {
        const res = this.$api.generalLinkSocial({ social });

        const { status = false, data } = res;

        if (status) {
          this.modal.url = data;
          this.modal.visible = true;
        }
      } catch (error) {
        console.log("handleRegister -> error", error);
      } finally {
        this.is_loading_facebook = false;
        this.is_loading_twitter = false;
      }

      // this.generalLinkSocial({ social })
      //   .then((res) => {
      //     let { status = false, data } = res
      //     if (status) {
      //       this.modal.url = data
      //       this.modal.visible = true
      //     }
      //   })
      //   .catch((err) => {})
      //   .finally(() => {
      //     this.is_loading_facebook = false
      //     this.is_loading_twitter = false
      //   })
    },
  },
};
</script>
<style lang="scss" scoped>
.warning- {
  &container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 44px;
  }
  &title {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
  }
  &content {
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
}
.item-row-social {
  padding: 5px 24px;
  border-bottom: 1px solid $border-color;
  background-color: #fff;
  cursor: pointer;
  user-select: none;

  &.is-disabled {
    opacity: 0.5;
  }

  &:hover {
    &:not(.is-disabled) {
      background-color: #f3f3f3;
    }
  }

  &:first-child {
    // border-top: 1px solid $border-color;
  }

  &::after {
    display: table;
    content: "";
    clear: both;
  }

  &-info {
    float: left;
    width: 75%;

    &-checkbox {
      &::after {
        display: table;
        content: "";
        clear: both;
      }

      .item-social-checkbox {
        width: 34px;
        float: left;
        height: 41px;
        display: flex;
        align-items: center;
      }

      .item-social-avatar {
        width: calc(100% - 34px);
        float: left;
      }
    }

    .item-social-account-title {
      flex-wrap: wrap;
      padding-left: 12px;

      &-name {
        font-weight: 500;
        width: 100%;
      }

      &-status {
        width: 100%;
        font-size: 12px;

        &.status-success {
          color: $success;
        }

        &.status-error {
          color: $danger;
        }
      }
    }
  }

  &-type {
    float: left;
    width: 25%;
    line-height: 41px;
    font-size: 14px;
    text-align: right;
    text-transform: capitalize;
  }
}
</style>
<style lang="scss">
.modal-add-social-content {
  .is-error-message {
    color: $danger;
    padding: 16px 16px 0 16px;

    &-content {
      border: 1px solid $danger;
      border-radius: 4px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
    }

    &-icon {
      @include flex(30px);

      display: flex;
      align-items: center;
      font-size: 17px;
    }

    &-text {
      @include flex(calc(100% - 30px));
    }

    p {
      margin-bottom: 0;
    }
  }
}
</style>
