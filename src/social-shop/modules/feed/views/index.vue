<template>
  <div class="list-feed-template">
      <ListTemplate />
  </div>
</template>
<script>
import ListTemplate from "../components/list-template.vue";

export default {
  name: "FeedCenter",
  metaInfo: {
    title: "Feed Center"
  },

  components: {
    ListTemplate
  },
};
</script>