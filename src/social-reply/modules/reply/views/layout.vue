<template>
  <div
    v-if="is_loadding && accounts.length === 0"
    class="layout-reply-box center"
    key="1"
  >
    <div>
      <fa-spin />
    </div>
  </div>

  <div
    v-else-if="!is_loadding && accounts.length === 0"
    class="layout-reply-box center text-center p-b-50"
    key="2"
  >
    <div class="flex-column p-b-50">
      <img src="@reply/assets/images/error/no-account.svg" alt="" />

      <div class="f-20">
        You have not add any account yet
      </div>

      <div class="m-t-14">
        Add a account and start promote your business
      </div>

      <router-link to="/manage-account?autoshow=1">
        <a-button type="primary" class="m-t-26">
          Add Account
        </a-button>
      </router-link>
    </div>
  </div>

  <div v-else-if="!is_loadding" class="layout-reply-box" key="3">
    <CoolLightBox
      :items="lightbox_images"
      :index="lightbox_index"
      @close="updateLightboxData"
      :loop="true"
      thumbsPosition="bottom"
    />

    <!-- <ListAccount /> -->

    <router-view />
  </div>
</template>

<script>
import ListAccount from "../components/list-account";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "VueLayout",
  components: {
    ListAccount,
  },
  metaInfo: {
    title: "Reply Box",
  },
  data() {
    return {
      is_loadding: false,
      loading_with_error: false,

      is_collapsed: false,
    };
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAll",
      lightbox_images: "Lightbox/getAll",
      lightbox_index: "Lightbox/getIndex",
      selectedAccount: "Account/getSelectedAccount",
    }),

    conversationId() {
      if (this.$route.params && this.$route.params.conversationId) {
        return this.$route.params.conversationId;
      }
      return undefined;
    },
  },

  watch: {
    selectedAccount(account) {
      this.$router.push(`/account/${account.social_id}`);
    },

    conversationId() {
      this.updateContextSidebar("customer-info");
      this.resetOrderInfo();
    },
  },

  created() {
    this.handleFetchAccount();
  },

  methods: {
    ...mapActions({
      fetchAccounts: "Account/fetchAccounts",

      updateLightbox: "Lightbox/update",

      removeCustomerInfo: "Customer/removeInfo",
      resetOrderInfo: "Order/reset",
      updateContextSidebar: "Sidebar/updateContext",
    }),

    async handleFetchAccount() {
      this.is_loadding = true;
      try {
        let data = await this.fetchAccounts();

        if (data && data.length > 0 && !this.$route.params.accountId) {
          const _data = data.sort((a, b) => {
            return a.id - b.id;
          });

          this.$router.push("/account/" + _data[0].social_id);
        }
      } catch (error) {
        this.loading_with_error = true;
      } finally {
        this.is_loadding = false;
      }
    },

    updateLightboxData() {
      this.updateLightbox({
        items: this.lightbox_images,
        index: null,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-reply-box {
  display: flex;
  height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
}

@media (max-width: 1200px) {
  .layout-reply-box {
    height: calc(100vh - 56px - 17px) !important;
    max-height: calc(100vh - 56px - 17px) !important;
  }
}
</style>
