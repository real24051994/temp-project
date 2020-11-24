<template>
  <div class="launching-page">
    <div class="section-content-review d-flex">
      <div class="d-flex box-left">
        <div class="m-r-10">
          <img src="@head/assets/icons/logo-socialhead.svg" />
        </div>
        <div class="d-flex flex-column grow-sales">
          <div class="txt-marketing">Grow sales on Social Media Easier and Faster</div>
          <div class="txt-description">
            Everything you need to sell more on social - Simplified. Automated. Integrated with Facebook, Google, Instagram and more...
          </div>
          <div class="evaluation d-flex align-items-center">
            <div class="m-r-10">
              <img alt height="22px" src="@head/assets/icons/five-star.png" />
            </div>
            <div>
              <span style="font-weight: 500">500+</span> reviews 5 stars on
              <img alt src="@head/assets/icons/shopify-logo.svg" />
            </div>
          </div>
        </div>
      </div>
      <div class="m-t-30">
        <img src="@head/assets/icons/main-dashboard.svg" />
      </div>
    </div>
    <div class="introduce-apps d-flex">
      <div class="scene" v-for="(item, index) in apps" :key="`item_${index}`" :class="{ 'is-active': is_loading == item.app_id }">
        <div class="card">
          <div class="card__face card__face--front">
            <img :src="item.frontContent.logo" alt />
            <div class="title-apps m-t-10">{{ item.frontContent.title }}</div>
            <div class="d-flex">
              <div class="benefit-apps">
                <p v-for="(text, text_index) in item.frontContent.text" :key="`text_item_index_${text_index}`">
                  <i class="m-r-8"><sh-icon :icon="['far', 'check']"/></i>
                  {{ text }}
                </p>
              </div>
            </div>
          </div>
          <div class="card__face card__face--back">
            <img :src="item.backContent.logo" alt />
            <div class="benefit-apps m-t-20">{{ item.backContent.text }}</div>
            <a-button
              v-if="install_apps[item.app_id]"
              @click="getApp(item)"
              size="large"
              block
              type="primary"
              class="get-app-btn m-t-20 d-flex justify-content-center align-items-center"
            >
              <span>
                Login
              </span>
              <i class="m-l-10">
                <sh-icon :icon="['far', 'long-arrow-alt-right']" />
              </i>
            </a-button>
            <a
              v-else
              target="_blank"
              href="https://apps.shopify.com/"
              class="install-app-btn ant-btn ant-btn-primary m-t-20 d-flex ant-btn-lg justify-content-center align-items-center"
            >
              <i class="m-r-10">
                <sh-icon :icon="['sh', 'shopify']" />
              </i>
              <span>Get Free App</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      wrapClassName="custom-form-dashboard"
      :title="false"
      v-model="visible"
      :footer="false"
      width="900px"
      :closable="allowed_close_modal"
      :maskClosable="allowed_close_modal"
    >
      <div class="modal-login">
        <div class="row">
          <div class="col col-5">
            <img class="m-t-30" :src="getLogo(form.app_id)" alt="" />
            <div class="modal-login-wrap">
              <h1 class="title-welcome m-t-20">Welcome to {{ nameApps(form.app_id) }}</h1>
              <div class="d-flex align-items-center m-b-20">
                <img class="m-r-10" alt height="22px" src="@head/assets/icons/five-star.png" />
                <div style="font-size: 11px;">
                  <span style="font-weight: 500;">500+ </span><span style="color: #4F4F4F">&nbsp;reviews 5 stars on Shopify</span>
                </div>
              </div>
              <form class="modal-login-form" @submit.stop.prevent="onSubmit()" novalidate>
                <div class="ant-form-item-control m-t-8" :class="{ 'has-error': formstate && $v.form.shop.$invalid }">
                  <div class="ant-form-item-wrap">
                    <input
                      class="ant-input"
                      name="shopname"
                      autocomplete="on"
                      placeholder="Your store name"
                      v-model="form.shop"
                      :disabled="is_loading"
                      type="text"
                    />
                    <span class="ant-form-item-wrap-subfix">.myshopify.com</span>
                  </div>
                </div>
                <transition name="fade-in" mode="out-in">
                  <div class="text-danger m-t-4">
                    <span v-if="formstate && !$v.form.shop.required">
                      Store name is required.
                    </span>
                    <span v-else-if="formstate && !$v.form.shop.valid">
                      Store name is invalid.
                    </span>
                  </div>
                </transition>
                <a-button class="m-b-16 m-t-16" type="primary" block html-type="submit" :loading="is_loading != false">
                  Login
                </a-button>
              </form>
            </div>
            <div class="m-t-20">
              Don’t have <img width="15" alt src="@head/assets/icons/icon-shopify.svg" /><span style="font-weight: 500"> Shopify account?</span>
              <a target="_blank" href="https://www.shopify.com/free-trial?ref=socialhead"> Create Account</a>
            </div>
          </div>
          <div class="col col-7 box-right-form">
            <img style="width: 100%" :src="getIntroduceApps(form.app_id)" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'Dashboard',
  metaInfo: {
    title: 'Home',
  },
  data() {
    return {
      is_loading: false,
      visible: false,
      formstate: false,
      form: {
        app_id: '',
        shop: '',
      },
      apps: [
        {
          app_id: 'social_publish',
          link: '/socialpublish',
          frontContent: {
            text: [
              'Promote your latest products',
              'Save 90% time of social post',
              'Get your audience insight',
              'Stand out from your competition',
              'Free Post Templates',
            ],
            title: 'All-in-1 social media management app',
            logo: require('@head/assets/icons/logo-socialpublish.svg'),
          },
          backContent: {
            text: 'Schedule, publish and post automatically on multiple social accounts. Integrate with Facebook, Twitter, Instagram and more',
            logo: require('@head/assets/icons/logo-socialpublish-back.svg'),
          },
        },
        {
          app_id: 'social_shop',
          link: '/socialshop',
          frontContent: {
            text: ['Sync products across platforms', 'Increase conversion rates', 'Save 90% time and effort', 'Bulk edit data fields', 'Real-time update'],
            logo: require('@head/assets/icons/logo-socialshop.svg'),
            title: 'Multiple platform product feed manager',
          },
          backContent: {
            text: 'List, sync and optimize your product feed to Google Merchant Center and Facebook Catalog in 1 click',
            logo: require('@head/assets/icons/logo-socialshop-back.svg'),
          },
        },
        {
          app_id: 'social_widget',
          link: '/socialwidget',
          frontContent: {
            text: ['Engagement from the first sight', 'Effortless usage', 'Highly customized', 'Fully responsive on all devices'],
            logo: require('@head/assets/icons/logo-socialwidget.svg'),
            title: 'Social media widget for e-commerce',
          },
          backContent: {
            text: 'Embed social media·to your store for authentic engagement. Set-it-forget-it tool to display Instagram grid on your website',
            logo: require('@head/assets/icons/logo-socialwidget-back.svg'),
          },
        },
        {
          app_id: 'social_reply',
          link: '/socialreply',
          frontContent: {
            text: ['Place Order in Chat', 'Expand customers list', 'Send product information', 'Integrate with multiple accounts and pages'],
            title: 'Messenger Marketing Made Simple',
            logo: require('@head/assets/icons/logo-socialreply.svg'),
          },
          backContent: {
            text: 'Reply and chat with customers across multiple social media accounts in one place',
            logo: require('@head/assets/icons/logo-socialreply-back.svg'),
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      install_apps: 'auth/getInstallApps',
      shop: 'auth/getShop',
    }),
    allowed_close_modal() {
      return this.is_loading == false
    },
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
    }),
    getApp(item) {
      if (this.install_apps.hasOwnProperty(item.app_id) && this.install_apps[item.app_id]) {
        window.location.href = item.link
      } else {
        if (this.shop) {
          this.handleLoginApp({
            app: item.app_id,
            shop: this.shop.raw_domain.replace(/.myshopify.com/gi, ''),
          })
        } else {
          this.form.app_id = item.app_id
          this.form.shop = ''
          this.formstate = false
          this.visible = true
        }
      }
    },
    onSubmit() {
      this.formstate = true
      if (!this.is_loading && !this.$v.form.$invalid) {
        var shop = this.form.shop.replace(/.myshopify.com/gi, '')
        var app = this.form.app_id
        this.handleLoginApp({
          app,
          shop,
        })
      }
    },
    handleLoginApp({ app, shop }) {
      if (this.is_loading) return
      this.is_loading = app
      this.login({ app, shop })
        .then((res) => {
          let { status, data } = res.data
          if (status && data) {
            window.location.href = data
          }
          this.is_loading = false
        })
        .catch((err) => {
          this.is_loading = false
        })
    },
    getLogo(apps) {
      if (apps == 'social_shop') {
        return require('@head/assets/icons/shop-form.svg')
      } else if (apps == 'social_publish') {
        return require('@head/assets/icons/publish-form.svg')
      } else if (apps == 'social_reply') {
        return require('@head/assets/icons/reply-form.svg')
      } else if (apps == 'social_widget') {
        return require('@head/assets/icons/widget-form.svg')
      }
    },
    nameApps(apps) {
      if (apps == 'social_shop') {
        return 'Socialshop'
      } else if (apps == 'social_publish') {
        return 'Socialpublish'
      } else if (apps == 'social_reply') {
        return 'Socialreply'
      } else if (apps == 'social_widget') {
        return 'Socialwidget'
      }
    },
    getIntroduceApps(apps) {
      if (apps == 'social_shop') {
        return require('@head/assets/icons/introduce-shop.png')
      } else if (apps == 'social_publish') {
        return require('@head/assets/icons/introduce-publish.png')
      } else if (apps == 'social_reply') {
        return require('@head/assets/icons/introduce-reply.png')
      } else if (apps == 'social_widget') {
        return require('@head/assets/icons/introduce-widget.png')
      }
    },
  },
  validations: () => ({
    form: {
      shop: {
        required,
        valid: function(value) {
          var temp = value.replace(/.myshopify.com/gi, '')
          const regex = /[!@#$%^&*(),.?":{}|<>`']/gi
          return !regex.test(temp)
        },
      },
    },
  }),
}
</script>
<style lang="scss">
.launching-page {
  .card {
    hr {
      border: none;
      border-top: 1px dashed #adbbd3;
      color: #fff;
      background-color: #fff;
      height: 1px;
    }
  }

  .get-app-btn {
    border-radius: 90px;
    color: $white;
    i {
      font-size: 16px;
    }
  }
  .install-app-btn {
    color: $white;
    border-radius: 90px;
  }
}
.modal-login {
  &-wrap {
  }
  &-form {
    display: block;
    width: 100%;
    label {
      font-weight: 600;
      margin-bottom: 8px;
    }
    .ant-form-item-wrap {
      position: relative;
      display: block;
      font-size: 14px;
      .ant-input {
        padding: 6px 110px 6px 11px;
        height: 40px;
      }
      &-subfix {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0.5;
        user-select: none;
        pointer-events: none;
        padding-right: 11px;
      }
    }
    .ant-btn {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
<style lang="scss" scoped>
.launching-page {
  .section-content-review {
    background-image: url('~@head/assets/icons/bg-launching.png');
    height: 404px;
    padding: 0 60px;
    justify-content: center;
    .box-left {
      width: 50%;
      margin-top: 60px;
      margin-right: 50px;
      .grow-sales {
        margin-top: -10px;
      }
      .txt-marketing {
        font-weight: bold;
        font-size: 32px;
      }
      .txt-description {
        color: #4f4f4f;
        margin-bottom: 10px;
      }
    }
  }
  .introduce-apps {
    left: 32px;
    margin-bottom: 28px;
    justify-content: center;
    margin-top: -37px;
    .scene {
      width: 300px;
      margin: 0 15px;
      &:hover {
        .card {
          transform: rotateY(180deg);
        }
      }
      &.is-active {
        .card {
          transform: rotateY(180deg);
        }
      }
      .card {
        min-height: 395px;
        transition: transform 1s;
        transform-style: preserve-3d;
        cursor: pointer;
        position: relative;

        .card__face {
          position: absolute;
          width: 100%;
          height: 100%;
          font-weight: bold;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          padding: 35px 23px;
          &.card__face--front {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.35) 100%), #ebf1ff;
            box-shadow: 0px 5px 10px rgba(61, 90, 153, 0.1);
            border-radius: 6px;
            .title-apps {
              color: $text;
              font-size: 18px;
              margin-bottom: 20px;
            }
            .benefit-apps {
              color: $app-sidebar-text-color;
              font-weight: normal;
              p {
                padding-bottom: 10;
                margin-bottom: 10px;
                i {
                  color: $success-color;
                }
              }
            }
          }
          &.card__face--back {
            transform: rotateY(180deg);
            background: $white;
            box-shadow: 0px 8px 16px rgba(61, 90, 153, 0.15);
            border-radius: 6px;
            text-align: center;
            .benefit-apps {
              color: $app-sidebar-text-color;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.custom-form-dashboard {
  .ant-modal-body {
    background-image: url('~@head/assets/icons/bg_popup.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: #f7faff;
    padding: 90px 48px 119px 48px;
    .modal-login {
      .box-right-form {
        margin-top: 90px;
      }
      .title-welcome {
        color: $primary-color-hover;
        font-size: 26px;
        font-weight: bold;
      }
    }
  }
}
</style>
