<template>
  <div class="app-sidebar">
    <div class="app-sidebar-navbar" :style="computeCustomStyle">
      <div class="app-sidebar-navbar-header">
        <slot name="sidebar-header"></slot>
      </div>
      <div class="app-sidebar-navbar-body">
        <vue-simple class="app-sidebar-navbar-scrollbar">
          <nav class="app-sidebar-menu">
            <ul
              class="navbar"
              v-for="(group, index) in data"
              :key="`group_index_${index}`"
            >
              <div class="d-flex justify-content-center">
                <span class="divider" v-if="index > 0"></span>
              </div>
              <a-popover
                overlayClassName="app-sidebar-menu-popover"
                :mouseEnterDelay="0.3"
                :destroyTooltipOnHide="true"
                :title="false"
                placement="right"
                v-for="(item, index_child) in group.items"
                :key="`sidebar_index_${index_child}`"
              >
                <template slot="content">
                  <div class="app-sidebar-menu-popover-content">
                    {{ item.title }}
                  </div>
                </template>
                <li
                  class="navbar-item"
                  :class="{ 'is-active': setActive(item) }"
                >
                  <template v-if="item.type == 'router-link'">
                    <router-link
                      class="navbar-link"
                      :id="item.id ? item.id : ''"
                      :to="{ name: item.route }"
                    >
                      <div class="navbar-icon">
                        <sh-icon :icon="['sh', `${item.icon}`]" />
                      </div>
                    </router-link>
                  </template>
                  <template v-else-if="item.type == 'link'">
                    <a
                      class="navbar-link"
                      target="_blank"
                      :href="item.href"
                      :id="item.id ? item.id : ''"
                    >
                      <div class="navbar-icon">
                        <sh-icon :icon="['sh', `${item.icon}`]" />
                      </div>
                    </a>
                  </template>
                  <template v-else-if="item.type == 'button'">
                    <a
                      class="navbar-link"
                      :id="item.id ? item.id : ''"
                      @click="item.onClick"
                    >
                      <div class="navbar-icon">
                        <sh-icon :icon="['sh', `${item.icon}`]" />
                      </div>
                    </a>
                  </template>
                </li>
              </a-popover>
            </ul>
          </nav>
        </vue-simple>
      </div>
      <div class="app-sidebar-navbar-footer" v-if="sticky.length">
        <nav class="app-sidebar-menu">
          <ul class="navbar">
            <a-popover
              overlayClassName="app-sidebar-menu-popover"
              :mouseEnterDelay="0.3"
              :destroyTooltipOnHide="true"
              :title="false"
              placement="right"
              v-for="(item, index_child) in sticky"
              :key="`sidebar_index_${index_child}`"
            >
              <template slot="content">
                <div class="app-sidebar-menu-popover-content">
                  {{ item.title }}
                </div>
              </template>
              <li class="navbar-item" :class="{ 'is-active': setActive(item) }">
                <template v-if="item.type == 'router-link'">
                  <router-link
                    class="navbar-link"
                    :id="item.id ? item.id : ''"
                    :to="{ name: item.route }"
                  >
                    <div class="navbar-icon">
                      <sh-icon :icon="['sh', `${item.icon}`]" />
                    </div>
                  </router-link>
                </template>
                <template v-else-if="item.type == 'link'">
                  <a
                    class="navbar-link"
                    target="_blank"
                    :href="item.href"
                    :id="item.id ? item.id : ''"
                  >
                    <div class="navbar-icon">
                      <sh-icon :icon="['sh', `${item.icon}`]" />
                    </div>
                  </a>
                </template>
                <template v-else-if="item.type == 'button'">
                  <a
                    class="navbar-link"
                    :id="item.id ? item.id : ''"
                    @click="item.onClick"
                  >
                    <div class="navbar-icon">
                      <sh-icon :icon="['sh', `${item.icon}`]" />
                    </div>
                  </a>
                </template>
              </li>
            </a-popover>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  name: "AppSidebar",
  props: {
    data: {
      type: Array,
      required: true,
    },
    modules: {
      tpye: Object,
      required: true,
    },
    customStyle: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      is_active_submenu: "",
      sticky: [
        {
          title: "Chat",
          type: "button",
          href: "",
          id: "vue-sidebar-intercom",
          icon: "support",
          onClick: () => {
            if (typeof this.$crisp != "undefined") {
              this.$crisp.toggle();
            }
          },
        },
        {
          title: "Help Center",
          type: "link",
          href: "https://help.socialhead.io/en/",
          id: "vue-sidebar-helper-center",
          icon: "faq",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      app_name: "getAppName",
    }),
    computeCustomStyle() {
      var paddingBottom = `${this.sticky.length * 58}px`;
      return Object.assign({}, { paddingBottom }, this.customStyle);
    },
  },
  methods: {
    ...mapActions({
      toggleShowIntercom: "auth/toggleShowIntercom",
    }),
    setActive(item) {
      if (item.type == "router-link") {
        return (
          this.modules[item.route] &&
          this.modules[item.route].indexOf(this.$route.name) >= 0
        );
      }
      return false;
    },
  },
};
</script>
<style lang="scss">
.app-sidebar {
  height: 100%;
  position: relative;
  &-navbar {
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 2;
    .simplebar-scrollbar:before {
      opacity: 1;
      background: #b9b8cd;
    }
    &-scrollbar {
      height: 100%;
      overflow: hidden auto;
      position: relative;
    }
    &-body {
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    &-header {
      position: absolute;
      top: 0;
      left: 0;
      height: auto;
      z-index: 3;
      width: 100%;
    }
    &-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: auto;
      z-index: 3;
      width: 100%;
      .app-sidebar-menu {
        padding: 0;
      }
    }
  }
  &-menu {
    padding: 8px 0;
    width: 100%;
    position: relative;
    .navbar {
      padding: 0;
      margin: 0;
      list-style-type: none;
      user-select: none;
      .divider {
        height: 1px;
        width: 80%;
        background: $app-sidebar-border;
        margin: 12px 0px;
      }
      &-item {
        margin-bottom: 4px;
        &.is-active,
        &:hover {
          position: relative;
          .navbar {
            &-icon {
              background-color: $primary-color;
              color: #fff;
            }
          }
        }
      }
      &-link {
        display: block;
        width: 100%;
        background: transparent;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;
        padding: 7px 0;
        text-align: center;
        &:after {
          content: "";
          display: table;
          clear: both;
        }
        * {
          pointer-events: none;
        }

        &.is-open-intercom {
          color: $app-sidebar-text-active-color;
          background: $app-sidebar-text-active-bg;
        }
        &.is-intercom-new-message {
          color: $app-sidebar-text-active-color;
          .fa-intercom {
            position: relative;
            &:after {
              content: "";
              position: absolute;
              top: -3px;
              right: -5px;
              width: 10px;
              height: 10px;
              background-color: $danger;
              border-radius: 50%;
              z-index: 1;
            }
          }
        }
      }
      &-icon {
        font-size: 20px;
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        color: $text;
        transition: all 0.2s ease;
      }
    }
    &-popover {
      .ant-popover-content {
        .ant-popover-arrow {
          border-bottom-color: rgba(0, 0, 0, 0.9) !important;
          border-left-color: rgba(0, 0, 0, 0.9) !important;
        }
        .ant-popover-inner {
          background-color: rgba(0, 0, 0, 0.9);
          color: #fff;
        }
        .ant-popover-inner-content {
          padding: 0;
          color: #fff;
        }
      }
      &-content {
        padding: 8px 12px;
        &-navbar {
          padding: 0;
          margin: -8px -12px;
          min-width: 150px;
          list-style-type: none;
          user-select: none;
          .navbar {
            &-link {
              display: block;
              width: 100%;
              background: transparent;
              line-height: 32px;
              min-height: 32px;
              padding: 0 12px;
              white-space: nowrap;
              text-overflow: ellipsis;
              transition: all 0.3s ease;
              text-decoration: none;
              color: $app-sidebar-text-color;
              background: $app-sidebar-text-bg;
              transition: all 0.2s ease;
              position: relative;
              font-size: 14px;
              &:hover {
                color: $app-sidebar-text-active-color;
                background: $app-sidebar-text-active-bg;
              }
            }
          }
        }
      }
    }
  }
}
</style>
