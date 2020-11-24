<template>
  <div class="app-auth-layout">
    <div class="bulk-info-user">
      <div class="app-toolbar-user" v-if="user">
        <a-dropdown :trigger="['click']" class="dropdown-user">
          <a-button class="btn-trigger">
            <span class="btn-text">
              <span class="user-name">Hi, {{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </span>
            <span class="btn-avatar">{{ user.name | shop_avatar }}</span>
          </a-button>
          <a-menu slot="overlay" class="app-toolbar-user-menu">
            <a-menu-item key="3" @click="handleLogout" id="btn-logout">
              <sh-icon :icon="['far', 'sign-out-alt']" />
              <span class="m-l-10">Logout</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <transition name="fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'upgrade',
  props: {
    appName: {
      type: String,
      default: 'shop',
    },
  },
  metaInfo: {
    titleTemplate: '%s - Socialshop',
  },
  computed: {
    ...mapGetters({
      user: 'auth/getShop',
      infoUser: 'auth/getUser',
      chat_box_token: 'auth/getChatBoxToken',
      chat_box_data: 'auth/getChatBoxData',
    }),
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      dataLayer: 'auth/dataLayer',
    }),
    handleLogout() {
      this.logout()
    },
  },
  created() {
    if (this.infoUser) {
      if (this.chat_box_data) {
        this.$crisp.init({
          token: this.chat_box_token,
          data: this.chat_box_data,
        })
      }
    }
    this.dataLayer({
      userId: this.infoUser.id,
    })
  },
}
</script>
<style lang="scss" scoped>
.app-auth-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  .bulk-info-user {
    position: absolute;
    right: 85px;
    top: 10px;
    color: $white;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
    .app-toolbar {
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      z-index: 0;
      overflow: hidden;
      padding: 0;
      &-dropdown {
        position: relative;
        z-index: 0;
        &:before {
          content: '';
          right: 0px;
          top: 0;
          bottom: 0;
          width: 1px;
          // background: $app-auth-bg;
          position: absolute;
          z-index: 1;
        }
        .dropdown-social {
          width: 240px;
          overflow: hidden;
        }
        .btn {
          &-trigger {
            border: none;
            display: flex;
            height: 72px;
            align-items: center;
            &:active {
              border: #fff !important;
            }
          }
          &-text {
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
          }
          &-icon {
            margin-left: 20px;
            font-size: 20px;
            line-height: 20px;
          }
        }
      }
      &-user {
        .dropdown-social {
          border-right: 1px solid $border-color;
          overflow: hidden;
        }
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
            box-shadow: none;
            border: none;
            color: $text;
            height: 72px;
            display: flex;
            align-items: center;
            // background-color: $app-auth-bg;
            overflow: hidden;
            // &.ant-dropdown-open,
            // &:hover {
            //   background: $primary-color;
            // }
          }
          &-avatar {
            width: 32px;
            height: 32px;
            margin: 0 10px;
            background: rgba(24, 144, 255, 0.2);
            border: 2px solid #a8d5ff;
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
                max-width: 160px;
                color: $white;
                overflow: hidden;
                white-space: nowrap;
                display: block;
                text-overflow: ellipsis;
                color: $app-auth-bg;
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
            // color: $white;
          }
        }
      }
    }
    .justify-content-evenly {
      justify-content: space-evenly;
    }
    .user-email {
      opacity: 0.7;
    }
    .btn-avatar {
      color: $primary-color;
      // background-color: #fff;
    }
  }
  .app-auth-container {
    width: 704px;
    padding: 100px 0 50px 0;
    display: block;
    text-align: left;
    .app-auth {
      &-header {
        width: 100%;
        text-align: center;
        padding-bottom: 42px;
      }
      &-body {
        width: 100%;
        background: #fff;
        padding-bottom: 30px;
        height: 500px;
        // max-height: calc(100% - 200px);
        border-radius: 8px;
        border: 1px solid #ddd;
        position: relative;
        .btn-back {
          position: absolute;
          top: 15px;
          left: 18px;
          padding: 0;
          border: none;
          color: $text;
          span {
            margin-left: 10px;
          }
        }
        form {
          display: block;
        }
        .ant-form-item-label {
          line-height: 20px;
        }
      }
      &-footer {
        padding: 23px 15px;
        text-align: center;
        a {
          font-style: normal;
          font-weight: normal;
          font-size: 11px;
          line-height: 16px;
          color: #b9b8cd;
          ~ a {
            margin-left: 20px;
          }
          &:hover {
            color: #fff;
          }
        }
      }
      &-title {
        text-align: center;
        padding: 0 15px 30px 15px;
        h3 {
          color: $primary-color;
          margin: 0;
        }
      }
      &-logo {
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0 20px;
          &-imgage {
            width: 35px;
            height: 35px;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          &-text {
            font-family: Rubik;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
            color: $primary-color;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
