<template>
  <div class="app-auth-layout">
    <div class="app-auth-layout-sidebar">
      <div class="app-auth-layout-sidebar-content">
        <div class="app-auth-layout-sidebar-logo">
          <svg-icon2 name="auth/logo-white" />
        </div>

        <div class="app-auth-layout-sidebar-slider">
          <carousel
            :autoplay="true"
            :autoplay-timeout="3000"
            :loop="true"
            :autoplay-hover-pause="true"
            :per-page="1"
          >
            <slide>
              <div class="item-slide">
                <div class="item-slide-img">
                  <svg-icon2 name="auth/banner" />
                </div>
                <div class="item-slide-title my-4" style="line-height: 28px;">
                  The Ultimate client engagement and management tool
                </div>
                <div class="item-slide-description">
                  Integrate multiple accounts into one app. Manage and engage
                  with your customers easier and faster than ever with
                  Socialreply
                </div>
              </div>
            </slide>
          </carousel>
        </div>
      </div>
    </div>

    <div class="app-auth-layout-content">
      <div v-if="user" class="app-auth-layout-content-user">
        <a-dropdown :trigger="['click']" class="dropdown-user">
          <a-button class="btn-trigger">
            <span class="btn-text">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </span>
            <span class="btn-avatar">
              {{ user.name | shop_avatar }}
            </span>
          </a-button>

          <a-menu slot="overlay" class="app-auth-layout-content-user-menu">
            <a-menu-item id="btn-logout" key="3" @click="handleLogout">
              <sh-icon :icon="['far', 'sign-out-alt']" />
              <span>Logout</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>

      <div class="app-auth-layout-content-body">
        <transition name="fade-in" mode="out-in">
          <router-view />
        </transition>
      </div>

      <div class="app-auth-layout-content-footer">
        <a target="_blank" href="https://socialhead.io/term-of-use/">{{
          $t("auth.link.term")
        }}</a>
        <a target="_blank" href="https://socialhead.io/privacy-policy/">{{
          $t("auth.link.policy")
        }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Auth",

  components: {
    Carousel,
    Slide,
  },

  metaInfo: {
    titleTemplate: "%s - Social Reply",
  },

  computed: {
    ...mapGetters({
      user: "auth/getShop",
    }),
  },

  methods: {
    ...mapActions({
      logout: "auth/logout",
    }),

    handleLogout() {
      this.logout();
    },
  },
};
</script>

<style lang="scss">
.app-auth-layout {
  width: 100%;
  background-color: #fff;

  &-sidebar {
    min-width: 480px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 33.33%;
    background: #5b86e5;
    overflow: hidden;
    z-index: 999;
    background-image: url("../assets/svg-icon/login-banner.svg");
    background-repeat: no-repeat;
    background-size: cover;
    &-logo {
      display: flex;
      position: absolute;
    }
    &-bg {
      position: absolute;
      z-index: 1;
      user-select: none;
      pointer-events: none;

      img {
        width: 100%;
        height: auto;
      }

      &.bg {
        &-top-left {
          width: 40%;
          top: 0;
          left: 0;
        }

        &-top-right {
          width: 40%;
          top: 0;
          right: 0;
        }

        &-bottom-left {
          width: 70%;
          bottom: 0;
          left: 0;
        }
      }
    }

    &-content {
      position: relative;
      z-index: 2;
      height: 100%;
      width: 100%;
      padding: 72px;
      overflow: hidden auto;
    }

    &-slider {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .item-slide {
        color: #fff;
        text-align: center;

        &-img {
          margin-bottom: 22px;

          img {
            max-width: 100%;
            height: auto;
          }
        }

        &-title {
          font-weight: 500;
          font-size: 24px;
          margin-bottom: 22px;
        }

        &-description {
          font-weight: normal;
          font-size: 14px;
          line-height: 17px;
        }
      }

      .VueCarousel-pagination {
        .VueCarousel-dot-container {
          .VueCarousel-dot {
            opacity: 0.3;
            border: none;
            width: 8px !important;
            height: 8px !important;
            padding: 0 !important;
            background: #fff !important;
            box-sizing: border-box;
            margin: 20px 10px 0 10px;

            &:focus {
              outline: none;
            }

            &.VueCarousel-dot--active {
              background: #fff !important;
              opacity: 1;
            }
          }
        }
      }
    }
  }

  &-content {
    padding-left: 33.33%;
    padding-bottom: 60px;
    min-height: 100vh;
    display: flex;
    align-items: center;

    &-user {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 999;
      display: inline-block;
      background: #fff;
      color: #252627;
      font-size: 14px;

      &-menu {
        li {
          font-size: 14px;
          display: flex;
          align-items: center;
          min-height: 36px;

          * {
            pointer-events: none;
          }

          i {
            font-size: 16px;
          }

          span {
            margin-left: 10px;
          }
        }
      }

      .btn {
        &-trigger {
          border: none;
          color: $text;
          height: 72px;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow: none;

          &.ant-dropdown-open,
          &:hover {
            background: #e6f7ff;
          }
        }

        &-avatar {
          width: 32px;
          height: 32px;
          margin: 0 10px;
          border: 2px solid $primary-color;
          border-radius: 50%;
          overflow: hidden;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;

          img {
            width: 100%;
          }
        }

        &-text {
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 24px;
          text-align: right;

          .user {
            &-name {
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 19px;
              letter-spacing: 0.035em;
              color: #252627;
              max-width: 160px;
              overflow: hidden;
              white-space: nowrap;
              display: block;
              text-overflow: ellipsis;
            }

            &-email {
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 19px;
              letter-spacing: 0.035em;
              color: #8c8c8c;
              max-width: 160px;
              overflow: hidden;
              white-space: nowrap;
              display: block;
              text-overflow: ellipsis;
            }
          }
        }

        &-icon {
          font-size: 16px;
          line-height: 16px;
          color: #252627;
        }
      }
    }

    &-body {
      width: 100%;
    }

    &-footer {
      left: 33.33%;
      bottom: 0;
      right: 0;
      height: 60px;
      position: fixed;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;

      a {
        display: inline-block;
        color: $text;
        margin: 0 13px;
        font-size: 12px;

        &:hover {
          color: $primary-color;
        }
      }
    }
  }

  .page {
    &-title {
      font-weight: 500;
      font-size: 22px;
      line-height: 26px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.125em;
    }

    &-description {
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>
