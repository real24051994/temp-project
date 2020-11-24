<template>
  <div>
    <div id="app-layout-master" class="app-layout">
      <div class="app-layout-toolbar">
        <app-toolbar />
      </div>

      <div class="app-layout-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AppToolbar from "@/layouts/partials/toolbar";
import { mapActions, mapGetters } from "vuex";
import { icon } from "@fortawesome/fontawesome-svg-core";

export default {
  name: "DefaultLayout",

  components: {
    AppToolbar,
  },

  metaInfo: {
    titleTemplate: "%s - Social Reply",
  },

  computed: {
    ...mapGetters({
      loading_error: "getLoadingError",
      user: "auth/getUser",
    }),
  },

  async created() {
    this.is_loading = false;
    this.is_loading_error = false;
    if (!this.is_loading_error) {
      if (this.user) {
        const { shop = {} } = this.user;

        this.$intercom.init({
          app_name: "Socialreply",
          // user_id: `social_replyl_${id}`,
          user_id: `${process.env.VUE_APP_INTERCOM_PREFIX}_${shop.id}`,
          name: shop ? shop.name : "",
          email: shop ? shop.email : "",
          internal_id: shop ? shop.internal_id : "",
          domain: shop ? shop.domain : "",
          raw_domain: shop ? shop.raw_domain : "",

          alignment: "left",
          horizontal_padding: 70,
          vertical_padding: 0,
        });

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
      }
    }
  },

  methods: {
    ...mapActions({
      getUser: "auth/getUser",
      dataLayer: "auth/dataLayer",
    }),

    handleCollapse() {
      this.collapse = !this.collapse;
    },
  },
};
</script>

<style lang="scss" scoped>
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
