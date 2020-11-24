<template>
  <div v-if="is_loading" key="is-loading" class="app-layout-loading">
    <fa-spin />
  </div>

  <div v-else key="loaded">
    <div
      id="app-layout-master"
      class="app-layout"
      :class="{ 'app-layout-collapsed': collapse }"
    >
      <div v-if="loading_error">
        <vue-error type="500" />
      </div>

      <template v-else>
        <div class="app-layout-sidebar">
          <div class="socical-account-list">
            <a-popover
              placement="rightTop"
              trigger="click"
              class="p-0"
              v-if="accounts && accounts.length > 0"
            >
              <template slot="content">
                <span class="socical-account-title d-flex px-3 py-3">
                  Social Account
                </span>
                <a-menu
                  mode="vertical"
                  class="socical-account-menu"
                  @select="onSelect"
                  :selectedKeys="[selectedAccount.social_id]"
                >
                  <a-menu-item
                    v-for="account in accounts"
                    :key="account.social_id"
                    class="px-3 d-flex m-0"
                    style="height: 55px"
                  >
                    <div
                      class="d-flex align-items-center justify-content-between flex-row w-100"
                    >
                      <span>
                        <a-avatar :src="account.avatar" class="mr-2" />
                        {{ account.name }}
                      </span>
                      <a-tag
                        v-if="account.unread_count > 0"
                        color="#EBF1FF"
                        style="color: #5B86E5"
                      >
                        {{ account.unread_count }}
                      </a-tag>
                    </div>
                  </a-menu-item>
                </a-menu>
                <div class="socical-account-title d-flex px-3 py-3">
                  <a-button block @click="$router.push('/manage-account')"
                    >Manage Account</a-button
                  >
                </div>
              </template>
              <template v-if="Object.keys(selectedAccount).length > 0">
                <a-avatar
                  class="socical-account-icon"
                  :src="selectedAccount.avatar"
                />
              </template>
              <template v-else>
                <a-avatar>
                  <a-icon
                    slot="icon"
                    type="user"
                    class="socical-account-icon"
                  />
                </a-avatar>
              </template>
            </a-popover>
            <a-button
              v-else
              type="dashed"
              shape="circle"
              class="btn-add-account p-0"
              @click="showModal('add-account')"
            >
              <sh-icon :icon="['far', 'user-plus']" color="#828282" />
            </a-button>
          </div>

          <app-sidebar
            style="height: calc(100% - 63px)"
            :logo="logo"
            :modules="sidebar.modules"
            :data="sidebar.data"
            :sticky="sidebar.sticky"
            :collapse.sync="collapse"
          />
        </div>

        <div class="app-layout-toolbar">
          <app-toolbar />
        </div>

        <div class="app-layout-container">
          <transition name="fade-in" mode="out-in">
            <router-view />
          </transition>
        </div>

        <SocketClient />

        <vue-list-account-modal-create
          v-if="visible"
          v-model="visible"
          :type="modalAddAccountType"
          :data="accounts"
          @on-reload="reload"
        />
      </template>
    </div>
  </div>
</template>

<script>
import AppToolbar from "@/layouts/partials/toolbar";
import AppSidebar from "@/layouts/partials/sidebar.vue";
import { mapActions, mapGetters } from "vuex";
import SocketClient from "../components/event/global-socket";
import { icon } from "@fortawesome/fontawesome-svg-core";
import VueListAccountModalCreate from "@reply/modules/account/components/vue-list-account-modal-create";

export default {
  name: "DefaultLayout",

  components: {
    AppToolbar,
    AppSidebar,
    SocketClient,
    VueListAccountModalCreate,
  },

  metaInfo: {
    titleTemplate: "%s - Social Reply",
  },

  data() {
    return {
      modalAddAccountType: "add-account",
      is_loading: true,
      is_loading_error: false,
      collapse: true,
      visible: false,
      logo: {
        collapse: require("@reply/assets/images/social-reply-icon.png"),
        expand: require("@reply/assets/images/social-reply-icon.png"),
      },
      sidebar: {
        data: [
          {
            items: [
              {
                title: "Reply Box",
                route: "ReplyBox",
                type: "router-link",
                id: "vue-sidebar-conversations",
                icon: "comment",
              },
              {
                title: "Customer chat widget",
                route: "ChatWidget",
                type: "router-link",
                id: "vue-sidebar-chat-widget",
                icon: "widget",
              },
              {
                title: "Manage Accounts",
                route: "ManageAccount",
                type: "router-link",
                id: "vue-sidebar-manage-account",
                icon: "account-center",
              },
              {
                title: "Auto hide setting",
                route: "AutoHide",
                type: "router-link",
                id: "vue-sidebar-auto-hide",
                icon: "setting",
              },
            ],
          },
        ],
        sticky: [
          {
            title: "Intercom",
            type: "button",
            href: "",
            id: "vue-sidebar-intercom",
            icon: icon({ prefix: "fab", iconName: "intercom" }).html[0],
            onClick: () => {},
          },
          {
            title: "Help Center",
            type: "link",
            href: "https://help.socialhead.io/en/",
            id: "vue-sidebar-helper-center",
            icon: icon({ prefix: "far", iconName: "life-ring" }).html[0],
          },
        ],
        modules: {
          ReplyBox: ["ReplyBox", "ReplyBoxDetail", "Inbox", "Comment"],
          ManageAccount: ["ManageAccount"],
          ChatWidget: ["ChatWidget"],
          AutoHide: ["AutoHide"],
        },
      },
    };
  },
  watch: {
    "$route.name"() {
      if (this.accounts.length === 0) {
        this.showModal("warning-add-account");
      }
    },
  },
  computed: {
    ...mapGetters({
      loading_error: "getLoadingError",
      user: "auth/getUser",
      chat_box_token: "auth/getChatBoxToken",
      chat_box_data: "auth/getChatBoxData",
      accounts: "Account/getAll",
      selectedAccount: "Account/getSelectedAccount",
    }),
  },

  async created() {
    this.is_loading = false;
    this.is_loading_error = false;
    if (!this.is_loading_error) {
      if (this.user) {
        await this.handleFetchAccount();
        const { shop = {} } = this.user;
        if (this.chat_box_data) {
          this.$crisp.init({
            token: this.chat_box_token,
            data: this.chat_box_data,
          });
        }

        this.$userpilot.init({ app_id: "32sm45e10" }).then(() => {
          this.$userpilot.register({
            id: `sr_${this.user.shop.id}`,
            data: {
              email: this.user.shop.email,
              name: this.user.shop.name,
              app_name: "Socialreply",
              created_at: this.user.shop.created_at,
            },
          });

          this.$watch("$route", () => {
            this.$userpilot.reload();
          });
        });

        this.dataLayer({
          userId: this.user.id,
        });
        if (this.accounts.length === 0) {
          this.showModal("warning-add-account");
        }
      }
    }
  },

  methods: {
    ...mapActions({
      getUser: "auth/getUser",
      dataLayer: "auth/dataLayer",
      fetchAccounts: "Account/fetchAccounts",
      setAccount: "Account/setAccount",
    }),
    handleCollapse() {
      this.collapse = !this.collapse;
    },
    showModal(type) {
      this.modalAddAccountType = type;
      this.visible = true;
    },
    async handleFetchAccount() {
      this.is_loadding = true;
      try {
        let data = await this.fetchAccounts();

        if (data && data.length > 0 && !this.$route.params.accountId) {
          const _data = data.sort((a, b) => {
            return a.id - b.id;
          });
        }
      } catch (error) {
        this.loading_with_error = true;
      } finally {
        this.is_loadding = false;
      }
    },
    async reload() {
      this.is_loading = true;
      try {
        await this.fetchAccounts();

        if (
          this.$route.query &&
          this.$route.query.autoshow == 1 &&
          this.isEmpty(this.accounts)
        ) {
          this.showModal();
        }
      } catch (error) {
        this.is_loading_error = true;
      } finally {
        this.is_loading = false;
      }
    },
    onSelect(item) {
      if (item.key) {
        this.setAccount(item.key);
      }
    },
  },
};
</script>
<style>
.ant-popover-inner-content {
  padding: 0 !important;
}
.ant-menu-item-selected {
  background-color: #f7f8fa !important;
}
</style>
<style lang="scss" scoped>
.btn-add-account {
  width: 40px;
  height: 40px;
  background: $light-gray3;
  border: 1px dashed #828282;
}
.socical-account- {
  &list {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 63px;
    border-bottom: 1px solid #f3f3f3;
  }
  &icon {
    cursor: pointer;
  }
  &title {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
  }
  &menu {
    max-height: 165px;
    overflow-y: auto;
    width: 256px;
    border: none;
  }
}
.app-layout-container {
  padding-bottom: 0 !important;
  min-height: 100vh;
  vertical-align: top;
}

@media (max-width: 1200px) {
  .app-layout-container {
    padding-bottom: 0 !important;
    min-height: calc(100vh - 17px);
  }
}
</style>
