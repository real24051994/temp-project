<template>
  <div class="flex-1 flex" v-if="accountId" key="1">
    <div class="w-25" style="min-width: 250px;">
      <list-conversations />
    </div>

    <div class="w-75">
      <router-view />
    </div>
  </div>

  <div v-else class="h-100 flex-1 center" key="2">
    <fa-spin />
  </div>
</template>

<script>
import ListConversations from "../components/list-conversations";

export default {
  components: {
    ListConversations,
  },

  metaInfo: {
    title: "Conversation",
  },

  computed: {
    accountId() {
      if (this.$route.params && this.$route.params.accountId) {
        return this.$route.params.accountId;
      }
      return null;
    },
  },
};
</script>
