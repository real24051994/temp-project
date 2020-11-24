<template>
  <div>
    <a-modal class="modal-create-feed-template" centered width="451px" :visible="visible" :footer="false" @cancel="closeModal()">
      <div class="txt-create-feed">Create feed template</div>
      <div>Please choose a channel to create your product feed.</div>
      <div id="select-social-platform" class="modal-content">
        <open-popup
          class="btn-connect-facebook-fbe w-100 m-b-20 m-t-20"
          @on-pusher="onPusher"
          :social_type="typeFacebookFbe"
          :loading_login.sync="spinningFbFbe"
        >
          <template v-if="spinningFbFbe" slot="button">
            <div class="btn-login-social btn-facebook justify-content-center">
              <a-spin size="large" :spinning="spinningFbFbe">
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </div>
          </template>
          <template v-else slot="popup">
            <div class="btn-connect-facebook-fbe btn-login-social btn-facebook">
              <div class="d-flex align-items-center">
                <div class="social-icon-fbe m-r-18">
                  <img src="@shop/assets/images/facebook_biz.svg" class alt />
                </div>
                <div class="d-flex flex-column">
                  <div>2in1 step for</div>
                  <strong>Facebook Catalog and Shops</strong>
                </div>
              </div>
              <sh-icon style="font-size: 16px" :icon="['far', 'angle-right']" />
            </div> </template
        ></open-popup>
        <open-popup class="w-100" @on-pusher="onPusher" :social_type="typeFacebook" :loading_login.sync="spinningFb">
          <template v-if="spinningFb" slot="button">
            <div class="btn-login-social btn-facebook justify-content-center">
              <a-spin size="large" :spinning="spinningFb">
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </div>
          </template>
          <template v-else slot="popup">
            <div class="btn-login-social btn-facebook">
              <div class="d-flex align-items-center">
                <div class="social-icon-facebook">
                  <sh-icon style="font-size: 17px" :icon="['fab', 'facebook-f']" />
                </div>
                <div class="d-flex flex-column">
                  <div>Connect with</div>
                  <strong>Facebook Catalog</strong>
                </div>
              </div>
              <sh-icon style="font-size: 16px" :icon="['far', 'angle-right']" />
            </div> </template
        ></open-popup>
        <open-popup class="w-100 m-b-20 m-t-20" @on-pusher="onPusher" :social_type="typeGoogle" :loading_login.sync="spinningGg">
          <template v-if="spinningGg" slot="button">
            <div class="btn-login-social btn-google justify-content-center">
              <a-spin size="large" :spinning="spinningGg">
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </div>
          </template>
          <template v-else slot="popup">
            <div class="btn-login-social btn-google">
              <div class="d-flex align-items-center">
                <div class="social-icon-google">
                  <img src="@shop/assets/images/google-icon-google.png" class alt />
                </div>
                <div class="d-flex flex-column">
                  <div>Connect with</div>
                  <strong>Google Merchant</strong>
                </div>
              </div>
              <sh-icon style="font-size: 16px" :icon="['far', 'angle-right']" />
            </div> </template
        ></open-popup>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    list_templates: {
      type: Array,
      default: () => [],
      required: false,
    },

    change_account: {
      type: Number,
      default: 0,
      required: false,
    },
  },

  data() {
    return {
      tooltip: {
        contentAsHTML: true,
        side: 'bottom',
        maxWidth: 400,
      },
      typeFacebook: 'facebook',
      typeGoogle: 'google',
      typeFacebookFbe: 'facebook_fbe',
      spinningGg: false,
      spinningFb: false,
      spinningFbFbe: false,
    }
  },

  created() {
    if (this.change_account > 0 && this.getSocialType !== '') {
      this.openLoginPopup(this.getSocialType)
    }
  },

  computed: {
    ...mapGetters({
      shop: 'auth/getShop',
      getSocialType: 'feed/getSocialType',
    }),

    disabledGoogle() {
      if (this.list_templates && this.list_templates.findIndex((item) => item.social_type === 'google') > -1) {
        return true
      }
      return false
    },

    disabledFacebook() {
      if (this.list_templates && this.list_templates.findIndex((item) => item.social_type === 'facebook') > -1) {
        return true
      }
      return false
    },
  },

  methods: {
    ...mapActions({
      connectSocial: 'auth/connectSocial',
    }),

    onPusher(res) {
      let { data, status, message } = res
      if (status) {
        if (data) {
          this.$emit('success', data)
          this.closeModal()
        }
      } else {
        this.toastError({
          title: 'Error',
          message,
        })
        this.closeModal()
      }
    },

    closeModal() {
      this.$emit('close')
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style lang="scss">
.modal-create-feed-template {
  .ant-modal-title {
    font-size: 20px;
    color: #252627;
  }

  .ant-modal-header {
    display: flex;
    align-items: center;
    background: #f3f3f3;
    height: 64px;
    border-bottom: unset !important;
  }
}
</style>

<style lang="scss" scoped>
.modal-create-feed-template {
  .txt-create-feed {
    color: $text;
    font-weight: 600;
    font-size: 20px;
  }
  .modal-content {
    padding: 8px 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .btn-login-social {
    display: flex;
    align-items: center;
    flex-grow: 1;
    height: 72px;
    border-radius: 4px;
    padding: 24px;
    cursor: pointer;
    font-size: 14px;
    width: 355px;
    justify-content: space-between;

    .social-icon-google {
      padding-right: 18px;
      line-height: 1;

      img {
        height: 28px;
        width: 28px;
      }

      i {
        font-size: 26px;
      }
    }

    .social-icon-facebook {
      background-color: #4080ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 18px;
    }

    &.disabled {
      cursor: unset;
    }

    &.btn-google {
      color: #4f4f4f;
      background: $white;
      border-radius: 8px;
      box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
    }

    &.btn-facebook {
      background: #4267b2;
      color: #4f4f4f;
      background: $white;
      border-radius: 8px;
      box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
<style lang="scss">
.modal-create-feed-template {
  .ant-modal-body {
    padding: 50px 48px 15px 48px;
  }
  .ant-modal-content {
    background-color: $base-color1;
  }
}
</style>
