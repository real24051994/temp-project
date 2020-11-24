<template>
  <div class="panel-conversations">
    <ConversationFilter />

    <div class="conversation-search-input">
      <search-input v-model="search" @submit="onSearch" />
    </div>

    <div v-if="is_loading" class="mx-4">
      <a-skeleton active avatar title />
    </div>

    <div v-else-if="items.length > 0">
      <vue-simple class="list-conversation" id="box-conversations">
        <div>
          <ConversationListItem
            v-for="item in items"
            :key="item.conversation_id"
            :info="item"
          />

          <fa-infinite-loading
            :isLoading="is_loading_more"
            :noMore="no_more"
            selector="#box-conversations .simplebar-content-wrapper"
            @loadMore="loadMore"
            :useLoading="true"
          />
        </div>
      </vue-simple>
    </div>

    <div v-else-if="items.length === 0" class="center pt-5">
      No results
    </div>
  </div>
</template>

<script>
import ConversationFilter from "./conversation-filter";
import ConversationListItem from "./conversation-list-item";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    ConversationFilter,
    ConversationListItem,
  },

  data() {
    return {
      is_loading: false,
      is_loading_more: false,
      no_more: false,

      offset: 0,
      limit: 20,

      search: "",

      change_account_id: false,
    };
  },

  computed: {
    ...mapGetters({
      filter: "Conversation/getFilter",
      conversations: "Conversation/getConversations",
    }),

    items() {
      if (!this.conversations) {
        return [];
      }

      return this.conversations.filter((item) => {
        return item.social_account_id == this.accountId;
      });
    },

    accountId() {
      if (
        this.$route.params &&
        this.$route.params &&
        this.$route.params.accountId
      ) {
        return this.$route.params.accountId;
      }
      return false;
    },
  },

  watch: {
    accountId() {
      this.change_account_id = true;
      this.search = "";
      this.updateFilter({
        conversation_type: "",
        read_type: "",
      });
      this.handleFetchConversations();
    },

    filter() {
      if (!this.change_account_id) {
        this.handleFetchConversations();
      } else {
        this.change_account_id = false;
      }
    },

    "$route.params"(params, oldParams) {
      if (
        params &&
        params.accountId &&
        oldParams.conversationId &&
        !params.conversationId
      ) {
        this.selectFirst();
      }
    },
  },

  created() {
    if (this.accountId) {
      this.handleFetchConversations();
    }
  },

  methods: {
    ...mapActions({
      updateFilter: "Conversation/updateFilter",
      fetchConversations: "Conversation/fetchConversations",
    }),

    async handleFetchConversations(reset = true) {
      this.is_loading = true;
      this.is_loading_more = true;
      this.no_more = false;

      try {
        await this.fetchConversations({
          social_account_id: this.accountId,
          conversation_type: this.filter.conversation_type || null,
          read_type: this.filter.read_type || null,
          offset: this.items.length || 0,
          limit: this.limit,
          name: this.search || null,
          reset,
        });
      } catch (error) {
        if (
          this.oGet(error, ["data", "message"]) ===
          "The selected account id is invalid."
        ) {
          return this.$router.push("/account");
        }

        if (this.oGet(error, ["data", "message"]) === "Data not found") {
          return this.$router.push("/account");
        }

        this.toastError({
          title: "Error",
          message: error.message || "Something went wrong !",
        });
      } finally {
        this.is_loading = false;
        this.is_loading_more = false;
      }

      this.selectFirst();
    },

    onSearch() {
      this.updateFilter({
        name: this.search || "",
      });
      this.handleFetchConversations();
    },

    selectFirst() {
      if (
        this.items &&
        this.items.length > 0 &&
        !this.$route.params.conversationId
      ) {
        const accountId = this.$route.params.accountId;

        const first = this.items.length > 0 ? this.items[0] : null;

        if (!first) {
          return;
        }

        const type = first.conversation_type === "inbox" ? "inbox" : "comment";

        this.$router.push(
          `/account/${accountId}/${type}/${first.conversation_id}`
        );
      }
    },

    async loadMore() {
      if (this.is_loading_more) {
        return;
      }

      this.is_loading_more = true;
      try {
        let rs = await this.fetchConversations({
          social_account_id: this.accountId,
          conversation_type: this.filter.conversation_type || null,
          read_type: this.filter.read_type || null,
          offset: this.items.length || 0,
          limit: this.limit,
          name: this.search || null,
          reset: false,
        });

        if (!rs || !rs.data || rs.data.length < this.limit) {
          this.no_more = true;
        }
      } catch (error) {
        if (
          error &&
          error.data &&
          error.data.message === "The selected account id is invalid."
        ) {
          return this.$router.push("/account");
        }

        this.toastError({
          title: "Error",
          message: error ? error.message : "Something went wrong !",
        });
      } finally {
        this.is_loading_more = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-conversations {
  border-right: 1px solid #eaeaea;
  width: 100%;
  max-width: 100%;
  height: 100%;
  // min-width: 250px;
  display: flex;
  flex-direction: column;

  .conversation-search-input {
    padding: 16px;
  }

  .list-conversation {
    height: calc(100vh - 56px - 54px - 65px);
    max-height: calc(100vh - 56px - 54px - 65px);
    flex-grow: 1;
    overflow-y: auto;
  }
}

@media (max-width: 1200px) {
  .list-conversation {
    height: calc(100vh - 56px - 54px - 65px - 17px) !important;
    max-height: calc(100vh - 56px - 54px - 65px - 17px) !important;
  }
}
</style>
