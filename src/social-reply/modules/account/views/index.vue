<template>
  <div class="vue-list-account-page">
    <div class="container">
      <div class="row">
        <div class="col col-12">
          <div key="is-loading-success" class="list-account-container">
            <template v-if="is_loading_error">
              <div class="list-account-error">
                <vue-error type="500" />
              </div>
            </template>

            <template v-else>
              <div class="list-account-content page-container">
                <div class="list-account-content-header page-container-header">
                  <div class="list-account-content-title">
                    <h1 class="page-title">
                      Social Account
                    </h1>
                  </div>

                  <div class="list-account-content-actions">
                    <a-button
                      id="btn-create-post-in-post-center"
                      type="primary"
                      @click="showModal"
                    >
                      Add Account
                    </a-button>
                  </div>
                </div>

                <div class="list-account-content-body  page-container-body">
                  <div class="list-account-content-table">
                    <vue-list-account-table
                      :value="accounts"
                      :loading="is_loading"
                      @reload="reload"
                    />
                  </div>
                </div>
              </div>
              <vue-list-account-modal-create
                v-if="visible"
                v-model="visible"
                :data="accounts"
                @on-reload="reload"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueListAccountTable from "../components/vue-list-account-table";
import VueListAccountModalCreate from "../components/vue-list-account-modal-create";

export default {
  name: "ManageAccount",

  components: {
    VueListAccountTable,
    VueListAccountModalCreate,
  },

  metaInfo() {
    return {
      title: "Manage Account",
    };
  },

  data() {
    return {
      is_loading_error: false,
      is_loading: false,
      visible: false,

      data: null,
    };
  },

  created() {
    this.handleFetchAccounts();
  },

  computed: {
    ...mapGetters({
      accounts: "Account/getAccounts",
    }),
  },

  methods: {
    ...mapActions({
      fetchAccounts: "Account/fetchAccounts",
    }),

    showModal() {
      this.visible = true;
    },

    hideModal() {
      this.visible = false;
    },

    async handleFetchAccounts() {
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

    reload() {
      this.handleFetchAccounts();
    },
  },
};
</script>
<style lang="scss" scoped>
.vue-list-account-page {
  position: relative;

  .list-account {
    &-loading,
    &-error {
      height: 400px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-content {
      &-title {
        @include flex(50%);
      }

      &-actions {
        @include flex(50%);

        text-align: right;
      }

      &-filter {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }
  }
}
</style>
